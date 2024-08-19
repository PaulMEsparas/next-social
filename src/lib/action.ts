//everything here will be running on the server
"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "./client";
import { z } from "zod";
import { validateHeaderName } from "http";
import { error } from "console";
import { revalidatePath } from "next/cache";

//userId props in the the id of the other user's profile
//this is to follow or unfollow the profile of another user
export const switchFollow = async (userId: string) => {
  //getting the userId of the currently logged in user from Clerk then change it to currentUserId
  const { userId: currentUserId } = auth();

  //if current user not logged in
  if (!currentUserId) {
    throw new Error("User not Authenticated! Please log in...");
  }

  //check if currently logged in user is already following the viewed other user
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
      include: {
        follower: true, // Include follower's user information
      },
    });

    //Deletes the current logged in user from the following table if he is already following the other user
    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });

      //Unfollow notification
      await prisma.notification.create({
        data: {
          type: "unfollow",
          message:
            currentUser?.name && currentUser.surname
              ? `${currentUser.name} + " " + ${currentUser.surname} unfollowed you.`
              : `${currentUser?.username} unfollowed you.`,
          userId: existingFollow.followingId,
          isRead: false,
        },
      });
    } else {
      //check  if a follow request has already been sent
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });
      //removes the current logged in user and cancels the follow request
      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });

        //decline request notification
        await prisma.notification.create({
          data: {
            type: "decline_follow_request",
            message:
              currentUser?.name && currentUser?.surname
                ? `${currentUser.name} ${currentUser.surname} declined your follow request.`
                : `${currentUser?.username} declined your follow request.`,
            userId: existingFollowRequest.senderId,
            isRead: false,
          },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
        //Follow request notification
        await prisma.notification.create({
          data: {
            type: "follow_request",
            message:
              currentUser?.name && currentUser.surname
                ? `${currentUser.name} ${currentUser.surname} sent you a follow request.`
                : `${currentUser?.username} sent you a follow request.`,
            userId: userId,
            isRead: false,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

//block or unblock user
//getting the other user's profile userId
export const switchBlock = async (userId: string) => {
  //get the logged in user's userId through clerk
  const { userId: currentUserId } = auth();

  //throw error if no user is logged in, just viewing the user
  if (!currentUserId) {
    throw new Error("User is not authenticated!");
  }

  try {
    //check if viewed user is already blocked by the logged in user
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });
    //if already blocked, running this function will remove the the viewd user from blocked
    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
      //Unblock notification
      await prisma.notification.create({
        data: {
          type: "unblock",
          message: `User ${existingBlock.blockerId} unblocked you.`,
          // message:
          //   // currentUser?.name && currentUser.surname
          //   //   ? `${currentUser.name} + " " + ${currentUser.surname} unfollowed you.`
          //   //   : `${currentUser?.username} unfollowed you.`,
          userId: existingBlock.blockedId,
          isRead: false,
        },
      });
    } else {
      //if not yet blocked, then block it by adding the viewed user id to the blocked table
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
      //Block Notification
      await prisma.notification.create({
        data: {
          type: "block",
          message: `User ${existingBlock!.blockerId} blocked you.`,
          userId: existingBlock!.blockedId,
          isRead: false,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

//accept follow or friend request
export const acceptFollowRequest = async (userId: string) => {
  //get logged in user from clerk
  const { userId: currentUserId } = auth();

  //if not logged in
  if (!currentUserId) {
    throw new Error("User is not Authenticated");
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    //if logged in user is already following or friends with the profile viewed
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }

    //add the user profile to following
    await prisma.follower.create({
      data: {
        followerId: userId,
        followingId: currentUserId,
      },
    });
    //Accept user follow request notification
    await prisma.notification.create({
      data: {
        type: "accept_follow_request",
        message:
          currentUser?.name && currentUser.surname
            ? `${currentUser.name} ${currentUser.surname} accepted your follow request.`
            : `${currentUser?.username} accepted your follow request.`,
        userId: userId,
        isRead: false,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

//decline follow or friend request
export const declineFollowRequest = async (userId: string) => {
  //get logged in user from clerk
  const { userId: currentUserId } = auth();

  //if not logged in
  if (!currentUserId) {
    throw new Error("User is not Authenticated");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });
    //delete the senderRequest
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
      await prisma.notification.create({
        data: {
          type: "decline_follow_request",
          message: `User ${existingFollowRequest.receiverId} declined your follow request.`,
          userId: existingFollowRequest.senderId,
          isRead: false,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

//Update profile
export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  payload: { formData: FormData; cover: string }
) => {
  //Object.entries is object to aray  while Object.fromEntries is from array to object

  const { formData, cover } = payload;

  //To get all the fields in formData
  const fields = Object.fromEntries(formData);
  // console.log(fields, "fields");

  //filtering fields to avoid taking the empty fields
  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value !== "")
  );

  //Zod form fields validation
  //condition
  const Profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });
  //validation
  const ValidatedFields = Profile.safeParse({ cover, ...filteredFields });

  //console.log error for each fields
  if (!ValidatedFields.success) {
    console.log(ValidatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  const { userId } = auth(); //get userId from auth clerk

  if (!userId) return { success: false, error: true };

  try {
    const res = await prisma.user.update({
      where: {
        id: userId,
      },
      data: ValidatedFields.data,
    });
    await prisma.notification.create({
      data: {
        type: "update_profile",
        message: `User ${userId} updated their profile.`,
        userId,
        isRead: false,
      },
    });
    return { success: true, error: false };
    // console.log(res, "Response");
  } catch (error) {
    // console.log(error);
    return { success: false, error: true };
  }
};

//like button action
export const switchLike = async (postId: number) => {
  const { userId } = auth();

  if (!userId) return new Error("User is not authenticated");

  try {
    // Get the current user details
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return new Error("Current user not found");
    }

    // Fetch the post details to get the owner ID
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }, // assuming 'userId' is the owner of the post
    });

    if (!post) {
      return new Error("Post not found");
    }

    const postOwnerId = post.userId;

    //checks if logged in user already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    //if alredy liked, removed from database
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      // Optionally, you can create a notification for unlike
      // await prisma.notification.create({
      //   data: {
      //     type: `unlike_post`,
      //     message: `${currentUser.username} unliked your post.`,
      //     userId: postIdOwnerId, // assuming you have a way to get the post owner ID
      //     isRead: false,
      //   },
      // });

      //add the logged in user to the post
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      if (userId !== postOwnerId) {
        await prisma.notification.create({
          data: {
            type: `like_post`,
            message:
              currentUser.name && currentUser.surname
                ? `${currentUser.name} ${currentUser.surname} liked your post.`
                : `${currentUser.username} liked your post.`,
            userId: postOwnerId,
            isRead: false,
          },
        });
      }
    }
  } catch (error) {
    // console.log(error);
    throw new Error("Something went wrong");
  }
};

//add comment
export const addComment = async (postId: number, desc: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const createdComment = await prisma.comment.create({
      data: {
        desc,
        userId,
        postId,
      },
      include: {
        user: true,
      },
    });
    await prisma.notification.create({
      data: {
        type: "add_comment",
        message: `User ${userId} commented on your post.`,
        userId: createdComment.userId,
        isRead: false,
      },
    });

    return createdComment;
  } catch (err) {
    // console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addPost = async (formData: FormData, img: string) => {
  const desc = formData.get("desc") as string;

  //validate description
  const Desc = z.string().min(1).max(255);
  const validateDesc = Desc.safeParse(desc);

  if (!validateDesc.success) {
    return new Error("Please add a description");
  }

  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    type PostData = {
      desc: string;
      userId: string;
      img?: string | null;
    };

    // Create post data object with the defined type
    const postData: PostData = {
      desc: validateDesc.data,
      userId,
    };

    // Add img to postData if it exists
    if (img) {
      postData.img = img;
    }

    // Create the post in the database
    await prisma.post.create({
      data: postData,
    });

    // await prisma.post.create({
    //   data: {
    //     desc: validateDesc.data,
    //     userId,
    //     img,
    //   },
    // });

    // Fetch followers of the user
    const followers = await prisma.follower.findMany({
      where: {
        followingId: userId,
      },
      include: {
        following: true,
      },
    });

    // Create notifications for each follower
    const notifications = followers.map((follower) => ({
      type: "add_post",
      message:
        follower.following?.name && follower.following.surname
          ? `${follower.following.name} ${follower.following.surname} added a post`
          : `${follower.following?.username} added a post.`,
      userId: follower.followerId,
      isRead: false,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    revalidatePath("/");
  } catch (err) {
    // console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addStory = async (img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }
    const createdStory = await prisma.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    return createdStory;
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (postId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.post.delete({
      where: {
        id: postId,
        userId,
      },
    });
    await prisma.notification.create({
      data: {
        type: "delete_post",
        message: `User ${userId} deleted a post.`,
        userId,
        isRead: false,
      },
    });
    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};

export const deleteNotification = async (postId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.notification.delete({
      where: {
        id: postId,
        userId,
      },
    });

    // revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};

//fetch notification
export const fetchNotification = async () => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });
    return notifications;
  } catch (err) {
    console.log(err);
  }
};

export const fetchCommentCount = async (postId: number): Promise<number> => {
  try {
    const count = await prisma.comment.count({
      where: { postId: postId },
    });
    return count;
  } catch (error) {
    console.error("Error fetching comment count:", error);
    throw new Error("Could not fetch comment count");
  }
};

export const markAllRead = async (userId: string) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};

//get friends list
export const getFriends = async (userId: string) => {
  // Find users you follow
  const following = await prisma.user.findMany({
    where: {
      followers: {
        some: {
          followerId: userId,
        },
      },
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      name: true,
      surname: true,
      // Add other fields you need...
    },
  });

  // Find users who follow you
  const followers = await prisma.user.findMany({
    where: {
      followings: {
        some: {
          followingId: userId,
        },
      },
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      name: true,
      surname: true,
      // Add other fields you need...
    },
  });

  // Combine the lists, removing duplicates by user id
  const friends = [
    ...new Map(
      [...following, ...followers].map((friend) => [friend.id, friend])
    ).values(),
  ];

  return friends;
};
