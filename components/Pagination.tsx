import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (size: number) => void;
}

const PaginationControls = ({
  totalItems,
  currentPage,
  onLimitChange,
  totalPages,
  limit,
  hasNext,
  hasPrev,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-between pt-12 lg:px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium leading-normal text-colors-textPrimary">
          Rows per page
        </span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
          defaultValue="2"
        >
          <SelectTrigger className="w-[70px] border-colors-lightGray rounded-[8px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-none rounded-[9px] text-colors-textPrimary">
            {[2, 3, 5, 10, 20].map((size) => (
              <SelectItem
                className="cursor-pointer"
                key={size}
                value={size.toString()}
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium leading-normal text-colors-textPrimary">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={!hasPrev}
          className="p-2 border-colors-lightGray rounded-[9px]"
        >
          <MdKeyboardDoubleArrowLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="p-2 border-colors-lightGray rounded-[9px]"
        >
          <MdKeyboardArrowLeft className="" size={16} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="p-2 border-colors-lightGray rounded-[9px]"
        >
          <MdKeyboardArrowRight size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className="p-2 border-colors-lightGray rounded-[9px]"
        >
          <MdKeyboardDoubleArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
