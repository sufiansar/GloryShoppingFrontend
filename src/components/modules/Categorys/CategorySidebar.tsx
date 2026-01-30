"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/categorys.interface";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  categories: Category[];
  currentCategorySlug?: string;
}

export function CategorySidebar({
  categories,
  currentCategorySlug,
}: CategorySidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCategoryClick = (slug: string) => {
    router.push(`/categorys/${slug}`);
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <p className="text-sm text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        📁 Categories
      </h3>

      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group",
              currentCategorySlug === category.slug
                ? "bg-primary text-white shadow-md"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100",
            )}
          >
            <span className="font-medium text-sm">{category.name}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                currentCategorySlug === category.slug
                  ? "text-white"
                  : "text-gray-400 group-hover:translate-x-1",
              )}
            />
          </button>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="text-xs text-gray-500 space-y-2">
        <p>📦 Total Categories: {categories.length}</p>
      </div>
    </div>
  );
}
