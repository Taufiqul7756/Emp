"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFields = z.infer<typeof passwordSchema>;

interface ConfirmPasswordProps {
  handleTabSwitch: (tab: "phoneNumber" | "pinCode" | "confirmPassword") => void;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ConfirmPassword({
  handleTabSwitch,
  open,
  onOpenChange,
}: ConfirmPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFields>({
    resolver: zodResolver(passwordSchema),
  });

  const handleFormSubmit = (data: PasswordFields) => {
    // console.log("Password submitted:", data.password);
    // Switch to the next tab after form submission
    handleTabSwitch("phoneNumber");
    toast.success("Password Changed successfully!");
    window.location.reload();
  };

  return (
    <div className="px-6 py-4">
      <div className="space-y-4">
        <div className="flex justify-center">
          <Image
            src="/images/Logo-dialog.png"
            alt="AmbuFast Logo"
            width={256}
            height={71}
            className="h-10 w-auto"
          />
        </div>
        <p className="text-center text-2xl font-semibold">Create Password</p>
      </div>
      <p className="text-center text-xs">
        We&apos;ve sent a one-time password (OTP) to your phone number. Please
        enter the code below to complete verification.
      </p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="pr-10"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="pr-10"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-primary-500 hover:bg-primary-600 text-baseWhite"
        >
          Next
        </Button>
      </form>
    </div>
  );
}
