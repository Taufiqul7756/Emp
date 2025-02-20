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

interface Employee {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  imageUrl?: string; // Optional image field
}

const CardEmployee: React.FC<{ employee: Employee }> = ({ employee }) => {
  return (
    <Card className="w-80">
      <CardHeader className="flex items-center">
        <img
          src={employee.imageUrl || "/default-avatar.png"}
          alt={employee.fullName}
          className="h-16 w-16 rounded-full"
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{employee.fullName}</CardTitle>
        <CardDescription>Email: {employee.email}</CardDescription>
        <CardDescription>Phone: {employee.phoneNumber}</CardDescription>
        <CardDescription>Role: {employee.role}</CardDescription>
        <CardDescription>Status: {employee.status}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline">View</Button>
      </CardFooter>
    </Card>
  );
};

export default CardEmployee;
