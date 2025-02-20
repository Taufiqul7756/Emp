"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { CalendarIcon, CloudUpload, PenIcon as UserPen } from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { get, patch, post } from "@/lib/api/handlers";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarPlus2Icon as CalendarIcon2 } from "lucide-react";

// Zod schema for validation
const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.string().min(1, "Gender is required"),
  phoneNumber: z.string(),
  profilePhoto: z.string().nonempty({ message: "Image is required." }),
  dateOfBirth: z.date().optional(),
});

type ProfileInformationProps = {
  user?: UserData;
};

type ProfileFormValues = z.infer<typeof schema>;

interface Profile {
  profilePhoto?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date; // ISO date string format (e.g., "YYYY-MM-DD")
}

// Type for Address (optional)
interface Address {
  addressLine1?: string;
  city?: string;
  country?: string;
  zipcode?: string;
  isDefault?: boolean;
}

// Main Type
interface User {
  fullName: string;
  phoneNumber?: string; // Optional
  email: string;
  password: string;
  role: "ADMIN" | "USER"; // Enum-like roles
  allowedModules: string[];
  Profile?: Profile; // Optional
  Address?: Address; // Optional
}

type UserData = {
  fullName?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "USER" | "MODERATOR";
  allowedModules?: string[];
  phoneNumber?: string;
  profile?: {
    profilePhoto?: string;
    gender?: "male" | "female" | "other";
    dateOfBirth?: Date;
  };
  address?: {
    addressLine1?: string;
    city?: string;
    country?: string;
    zipcode?: string;
    isDefault?: boolean;
  };
};

type Response = {
  success: boolean;
  message: string;
  data: UserData;
  error: string | null;
};

interface UserProps {
  data: User | undefined;
  refetch: () => void;
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({ user }) => {
  const { data: session } = useSession();
  const router = useRouter();
  // const [user, setUser] = useState<UserData | undefined>()
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const queryClient = useQueryClient();

  // const fetchDetails = async () => {
  //   const response = await get<Response>(`/users/user/self`, {
  //     userid: `${session?.user?.userId}`,
  //     Authorization: `Bearer ${session?.accessToken}`,
  //   })

  //   if (!response?.success || !response?.data) {
  //     throw new Error(response?.message || "Failed to fetch user details")
  //   }
  //   console.log("profile user", response.data)
  //   setUser(response.data)
  //   return response.data
  // }

  // const { refetch } = useInfiniteQuery({
  //   queryKey: ["user"],
  //   queryFn: fetchDetails,
  //   initialPageParam: 0,
  //   getNextPageParam: () => undefined,
  // })

  // useEffect(() => {
  //   refetch()
  // }, [refetch])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      gender: user?.profile?.gender || undefined,
      profilePhoto: user?.profile?.profilePhoto || "",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: user?.profile?.dateOfBirth
        ? new Date(user.profile.dateOfBirth)
        : undefined,
    },
    mode: "onBlur", // Trigger validation on blur to show errors immediately
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      try {
        const response = await patch<Response>(
          `/users/user/self`,
          {
            fullName: data?.fullName,
            email: data?.email,
            Profile: {
              gender: data?.gender,
              profilePhoto: data?.profilePhoto,
              dateOfBirth: data?.dateOfBirth
                ? data.dateOfBirth.toISOString()
                : undefined,
            },
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
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profilenavbar"] });
      router.push("/dashboard/settings");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("images", file);

      const response = await post<{
        success: boolean;
        data: { urls: string[] };
      }>("/users/user/upload-images", formData, {
        Authorization: `Bearer ${session?.accessToken ?? ""}`,
      });

      const imageUrl = response?.data?.urls?.[0];
      if (imageUrl) {
        setProfileImage(imageUrl);
        form.setValue("profilePhoto", imageUrl);
      }
      return response;
    },
    onSuccess: () => toast.success("Image uploaded successfully!"),
    onError: () => toast.error("Image upload failed."),
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
    }
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (formData) => {
    const updatedData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : undefined,
    };
    mutation.mutate(updatedData);
  };

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        gender: user?.profile?.gender || undefined,
        profilePhoto: user?.profile?.profilePhoto || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.profile?.dateOfBirth
          ? new Date(user.profile.dateOfBirth)
          : undefined,
      });
    }
  }, [user, form]);

  return (
    <div className="m-5">
      {/* Profile Header */}
      <div className="mb-8 flex items-center justify-between space-x-4">
        <div className="flex items-center">
          <div>
            {profileImage || user?.profile?.profilePhoto ? (
              <Image
                src={
                  profileImage ||
                  user?.profile?.profilePhoto ||
                  "/default-profile.png" ||
                  "/placeholder.svg"
                }
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <>
                <div className="flex h-24 w-24 items-center justify-center rounded-full border text-lg">
                  <UserPen size={48} />
                </div>
                {form?.formState?.errors?.profilePhoto && (
                  <p className="text-sm text-red-500">
                    {form?.formState?.errors?.profilePhoto?.message}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mx-3">
            <h2 className="text-lg font-bold">
              {user?.fullName || "User Name"}
            </h2>
            <p className="text-sm text-gray-600">{user?.email || "Email"}</p>
          </div>
        </div>

        <div>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="profile-upload"
            className="flex cursor-pointer items-center rounded-md border-2 border-gray-300 bg-gray-200 px-5 py-2"
          >
            <CloudUpload className="mr-2" /> Upload
          </label>
        </div>
      </div>

      {/* Profile Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              disabled
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Select</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-white p-0"
                        align="start"
                      >
                        <div className="flex flex-col space-y-4 p-3">
                          <div className="flex justify-between space-x-2">
                            <Select
                              onValueChange={(value) => {
                                const newDate = new Date(calendarMonth);
                                newDate.setMonth(Number.parseInt(value));
                                setCalendarMonth(newDate);
                              }}
                              value={calendarMonth.getMonth().toString()}
                            >
                              <SelectTrigger className="w-[110px]">
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {new Date(0, i).toLocaleString("default", {
                                      month: "long",
                                    })}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              onValueChange={(value) => {
                                const newDate = new Date(calendarMonth);
                                newDate.setFullYear(Number.parseInt(value));
                                setCalendarMonth(newDate);
                              }}
                              value={calendarMonth.getFullYear().toString()}
                            >
                              <SelectTrigger className="w-[95px]">
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {Array.from({ length: 100 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={(
                                      new Date().getFullYear() - i
                                    ).toString()}
                                  >
                                    {new Date().getFullYear() - i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date: Date | undefined) => {
                              if (date) {
                                field.onChange(date);
                                setCalendarOpen(false);
                              }
                            }}
                            month={calendarMonth}
                            onMonthChange={setCalendarMonth}
                            initialFocus
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center">
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none"
            >
              {form.formState.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileInformation;
