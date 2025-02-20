"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { LiaSignOutAltSolid } from "react-icons/lia";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import notificationsData from "./data/notification.json";
import userDataJson from "./data/userData.json";
import { Notification } from "./Notification";
import { useSession } from "next-auth/react";
import { signOutHandler } from "@/app/(example)/auth/action";
import { get } from "@/lib/api/handlers";
import { ApiResponse, UserProfile } from "./NavBarTypes";
import { useQuery } from "@tanstack/react-query";
import logo from "../../public/BroTecs-Logo.webp";

interface NavbarProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setIsLoggedIn }: NavbarProps) {
  const { data: session, status } = useSession();
  const notifications = notificationsData.data.notifications;
  const userData = userDataJson?.data;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const router = useRouter();

  // console.log("sessionsession", session);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {};

  const getUserData = async () => {
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }
    const response = await get<ApiResponse<UserProfile>>(`/users/user/self`, {
      Authorization: `Bearer ${session?.accessToken}`,
      userId: session?.user?.userId,
    });
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch user data");
    }
    return response.data;
  };

  const {
    data: UserDataAtNavbar,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profilenavbar"],
    queryFn: getUserData,
    enabled: !!session?.accessToken,
  });

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b-[1px] border-[#D4D5D9] bg-white px-12 py-4">
      {/* LOGO */}
      <div className="flex items-center">
        <Link href="/dashboard">
          <Image src={logo} width={200} height={200} alt="Logo" />
        </Link>
      </div>

      {/* Notifications, Settings, and Profile */}
      <div className="flex items-center justify-center gap-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-black">
              <FaBell size={20} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            {/* Notifications Content */}
            <Notification notifications={notifications} />
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/dashboard/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black"
        >
          <IoSettings size={20} />
        </Link>

        {/* Profile Section with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center space-x-4">
              {/* Show skeletons if session is loading */}
              {status === "loading" ? (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[70px]" />
                  </div>
                </div>
              ) : (
                <>
                  {isLoading ? (
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
                  ) : (
                    <Avatar>
                      <AvatarImage
                        src={
                          UserDataAtNavbar?.profile?.profilePhoto ||
                          session?.user?.profilePhoto ||
                          "/default-avatar.png"
                        }
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback className="bg-danger-200 text-black">
                        {session?.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {/* Name and Role */}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-primary-500">
                      {session?.user?.role}
                    </p>
                  </div>
                </>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="py-2" side="bottom" align="end">
            <DropdownMenuItem
              // onClick={() => setIsDialogOpen(true)}
              // onClick={handleSignOut}
              onClick={() => {
                setIsDialogOpen(true);
              }}
              className="text-md flex cursor-pointer items-center justify-center gap-2 font-semibold text-primary-500"
            >
              <LiaSignOutAltSolid size={20} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Confirm sign out notifications dialog -  not used now*/}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm sign out</DialogTitle>
              <DialogDescription>
                Are you sure you want to sign out?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <form action={signOutHandler}>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white"
                >
                  Confirm
                </button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sign Out Confirmation Dialog */}
        {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                Do you really want to sign out? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded-md text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
    </nav>
  );
}
