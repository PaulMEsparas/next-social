"use client";

import { deletePost } from "@/lib/action";
import Image from "next/image";
import { useState } from "react";

const PostInfo = ({ postId }: { postId: number }) => {
  const [open, setOpen] = useState(false);

  //passing the post id as input to the delete action
  //like creating another function which takes the postId as a parameter passed to the function deletePost
  const deletePostWithId = deletePost.bind(null, postId);
  return (
    <div className="relative">
      <Image
        src="/more.png"
        alt=""
        width={16}
        height={16}
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer"
      />
      {open && (
        <div className="absolute top-4 w-32 right-0 bg-white p-4 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
          <span className="cursor-pointer">View</span>
          <span className="cursor-pointer">Repost</span>
          <form action={deletePostWithId}>
            <button className="text-red-500">Delete</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostInfo;
