"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaStarOfLife } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsPersonCheck, BsBoxArrowLeft, BsUpload } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch, post } from "@/lib/api/handlers";
import { handleApiError } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  AdsUpdateSchema,
  AdsUpdateSchemaZod,
} from "../schema/adsupdate.schema";

const Options = [
  "All",
  "/about",
  "/member",
  "/club",
  "/club/details/id",
  "/club/update/id",
  "/event",
  "/event/id",
  "/election",
  "/jobs",
  "/jobs/id",
  "/service",
  "/service/Health",
  "/service/Health/id",
  "/service/Health/Booking/id",
  "/service/Education",
  "/service/Education/id",
  "/service/Education/Booking/id",
  "/service/Store",
];

export interface AdsData {
  id: string;
  thumbnail: string;
  adsName: string;
  providerName: string;
  pageOfAds: string[];
  amount: number;
  paymentMethod: string;
  adsStart: string;
  adsEnd: string;
  //   state: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdsApiResponse {
  success: boolean;
  message: string;
  data: AdsData;
  error: any;
}

const UpdateAds = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const adId = searchParams.get("id");

  const [showBackDialog, setShowBackDialog] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const form = useForm<AdsUpdateSchema>({
    resolver: zodResolver(AdsUpdateSchemaZod),
    defaultValues: {
      thumbnail: "",
      adsName: "",
      providerName: "",
      amount: 0,
      createdBy: "",
      pageOfAds: [],
      paymentMethod: "Credit Card",
      //   state: undefined,
      adsStart: undefined,
      adsEnd: undefined,
      status: undefined,
    },
  });

  const fetchAdsData = async (adId: string) => {
    const response = await get<AdsApiResponse>(
      `/content/ads/${adId}`,
      //     {
      //   Authorization: `Bearer ${session?.accessToken}`,
      // }
    );
    return response.data;
  };

  // Fetch the existing ad data
  const { data: adData, isLoading: isAdLoading } = useQuery({
    queryKey: ["ad", adId],
    queryFn: () => (adId ? fetchAdsData(adId) : null),
    enabled: !!adId,
  });

  useEffect(() => {
    if (adData) {
      form.reset({
        thumbnail: adData.thumbnail,
        adsName: adData.adsName,
        providerName: adData.providerName,
        pageOfAds: adData.pageOfAds,
        amount: adData.amount,
        paymentMethod: adData.paymentMethod as
          | "Credit Card"
          | "PayPal"
          | "Bank Transfer",
        adsStart: new Date(adData.adsStart),
        adsEnd: new Date(adData.adsEnd),
        status: adData.status as
          | "PENDING"
          | "WAITING_FOR_PAYMENT"
          | "RUNNING"
          | "COMPLETED"
          | "CANCELED",
        createdBy: adData.createdBy,
      });
      setProfileImage(adData.thumbnail);
    }
  }, [adData, form]);

  // Use useEffect to update the form when adData changes
  const uploadProfileImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("images", file);

      const response = await post<{
        success: boolean;
        data: { urls: string[] };
      }>("/ext/file/upload/images", formData);

      const imageUrl = response?.data?.urls?.[0];
      if (imageUrl) {
        setProfileImage(imageUrl);
        form.setValue("thumbnail", imageUrl);
      }
      return response;
    },
    onSuccess: () => toast.success("Image uploaded successfully!"),
    onError: () => toast.error("Image upload failed."),
  });

  const handleProfileImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfileImageMutation.mutate(file);
    }
  };
  // Mutation to update the ad (PATCH)
  const updateAdsMutation = useMutation({
    mutationFn: async (data: AdsUpdateSchema) => {
      try {
        const response = await patch<AdsApiResponse>(
          `/content/ads/${adId}`,
          data,
        );
        return response;
      } catch (error) {
        return handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adsdata"] });
      toast.success("Ads updated successfully");
      router.push("/dashboard/ads-management/all-ads");
    },
    onError: () => {
      toast.error("Failed to update Ads");
    },
  });

  const handleBackButton = () => {
    setShowBackDialog(true);
  };

  const handleConfirmBack = () => {
    setShowBackDialog(false);
    router.back();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (data: AdsUpdateSchema) => {
    if (updateAdsMutation.isPending) return;
    updateAdsMutation.mutate(data);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-4 p-4"
          onKeyDown={handleKeyDown}
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              {/* Header with Back Button */}
              <div className="mb-8 flex items-center justify-between rounded-sm bg-slate-50 p-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={handleBackButton}
                >
                  <FaArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <h2 className="text-xl font-semibold">Update Ads</h2>
                <div className="w-[72px]" />
              </div>

              <p className="mb-3 mt-10 border-b pb-3 text-2xl font-bold">
                Ads Basic Information
              </p>

              <section className="space-y-8">
                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <div className="relative h-72 w-full rounded-lg bg-gray-100">
                    {profileImage ? (
                      <>
                        <Image
                          src={profileImage || "/placeholder.svg"}
                          alt="Ads profile"
                          fill
                          className="rounded-lg object-contain"
                        />
                        {/* Remove Image Button */}
                        <button
                          type="button"
                          className="absolute right-4 top-4 rounded-lg bg-danger-500 p-2 text-white hover:bg-danger-300"
                          onClick={() => {
                            setProfileImage(null);
                            form.setValue("thumbnail", "");
                          }}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <label className="flex h-full w-full cursor-pointer items-center justify-center">
                        <div className="text-center">
                          <BsUpload className="mx-auto h-8 w-8 text-gray-400" />
                          <span className="mt-2 block text-sm text-gray-500">
                            Upload Ads Photo
                          </span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleProfileImageUpload}
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Ads Name Field */}
                <div className="space-y-2">
                  <div className="flex">
                    <Label className="text-[13px] font-normal leading-[15.6px] text-grayscaleText">
                      Ads Name
                    </Label>
                    <span className="pl-1 text-danger-500">
                      <FaStarOfLife size={5} />
                    </span>
                  </div>
                  <FormField
                    control={form.control}
                    name="adsName"
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          className="h-12"
                          placeholder="Enter Ads Name"
                          {...field}
                        />
                        <FormMessage className="text-sm text-danger-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Ads Provider Name */}
                <div className="space-y-2">
                  <div className="flex">
                    <Label className="text-[13px] font-normal leading-[15.6px] text-grayscaleText">
                      Ads Provider Name
                    </Label>
                    <span className="pl-1 text-danger-500">
                      <FaStarOfLife size={5} />
                    </span>
                  </div>
                  <FormField
                    control={form.control}
                    name="providerName"
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          className="resize-none"
                          placeholder="Write Ads Provider Name"
                          {...field}
                        />
                        <FormMessage className="text-sm text-danger-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Page of Ads */}
                <div className="space-y-2">
                  <Label>Select Page of Ads</Label>
                  <FormField
                    control={form.control}
                    name="pageOfAds"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value.length && "text-muted-foreground",
                              )}
                            >
                              {field.value.length > 0
                                ? `${field.value.length} Ads selected`
                                : "Select page of ads"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <ScrollArea className="h-[200px] p-1">
                              {field.value.includes("All")
                                ? // If "All" is selected, show only the "All" option
                                  Options.filter(
                                    (option) => option === "All",
                                  ).map((option) => (
                                    <div
                                      key={option}
                                      className="flex items-center space-x-2 p-2"
                                    >
                                      <Checkbox
                                        checked={true}
                                        onCheckedChange={(checked) => {
                                          // Unchecking "All" clears the selection.
                                          if (!checked) {
                                            field.onChange([]);
                                          }
                                        }}
                                      />
                                      <label htmlFor={option}>{option}</label>
                                    </div>
                                  ))
                                : // Otherwise, show all options
                                  Options.map((option) => (
                                    <div
                                      key={option}
                                      className="flex items-center space-x-2 p-2"
                                    >
                                      <Checkbox
                                        checked={field.value.includes(option)}
                                        onCheckedChange={(checked) => {
                                          if (option === "All") {
                                            // If "All" is checked, override any other selections.
                                            if (checked) {
                                              field.onChange(["All"]);
                                            } else {
                                              field.onChange([]);
                                            }
                                          } else {
                                            // For non-"All" options, update the selection normally.
                                            if (checked) {
                                              field.onChange([
                                                ...field.value,
                                                option,
                                              ]);
                                            } else {
                                              field.onChange(
                                                field.value.filter(
                                                  (value) => value !== option,
                                                ),
                                              );
                                            }
                                          }
                                        }}
                                      />
                                      <label htmlFor={option}>{option}</label>
                                    </div>
                                  ))}
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {field.value.map((option) => (
                            <Badge
                              key={option}
                              variant="secondary"
                              className="flex items-center text-sm"
                            >
                              {option}
                              <button
                                type="button"
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={() => {
                                  // Removing an option:
                                  // If "All" is removed, clear the selection.
                                  if (option === "All") {
                                    field.onChange([]);
                                  } else {
                                    field.onChange(
                                      field.value.filter(
                                        (value) => value !== option,
                                      ),
                                    );
                                  }
                                }}
                              >
                                ✕
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-normal leading-[15.6px] text-grayscaleText">
                    Amount ($)
                  </Label>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          type="number"
                          className="h-12"
                          placeholder="Enter amount"
                          {...field}
                        />
                        <FormMessage className="text-sm text-danger-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-normal leading-[15.6px] text-grayscaleText">
                    Payment Method
                  </Label>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Credit Card">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="PayPal">PayPal</SelectItem>
                            <SelectItem value="Bank Transfer">
                              Bank Transfer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-sm text-danger-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-normal leading-[15.6px] text-grayscaleText">
                    Start Date
                  </Label>
                  <FormField
                    control={form.control}
                    name="adsStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-normal leading-[15.6px] text-grayscaleText">
                    End Date
                  </Label>
                  <FormField
                    control={form.control}
                    name="adsEnd"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status */}
                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-normal leading-[15.6px] text-grayscaleText">
                    Status
                  </Label>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            className={`h-12 ${
                              field.value === "PENDING"
                                ? "bg-yellow-50 text-yellow-500"
                                : field.value === "WAITING_FOR_PAYMENT"
                                  ? "bg-orange-50 text-orange-500"
                                  : field.value === "RUNNING"
                                    ? "bg-blue-50 text-blue-500"
                                    : field.value === "COMPLETED"
                                      ? "bg-green-50 text-green-500"
                                      : field.value === "CANCELED"
                                        ? "bg-red-50 text-red-500"
                                        : "bg-white text-black"
                            }`}
                          >
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              className="text-yellow-500"
                              value="PENDING"
                            >
                              Pending
                            </SelectItem>
                            <SelectItem
                              className="text-orange-500"
                              value="WAITING_FOR_PAYMENT"
                            >
                              Waiting for Payment
                            </SelectItem>
                            <SelectItem
                              className="text-blue-500"
                              value="RUNNING"
                            >
                              Running
                            </SelectItem>
                            <SelectItem
                              className="text-green-500"
                              value="COMPLETED"
                            >
                              Completed
                            </SelectItem>
                            <SelectItem
                              className="text-red-500"
                              value="CANCELED"
                            >
                              Canceled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-sm text-danger-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between">
                  <Button
                    type="button"
                    onClick={handleBackButton}
                    className="flex items-center justify-center bg-danger-500 px-5 py-3 text-base font-normal leading-[19.2px] text-white hover:bg-danger-300"
                  >
                    <BsBoxArrowLeft className="mr-2.5" size={20} />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateAdsMutation.isPending}
                    className="flex cursor-pointer items-center justify-center bg-primary-500 px-5 py-3 text-base font-normal leading-[19.2px] text-white"
                    // onClick={() => {
                    //   form.handleSubmit(onSubmit)();
                    // }}
                    // onClick={() => {
                    //   // eslint-disable-next-line no-console
                    //   console.log("Submit button clicked");
                    //   form.handleSubmit(onSubmit)();
                    // }}
                  >
                    <BsPersonCheck className="mr-2.5" size={20} />
                    {updateAdsMutation.isPending ? "Updating Ads..." : "Update"}
                  </Button>
                </div>
              </section>

              {/* Back Dialog */}
              <AlertDialog
                open={showBackDialog}
                onOpenChange={setShowBackDialog}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to go back?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Any unsaved changes will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, stay here</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-primary-500 text-white hover:bg-primary-300"
                      onClick={handleConfirmBack}
                    >
                      Yes, go back
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default UpdateAds;
