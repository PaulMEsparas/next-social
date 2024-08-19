import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const ProfileCard = async () => {
  //get userId from auth clerk
  const { userId } = auth();

  if (!userId) return null;

  // get user data from database
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    //get followers for the particular userId(the one logged in)
    include: {
      _count: {
        select: {
          followers: true,
        },
      },
      followers: {
        include: {
          follower: {
            select: {
              avatar: true,
            },
          },
        },
      },
    },
  });

  // console.log(user, "USER LEFT");

  if (!user) return null;
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-gray-500 text-sm flex flex-col gap-6">
      <div className="h-20 relative">
        <Image
          src={user.cover || "/noCover.jpg"}
          alt=""
          fill
          className="rounded-md object-cover"
        />
        <Image
          src={user.avatar || "/noAvatar.png"}
          alt=""
          width={64}
          height={64}
          className="rounded-full object-cover w-16 h-16 absolute left-0 right-0 m-auto -bottom-6 ring-white ring-1 z-10"
        />
      </div>
      <div className="h-20 flex flex-col gap-2 items-center">
        <span className="font-semibold">
          {user.name && user.surname
            ? user.name + " " + user.surname
            : user.username}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex gap-0.5">
            {user.followers.map((followerRelation, index) => (
              <Image
                key={index}
                src={followerRelation.follower.avatar || "/noAvatar.png"}
                alt={`Follower ${index + 1}`}
                width={12}
                height={12}
                className="rounded-full object-cover w-3 h-3"
              />
            ))}
            {/* <Image
              src="https://images.pexels.com/photos/26770698/pexels-photo-26770698/free-photo-of-a-tree-with-leaves-on-it-on-a-beach.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
              alt=""
              width={12}
              height={12}
              className="rounded-full object-cover w-3 h-3 "
            />
            <Image
              src="https://images.pexels.com/photos/26770698/pexels-photo-26770698/free-photo-of-a-tree-with-leaves-on-it-on-a-beach.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
              alt=""
              width={12}
              height={12}
              className="rounded-full object-cover w-3 h-3 "
            />
            <Image
              src="https://images.pexels.com/photos/26770698/pexels-photo-26770698/free-photo-of-a-tree-with-leaves-on-it-on-a-beach.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
              alt=""
              width={12}
              height={12}
              className="rounded-full object-cover w-3 h-3 "
            /> */}
          </div>
          <span className="text-xs text-gray-500">
            {user._count.followers}{" "}
            {user._count.followers === 0
              ? " follower"
              : " follower" + (user._count.followers > 1 ? "s" : "")}
          </span>
        </div>
        <Link href={`/profile/${user.username}`}>
          <button className="bg-blue-500 text-white text-xs p-2 rounded-md">
            My Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
