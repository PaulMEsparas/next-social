import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import prisma from "@/lib/client";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";
import Notifications from "./Notifications";
import { auth } from "@clerk/nextjs/server";

const Navbar = async () => {
  const { userId: currentUserId } = auth();

  //if current user not logged in
  if (!currentUserId) {
    throw new Error("User not Authenticated! Please log in...");
  }

  // Fetch the current user data
  let currentUser;
  try {
    currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { username: true }, // select only the username
    });

    if (!currentUser) {
      throw new Error("Current user not found");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while fetching user data");
  }

  return (
    <div className=" h-24 flex items-center justify-between">
      {/* LEFT */}
      <div className="lg:block w-[20%]">
        <Link href="/" className="font-bold text-xl text-blue-600">
          Sosyal Medya
        </Link>
      </div>
      {/* CENTER */}
      <div className="hidden md:flex md:justify-center w-[50%] text-sm items-center justify-between">
        {/* LINKS */}
        <div className="flex gap-6 text-gray-600">
          <Link href="/" className="flex items-center gap-2">
            <Image
              // src="/home.png"
              src="/Home.svg"
              alt="Homepage"
              width={20}
              height={20}
              className="w-4 h-4"
            />
            <span className="dark:text-white">Home</span>
          </Link>
          <Link
            href={`/friends/${currentUser.username}`}
            className="flex items-center gap-2"
          >
            <Image
              // src="/friends.png"
              src="/Friends.svg"
              alt="Friends"
              width={20}
              height={20}
              className="w-6 h-6"
            />
            <span className="dark:text-white">Friends</span>
          </Link>
          <Link
            href={`/stories/${currentUser.username}`}
            className="flex items-center gap-2"
          >
            <Image
              // src="/stories.png"
              src="/Stories.svg"
              alt="Stories"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="dark:text-white">Stories</span>
          </Link>
        </div>
        {/* SEACRH INPUT */}
        {/* <div className="hidden xl:flex p-2 bg-slate-100 items-center rounded-xl ">
          <input
            type="text"
            placeholder="Search.."
            className="bg-transparent outline-none"
          />
          <Image src="/search.png" alt="" width={14} height={14} />
        </div> */}
      </div>
      {/* RIGHT */}
      <div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end">
        <ClerkLoading>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] "></div>
        </ClerkLoading>
        <ClerkLoaded>
          <ThemeToggle />
          <SignedIn>
            {/* <div className="cursor-pointer">
              <Image src="/people.png" alt="" width={24} height={24} />
            </div>
            <div className="cursor-pointer">
              <Image src="/messages.png" alt="" width={24} height={24} />
            </div> */}
            {/* <div className="cursor-pointer">
              <Image src="/notifications.png" alt="" width={24} height={24} />
            </div> */}
            {/* <Link href="/" className="flex items-center gap-2">
              <Image
                src="/home.png"
                alt="Homepage"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </Link>
            <Link
              href={`/friends/${currentUser.username}`}
              className="flex items-center gap-2"
            >
              <Image
                src="/friends.png"
                alt="Friends"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </Link>
            <Link
              href={`/stories/${currentUser.username}`}
              className="flex items-center gap-2"
            >
              <Image
                src="/stories.png"
                alt="Stories"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </Link> */}
            <Notifications />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <Image src="/login.png" alt="" width={20} height={20} />
              <Link href="/sign-in" className="dark:text-white">
                Login/Register
              </Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;
