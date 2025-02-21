"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { SummaryCards } from "./components/SummaryCards";
// import { RequestChart } from "./components/RequestChart";
// import { OrderChart } from "./components/OrderChart";
// import { RecentTables } from "./components/RecentTables";
// import { DateRangePicker } from "./components/DateRangePicker";
// import { Toaster } from "@/components/ui/toaster";
// import { RecentQuotationTable } from "./components/RecentQuotationTable";

const queryClient = new QueryClient();

const DashboardContent = () => {
  const [dateRange, setDateRange] = React.useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  const handleDateRangeChange = (newDateRange: { from: Date; to: Date }) => {
    setDateRange(newDateRange);
    // console.log("From page", dateRange);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome To{" "}
            <span className="text-red-500">Employee Management Panel</span>
          </h2>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardContent;
