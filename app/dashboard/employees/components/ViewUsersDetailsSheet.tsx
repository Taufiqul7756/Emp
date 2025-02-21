"use client";

import React, { useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoIosEye } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api/handlers";
import Loading from "@/components/shared/Loading";
import LabelWithoutRequired from "@/components/shared/LabelWithoutRequired";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import LabelWithRequired from "@/components/shared/LabelWithRequired";
import { Button } from "@/components/ui/button";
import { BsBoxArrowLeft } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { IoBookSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { SingleUserType, User } from "../types/employeesType";

interface ViewProps {
  id: string;
  phoneNumber: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}

const ViewUsersDetailsSheet: React.FC<ViewProps> = ({ phoneNumber, id }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getSingleUserData = async (): Promise<ApiResponse<SingleUserType>> => {
    const response = await get<ApiResponse<SingleUserType>>(
      `/users/user/other/${phoneNumber}`,
      {
        Authorization: `Bearer ${session?.accessToken ?? ""}`,
      },
    );

    if (!response || !response.success) {
      throw new Error(response?.error || "Failed to fetch user data");
    }
    return response;
  };

  const {
    data: userSingleDataResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<ApiResponse<SingleUserType>>({
    queryKey: ["userdata", phoneNumber],
    queryFn: getSingleUserData,
    enabled: isOpen,
  });
  const userSingleData = userSingleDataResponse?.data;
  // console.log("SingleUserData", userSingleData);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="cursor-pointer rounded-lg border px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-400">
          {/* <IoIosEye className="h-8 w-8 text-gray-600" /> */}
          View
        </div>
      </SheetTrigger>

      <SheetContent className="w-[600px] max-w-[600px] dark:bg-slate-300">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            <SheetHeader className="my-5 flex flex-row items-center justify-between rounded-md">
              <SheetTitle className="flex w-full items-center justify-between rounded-lg bg-[#E9E8EE] p-4 text-xl font-semibold leading-[125%] dark:bg-slate-500">
                <div>
                  User ID: {id}
                  <h4 className="text-xs font-semibold leading-[150%] dark:text-white">
                    {userSingleData?.fullName}
                  </h4>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Separator className="my-5 border-t" />

            <div className="max-h-[90vh] overflow-auto pr-4 pt-4">
              <div>
                {/* Personal Information Section */}
                <section className="mb-8 space-y-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Image
                        className="h-[250px] w-full rounded-lg object-contain"
                        width={100}
                        height={250}
                        alt="ID Image"
                        src={
                          userSingleData?.profile?.profilePhoto ||
                          "/placeholder.png"
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithoutRequired> Name</LabelWithoutRequired>
                      <Input
                        value={userSingleData?.fullName}
                        disabled
                        className="h-12 bg-gray-50 text-black !opacity-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <LabelWithoutRequired>Email</LabelWithoutRequired>
                      <Input
                        value={userSingleData?.email || "Not Found"}
                        disabled
                        className="h-12 bg-gray-50 text-black !opacity-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithoutRequired>Phone</LabelWithoutRequired>
                      <Input
                        value={userSingleData?.phoneNumber || "Not Found"}
                        disabled
                        className="h-12 bg-gray-50 text-black !opacity-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithoutRequired>Birthdate</LabelWithoutRequired>
                      <Input
                        value={
                          userSingleData?.Profile?.dateOfBirth || "Not Found"
                        }
                        disabled
                        className="h-12 bg-gray-50 text-black !opacity-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithoutRequired>Role</LabelWithoutRequired>
                      <Input
                        value={userSingleData?.role || "Not Found"}
                        disabled
                        className="h-12 bg-gray-50 text-black !opacity-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithoutRequired>Address</LabelWithoutRequired>
                      <Input
                        value={
                          userSingleData?.address
                            ? ` ${userSingleData.address[0]?.state || ""}, ${userSingleData.address[0]?.country || ""}`
                            : "Not Found"
                        }
                        disabled
                        className="h-12 bg-gray-50 text-black !opacity-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <LabelWithoutRequired>Blood Group</LabelWithoutRequired>
                      <Input
                        value={
                          userSingleData?.Profile?.bloodGroup || "Not Found"
                        }
                        disabled
                        className="h-12 bg-gray-50 text-black !opacity-100"
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Close Button */}
              <div className="mb-32 mt-16 flex items-center justify-center">
                <Button
                  type="button"
                  className="flex h-12 w-[129px] items-center justify-center bg-danger-500 px-5 py-3 text-base font-normal leading-[19.2px] text-white hover:bg-danger-300"
                  onClick={() => setIsOpen(false)}
                >
                  <BsBoxArrowLeft className="mr-2.5" size={20} />
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ViewUsersDetailsSheet;
