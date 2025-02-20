import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlEqualizer } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterState } from "../types/adsType";

interface FilterPopoverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  filterState: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onDateSelection: (key: "from" | "to", date: Date | undefined) => void;
  onReset: () => void;
  onApply: () => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  open,
  setOpen,
  filterState,
  onFilterChange,
  onDateSelection,
  onReset,
  onApply,
}) => {
  const [fromMonth, setFromMonth] = useState(new Date());
  const [toMonth, setToMonth] = useState(new Date());

  const validateDateSelection = (
    key: "from" | "to",
    newDate: Date | undefined,
  ) => {
    if (!newDate) {
      onDateSelection(key, undefined);
      return;
    }

    const otherDate = key === "from" ? filterState.to : filterState.from;

    if (otherDate) {
      const otherDateTime = new Date(otherDate).getTime();
      const newDateTime = newDate.getTime();

      if (key === "from" && newDateTime > otherDateTime) {
        toast.error("Start date cannot be after end date");
        return;
      }

      if (key === "to" && newDateTime < otherDateTime) {
        toast.error("End date cannot be before start date");
        return;
      }
    }

    onDateSelection(key, newDate);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onApply();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-between">
          Filtering
          <SlEqualizer className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-lg font-semibold">Filter</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {/* Status Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h5 className="text-base font-medium">Status</h5>
            <RadioGroup
              value={filterState.status}
              onValueChange={(value) => onFilterChange("status", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="RUNNING" id="inactive" />
                <Label htmlFor="RUNNING">RUNNING</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PENDING" id="inactive" />
                <Label htmlFor="PENDING">PENDING</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COMPLETED" id="inactive" />
                <Label htmlFor="COMPLETED">COMPLETED</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CANCELED" id="inactive" />
                <Label htmlFor="CANCELED">CANCELED</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="WAITING_FOR_PAYMENT" id="inactive" />
                <Label htmlFor="WAITING_FOR_PAYMENT">WAITING FOR PAYMENT</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range Section */}
          <div className="space-y-4">
            <h5 className="text-base font-medium">Join Date</h5>
            <div className="space-y-4">
              {/* From Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start border-gray-200 text-left font-normal",
                      !filterState.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterState.from ? (
                      format(filterState.from, "PPP")
                    ) : (
                      <span>From</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex flex-col space-y-4 p-3">
                    <div className="flex justify-between space-x-2">
                      <Select
                        onValueChange={(value) => {
                          const newDate = new Date(fromMonth);
                          newDate.setMonth(parseInt(value));
                          setFromMonth(newDate);
                        }}
                        value={fromMonth.getMonth().toString()}
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {new Date(0, i).toLocaleString("default", {
                                month: "long",
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) => {
                          const newDate = new Date(fromMonth);
                          newDate.setFullYear(parseInt(value));
                          setFromMonth(newDate);
                        }}
                        value={fromMonth.getFullYear().toString()}
                      >
                        <SelectTrigger className="w-[95px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 100 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={(new Date().getFullYear() - i).toString()}
                            >
                              {new Date().getFullYear() - i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Calendar
                      mode="single"
                      selected={filterState.from || undefined}
                      onSelect={(date) => validateDateSelection("from", date)}
                      month={fromMonth}
                      onMonthChange={setFromMonth}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* To Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start border-gray-200 text-left font-normal",
                      !filterState.to && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterState.to ? (
                      format(filterState.to, "PPP")
                    ) : (
                      <span>To</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex flex-col space-y-4 p-3">
                    <div className="flex justify-between space-x-2">
                      <Select
                        onValueChange={(value) => {
                          const newDate = new Date(toMonth);
                          newDate.setMonth(parseInt(value));
                          setToMonth(newDate);
                        }}
                        value={toMonth.getMonth().toString()}
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {new Date(0, i).toLocaleString("default", {
                                month: "long",
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) => {
                          const newDate = new Date(toMonth);
                          newDate.setFullYear(parseInt(value));
                          setToMonth(newDate);
                        }}
                        value={toMonth.getFullYear().toString()}
                      >
                        <SelectTrigger className="w-[95px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 100 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={(new Date().getFullYear() - i).toString()}
                            >
                              {new Date().getFullYear() - i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Calendar
                      mode="single"
                      selected={filterState.to || undefined}
                      onSelect={(date) => validateDateSelection("to", date)}
                      month={toMonth}
                      onMonthChange={setToMonth}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Organization Name Input */}
          {/* <div className="space-y-4">
            <Input
              placeholder="Write Org Name"
              type="text"
              value={filterState.organizationName}
              onChange={(e) =>
                onFilterChange("organizationName", e.target.value)
              }
              onKeyPress={handleKeyPress}
              className="border-gray-200"
            />
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              onReset();
              setOpen(false);
            }}
            className="flex-1 border-0 bg-gray-100 hover:bg-gray-200"
          >
            Reset
          </Button>
          <Button
            onClick={onApply}
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
          >
            Apply Now
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
