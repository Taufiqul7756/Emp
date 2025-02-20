
"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { get } from "@/lib/api/handlers";
import ProfileInformation from "./ProfileInformation";
import Password from "./Password";
import AddressInformation from "./AddressInformation";

type UserData = {
  fullName?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "USER" | "MODERATOR";
  allowedModules?: string[];
  Profile?: {
    profilePhoto?: string;
    gender?: "male" | "female" | "other";
    dateOfBirth?: string;
    phoneNumber?: string;
  };
  Address?: {
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

const Settings = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserData | undefined>();

  const fetchDetails = async () => {
    const response = await get<Response>(`/users/user/self`, {
      userid: `${session?.user?.userId}`,
      Authorization: `Bearer ${session?.accessToken}`,
    });

    if (!response?.success || !response?.data) {
      throw new Error(response?.message || "Failed to fetch user details");
    }

    setUser(response.data);
    return response.data;
  };

  const { refetch } = useInfiniteQuery({
    queryKey: ["user"],
    queryFn: fetchDetails,
    initialPageParam: 0,
    getNextPageParam: () => undefined,
    enabled: !!session?.accessToken
  });



  return (
    <div>
      <ProfileInformation user={user}/>
      <AddressInformation user={user}/>
      <Password />
    </div>
  );
};

export default Settings;