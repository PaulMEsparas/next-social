import prisma from "@/lib/client";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { getFriends } from "@/lib/action";
import { auth } from "@clerk/nextjs/server";

const Friends = async ({ user }: { user: User }) => {
  //find the media/ or images for the logged in user
  const { userId: currentUserId } = auth();

  //if current user not logged in
  if (!currentUserId) {
    throw new Error("User not Authenticated! Please log in...");
  }
  // Fetch all friends (both followers and followings)
  const friends = await getFriends(user.id);
  // console.log(friends, "Friends");

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className=" flex justify-between items-center font-medium">
        <span className="text-gray-500">Friends</span>
      </div>
      {/* BOTTOM */}
      <div className="flex gap-4 flex-wrap">
        {friends.length
          ? friends.map((friend) => (
              <div className="relative w-1/5 h-24" key={friend.id}>
                <Link href={`/profile/${friend.username}`}>
                  <Image
                    src={friend.avatar || "/default-avatar.png"}
                    alt={friend.username}
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center">
                    {friend.username}
                  </div>
                </Link>
              </div>
            ))
          : "No friends found!"}
      </div>
    </div>
  );
};

export default Friends;
