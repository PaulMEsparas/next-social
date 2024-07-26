"use client";

import { updateProfile } from "@/lib/action";
import { User } from "@prisma/client";
import Image from "next/image";
import { useActionState, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { any } from "zod";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import UpdateButton from "./UpdateButton";

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  //for Cloudinary image state
  const [cover, setCover] = useState<any>(false);

  //props for useActionState : (server action, initial state)
  const [state, formAction] = useActionState(updateProfile, {
    success: false,
    error: false,
  });

  const router = useRouter();
  const handleModalClose = () => {
    setOpen(false);
    state.success && router.refresh();
  };

  return (
    <div>
      <span
        className="text-blue-500 text-xs cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Update
      </span>
      {open && (
        <div className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50">
          <form
            action={(formData) =>
              formAction({ formData, cover: cover?.secure_url || "" })
            }
            className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative"
          >
            {/* TITLE */}
            <h1>Update Profile</h1>
            <div className="mt-4 text-xs text-gray-500">
              Use the navbar profile to change the avatr or username.
            </div>
            {/* COVER PICTURE */}

            <CldUploadWidget
              uploadPreset="SosyalMedia"
              onSuccess={(result) => setCover(result.info)}
            >
              {/* //returns secure URL for the app to consume */}
              {({ open }) => {
                return (
                  <div
                    className="flex flex-col gap-4 my-4"
                    onClick={() => open()}
                  >
                    <label htmlFor="">Cover Picture</label>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Image
                        src={user.cover || "/noCover.png"}
                        alt=""
                        width={48}
                        height={32}
                        className="w-12 h-8 rounded-md object-cover"
                      />
                      <span className="text-xs underline text-gray-600">
                        Change
                      </span>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>

            {/* INPUTS */}
            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  First Name
                </label>
                <input
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  type="text"
                  name="name"
                  placeholder={user.name || "John"}
                />
              </div>

              {/* --- */}

              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  Last Name
                </label>
                <input
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  type="text"
                  name="surname"
                  placeholder={user.surname || "Doe"}
                />
              </div>

              {/* --- */}

              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.description || "Life is great..."}
                />
              </div>

              {/* --- */}

              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  City
                </label>
                <input
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  type="text"
                  name="city"
                  placeholder={user.city || "New York"}
                />
              </div>

              {/* --- */}

              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  School
                </label>
                <input
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  type="text"
                  name="school"
                  placeholder={user.school || "MIT"}
                />
              </div>

              {/* --- */}

              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  Work
                </label>
                <input
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  type="text"
                  name="work"
                  placeholder={user.work || "Google"}
                />
              </div>
              {/* --- */}
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  Website
                </label>
                <input
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  type="text"
                  name="website"
                  placeholder={user.website || "www.google.com"}
                />
              </div>
            </div>
            {/* --INPUTS-- */}

            <UpdateButton />

            {state.success && (
              <span className="text-green-500">Profile has been updated!</span>
            )}
            {state.error && (
              <span className="text-red-500">Something went wrong!</span>
            )}

            <div
              className="cursor-pointer absolute tex-xl right-5 top-3"
              onClick={handleModalClose}
            >
              X
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
