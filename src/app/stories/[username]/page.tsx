import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";

import Image from "next/image";
import { notFound } from "next/navigation";
import Friends from "@/components/Friends";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

const StoriesPath = async () => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) return null;

  const user = await prisma.user.findFirst({
    where: {
      username: currentUserId,
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
  // console.log(stories);
  // // Get the first user from stories or provide a default
  // const user =
  //   stories.length > 0
  //     ? stories[0].user
  //     : { name: "Default User", avatar: "/noAvatar.png" };

  return (
    <div className="flex gap-6 py-4">
      {/* LEFT */}
      <div className="hidden xl:block w-[20%]">
        {/* <LeftMenu type="profile" /> */}
        <LeftMenu type="home" />
      </div>
      {/* CENTER */}
      <div className="w-full  lg:w-[70%] xl:w-[50%]">
        <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll no-scrollbar flex flex-col gap-4">
          <div className=" flex justify-between items-center font-medium">
            <span className="text-gray-500">Stories</span>
          </div>
          <div className="flex gap-8 w-max text-xs">
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
                    {story.user.name || story.user.username}
                  </span>
                  <span>{story.id}</span>
                </div>
              ))
            ) : (
              <div className="p-4 bg-white rounded-lg shadow-md text-sm flex justify-center items-center ">
                No Stories
              </div>
            )}
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user!} />
      </div>
    </div>
  );
};

export default StoriesPath;
