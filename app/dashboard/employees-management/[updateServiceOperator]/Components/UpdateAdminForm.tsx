"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useParams, useRouter } from "next/navigation";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, patch, post } from "@/lib/api/handlers";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { set } from "lodash";
import { ApiResponse } from "@/types/ClientMessages";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface UserData {
  userId: string;
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  allowedModules: any[]; // Replace `any` with the specific type if known
  status: string;
  createdBy: string | null;
  createdAt: string;
  profile: {
    profileId: string;
    profilePhoto: string;
    dateOfBirth: string | null;
    gender: string | null;
    department: string | null;
    experience: string | null;
    licenseNo: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    bloodGroup: string | null;
    licenseFile: any[];
    preferredLocations: any[];
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
  address: {
    addressId: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string | null;
    zipcode: string;
    country: string;
    fullAddress: string | null;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
  }[];
}

interface UserFormData {
  fullName: string;
  email: string;
  // phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  status: string;
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
    // phoneNumber: z.string().min(10, { message: 'Enter a valid phone number.' }),
    email: z.string().email({ message: "Enter a valid email address." }),
    Address: z.object({
      addressLine1: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      zipcode: z.string().optional(),
    }),
    password: z.string(),
    // .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    Profile: z.object({
      profilePhoto: z.string().optional(),
      gender: z.string().optional(),
    }),
    role: z.enum(["ADMIN", "MODERATOR", "CLIENT"], {
      errorMap: () => ({ message: "Role is required." }),
    }),
    status: z.string(),
    allowedModules: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface Permission {
  id: string;
  label: string;
}

const permissions: Permission[] = [
  { id: "user-management", label: "User Management" },
  { id: "website-management", label: "Website Management" },
  { id: "service-management", label: "Service Management" },
  { id: "fleet-management", label: "Fleet Management" },
  { id: "request-management", label: "Request Management" },
];

export default function UpdateAdminForm() {
  const { data: session } = useSession();
  const params = useParams();
  // console.log("params", params);
  const id = params?.updateServiceOperator || params?.updateServiceOperator;
  const router = useRouter();
  const [viewsPassword, setViewsPassword] = useState<boolean>(false);
  const [viewsConPassword, setViewsConPassword] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const GetUsers = async (
    accessToken: string,
    page: number,
    limit: number,
  ): Promise<ApiResponse<UserData>> => {
    const response = await get(`/users/user/other/${id}`, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response as ApiResponse<UserData>;
  };

  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["Users", page, rowsPerPage],
    queryFn: () => GetUsers(session?.accessToken ?? "", page, rowsPerPage),
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
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
    }
  };

  const userMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const updatedData: UserFormData = {
        ...data,
        Profile: {
          profilePhoto: profilePhoto
            ? profilePhoto
            : data?.Profile?.profilePhoto,
          gender: data.Profile.gender,
        },
      };

      if (!data.password) {
        delete updatedData.password;
      }

      await patch(`/users/user/other/${id}`, updatedData, {
        Authorization: `Bearer ${session?.accessToken ?? ""}`,
      });
    },
    onSuccess: () => {
      toast.success("Admin updated successfully!");
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
    const { confirmPassword, password, ...dataWithoutConfirmPassword } = {
      ...formData,
    };

    if (password?.trim()) {
      (dataWithoutConfirmPassword as UserFormData).password = password;
    }
    userMutation.mutate(dataWithoutConfirmPassword);
  };

  const handleBackTable = () => {
    router.push("/dashboard/employees-management");
  };

  const togglePasswordVisibility = () => {
    setViewsPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setViewsConPassword((prev) => !prev);
  };

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const toggleAllPermissions = (checked: boolean) => {
    setSelectedPermissions(checked ? permissions.map((p) => p.id) : []);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ADMIN",
      status: usersData?.data?.status || "",
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

  useEffect(() => {
    if (usersData?.data) {
      form.reset({
        fullName: usersData.data.fullName || "",
        email: usersData.data.email || "",
        // password: usersData.data.password || '',
        role:
          (usersData.data.role as "ADMIN" | "MODERATOR" | "CLIENT") || "ADMIN",
        status: usersData.data.status as "ACTIVE" | "INACTIVE" | "SUSPENDED",
        allowedModules: usersData.data.allowedModules || [],
        Address: {
          addressLine1: usersData.data.address?.[0]?.addressLine1 || "",
          city: usersData.data.address?.[0]?.city || "",
          country: usersData.data.address?.[0]?.country || "",
          zipcode: usersData.data.address?.[0]?.zipcode || "",
        },
        Profile: {
          gender: usersData.data.profile?.gender || "",
          profilePhoto: usersData.data.profile?.profilePhoto || "",
        },
      });
    }
  }, [usersData, form]);

  return (
    <div className="m-4 space-y-4 rounded-sm bg-white p-4 pt-2">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/employees-management")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-center text-2xl font-bold">Update Employee</h1>
      <div className="flex justify-center pb-10">
        <div className="relative">
          {profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profilePhoto}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : usersData?.data?.profile?.profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={usersData?.data?.profile?.profilePhoto}
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
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the name" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="Profile.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender*</FormLabel>
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
                  <Input placeholder="Enter Address Line 1" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="Enter City" {...field} />
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
                  <Input placeholder="Enter Country" {...field} />
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
                  <Input placeholder="Enter Zipcode" {...field} />
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
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={viewsPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...field}
                        className="pr-10"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={viewsConPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                        className="pr-10"
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
                  <FormMessage />
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
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
            <Button type="button" variant="outline" onClick={handleBackTable}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-primary-500 text-white"
            >
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
