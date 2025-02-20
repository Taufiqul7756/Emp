

"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LuCirclePlus } from 'react-icons/lu'
import { useRouter } from "next/navigation";
import { Breadcrumb } from '@/components/BreadCrumb'
import { get } from '@/lib/api/handlers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { AmbulanceAdminApiResponse, UsersManagementApiResponse } from '@/types/Types';
import { TableData } from './TableData';

interface PaginatedResponse<T> {
  users: T[];
  totalPanelUsers: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface user {
  id: string
  fullName: string
  email: string
  phoneNumber: number
  address: string
  status: 'active' | 'inactive'
  joinDate: string
  avatar: string
  permissions: string[]
}

function CallOperatorPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [page, setPage] = React.useState(1);
  const queryClient = useQueryClient();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState<number>(0);


  const handleCreateNewCallOperator=()=>{
    router.push("/dashboard/users-management/call-operator/new-call-operator");
  }



// Get ambulance order data from API
  const getOrderData = async (page: number, limit: number) => {
    const response = await get<UsersManagementApiResponse>(`/users/user?page=${page}&limit=${limit}&role=CALLOPERATOR`, {
      Authorization: `Bearer ${session?.accessToken}`,
    });
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch ambulances");
    }
    // console.log("response data---users",response?.data);
    return response?.data;
  };

  const {
    data: adminData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["adminData", page, rowsPerPage],
    queryFn: () => getOrderData(page, rowsPerPage),
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
    setTotalCount(adminData?.rowCount || 0);
  }, [adminData?.rowCount]);

// console.log("ambulanceData",adminData);

  return (
    <section className=''>
        <div className='p-4'>
    <Breadcrumb/>
      </div>
    <div className='m-4 bg-white rounded-sm'>
<div className='border-b-2 border-gray-200 pb-4 flex justify-between p-2'>
  <h1 className='font-bold text-[20px]'>Call Operator ({adminData?.rowCount})</h1>
  <Button className='bg-primary-500 text-white' onClick={handleCreateNewCallOperator}><LuCirclePlus />
  New Call Operator</Button>
</div>
      <TableData
        data={adminData?.data || []}
        isLoading={isLoading}
        isError={isError}
        page={page}
        pageCount={adminData?.pageCount || 0}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        refetch={() => queryClient.invalidateQueries({queryKey: ["adminData"]})}
      />
    </div>
    </section>
  )
}

export default CallOperatorPage
















