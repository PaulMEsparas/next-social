"use client";

import prisma from "@/lib/client";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { useState } from "react";

// const MobileMenu = () => {
const MobileMenu = ({ params }: { params: { username: string } }) => {
  const username = params.username;
  // console.log(username, "USERNAME");
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false); // Close the menu when a link is clicked
  };

  return (
    <div className="md:hidden">
      <div
        className="flex flex-col gap-[4.5px] cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "rotate-45" : ""
          } origin-left ease-in-out duration-500`}
        />
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "opacity-0" : ""
          } ease-in-out duration-500`}
        />
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "-rotate-45" : ""
          } origin-left ease-in-out duration-500`}
        />
      </div>
      {isOpen && (
        <div className=" absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10 ">
          <Link href="/" onClick={handleLinkClick}>
            Home
          </Link>
          <Link href={`/friends/${username}`} onClick={handleLinkClick}>
            Friends
          </Link>
          {/* <Link href="/">Groups</Link> */}
          <Link href={`/stories/${username}`} onClick={handleLinkClick}>
            Stories
          </Link>
          {/* <Link href="/sign-in">Login</Link> */}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
