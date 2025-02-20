"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCounterStore } from "@/store/counter-store";
import Link from "next/link";
import React from "react";

const Counter = () => {
  const { count, increment, decrement } = useCounterStore((state) => state);

  return (
    <div className="w-[400px] border border-white rounded p-4 flex flex-col items-center gap-4">
      <p className="text-xl">Count: {count}</p>
      <div className="flex gap-2">
        <Button className={cn(count > 0 && "bg-green-500")} onClick={increment}>
          Increase +
        </Button>
        <Button className="bg-red-500" onClick={decrement}>
          Decrease -
        </Button>
      </div>
      <p className="text-sm">
        Implemented with{" "}
        <Link
          href="https://zustand.docs.pmnd.rs/integrations/persisting-store-data"
          target="_blank"
          className="text-yellow-500 animate-pulse"
        >
          zustand + persist(localstorage)
        </Link>
      </p>
    </div>
  );
};

export default Counter;
