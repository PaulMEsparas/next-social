"use client";

import { acceptFollowRequest, declineFollowRequest } from "@/lib/action";
import { FollowRequest, User } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState } from "react";

type RequestWithUser = FollowRequest & { sender: User };

const FriendRequestList = ({ requests }: { requests: RequestWithUser[] }) => {
  //state for requests
  const [requestState, setRequestState] = useState(requests);

  //logged in user clicks or presses  on the accept button
  const accept = async (requestId: number, userId: string) => {
    removeOptimisticRequests(requestId); //updates the ui in an instant
    try {
      await acceptFollowRequest(userId); //update the data to the server
      setRequestState((prev) => prev.filter((req) => req.id !== requestId)); //update the state for the frontend
    } catch (error) {
      console.log(error);
    }
  };

  //logged in user clicks or presses  on the decline button
  const decline = async (requestId: number, userId: string) => {
    removeOptimisticRequests(requestId);
    try {
      await declineFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.log(error);
    }
  };

  //optimistic by filtering the requests using the userId
  const [optimisticRequests, removeOptimisticRequests] = useOptimistic(
    requestState,
    (state, value: number) => state.filter((req) => req.id !== value)
  );
  return (
    <div>
      {optimisticRequests.map((request) => (
        <div className="flex items-center justify-between" key={request.id}>
          <div className="flex items-center gap-4">
            <Image
              src={request.sender.avatar || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold">
              {request.sender.name && request.sender.surname
                ? request.sender.name + " " + request.sender.surname
                : request.sender.username}
            </span>
          </div>
          <div className="flex gap-3 justify-end">
            <form action={() => accept(request.id, request.senderId)}>
              <button>
                <Image
                  src="/accept.png"
                  alt=""
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              </button>
            </form>

            <form action={() => decline(request.id, request.senderId)}>
              <button>
                <Image
                  src="/reject.png"
                  alt=""
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;
