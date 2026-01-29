// components/brands/BrandList.tsx
"use client";

import { Brand } from "@/types/brand.interface";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface BrandListProps {
  brands: Brand[];
  selectedBrand: string;
}

export function BrandList({ brands, selectedBrand }: BrandListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to generate slug from brand name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "")
      .replace(/&/g, "and");
  };

  // Group brands by first letter
  const groupedBrands = brands.reduce(
    (acc, brand) => {
      const slug = brand.slug || generateSlug(brand.name);
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push({ ...brand, slug });
      return acc;
    },
    {} as Record<string, (Brand & { slug: string })[]>,
  );

  const sortedLetters = Object.keys(groupedBrands).sort();

  const handleBrandClick = (brandSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("brand", brandSlug);
    params.delete("page");
    router.push(`/brands?${params.toString()}`);
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Brands A-Z</h3>
      <div className="space-y-6">
        {sortedLetters.map((letter) => (
          <div key={letter}>
            <h4 className="text-sm font-medium text-gray-500 mb-2">{letter}</h4>
            <div className="space-y-1">
              {groupedBrands[letter].map((brand) => (
                <Button
                  key={brand.id}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-between ${
                    selectedBrand === brand.slug
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "text-gray-700"
                  }`}
                  onClick={() => handleBrandClick(brand.slug)}
                >
                  <span className="truncate">{brand.name}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
