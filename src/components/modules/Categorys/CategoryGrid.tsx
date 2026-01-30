"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/categorys.interface";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group relative overflow-hidden rounded-xl bg-white border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            {category.images && category.images.length > 0 ? (
              <img
                src={category.images[0]}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
                <div className="text-4xl font-bold text-primary/30">
                  {category.name.charAt(0)}
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {category.name}
            </h3>

            {category.description && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {category.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="text-sm">Browse Products</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
