"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Notification, User } from "@prisma/client";
import {
  deleteNotification,
  fetchNotification,
  markAllRead,
} from "@/lib/action";

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

// type NotificationType = Notification & { user: User };

const Notifications: React.FC = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [hasViewedNotifications, setHasViewedNotifications] =
    useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const notifications = await fetchNotification();
        setNotifications(notifications || []);
        console.log(notifications, "notifications");
      }
    };

    fetchNotifications();
  }, [user]);

  //realtime notification
  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "Notification",
            filter: `userId=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
            setHasViewedNotifications(false);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // const toggleDropdown = async () => {
  //   setIsDropdownOpen((prevState) => !prevState);
  //   if (!hasViewedNotifications) {
  //     await markAllRead(user!.id);
  //     setHasViewedNotifications(true);
  //   }
  // };

  const toggleDropdown = async () => {
    setIsDropdownOpen((prevState) => !prevState);
    if (!hasViewedNotifications) {
      await markAllRead(user!.id);
      setHasViewedNotifications(true);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      toggleRef.current &&
      !toggleRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const deletingNotification = async (id: number) => {
    await deleteNotification(id);
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  if (!user) return null;

  return (
    <div className="lg:relative md:relative">
      <div
        onClick={toggleDropdown}
        ref={toggleRef}
        className="cursor-pointer relative"
      >
        <Image
          // src="a/notifications.png"
          src="/Notification.svg"
          alt="Notifications"
          title="Notifications"
          className="w-6 h-6 md:w-8 md:h-8 lg:w-6 lg:h-6"
          width={12}
          height={12}
        />
        {unreadCount > 0 && !hasViewedNotifications && (
          <span className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute m-auto left-0 right-0 z-50 shadow-md mt-9 rounded-md w-full md:w-80 md:left-auto bg-white lg:w-72 lg:mt-2 lg:right-auto"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`mb-2 w-auto p-2 rounded-md flex-col justify-between items-center ${
                      notification.isRead ? "bg-gray-100" : "bg-yellow-100"
                    }`}
                  >
                    <p className="w-full">{notification.message}</p>
                    <button
                      onClick={() => deletingNotification(notification.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <p className="text-sm">Delete</p>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
  // <div className="relative">
  //   <div className="lg:relative md:relative">
  //     <div
  //       onClick={toggleDropdown}
  //       ref={toggleRef}
  //       className="cursor-pointer relative"
  //     >
  //       <img
  //         src="/notifications.png"
  //         alt="Notifications"
  //         width={24}
  //         height={24}
  //       />
  //       {unreadCount > 0 && !hasViewedNotifications && (
  //         <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
  //           {unreadCount}
  //         </span>
  //       )}
  //     </div>
  //     {isDropdownOpen && (
  //       <div
  //         ref={dropdownRef}
  //         //   className="absolute right-auto  mt-2 w-screen lg:w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50"
  //         className="absolute m-auto left-0 right-0 z-50 shadow-md mt-9 rounded-md md:w-80 md:left-auto bg-white lg:w-72 lg:mt-2 lg:right-auto "
  //       >
  //         <div className="p-4 ">
  //           <h2 className="text-lg font-semibold mb-2">Notifications</h2>
  //           {notifications.length === 0 ? (
  //             <p>No notifications</p>
  //           ) : (
  //             <div>
  //               {notifications.map((notification) => (
  //                 <div
  //                   key={notification.id}
  //                   className={` mb-2 w-auto p-2 rounded-md flex-col justify-between items-center ${
  //                     notification.isRead ? "bg-gray-100" : "bg-yellow-100"
  //                   }`}
  //                 >
  //                   <p className="w-full">{notification.message}</p>
  //                   <button
  //                     onClick={() => deletingNotification(notification.id)}
  //                     className="text-red-500 hover:text-red-700"
  //                   >
  //                     <p className="text-sm">Delete</p>
  //                   </button>
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  //   <div className="relative lg:relative md:relative">
  //     <div
  //       onClick={toggleDropdown}
  //       ref={toggleRef}
  //       className="cursor-pointer relative"
  //     >
  //       <img
  //         src="/notifications.png"
  //         alt="Notifications"
  //         className="w-6 h-6 md:w-8 md:h-8 lg:w-6 lg:h-6"
  //       />
  //       {unreadCount > 0 && !hasViewedNotifications && (
  //         <span className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
  //           {unreadCount}
  //         </span>
  //       )}
  //     </div>
  //     {isDropdownOpen && (
  //       <div
  //         ref={dropdownRef}
  //         className="absolute m-auto left-0 right-0 z-50 shadow-md mt-9 rounded-md w-full md:w-80 md:left-auto bg-white lg:w-72 lg:mt-2 lg:right-auto"
  //       >
  //         <div className="p-4">
  //           <h2 className="text-lg font-semibold mb-2">Notifications</h2>
  //           {notifications.length === 0 ? (
  //             <p>No notifications</p>
  //           ) : (
  //             <div>
  //               {notifications.map((notification) => (
  //                 <div
  //                   key={notification.id}
  //                   className={`mb-2 w-auto p-2 rounded-md flex-col justify-between items-center ${
  //                     notification.isRead ? "bg-gray-100" : "bg-yellow-100"
  //                   }`}
  //                 >
  //                   <p className="w-full">{notification.message}</p>
  //                   <button
  //                     onClick={() => deletingNotification(notification.id)}
  //                     className="text-red-500 hover:text-red-700"
  //                   >
  //                     <p className="text-sm">Delete</p>
  //                   </button>
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default Notifications;
