"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SortState {
  date: "descending" | "ascending" | null;
  name: "a-z" | "z-a" | null;
}

export default function Sort() {
  const [open, setOpen] = useState(false);
  const [sortState, setSortState] = useState<SortState>({
    date: null,
    name: null,
  });

  const handleReset = () => {
    setSortState({
      date: null,
      name: null,
    });
  };

  const handleApply = () => {
    // console.log("Applying sort:", sortState);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button disabled variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort
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
                <RadioGroupItem value="descending" id="date-descending" />
                <Label htmlFor="date-descending">Descending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ascending" id="date-ascending" />
                <Label htmlFor="date-ascending">Ascending</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 font-medium">Name</h4>
            <RadioGroup
              value={sortState.name || ""}
              onValueChange={(value) =>
                setSortState((prev) => ({
                  ...prev,
                  name: value as SortState["name"],
                }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="a-z" id="name-az" />
                <Label htmlFor="name-az">A-Z</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="z-a" id="name-za" />
                <Label htmlFor="name-za">Z-A</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Now
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
