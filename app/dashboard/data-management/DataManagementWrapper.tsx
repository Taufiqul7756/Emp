"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuCirclePlus } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/BreadCrumb";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api/handlers";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { DataManagementTable } from "./components/DataManagementTable";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddDataManagement from "./components/AddDataManagement";

export interface allData {
  id: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  createdAt: string;
  updatedAt: string;
}

export interface AmbulanceFareApiResponse {
  success: boolean;
  message: string;
  data: {
    datas: allData[];
    currentPage: number;
    totalDatas: number;
    totalPages: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error: null;
}

function DataManagementWrapper() {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get ambulance fare data from API
  const getFareData = async (page: number, limit: number) => {
    const response = await get<AmbulanceFareApiResponse>(
      `/service/datamanagement/?page=${page}&limit=${limit}`,
      {
        Authorization: `Bearer ${session?.accessToken}`,
      }
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch ambulances");
    }
    return response.data;
  };

  const {
    data: DataManagementData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["datamanagement", page, rowsPerPage],
    queryFn: () => getFareData(page, rowsPerPage),
    select: (data) => ({
      data: data,
      pageCount: data.totalPages,
      rowCount: data.totalDatas,
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

  useEffect(() => {
    setTotalCount(DataManagementData?.rowCount || 0);
  }, [DataManagementData?.rowCount]);

  return (
    <section className="">
      <div className="p-4">
        <Breadcrumb />
      </div>
      <div className="m-4 rounded-sm bg-white">
        <div className="flex mb-10 justify-between border-b-2 border-gray-200 p-2 pb-4">
          <h1 className="pt-2 text-lg font-semibold">
            Data Management({totalCount})
          </h1>
          <div className="flex gap-2 ">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-500 text-white">
                  <LuCirclePlus /> Create
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 ">
                <AddDataManagement
                refatch={refetch}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onClose={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div>
          {/* <div className="flex items-center justify-between p-4">
            <Input
              placeholder="Search by options"
              className="max-w-sm bg-white"
              value=""
              disabled
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => location && refetchByLocation()}
            />
          </div> */}
          <DataManagementTable
            data={DataManagementData?.data?.datas || []}
            isLoading={isLoading}
            isError={isError}
            page={page}
            pageCount={DataManagementData?.pageCount || 0}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            refetch={() =>
              queryClient.invalidateQueries({
                queryKey: ["datamanagement"],
              })
            }
          />
        </div>
      </div>
    </section>
  );
}

export default DataManagementWrapper;
