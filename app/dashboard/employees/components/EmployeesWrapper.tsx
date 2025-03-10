"use client";
import { get } from "@/lib/api/handlers";
import React, { useState } from "react";
import { UsersManagementApiResponse } from "../types/CardEmployeesType";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CardEmployee from "./CardEmployee";
import Button from "@/components/Button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Loading from "@/components/shared/Loading";
import { LuCirclePlus } from "react-icons/lu";

const EmployeesWrapper = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const { data: session } = useSession();
  const [page, setPage] = React.useState(1);
  const queryClient = useQueryClient();
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getUserData = async (page: number, limit: number) => {
    const response = await get<UsersManagementApiResponse>(
      `/users/user?page=${page}&limit=${limit}`,
      {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch users");
    }
    setTotalCount(response?.data.totalUsers);
    // console.log("response data---users",response?.data.totalOrders);
    return response?.data;
  };

  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userData", page, rowsPerPage],
    queryFn: () => getUserData(page, rowsPerPage),
    select: (data) => ({
      data: data.users,
      pageCount: data.totalPages,
      rowCount: data.totalUsers,
      totalUsers: data.totalUsers,
      totalPages: data.totalPages,
      hasNext: data.hasNext,
      hasPrev: data.hasPrev,
    }),
    refetchOnWindowFocus: true,
  });
  const cardData = userData?.data || [];
  const totalPages = userData?.totalPages || 1;
  // console.log("userData for Card", cardData);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      refetch();
    }
  };
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
    refetch();
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex justify-between border-b-2 border-gray-200 p-2 pb-4">
            <h1 className="text-[20px] font-bold">
              Total Employees ({userData?.rowCount})
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cardData?.map((employee) => (
              <CardEmployee
                key={employee.id}
                employee={{
                  ...employee,
                  phoneNumber: String(employee.phoneNumber),
                }}
              />
            ))}
          </div>

          {/* Pagination Section */}
          <div className="mt-6 flex items-center justify-between">
            {/* Items Per Page */}
            <div className="flex items-center space-x-3 pr-8">
              <span className="text-[16px] font-normal leading-[15.6px] dark:text-white">
                Items per page:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  handleRowsPerPageChange(Number(e.target.value))
                }
                className="rounded-md border bg-white px-3 py-2 dark:bg-slate-300"
                disabled={isLoading} // Disable while loading
              >
                {[5, 10, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={!userData?.hasPrev || isLoading}
                className="dark:bg-slate-400 dark:text-white"
              >
                <FaAngleLeft />
              </Button>
              <div className="text-sm font-medium dark:text-white">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={!userData?.hasNext || isLoading}
                className="dark:bg-slate-400 dark:text-white"
              >
                <FaAngleRight />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeesWrapper;
