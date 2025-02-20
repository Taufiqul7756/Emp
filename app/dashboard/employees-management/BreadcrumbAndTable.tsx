"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuCirclePlus } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/BreadCrumb";
// import { TableData } from './TableData';
import { get } from "@/lib/api/handlers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UsersManagementApiResponse } from "@/types/Types";
import { TableData } from "./components/TableData";

interface PaginatedResponse<T> {
  users: T[];
  totalPanelUsers: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface user {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  address: string;
  status: "active" | "inactive";
  joinDate: string;
  avatar: string;
  permissions: string[];
}

function BreadcrumbAndTable() {
  const router = useRouter();
  const { data: session } = useSession();
  const [page, setPage] = React.useState(1);
  const queryClient = useQueryClient();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  const handleCreateNewEmployee = () => {
    router.push("/dashboard/employees-management/create-employee");
  };

  // Get ambulance order data from API
  const getUserData = async (page: number, limit: number) => {
    const response = await get<UsersManagementApiResponse>(
      `/users/user?page=${page}&limit=${limit}`,
      {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch ambulances");
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
    }),
    refetchOnWindowFocus: true,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch();
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    refetch();
  };

  // Update the totalCount when ambulanceData changes
  useEffect(() => {
    setTotalCount(userData?.rowCount || 0);
  }, [userData?.rowCount]);

  return (
    <section className="">
      <div className="p-4">
        <Breadcrumb />
      </div>
      <div className="m-4 rounded-sm bg-white">
        <div className="flex justify-between border-b-2 border-gray-200 p-2 pb-4">
          <h1 className="text-[20px] font-bold">
            Total Employees ({userData?.rowCount})
          </h1>
          <Button
            className="bg-primary-500 text-white"
            onClick={handleCreateNewEmployee}
          >
            <LuCirclePlus />
            Create Employee
          </Button>
        </div>
        <TableData
          data={userData?.data || []}
          isLoading={isLoading}
          isError={isError}
          page={page}
          pageCount={userData?.pageCount || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          refetch={() =>
            queryClient.invalidateQueries({
              queryKey: ["userData", page, rowsPerPage],
            })
          }
        />
      </div>
    </section>
  );
}

export default BreadcrumbAndTable;
