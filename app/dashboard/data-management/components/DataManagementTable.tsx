"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Loading from "@/components/shared/Loading";
import DeleteConfirmationDialogForDataManagement from "./DeleteConfirmationDialogForDataManagement";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditDataManagement from "./EditDataManagement";
import { formatDateTime } from "@/utils/dateUtils";

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

interface DataManagementTableProps {
  data: allData[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageCount: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  refetch: () => void;
  onRowsPerPageChange: (newLimit: number) => void;
}

export const DataManagementTable: React.FC<DataManagementTableProps> = ({
  data,
  isLoading,
  isError,
  page,
  pageCount,
  rowsPerPage,
  onPageChange,
  refetch,
  onRowsPerPageChange,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editData, setEditData] = useState<allData | null>(null);

  // console.log("data : date check", data);

  const columns: ColumnDef<allData>[] = [
    {
      accessorKey: "option1",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("option1")}</div>
      ),
    },
    {
      accessorKey: "option2",
      header: "Number",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("option2")}</div>
      ),
    },

    {
      accessorKey: "option3",
      header: "Source",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("option3")}</div>
      ),
    },

    {
      accessorKey: "option4",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("option4")}</div>
      ),
    },
    {
      accessorKey: "option5",
      header: "Remarks",
      cell: ({ row }) => {
        const text = (row.getValue("option5") as string) || "";
        const truncatedText = text.length > 100 ? text.slice(0, 100) + "..." : text;
        return <div className="capitalize whitespace-normal w-60">{truncatedText}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return <div>{formatDateTime(row.getValue<string>("createdAt"))}</div>;
      },
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const ambulanceData = row.original;
        const selectedRows = table.getSelectedRowModel().rows;
        // Ensuring only include defined IDs
        const selectedIds = selectedRows
          .map((row) => row?.original?.id)
          .filter((id) => id !== undefined);

        // Ensure ambulanceData.id exists before creating the delete array
        const deleteIds =
          selectedRows.length > 0
            ? selectedIds
            : ambulanceData.id
            ? [ambulanceData.id]
            : [];

        return (
          <div className="flex gap-2">
            <Button
              onClick={() => setEditData(ambulanceData)}
              className="border-none p-[2.5px]"
            >
              <MdEdit />
            </Button>

            {deleteIds.length > 0 && (
              <DeleteConfirmationDialogForDataManagement
                ids={deleteIds}
                trigger={
                  <Button variant="outline" className="border-none p-[2.5px]">
                    <RiDeleteBin6Fill size={15} className="text-primary-500" />
                  </Button>
                }
                refetch={refetch}
                onSuccess={() => setRowSelection({})}
              />
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: page - 1, pageSize: rowsPerPage },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  const pageSizes = [5, 10, 20, 50];

  return (
    <div className="w-full p-4">
      <div className="rounded-none border">
        <Table>
          <TableHeader className="rounded-md bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-gray-200">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Main Table */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-red-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap bg-white"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-red-100">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        {/* Items Per Page */}
        <div className="flex items-center space-x-3 pr-8">
          <span className="text-[13px] font-normal leading-[15.6px]">
            Items per page:
          </span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="rounded-md border bg-white px-3 py-2"
          >
            {pageSizes.map((size) => (
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
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <FaAngleLeft />
          </Button>
          <div className="text-sm font-medium">
            Page {page} of {pageCount}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pageCount}
          >
            <FaAngleRight />
          </Button>
        </div>
      </div>

      {editData && (
        <Dialog open={!!editData} onOpenChange={() => setEditData(null)}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent>
            <EditDataManagement
              data={editData}
              page={page}
              rowsPerPage={rowsPerPage}
              onClose={() => setEditData(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
