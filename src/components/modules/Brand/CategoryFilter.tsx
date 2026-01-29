// components/brands/CategoryFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Cleanser",
  "Toner",
  "Serum",
  "Moisturizer",
  "Sunscreen",
  "Mask",
  "Eye Cream",
  "Treatment",
  "Exfoliator",
];

interface CategoryFilterProps {
  selectedCategory: string;
}

export function CategoryFilter({ selectedCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    // Reset to first page when changing category
    params.delete("page");
    router.push(`/brands?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Badge
            key={category}
            variant={
              selectedCategory === category ||
              (category === "All" && !selectedCategory)
                ? "default"
                : "outline"
            }
            className={cn(
              "cursor-pointer px-3 py-1.5",
              (selectedCategory === category ||
                (category === "All" && !selectedCategory)) &&
                "bg-blue-600 hover:bg-blue-700",
            )}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
