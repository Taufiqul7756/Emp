"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NotificationProps {
  notifications: {
    id: string;
    avatar: string;
    name: string;
    description: string;
    time: string;
    read: boolean;
  }[];
}

export const Notification: React.FC<NotificationProps> = ({
  notifications,
}) => {
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const handleFilterChange = (filterType: "all" | "read" | "unread") => {
    // console.log(`Filter clicked: ${filterType}`); // Logs which button was clicked
    setFilter(filterType);
  };
  // Filter notifications based on the selected filter
  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "read"
      ? notifications.filter((notification) => notification.read)
      : notifications.filter((notification) => !notification.read);

  return (
    <div className="p-6 xl:w-[650px] lg:w-[450px] md:w-[350px] w-[250px] bg-white rounded-lg">
      <div className="flex  pb-4 border-b border-gray-200 font-bold">
        <h2 className="text-lg font-bold text-black">Notifications</h2>
      </div>
      {/* Filter buttons */}
      <div className="flex justify-center xl:gap-10 lg:gap-6 md:gap-4 gap-2 text-sm py-3 border-b border-gray-200">
        <button
          className={cn(
            "px-4 font-medium",
            filter === "all"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-500 hover:text-red-500"
          )}
          // onClick={() => setFilter("all")}
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
        <button
          className={cn(
            "px-4 font-medium",
            filter === "unread"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-500 hover:text-red-500"
          )}
          // onClick={() => setFilter("unread")}
          onClick={() => handleFilterChange("unread")}
        >
          Unread
        </button>
        <button
          className={cn(
            "px-4 font-medium",
            filter === "read"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-500 hover:text-red-500"
          )}
          // onClick={() => setFilter("read")}
          onClick={() => handleFilterChange("read")}
        >
          Read
        </button>
      </div>
      <ul className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications</p>
        ) : (
          filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-md",
                notification.read ? "bg-gray-50" : "bg-gray-100"
              )}
            >
              {/* Avatar */}
              <Image
                src={notification.avatar}
                alt={notification.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900">
                  {notification.name}{" "}
                  <span className="font-normal text-gray-600">
                    {notification.description}
                  </span>
                </p>
                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
