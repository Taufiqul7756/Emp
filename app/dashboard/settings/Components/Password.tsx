"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { patch } from "@/lib/api/handlers";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

// Define validation schema with Zod
const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// Infer schema types
type PasswordForm = z.infer<typeof schema>;

const Password = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Hook form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      try {
        let response = await patch<Response>(
          `/users/user/self`,
          {
            password: data?.password,
          },
          {
            userid: `${session?.user?.userId}`,
            Authorization: `Bearer ${session?.accessToken ?? ""}`,
          },
        );

        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.error);
        } else {
          throw new Error("Internal server error");
        }
      }
    },
    onSuccess: () => {
      toast.success("Password updated successfully!");
      router.push("/dashboard");
      // router.push("/dashboard/settings");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onSubmit: SubmitHandler<PasswordForm> = async (values) => {
    try {
      // Simulate API call
      mutation.mutate(values);
    } catch (error) {
      // console.error("Form submission error:", error);
    }
  };

  return (
    <div className="m-5">
      <h1 className="mb-2 text-2xl font-bold">Password</h1>
      <p className="mb-6 text-gray-600">Modify your current password</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Password Field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-2 block font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              {...register("password")}
              className="pr-10 dark:border dark:bg-white"
            />
            <Button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </div>
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="mb-2 block font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className="pr-10 dark:border dark:bg-white"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Update Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            // className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none dark:bg-slate-400 dark:hover:bg-slate-300"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Password;
