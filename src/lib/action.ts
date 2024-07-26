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
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });
    //Deletes the current logged in user from the following table if he is already following the other user
    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
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
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
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
    } else {
      //if not yet blocked, then block it by adding the viewed user id to the blocked table
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
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
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });
    console.log(existingFollowRequest, "existingFollowRequest");
    //if logged in user is already following or friends with the profile viewed
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }

    //add the user profile to folowing
    await prisma.follower.create({
      data: {
        followerId: userId,
        followingId: currentUserId,
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
  console.log(fields, "fields");

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
    return { success: true, error: false };
    console.log(res, "Response");
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

//like button action
export const switchLike = async (postId: number) => {
  const { userId } = auth();

  if (!userId) return new Error("User is not authenticated");

  try {
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
      //add the logged in user to the post
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (error) {
    console.log(error);
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

    return createdComment;
  } catch (err) {
    console.log(err);
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
    await prisma.post.create({
      data: {
        desc: validateDesc.data,
        userId,
        img,
      },
    });

    revalidatePath("/");
  } catch (err) {
    console.log(err);
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
    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};
