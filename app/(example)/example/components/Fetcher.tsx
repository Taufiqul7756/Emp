"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { del, get, post, put } from "@/lib/api/handlers";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface SingleUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
}

const Fetcher = () => {
  const [userId, setUserId] = useState<string>("");

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [userId],
    queryFn: () => get<SingleUser>("/users/" + userId),
    enabled: false, // will not render on page load
    staleTime: 0,
    retry: 0,
  });

  const handleDataFetch = () => {
    refetch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };



  return (
    <div className=" border border-white p-4 rounded-sm">
      <Input
        placeholder="Type a userid"
        onChange={handleInputChange}
        className="mb-4"
      />
      <Button
        disabled={isLoading || !userId}
        variant={"default"}
        onClick={handleDataFetch}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "GET"}
      </Button>

      {data && (
        <div className="my-2 text-green-400">
          {"Username: " + data.firstName + " " + data.lastName}
        </div>
      )}
      {error && (
        <div className="my-2 text-red-500">
          {"Error occured: " + error.message}
        </div>
      )}

      <p className="text-xs mt-4">
        A sample axios, react query api handling example
      </p>
    </div>
  );
};

export default Fetcher;
