// "use client";

// import { useUser } from "@clerk/nextjs";
// import {
//   CldUploadWidget,
//   CloudinaryUploadWidgetResults,
// } from "next-cloudinary";

// import Image from "next/image";
// import { useState } from "react";
// import AddPostButton from "../AddPostButton";
// import { addPost } from "@/lib/action";

// const Addpost = () => {
//   const { user, isLoaded } = useUser();
//   const [desc, setDesc] = useState("");
//   const [img, setImg] = useState<any>();

//   if (!isLoaded) {
//     return "Loading...";
//   }

//   const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
//     if (
//       result.info &&
//       typeof result.info === "object" &&
//       "secure_url" in result.info
//     ) {
//       setImg(result.info.secure_url);
//     }
//   };

//   const handleSubmit = async (formData: FormData) => {
//     await addPost(formData, img || "");
//     setImg(null); // Reset the image placeholder after form submission
//     setDesc("");
//   };

//   return (
//     <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
//       {/* AVATAR */}
//       <Image
//         src={user?.imageUrl || "/noAvatar.png"}
//         alt=""
//         width={48}
//         height={48}
//         className="w-12 h-12 object-cover rounded-full"
//       />
//       {/* POST */}
//       <div className="flex-1">
//         {/* TEXT INPUT */}
//         {/* <form
//           action={(formData) => {
//             addPost(formData, img?.secure_url || "");
//             setDesc("");
//             setImg(null);
//           }}
//           className="flex gap-4"
//         > */}
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             const formData = new FormData(e.currentTarget);
//             handleSubmit(formData);
//           }}
//           className="flex gap-4"
//         >
//           <textarea
//             placeholder="What's on your mind?"
//             className="bg-slate-100 rounded-lg flex-1 p-2"
//             name="desc"
//             value={desc}
//             onChange={(e) => setDesc(e.target.value)}
//           ></textarea>
//           {/* <div>
//             <Image
//               src="/emoji.png"
//               alt=""
//               width={20}
//               height={20}
//               className="w-5 h-5 cursor-pointer self-end"
//             />
//           </div> */}
//           <AddPostButton desc={desc} />
//         </form>
//         {/* POST OPTIONS */}
//         <div className=" flex flex-wrap items-center gap-4 mt-4 text-gray-400">
//           {/* UPLOAD IMG */}
//           <CldUploadWidget
//             uploadPreset="SosyalMedia"
//             // onSuccess={(result, { widget }) => {
//             //   setImg(result.info);
//             //   widget.close();
//             // }}
//             onSuccess={handleUploadSuccess}
//           >
//             {/* //returns secure URL for the app to consume */}
//             {({ open }) => {
//               return (
//                 <div
//                   className="flex items-center gap-2 cursor-pointer"
//                   onClick={() => open()}
//                 >
//                   <Image
//                     src={img || "/addimage.png"}
//                     alt=""
//                     width={20}
//                     height={20}
//                   />
//                   Photo
//                 </div>
//               );
//             }}
//           </CldUploadWidget>

//           <div className="flex items-center gap-2 cursor-pointer">
//             <Image src="/addVideo.png" alt="" width={20} height={20} />
//             Video
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer">
//             <Image src="/addevent.png" alt="" width={20} height={20} />
//             Event
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer">
//             <Image src="/poll.png" alt="" width={20} height={20} />
//             Poll
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Addpost;

// "use client";

// import { useUser } from "@clerk/nextjs";
// import {
//   CldUploadWidget,
//   CloudinaryUploadWidgetResults,
// } from "next-cloudinary";
// import Image from "next/image";
// import { useState } from "react";
// import AddPostButton from "../AddPostButton";
// import { addPost } from "@/lib/action";

// const AddPost = () => {
//   const { user, isLoaded } = useUser();
//   const [desc, setDesc] = useState("");
//   const [imgUrl, setImgUrl] = useState("");

//   if (!isLoaded) {
//     return <p>Loading...</p>;
//   }

//   // const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
//   //   if (result.info?.secure_url) {
//   //     setImgUrl(result.info.secure_url);
//   //   }
//   // };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     formData.append("image", imgUrl);

//     try {
//       await addPost(formData, imgUrl?.secure_url || "");

//       setImgUrl("");
//       setDesc("");
//     } catch (error) {
//       console.error("Failed to submit the post:", error);
//     }
//   };

//   return (
//     <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
//       {/* AVATAR */}
//       <Image
//         src={user?.imageUrl || "/noAvatar.png"}
//         alt="User avatar"
//         width={48}
//         height={48}
//         className="w-12 h-12 object-cover rounded-full"
//       />
//       {/* POST */}
//       <div className="flex-1">
//         {/* TEXT INPUT */}
//         <form onSubmit={handleSubmit} className="flex gap-4">
//           <textarea
//             placeholder="What's on your mind?"
//             className="bg-slate-100 rounded-lg flex-1 p-2"
//             name="desc"
//             value={desc}
//             onChange={(e) => setDesc(e.target.value)}
//           ></textarea>
//           <AddPostButton desc={desc} />
//         </form>
//         {/* POST OPTIONS */}
//         <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-400">
//           {/* UPLOAD IMG */}
//           <CldUploadWidget
//             uploadPreset="SosyalMedia"
//             onSuccess={handleUploadSuccess}
//           >
//             {({ open }) => (
//               <div
//                 className="flex items-center gap-2 cursor-pointer"
//                 onClick={() => open()}
//               >
//                 <Image
//                   src={imgUrl || "/addimage.png"}
//                   alt="Add image"
//                   width={20}
//                   height={20}
//                 />
//                 Photo
//               </div>
//             )}
//           </CldUploadWidget>

//           <div className="flex items-center gap-2 cursor-pointer">
//             <Image src="/addVideo.png" alt="Add video" width={20} height={20} />
//             Video
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer">
//             <Image src="/addevent.png" alt="Add event" width={20} height={20} />
//             Event
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer">
//             <Image src="/poll.png" alt="Add poll" width={20} height={20} />
//             Poll
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPost;

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
