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
    <Card className="w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 shadow-lg">
      {/* Full-width image at the top */}
      <CardHeader className="p-0">
        <img
          src={employee.imageUrl || "/profile.jpg"}
          alt={employee.fullName}
          className="h-36 w-full object-cover"
        />
      </CardHeader>

      {/* Card Content */}
      <CardContent className="p-4">
        <CardTitle className="text-center text-lg font-semibold">
          {employee.fullName}
        </CardTitle>
        <CardDescription className="overflow-hidden truncate text-ellipsis break-words text-gray-600 md:text-sm">
          <span className="font-semibold">Email:</span> {employee.email}
        </CardDescription>
        <CardDescription>
          <span className="font-semibold">Phone:</span> {employee.phoneNumber}
        </CardDescription>

        {/* Role & Status Badges */}
        <div className="mt-6 flex justify-start gap-2">
          Role:
          <span className="rounded-md border bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {employee.role}
          </span>
        </div>
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
      </CardContent>

      {/* Button at the Bottom */}
      <CardFooter className="flex justify-end p-4">
        <Button variant="outline">View</Button>
      </CardFooter>
    </Card>
  );
};

export default CardEmployee;
