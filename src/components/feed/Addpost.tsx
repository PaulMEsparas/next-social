"use client";

import { useUser } from "@clerk/nextjs";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import Image from "next/image";
import { useState } from "react";
import AddPostButton from "../AddPostButton";
import { addPost } from "@/lib/action";

const Addpost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();

  if (!isLoaded) {
    return "Loading...";
  }

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (
      result.info &&
      typeof result.info === "object" &&
      "secure_url" in result.info
    ) {
      setImg(result.info.secure_url);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    await addPost(formData, img || "");
    setImg(null); // Reset the image placeholder after form submission
    setDesc("");
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user?.imageUrl || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        {/* <form
          action={(formData) => {
            addPost(formData, img?.secure_url || "");
            setDesc("");
            setImg(null);
          }}
          className="flex gap-4"
        > */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}
          className="flex gap-4"
        >
          <textarea
            placeholder="What's on your mind?"
            className="bg-slate-100 rounded-lg flex-1 p-2"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          {/* <div>
            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
          </div> */}
          <AddPostButton desc={desc} />
        </form>
        {/* POST OPTIONS */}
        <div className=" flex flex-wrap items-center gap-4 mt-4 text-gray-400">
          {/* UPLOAD IMG */}
          <CldUploadWidget
            uploadPreset="SosyalMedia"
            // onSuccess={(result, { widget }) => {
            //   setImg(result.info);
            //   widget.close();
            // }}
            onSuccess={handleUploadSuccess}
          >
            {/* //returns secure URL for the app to consume */}
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image
                    src={img || "/addimage.png"}
                    alt=""
                    width={20}
                    height={20}
                  />
                  Photo
                </div>
              );
            }}
          </CldUploadWidget>

          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addVideo.png" alt="" width={20} height={20} />
            Video
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addevent.png" alt="" width={20} height={20} />
            Event
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/poll.png" alt="" width={20} height={20} />
            Poll
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addpost;
