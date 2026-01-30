"use client";

import { Category } from "@/types/categorys.interface";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";

interface CategoryBreadcrumbProps {
  category: Category;
}

export default function CategoryBreadcrumb({
  category,
}: CategoryBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/categories" className="hover:text-primary transition-colors">
        Categories
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-gray-900">{category.name}</span>
    </nav>
  );
}
