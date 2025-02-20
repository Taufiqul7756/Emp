"use client"

import { useState } from 'react';
import { SlEqualizer } from "react-icons/sl";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface FilterState {
  status: {
    active: boolean;
    inactive: boolean;
    suspend: boolean;
  };
  joinDateFrom: Date | undefined;
  joinDateTo: Date | undefined;
  idNumber: string;
  email: string;
  phone: string;
}

const initialState: FilterState = {
  status: {
    active: false,
    inactive: false,
    suspend: false
  },
  joinDateFrom: undefined,
  joinDateTo: undefined,
  idNumber: '',
  email: '',
  phone: ''
};

const Filter = () => {
  const [filterState, setFilterState] = useState<FilterState>(initialState);
  const [open, setOpen] = useState(false);

  const handleStatusChange = (key: keyof typeof filterState.status) => {
    setFilterState((prevState) => ({
      ...prevState,
      status: {
        ...prevState.status,
        [key]: !prevState.status[key]
      }
    }));
  };

  const handleFilterChange = (key: keyof Omit<FilterState, 'status'>, value: any) => {
    setFilterState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleApply = () => {
    // console.log('Applying filters:', filterState);
    setFilterState(initialState);
    setOpen(false);
  };

  const handleReset = () => {
    setFilterState(initialState);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button disabled variant="outline" className="w-[150px] justify-between">
          Filtering
          <SlEqualizer className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-6">
        <div className="flex justify-between items-center mb-6">
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
        <div className="space-y-6">
          <div className="space-y-4">
            <h5 className="text-base font-medium">Status</h5>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={filterState.status.active}
                  onCheckedChange={() => handleStatusChange('active')}
                />
                <label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Active
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inactive"
                  checked={filterState.status.inactive}
                  onCheckedChange={() => handleStatusChange('inactive')}
                />
                <label htmlFor="inactive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Inactive
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="suspend"
                  checked={filterState.status.suspend}
                  onCheckedChange={() => handleStatusChange('suspend')}
                />
                <label htmlFor="suspend" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Suspend
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-base font-medium">Join Date</h5>
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-200",
                      !filterState.joinDateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterState.joinDateFrom ? format(filterState.joinDateFrom, "PPP") : <span>From</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filterState.joinDateFrom}
                    onSelect={(date) => {
                      handleFilterChange('joinDateFrom', date);
                      const event = new Event('keydown');
                      Object.defineProperty(event, 'key', {value: 'Escape'});
                      document.dispatchEvent(event);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-200",
                      !filterState.joinDateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterState.joinDateTo ? format(filterState.joinDateTo, "PPP") : <span>To</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filterState.joinDateTo}
                    onSelect={(date) => {
                      handleFilterChange('joinDateTo', date);
                      const event = new Event('keydown');
                      Object.defineProperty(event, 'key', {value: 'Escape'});
                      document.dispatchEvent(event);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="write Id number"
              value={filterState.idNumber}
              onChange={(e) => handleFilterChange('idNumber', e.target.value)}
              className="border-gray-200"
            />
          </div>

          <div className="space-y-4">
            <Input
              placeholder="write email"
              type="email"
              value={filterState.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              className="border-gray-200"
            />
          </div>

          <div className="space-y-4">
            <Input
              placeholder="write phone"
              type="tel"
              value={filterState.phone}
              onChange={(e) => handleFilterChange('phone', e.target.value)}
              className="border-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 bg-gray-100 hover:bg-gray-200 border-0"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            Apply Now
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
