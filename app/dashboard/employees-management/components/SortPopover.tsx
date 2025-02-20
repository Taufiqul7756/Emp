import React from "react";
import { Button } from "@/components/ui/button";
import { RiExpandUpDownLine } from "react-icons/ri";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SortState {
  orderBy: "desc" | "asc" | null;
}

interface SortPopoverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sortState: SortState;
  onSortChange: (value: "desc" | "asc" | null) => void;
  onReset: () => void;
  onApply: () => void;
}

export const SortPopover: React.FC<SortPopoverProps> = ({
  open,
  setOpen,
  sortState,
  onSortChange,
  onReset,
  onApply,
}) => {
  return (
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
            <h4 className="mb-2 font-medium">Sort</h4>
            <RadioGroup
              value={sortState.orderBy || ""}
              onValueChange={(value) =>
                onSortChange(value as "desc" | "asc" | null)
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
            onClick={() => {
              onReset();
              setOpen(false);
            }}
          >
            Reset
          </Button>
          <Button
            disabled={!sortState.orderBy}
            className="flex-1 bg-primary-500 text-white"
            onClick={onApply}
          >
            Apply Now
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
