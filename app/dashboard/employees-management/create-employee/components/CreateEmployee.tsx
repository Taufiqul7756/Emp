"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "@/lib/api/handlers";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface UserFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  role: "ADMIN" | "MODERATOR" | "CLIENT";
  Address: {
    addressLine1?: string;
    city?: string;
    country?: string;
    zipcode?: string;
  };
  Profile: {
    profilePhoto?: string;
    gender?: string;
  };
}

interface PaginatedResponse<T> {
  data: T;
  totalPanelUsers: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

type ImgResponse = {
  success: boolean;
  message: string;
  data: {
    urls: string[];
  };
  error: string | null;
};

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." }),
    phoneNumber: z.string().min(10, { message: "Enter a valid phone number." }),
    email: z.string().email({ message: "Enter a valid email address." }),
    Address: z.object({
      addressLine1: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      zipcode: z.string().optional(),
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    Profile: z.object({
      profilePhoto: z.string().optional(),
      gender: z.string().optional(),
    }),
    role: z.enum(["ADMIN", "MODERATOR", "CLIENT"], {
      errorMap: () => ({ message: "Role is required." }),
    }),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"], {
      errorMap: () => ({ message: "Status is required." }),
    }),

    allowedModules: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function CreateEmployee() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | null>("");
  const [viewsPassword, setViewsPassword] = useState<boolean>(false);
  const [viewsConPassword, setViewsConPassword] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ADMIN",
      status: "ACTIVE",
      allowedModules: [],
      Address: {
        addressLine1: "",
        city: "",
        country: "",
        zipcode: "",
      },
      Profile: {
        gender: "",
        profilePhoto: "",
      },
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      // console.log("file data", file);
      const formData = new FormData();
      formData.append("images", file);

      const response = await post<ImgResponse>(
        "/users/user/upload-images",
        formData,
        {
          Authorization: `Bearer ${session?.accessToken ?? ""}`,
        },
      );
      setProfilePhoto(response?.data?.urls[0]);
      return response;
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully!");
    },
    onError: (error) => {
      // console.error("Image upload error:", error.message);
      toast.error("Image upload failed.");
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
      uploadImageMutation.mutate(file);
      // console.log("file data handleImageUpload", file);
    }
  };

  const userMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      await post(
        "/users/user",
        {
          ...data,
          Profile: {
            profilePhoto: profilePhoto,
            gender: data.Profile.gender,
          },
        },
        {
          Authorization: `Bearer ${session?.accessToken ?? ""}`,
        },
      );
    },
    onSuccess: () => {
      toast.success("Employee created successfully!");
      form.reset();
      setProfilePhoto(null);
      router.push("/dashboard/employees-management");
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data) {
        toast.error(`Error: ${error.response?.data.error}`);
      } else {
        toast.error("An unexpected error occurred!");
      }
    },
  });

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    const { confirmPassword, ...dataWithoutConfirmPassword } = formData;
    userMutation.mutate(dataWithoutConfirmPassword);
  };

  const handleBackAdmin = () => {
    router.push("/dashboard/employees-management");
  };

  const togglePasswordVisibility = () => {
    setViewsPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setViewsConPassword((prev) => !prev);
  };

  return (
    <div className="m-4 space-y-4 rounded-sm bg-white p-4 pt-2 dark:bg-slate-300">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/employees-management")}
        className="dark:hover:bg-slate-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-center text-2xl font-bold">Create Employee</h1>

      <div className="flex justify-center pb-10">
        <div className="relative">
          {profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profilePhoto}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200" />
          )}
          <label
            htmlFor="profile-upload"
            className="absolute -left-8 top-[100px] flex w-40 cursor-pointer justify-center gap-2 rounded-sm border border-gray-400 bg-gray-200 p-2 text-[13px] shadow-md"
          >
            <RiUploadCloud2Line className="h-4 w-4" /> Upload profile
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <h1 className="font-semibold">Profile Information</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the name"
                      className="dark:border-none dark:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            {/* Add remaining form fields here */}
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number<span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="dark:border-none dark:bg-white"
                      placeholder="Enter Phone Number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="dark:border-none dark:bg-white"
                      placeholder="Enter Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="Profile.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="dark:bg-slate-400 dark:text-white">
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-slate-400 dark:text-white">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <h1 className="font-semibold">Address Information</h1>

          {/* Address */}
          <FormField
            control={form.control}
            name="Address.addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input
                    className="dark:border-none dark:bg-white"
                    placeholder="Enter Address Line 1"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    className="dark:border-none dark:bg-white"
                    placeholder="Enter City"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    className="dark:border-none dark:bg-white"
                    placeholder="Enter Country"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Address.zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zipcode</FormLabel>
                <FormControl>
                  <Input
                    className="dark:border-none dark:bg-white"
                    placeholder="Enter Zipcode"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={viewsPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...field}
                        className="pr-10 dark:border-none dark:bg-white"
                      />
                      <Button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                      >
                        {viewsPassword ? <ImEyeBlocked /> : <ImEye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={viewsConPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                        className="pr-10 dark:border-none dark:bg-white"
                      />
                      <Button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                      >
                        {viewsConPassword ? <ImEyeBlocked /> : <ImEye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="dark:bg-slate-400 dark:text-white">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-slate-400 dark:text-white">
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="dark:bg-slate-400 dark:text-white dark:hover:bg-slate-300"
              onClick={handleBackAdmin}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              className="rounded-lg bg-primary-500 text-white dark:bg-slate-400 dark:hover:bg-slate-300"
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
