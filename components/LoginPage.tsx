/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaBolt, FaPhoneFlip } from "react-icons/fa6";
import { FaRegPaperPlane } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
// import "react-toastify/dist/ReactToastify.css";
import toast from "react-hot-toast";
import { z } from "zod";
import { loginHandler } from "@/app/(example)/auth/action";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useToast } from "@/components/hooks/use-toast";
import AuthDialogue from "./RecoveryPassword/AuthDialog";
import Link from "next/link";
import { LuDot } from "react-icons/lu";
import logo from "../public/BroTecs-Logo.webp";

type FormData = {
  phoneNumber: string;
  password: string;
};

interface LoginResponse {
  accessToken: string;
  message?: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  // const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [openAuthDialogue, setOpenAuthDialogue] = useState(false);
  const [highlightBorder, setHighlightBorder] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginSchema = z.object({
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits."),
    password: z.string().min(6, "Password must be at least 6 characters."),
  });

  type LoginFormFields = z.infer<typeof loginSchema>;

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    setError: setErrorLogin,
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    setServerError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("password", data.password);

    const loadingToast = toast.loading("Logging in...");

    try {
      const result = await loginHandler(formData);
      toast.dismiss(loadingToast);
      if (!result?.error) {
        toast.success("Login successful!");
        window.location.href = "/dashboard";
      } else {
        toast.error(`Login failed: ${result?.error}`);
        setServerError(result?.error);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred. Please try again.");
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = () => {
    setHighlightBorder(true);
    setTimeout(() => setHighlightBorder(false), 2000);
  };
  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* left Side */}
      <div className="relative flex w-full items-center justify-center bg-white px-8 py-[220px] sm:px-1 md:px-3 lg:w-2/4 lg:px-5">
        {/* Top Div */}
        <div className="absolute left-0 right-0 top-[-210px] mt-[230px] grid items-start justify-between gap-5 px-8 md:mt-60 md:flex md:items-center lg:mt-[230px] lg:flex lg:items-center lg:gap-5 xl:mt-[230px] xl:flex xl:items-center xl:gap-0">
          <Image
            src={logo}
            alt="Company Logo"
            width={240}
            height={118}
            className="h-[48px] w-[174px]"
          />
          <div>
            <span>
              Don't Have an Account ?{" "}
              <span
                onClick={handleContactClick}
                className="cursor-pointer font-medium text-primary-500"
              >
                Contact
              </span>{" "}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-sm lg:max-w-md xl:max-w-lg">
          <div className="mb-5 grid gap-2 text-center">
            <span className="text-3xl font-bold">Welcome to</span>
            <span className="text-3xl font-semibold">
              Employee Management Panel
            </span>
            <span> Login into your account</span>
          </div>
          <form
            onSubmit={handleSubmitLogin(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            <div className="space-y-3">
              <Label
                className="text-colors-text-login pb-3 text-base font-normal leading-[100%]"
                htmlFor="email"
              >
                Phone
              </Label>
              <Input
                required
                id="phoneNumber"
                type="text"
                placeholder="Enter your phone"
                className="focus-visible:ring-colors-light-bg h-12 border-0 bg-gray-100 pr-10"
                {...registerLogin("phoneNumber")}
              />
              {loginErrors.phoneNumber && (
                <span className="text-sm text-red-500">
                  {loginErrors.phoneNumber.message}
                </span>
              )}
            </div>
            <div className="space-y-3">
              <Label
                className="text-colors-text-login pb-3 text-base font-normal leading-[100%]"
                htmlFor="password"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  required
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="focus-visible:ring-colors-light-bg h-12 w-full border-0 bg-gray-100 pr-10"
                  {...registerLogin("password")}
                />
                {loginErrors.password && (
                  <span className="text-sm text-red-500">
                    {loginErrors.password.message}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoginSubmitting}
              className="flex h-12 w-full items-center justify-center gap-x-2 bg-primary-500 text-lg font-semibold leading-[27px] text-white hover:bg-primary-400"
            >
              {isLoginSubmitting ? "Logging in..." : "Login"}
              <FaRegPaperPlane size={16} />
            </Button>
          </form>
        </div>
      </div>

      {/* right Side */}
      <div
        className="relative hidden flex-col items-center justify-end px-8 py-10 text-white lg:flex lg:w-2/4"
        style={{
          backgroundImage:
            "url('https://ambufast.sgp1.digitaloceanspaces.com/assets/Admin/Login.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          // height: "100vh",
          // width: "100vh",
        }}
      >
        {/* Phone section */}
        <div
          className={`absolute right-4 top-4 flex items-center gap-3 rounded-full bg-black/10 px-7 py-3 text-sm text-gray-800 shadow-lg backdrop-blur-sm ${
            highlightBorder ? "animate-border-highlight" : ""
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
            <FaPhoneFlip className="text-xl" />
          </div>
          <span className="text-xl font-medium">+8801634139003</span>
        </div>
        {/* Description box */}
        <div className="mb-15 max-w-2xl rounded-lg bg-black/60 p-10 text-center text-white backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-gray/60 flex h-12 w-12 items-center justify-center rounded-full text-white backdrop-blur-md">
              <FaBolt className="text-2xl" />
            </div>
          </div>
          <p className="text-2xl font-light">
            Bro Tecs Employee Management simplifies workforce management.
          </p>
        </div>
      </div>

      {/* AuthDialogue Component */}
      <AuthDialogue
        open={openAuthDialogue}
        onOpenChange={setOpenAuthDialogue}
      />
    </div>
  );
};

export default LoginPage;
