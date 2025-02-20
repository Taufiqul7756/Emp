import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  limit: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const CustomPagination: React.FC<PaginationControlsProps> = ({
  currentPage,
  limit,
  totalPages,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <div className="flex justify-between items-center mt-16">
      <div>
        <select
          value={limit}
          onChange={(e) =>
            onRowsPerPageChange && onRowsPerPageChange(Number(e.target.value))
          }
          className="border rounded-md p-2 bg-white"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} rows per page
            </option>
          ))}
        </select>
      </div>
      <div>
        <Pagination>
          <PaginationFirst onPageChange={() => onPageChange(1)} />
          <PaginationPrevious
            className={`${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            isActive={currentPage !== 1}
            onClick={() => onPageChange(currentPage - 1)}
          />
          <PaginationContent>
            {[...Array(totalPages || 0)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={index + 1 === currentPage}
                  onClick={() => onPageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            className={`${
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
            }`}
            isActive={currentPage !== totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />

          <PaginationLast onPageChange={() => onPageChange(totalPages)} />
        </Pagination>
      </div>
    </div>
  );
};

export default CustomPagination;
