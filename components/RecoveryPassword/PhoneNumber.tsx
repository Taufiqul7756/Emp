"use client";

import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define phone validation schema
const schema = z.object({
  phone: z
    .string()
    .nonempty({ message: "Phone number is required" })
    .regex(/^01[3-9][0-9]{8}$/, "Invalid phone number"),
});

interface FormField extends z.infer<typeof schema> {}

interface LoginDialogProps {
  handleTabSwitch: (tab: "phoneNumber" | "pinCode" | "confirmPassword") => void;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const PhoneNumber: React.FC<LoginDialogProps> = ({
  handleTabSwitch,
  open,
  onOpenChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormField>({
    defaultValues: {
      phone: "",
    },
    resolver: zodResolver(schema),
  });
  // console.log("login ")
  const onSubmit: SubmitHandler<FormField> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      handleTabSwitch("pinCode"); // Switch to the next tab
    } catch (error) {
      //   console.error("Login error", error);
    }
  };

  return (
    <div className="px-6 py-4">
      <Image
        src="/images/LoginImg.png"
        alt="Login Illustration"
        width={400}
        height={400}
        className="rounded-lg object-cover mx-auto mb-4"
      />
      <div>
        <p className="text-center text-2xl font-semibold">Login</p>
      </div>
      <form
        className="flex flex-col gap-4 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <Input
            type="tel"
            placeholder="Enter your phone number"
            {...register("phone")}
          />
          {errors.phone && (
            <span className="text-sm text-red-500">{errors.phone.message}</span>
          )}
        </div>
        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-primary-500 text-baseWhite"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default PhoneNumber;
