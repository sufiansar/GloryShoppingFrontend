"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

interface SearchFormProps {
  initialSearchTerm: string;
  initialPage: string;
  initialLimit: string;
}

export default function SearchForm({
  initialSearchTerm,
  initialPage,
  initialLimit,
}: SearchFormProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams({
      page: "1",
      limit: initialLimit,
    });

    if (term) {
      params.set("searchTerm", term);
    }

    router.push(`/admin/dashboard/categories-management?${params.toString()}`);
  }, 500);

  const handleClear = () => {
    setSearchTerm("");
    const params = new URLSearchParams({
      page: "1",
      limit: initialLimit,
    });
    router.push(`/admin/dashboard/categories-management?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search categories by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
          className="pl-10"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
            onClick={handleClear}
          >
            Clear
          </Button>
        )}
      </div>
      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
    </div>
  );
}
