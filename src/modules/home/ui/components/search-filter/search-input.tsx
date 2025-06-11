import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  disabled?: boolean;
  defaultValue?: string | undefined;
  onChange?: (value: string) => void;
}
export const SearchInput = ({ disabled, defaultValue, onChange }: Props) => {
  const trpc = useTRPC();
  const [searchValue, setSearchValue] = useState(defaultValue || "");
  const session = useQuery(trpc.auth.session.queryOptions());
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      onChange?.(searchValue);
    }, 500);

    return clearTimeout(id);
  }, [searchValue, onChange]);
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar
        open={isCategorySidebarOpen}
        onOpenChange={setIsCategorySidebarOpen}
      />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search products"
          disabled={disabled}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Button
        className="size-12 shrink-0 flex lg:hidden"
        variant="elevated"
        onClick={() => setIsCategorySidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
      {session.data?.user && (
        <Button variant="elevated" asChild>
          <Link prefetch href="/library">
            <BookmarkCheckIcon /> Library
          </Link>
        </Button>
      )}
    </div>
  );
};
