"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuCirclePlus } from "react-icons/lu";
import { Breadcrumb } from "@/components/shared/BreadCrumb";
import { useQueryClient } from "@tanstack/react-query";
import { get } from "@/lib/api/handlers";
// import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { handleApiError } from "@/utils/errorHandler";
import { useRouter } from "next/navigation";

import { useDebounce } from "@/hooks/useDebounce";
import { getDateRangeISO } from "@/utils/dateUtils";
import { AdsData, ApiResponse, FilterState } from "../types/adsType";
import { SearchBar } from "./SearchBar";
import { SortPopover } from "./SortPopover";
import { FilterPopover } from "./FilterPopover";
import { TableData } from "./TableData";

// Initial Filter State
const initialFilterState: FilterState = {
  status: "",
  from: "",
  to: "",
  organizationName: "",
};

function BreadcrumbAndTable() {
  // ----------------------------- States -----------------------------
  const router = useRouter();
  // const {data: session} = useSession();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Initial rowsPerPage
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortState, setSortState] = useState<{
    orderBy: "desc" | "asc" | null;
  }>({
    orderBy: null,
  });
  const [filterState, setFilterState] = useState<FilterState>({
    status: "",
    from: "",
    to: "",
    organizationName: "",
  });
  const [appliedSortState, setAppliedSortState] = useState<{
    orderBy: "desc" | "asc" | null;
  }>({
    orderBy: null,
  });
  const [appliedFilterState, setAppliedFilterState] = useState<FilterState>({
    status: "",
    from: "",
    to: "",
    organizationName: "",
  });
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  // ----------------------------- API Call -----------------------------
  const getOrganizationNamesData = async (page: number, limit: number) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add search term
      if (searchTerm) {
        queryParams.append("adsName", searchTerm);
      }

      // Add sorting
      if (appliedSortState.orderBy) {
        queryParams.append("orderBy", appliedSortState.orderBy);
      }

      // Add filters
      if (appliedFilterState.status) {
        queryParams.append("state", appliedFilterState.status);
      }

      if (appliedFilterState.from || appliedFilterState.to) {
        const fromDate = appliedFilterState.from
          ? new Date(appliedFilterState.from)
          : new Date(0);
        const toDate = appliedFilterState.to
          ? new Date(appliedFilterState.to)
          : new Date();

        const { startISO } = getDateRangeISO(fromDate);
        const { endISO } = getDateRangeISO(toDate);
        queryParams.append("from", startISO);
        queryParams.append("to", endISO);
      }

      if (appliedFilterState.organizationName) {
        queryParams.append("name", appliedFilterState.organizationName);
      }

      const response = (await get(`/content/ads`)) as ApiResponse<AdsData>;
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const {
    data: adsData,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "adsdata",
      page,
      rowsPerPage,
      debouncedSearchTerm,
      appliedSortState,
      appliedFilterState,
    ],
    queryFn: () => getOrganizationNamesData(page, rowsPerPage),
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // ----------------------------- Handlers -----------------------------

  const handleCreateOrganization = () => {
    router.push("/dashboard/organization-name/create-organization");
    queryClient.invalidateQueries({
      queryKey: ["adsdata", page, rowsPerPage],
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
  };

  // Handlers for search, sort, and filter
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (newSortState: { orderBy: "desc" | "asc" | null }) => {
    setSortState(newSortState);
  };

  const handleFilter = (key: keyof FilterState, value: any) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Add new handlers for applying changes
  const handleApplySort = () => {
    setAppliedSortState(sortState);
    setSortPopoverOpen(false); // Close sort popover
    setPage(1);
  };

  const handleApplyFilter = () => {
    setAppliedFilterState(filterState);
    setFilterPopoverOpen(false); // Close filter popover
    setPage(1);
  };

  // Fix the reset handlers
  const handleResetSort = () => {
    const resetState = { orderBy: null };
    setSortState(resetState);
    setAppliedSortState(resetState);
    setSortPopoverOpen(false);
    setPage(1);
  };

  const handleResetFilter = () => {
    setFilterState(initialFilterState);
    setAppliedFilterState(initialFilterState);
    setFilterPopoverOpen(false);
    setPage(1);
  };

  // useEffect to handle page reset when debounced search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className="m-4">
      <Breadcrumb />
      <div className="mt-4 flex justify-between border-b-2 border-gray-200 pb-4 font-bold">
        <h1>Running Ads ({adsData?.totalAds})</h1>
        <Button
          className="bg-primary-500 text-white hover:bg-primary-300"
          onClick={handleCreateOrganization}
        >
          <LuCirclePlus />
          New
        </Button>
      </div>

      {/* Search and Filter controls */}
      <div className="flex items-center justify-between py-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={(e) => handleSearch(e.target.value)}
        />

        <div className="flex justify-center gap-2">
          <SortPopover
            open={sortPopoverOpen}
            setOpen={setSortPopoverOpen}
            sortState={sortState}
            onSortChange={(value) => handleSort({ orderBy: value })}
            onReset={handleResetSort}
            onApply={handleApplySort}
          />

          <FilterPopover
            open={filterPopoverOpen}
            setOpen={setFilterPopoverOpen}
            filterState={filterState}
            onFilterChange={handleFilter}
            onDateSelection={(key, date) => {
              setFilterState((prev) => ({
                ...prev,
                [key]: date || "",
              }));
            }}
            onReset={handleResetFilter}
            onApply={handleApplyFilter}
          />
        </div>
      </div>

      <TableData
        data={adsData?.ads || []}
        isLoading={isLoading}
        isPending={isPending}
        hasPrev={adsData?.hasPrev}
        hasNext={adsData?.hasNext}
        isError={isError}
        page={page}
        // pageCount={Math.ceil(totalCount / rowsPerPage)}
        pageCount={adsData?.totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        refetch={refetch}
      />
    </div>
  );
}

export default BreadcrumbAndTable;
