import React from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <Input
      placeholder="Search by Ads Name"
      value={searchTerm}
      onChange={onSearchChange}
      className="max-w-sm bg-white"
    />
  );
};
