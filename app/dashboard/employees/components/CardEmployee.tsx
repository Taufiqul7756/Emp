/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ViewUsersDetailsSheet from "./ViewUsersDetailsSheet";
import { IoPersonSharp } from "react-icons/io5"; // Role icon
import { MdWork } from "react-icons/md"; // Status icon

interface Employee {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  imageUrl?: string;
}

const CardEmployee: React.FC<{ employee: Employee }> = ({ employee }) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-none dark:bg-slate-500">
      {/* Full-width image at the top */}
      <CardHeader className="p-0">
        <img
          src={employee.imageUrl || "/profile.jpg"}
          alt={employee.fullName}
          className="object-fit h-48 w-full"
        />
      </CardHeader>

      {/* Card Content */}
      <CardContent className="grid gap-2 p-5">
        <CardTitle className="text-center text-lg font-semibold text-gray-900 dark:text-white">
          {employee.fullName}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-white">
          <span className="font-semibold">Email:</span> {employee.email}
        </CardDescription>
        <CardDescription className="text-sm text-gray-600 dark:text-white">
          <span className="font-semibold">Phone:</span> {employee.phoneNumber}
        </CardDescription>

        {/* Separator for better visual structure */}
        <Separator className="my-3 bg-gray-300 dark:bg-white" />

        {/* Role & Status Section */}
        <div className="flex flex-col gap-3">
          {/* Role */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MdWork className="text-lg text-gray-500 dark:text-white" />
            <span className="font-semibold dark:text-white">Role:</span>
            <span className="rounded-md border px-3 py-1 text-sm font-medium text-gray-800 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-300">
              {employee.role}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <IoPersonSharp className="text-lg text-gray-500 dark:text-white" />
            <span className="font-semibold">Status:</span>
            <span
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                employee.status === "Active"
                  ? "border border-green-300 bg-green-100 text-green-700 dark:border-green-500 dark:bg-green-800 dark:text-green-300"
                  : "border border-red-300 bg-red-100 text-red-700 dark:border-red-500 dark:bg-red-800 dark:text-red-300"
              }`}
            >
              {employee.status}
            </span>
          </div>
        </div>
      </CardContent>

      {/* View Button at the Bottom */}
      <CardFooter className="flex justify-center p-4">
        <ViewUsersDetailsSheet
          phoneNumber={employee.phoneNumber}
          id={employee.id}
        />
      </CardFooter>
    </Card>
  );
};

export default CardEmployee;
