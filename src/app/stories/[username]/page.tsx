import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import Stories from "@/components/Stories";

const FriendsListPage = async ({
  params,
}: {
  params: { username: string };
}) => {
  const username = params.username;

  //find the profile of some other user's profile
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true,
        },
      },
    },
  });

  if (!user) return notFound();

  //to check first if user is blocked by the profile the user is trying to view

  const { userId: currentUserId } = auth(); //getting the current users ID

  if (!currentUserId) return null;

  let isBlocked;
  if (currentUserId) {
    const res = await prisma.block.findFirst({
      where: {
        blockerId: user.id,
        blockedId: currentUserId,
      },
    });
    if (res) isBlocked = true;
  } else {
    isBlocked = false;
  }

  if (isBlocked) return notFound();

  const stories = await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      OR: [
        {
          user: {
            followers: {
              some: {
                followerId: currentUserId,
              },
            },
          },
        },
        {
          userId: currentUserId,
        },
      ],
    },
    include: {
      user: true,
    },
  });

  return (
    <div className="flex gap-6 pt-6">
      {/* LEFT */}
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="profile" />
      </div>
      {/* CENTER
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        {stories.map((story) => (
          <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            key={story.id}
          >
            <Image
              src={story.img || "/noAvatar.png"}
              alt=""
              width={80}
              height={80}
              className="w-20 h-20 rounded-full ring-2"
            />
            <span className="font-medium">
              {story.user?.name || story.user?.username}
            </span>
          </div>
        ))}
      </div> */}
      {/* CENTER */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
          {stories.length > 0 ? (
            stories.map((story) => (
              <div
                className="flex flex-col items-center gap-2 cursor-pointer"
                key={story.id}
              >
                <Image
                  src={story.img || "/noAvatar.png"}
                  alt=""
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full ring-2"
                />
                <span className="font-medium">
                  {story.user?.name || story.user?.username}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No stories available
            </div>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user} />
      </div>
    </div>
  );
};

export default FriendsListPage;
