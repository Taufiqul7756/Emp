"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { get, patch } from "@/lib/api/handlers";
import { AxiosError } from "axios";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type AddressInformationProps = {
  user?: UserData;
};

const formSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(4, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

type FormValues = z.infer<typeof formSchema>;

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
  address?: [
    {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      country?: string;
      zipcode?: string;
      state?: string;
      isDefault?: boolean;
    },
  ];
};

type Response = {
  success: boolean;
  message: string;
  data: UserData;
  error: string | null;
};

const states = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

const AddressInformation: React.FC<AddressInformationProps> = ({ user }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFormInitialized, setIsFormInitialized] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  React.useEffect(() => {
    if (user && user.address && user.address[0]) {
      form.reset({
        streetAddress: user.address[0].addressLine1 || "",
        apartment: user.address[0].addressLine2 || "",
        city: user.address[0].city || "",
        state: user.address[0].state || "",
        zipCode: user.address[0].zipcode || "",
        country: user.address[0].country || "",
      });
      setIsFormInitialized(true);
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      try {
        const response = await patch<Response>(
          `/users/user/self`,
          {
            Address: {
              country: data.country,
              city: data.city,
              addressLine1: data.streetAddress,
              addressLine2: data.apartment,
              isDefault: false,
              zipcode: data.zipCode,
              state: data.state,
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
      toast.success("Address updated successfully!");
      router.push("/dashboard/settings");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    mutation.mutate(formData);
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Address Information</h2>
      <Form {...form}>
        <form
          key={user?.address?.[0]?.addressLine1 || "new"}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123 Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apartment, Suite, Unit (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Apt 4B, Suite 201" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dhaka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isFormInitialized && (
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Divisions*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1212" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isFormInitialized && (
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none"
            >
              {form.formState.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddressInformation;