"use client";

import { Button } from "@/components/ui/button";
import { Filter, Grid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  const handleSort = (sortBy: string, sortOrder: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("page", "1"); // Reset to page 1 on sort change
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Sort By
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSort("createdAt", "desc")}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("price", "asc")}>
            Price: Low to High
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("price", "desc")}>
            Price: High to Low
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center border rounded-md overflow-hidden bg-white">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none px-3 ${
            !searchParams.get("view") || searchParams.get("view") === "grid"
              ? "bg-gray-100"
              : ""
          }`}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("view", "grid");
            router.push(`?${params.toString()}`, { scroll: false });
          }}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none px-3 border-l ${
            searchParams.get("view") === "list" ? "bg-gray-100" : ""
          }`}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("view", "list");
            router.push(`?${params.toString()}`, { scroll: false });
          }}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
