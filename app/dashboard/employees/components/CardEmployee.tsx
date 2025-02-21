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
import profileImg from "../../../../public/profile.jpg";

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
    <Card className="w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 shadow-lg dark:bg-slate-300">
      {/* Full-width image at the top */}
      <CardHeader className="p-0">
        <img
          src={employee.imageUrl || "/profile.jpg"}
          alt={employee.fullName}
          className="object-fit h-48 w-full"
        />
      </CardHeader>

      {/* Card Content */}
      <CardContent className="grid gap-2 p-4">
        <CardTitle className="mb-2 text-center text-lg font-semibold dark:text-slate-600">
          {employee.fullName}
        </CardTitle>
        <CardDescription className="overflow-hidden truncate text-ellipsis break-words text-gray-600 md:text-sm">
          <span className="font-semibold">Email:</span> {employee.email}
        </CardDescription>
        <CardDescription className="dark:text-slate-600">
          <span className="font-semibold">Phone:</span> {employee.phoneNumber}
        </CardDescription>
        <CardDescription className="dark:text-slate-600">
          <div className="flex justify-start gap-2">
            Role:
            <span className="rounded-md border bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {employee.role}
            </span>
          </div>
        </CardDescription>
        <CardDescription className="dark:text-slate-600">
          <div className="mt-2 flex justify-start gap-2">
            Status:
            <span
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                employee.status === "Active"
                  ? "border border-green-300 bg-green-100 text-green-700"
                  : "border border-red-300 bg-red-100 text-red-700"
              }`}
            >
              {employee.status}
            </span>
          </div>
        </CardDescription>
      </CardContent>

      {/* Button at the Bottom */}
      <CardFooter className="flex justify-end p-4">
        <Button
          className="dark:bg-slate-300 dark:text-slate-700 dark:hover:bg-slate-200"
          variant="outline"
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardEmployee;
