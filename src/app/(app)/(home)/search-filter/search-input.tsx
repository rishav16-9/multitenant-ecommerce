"use client";
import { Input } from "@/components/ui/input";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { customCategory } from "../types";
import { CategoriesSidebar } from "./categories-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  disabled?: boolean;
  data: customCategory[];
}
export const SearchInput = ({ disabled, data }: Props) => {
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar
        open={isCategorySidebarOpen}
        onOpenChange={setIsCategorySidebarOpen}
        data={data}
      />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search products"
          disabled={disabled}
        />
      </div>
      <Button
        className="size-12 shrink-0 flex lg:hidden"
        variant="elevated"
        onClick={() => setIsCategorySidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
    </div>
  );
};
