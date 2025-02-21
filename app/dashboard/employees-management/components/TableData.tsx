"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CalendarIcon, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoIosEye } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getStatusStyles } from "@/helper/statusStyles";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Link from "next/link";
import { del, get, patch } from "@/lib/api/handlers";
import { useSession } from "next-auth/react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ClientMessages";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { RiExpandUpDownLine } from "react-icons/ri";
import { Calendar } from "@/components/ui/calendar";
import { SlEqualizer } from "react-icons/sl";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime } from "@/utils/dateUtils";
import ViewUsersDetailsSheet from "./ViewUsersDetailsSheet";

interface SortState {
  date: "descending" | "ascending" | null;
  name: "a-z" | "z-a" | null;
}
interface FilterState {
  status: string;
  joinDateFrom: Date | "";
  joinDateTo: Date | "";
  idNumber: string;
  email: string;
  phone: string;
}

const initialState: FilterState = {
  status: "",
  joinDateFrom: "",
  joinDateTo: "",
  idNumber: "",
  email: "",
  phone: "",
};

type Address = {
  addressId: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  zipcode: string;
  country: string;
  fullAddress: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  joinDate: string;
  avatar: string;
  permissions: string[];
  password: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  role: "ADMIN" | "MODERATOR" | "CLIENT";
  createdAt: string;
  address: Address[];
  Profile: {
    profilePhoto?: string;
    gender?: string;
    profileId: string;
    dateOfBirth: string | null;
    department: string | null;
    experience: string | null;
    licenseNo: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    bloodGroup: string | null;
    licenseFile: string[]; // Assuming URLs or file names
    preferredLocations: string[];
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
  profile?: {
    profilePhoto?: string;
    gender?: string;
    profileId: string;
    dateOfBirth: string | null;
    department: string | null;
    experience: string | null;
    licenseNo: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    bloodGroup: string | null;
    licenseFile: string[]; // Assuming URLs or file names
    preferredLocations: string[];
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
}

interface Permission {
  id: string;
  label: string;
}

interface PaginatedResponse<T> {
  users: T[];
  totalPanelUsers: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const permissions: Permission[] = [
  { id: "user-management", label: "User Management" },
  { id: "website-management", label: "Website Management" },
  { id: "service-management", label: "Service Management" },
  { id: "fleet-management", label: "Fleet Management" },
  { id: "request-management", label: "Request Management" },
];

interface TableDataProps {
  data: User[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageCount: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  refetch: () => void;
  onRowsPerPageChange: (newLimit: number) => void;
}

export const TableData: React.FC<TableDataProps> = ({
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
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [shownProfile, setShownProfile] = React.useState<boolean>(false);
  const [shownProfileDelete, setShownProfileDelete] =
    React.useState<boolean>(false);
  const [shownClientDelete, setShownClientDelete] = React.useState<string>();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    string[]
  >([]);
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [singleClientDetails, setSingleClientDetails] =
    React.useState<User | null>(null);
  const [allUserData, setAllUserData] = React.useState<User[]>([]);

  const queryInvalid = new QueryClient();

  const handleDeleteData = (phoneNumber: number) => {
    setShownProfileDelete(true);
    setShownClientDelete(phoneNumber.toString());
  };

  const handleDeleteConfirm = async () => {
    setShownProfileDelete(false);
    if (shownClientDelete) {
      let response;
      try {
        await del(`/users/user/other/${shownClientDelete}?force=1`, {
          Authorization: `Bearer ${session?.accessToken ?? ""}`,
        });
        toast.success("successfully user deleted permanently");
        // Invalidate query to refresh data
        // queryClient.invalidateQueries({
        //   queryKey: ["userData", page, rowsPerPage],
        // });
        refetch();
      } catch (err) {
        // console.error("Error deleting user:", err);
        toast.error("Failed to delete user.");
      }
    }
  };

  // ----------Input field search data section start from here----------
  const handleSearch = async (search: string) => {
    try {
      let response = await get(`/users/user?fullName=${search}`, {
        Authorization: `Bearer ${session?.accessToken ?? ""}`,
      });
      setAllUserData(
        (response as ApiResponse<PaginatedResponse<User>>).data.users,
      );
    } catch (err) {
      toast.error(
        err instanceof AxiosError && err.response?.data?.message
          ? `Error: ${err.response.data.message}`
          : "Failed to fetch user details.",
      );
    }
  };

  // ----------sorting data section start from here----------
  const [open, setOpen] = React.useState(false);
  const [sortState, setSortState] = React.useState<SortState>({
    date: null,
    name: null,
  });

  const handleReset = () => {
    setSortState({
      date: null,
      name: null,
    });
  };

  const handleApply = async () => {
    setOpen(false);
    try {
      let response = await get(
        `/users/user?page=1&limit=100&orderBy=${sortState.date}&order=${sortState.name}`,
        {
          Authorization: `Bearer ${session?.accessToken ?? ""}`,
        },
      );
      setAllUserData(
        (response as ApiResponse<PaginatedResponse<User>>).data.users,
      );
    } catch (err) {
      toast.error(
        err instanceof AxiosError && err.response?.data?.message
          ? `Error: ${err.response.data.message}`
          : "Failed to fetch user details.",
      );
    }
  };

  // ----------Filter data section start from here----------

  // function convertToISOString({ dateString }: { dateString: Date | string }) {
  //   const date = new Date(dateString);
  //   return date.toISOString();
  // }

  React.useEffect(() => {
    setAllUserData(data);
  }, [data]);
  // console.log("admin---data", singleClientDetails?.address[0].addressLine1);

  const columns: ColumnDef<User, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="border-spacing-44 border-gray-500"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="border-gray-500"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fullName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("phoneNumber")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue<string>("createdAt"));
        const day = date.getDate().toString().padStart(2, "0");
        const month = date
          .toLocaleString("en-US", { month: "short" })
          .toUpperCase();
        const year = date.getFullYear();

        return (
          <div>
            {`${year}-${month}-${day}`}{" "}
            {new Date(row.getValue<string>("createdAt")).toLocaleTimeString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              },
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const roleValue = row.getValue("role") as string;
        const styles = getStatusStyles(roleValue);
        return <span style={styles}>{roleValue}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusValue = row.getValue("status") as string;
        const styles = getStatusStyles(statusValue);
        return <span style={styles}>{statusValue}</span>;
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;
        const id = row.original?.id;
        const phoneNumber = row.original?.phoneNumber;
        return (
          <div className="flex gap-2">
            <Button className="p-0">
              <ViewUsersDetailsSheet phoneNumber={phoneNumber} id={id} />
              {/* <IoIosEye className="text-success-600" /> */}
            </Button>
            <Link href={`/dashboard/employees-management/${phoneNumber}`}>
              <Button className="p-0">
                <MdModeEditOutline className="text-success-500" />
              </Button>
            </Link>
            <Button
              onClick={() => {
                handleDeleteData(payment.phoneNumber);
              }}
              className="p-0"
            >
              <RiDeleteBin6Fill className="text-primary-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: allUserData || [],
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

  const pageSizes = [5, 10, 20, 50];
  // console.log("profile", singleClientDetails?.profile?.profilePhoto);

  return (
    <>
      <div className="w-full p-4">
        <div className="flex items-center justify-between py-4">
          {/* search field */}
          <Input
            placeholder="Search by name"
            // value={search}
            onChange={(event) => handleSearch(event.target.value)}
            className="max-w-sm bg-white"
          />
          {/* ------<Sort />------ */}
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Sort
                  <RiExpandUpDownLine className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px] p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium">Date</h4>
                    <RadioGroup
                      value={sortState.date || ""}
                      onValueChange={(value) =>
                        setSortState((prev) => ({
                          ...prev,
                          date: value as SortState["date"],
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="desc"
                          id="date-descending"
                          defaultChecked
                        />
                        <Label htmlFor="date-descending">Descending</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asc" id="date-ascending" />
                        <Label htmlFor="date-ascending">Ascending</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button
                    disabled={
                      sortState.date === null && sortState.name === null
                    }
                    className="flex-1 bg-primary-500 text-white"
                    onClick={handleApply}
                  >
                    Apply Now
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* Table */}
        <div className="rounded-none border">
          <Table>
            <TableHeader className="bg-gray-00 rounded-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="bg-gray-200">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-red-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="bg-white">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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
        {/* pagination  */}
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
      </div>

      <Dialog open={shownProfile} onOpenChange={setShownProfile}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="relative pb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={singleClientDetails?.profile?.profilePhoto}
                  alt={singleClientDetails?.fullName}
                />
                {/* <AvatarImage src=" https://ambufast.sgp1.digitaloceanspaces.com/1734940049656-hasan.jpeg" alt={singleClientDetails?.fullName} /> */}
                <AvatarFallback>
                  {singleClientDetails?.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  {singleClientDetails?.fullName ?? ""}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {singleClientDetails?.id ?? ""}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Email</span>
                <span>{singleClientDetails?.email ?? " "}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Phone</span>
                <span>{singleClientDetails?.phoneNumber ?? " "}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Gender</span>
                <span>{singleClientDetails?.profile?.gender ?? " "}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Blood Group</span>
                <span>
                  {singleClientDetails?.profile?.bloodGroup ?? "Emply"}
                </span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Height</span>
                {singleClientDetails?.profile?.height ? (
                  <span> {singleClientDetails?.profile?.height} ft.</span>
                ) : (
                  "Emply"
                )}
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Weight</span>
                {singleClientDetails?.profile?.weight ? (
                  <span> {singleClientDetails?.profile?.weight} KG.</span>
                ) : (
                  "Emply"
                )}
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Date Of Birth</span>
                <span>
                  {singleClientDetails?.profile?.dateOfBirth ? (
                    <>{formatDate(singleClientDetails?.profile?.dateOfBirth)}</>
                  ) : (
                    "Emply"
                  )}
                </span>
              </div>

              <div className="flex justify-between border-b py-2">
                <div className="text-muted-foreground">Address</div>
                <div className="max-w-96">
                  {[
                    singleClientDetails?.address?.[0]?.addressLine1,
                    singleClientDetails?.address?.[0]?.addressLine2,
                    singleClientDetails?.address?.[0]?.city,
                    singleClientDetails?.address?.[0]?.country,
                  ]
                    .filter(Boolean) // Removes undefined/null values
                    .join(", ")}
                </div>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    singleClientDetails?.status === "ACTIVE"
                      ? "default"
                      : "destructive"
                  }
                  className={`capitalize ${singleClientDetails?.status === "ACTIVE" ? "rounded border border-success-600 bg-success-100 text-success-600" : singleClientDetails?.status === "INACTIVE" ? "rounded border border-warning-600 bg-warning-100 text-warning-400" : "rounded border border-danger-600 bg-danger-100 text-danger-600"} `}
                >
                  {singleClientDetails?.status}
                </Badge>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">Join Date</span>
                {singleClientDetails?.createdAt && (
                  <>{formatDateTime(singleClientDetails?.createdAt)}</>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                className="rounded-md bg-primary-500 text-white"
                onClick={() => setShownProfile(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shownProfileDelete} onOpenChange={setShownProfileDelete}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="relative pb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  Are you sure delete it.
                </h2>
              </div>
            </div>
          </DialogHeader>

          {/* <div className="space-y-4">
     <p>Are you sure you want to delete?</p>
        </div> */}
          <div className="flex justify-end gap-2">
            <Button
              className="rounded-md"
              onClick={() => setShownProfileDelete(false)}
            >
              Cancel
            </Button>
            {/* <Button
              variant="outline"
              className="rounded-md border border-primary-500 text-primary-500"
              onClick={handleArchiveDelete}
            >
              Archive
            </Button> */}
            <Button
              className="rounded-md bg-primary-500 text-white"
              onClick={handleDeleteConfirm}
            >
              Delete Permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
