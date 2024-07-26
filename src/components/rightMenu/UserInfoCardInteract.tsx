"use client";

import { switchFollow, switchBlock } from "@/lib/action";
import { useOptimistic, useState } from "react";

const UserInfoCardInteract = ({
  userId,
  //   currentUserId,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
}: {
  userId: string;
  //   currentUserId: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
}) => {
  const [userState, setUserState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingrequestSent: isFollowingSent,
  });

  //action to update the follow button
  const follow = async () => {
    switchOptimisticState("follow");
    try {
      await switchFollow(userId);
      setUserState((prev) => ({
        ...prev,
        following: prev.following && false,
        followingrequestSent:
          !prev.following && !prev.followingrequestSent ? true : false,
      }));
    } catch (err) {
      console.log(err);
    }
  };
  //action to block or unblock the viewed user
  const block = async () => {
    switchOptimisticState("block");
    try {
      await switchBlock(userId);
      setUserState((prev) => ({
        ...prev,
        blocked: !prev.blocked,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const [optimisticState, switchOptimisticState] = useOptimistic(
    userState,
    (state, value: "follow" | "block") =>
      value === "follow"
        ? {
            ...state,
            following: state.following && false,
            followingrequestSent:
              !state.following && !state.followingrequestSent ? true : false,
          }
        : { ...state, blocked: !state.blocked }
  );

  return (
    <>
      <form action={follow}>
        <button className="w-full bg-blue-500 text-white text-sm rounded-md p-2">
          {optimisticState.following
            ? "Following"
            : optimisticState.followingrequestSent
            ? "Friend request sent"
            : "Follow"}
        </button>
      </form>
      <form action={block} className="self-end">
        <button>
          <span className="text-red-400 text-xs cursor-pointer">
            {optimisticState.blocked ? "Unblocked User" : "Block User"}
          </span>
        </button>
      </form>
    </>
  );
};

export default UserInfoCardInteract;
