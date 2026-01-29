// components/brands/BrandFilter.tsx
"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Brand } from "@/types/brand.interface";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BrandFilterProps {
  brands: Brand[];
  currentBrandSlug: string;
}

export function BrandFilter({ brands, currentBrandSlug }: BrandFilterProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Create slugs for each brand
  const brandsWithSlugs = brands.map((brand) => ({
    ...brand,
    slug: brand.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "")
      .replace(/&/g, "and"),
  }));

  // Filter brands based on search term
  const filteredBrands = brandsWithSlugs.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleBrandSelect = (brandSlug: string) => {
    router.push(`/brand/${brandSlug}`);
  };

  // Group brands by first letter
  const groupedBrands = filteredBrands.reduce(
    (acc, brand) => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(brand);
      return acc;
    },
    {} as Record<string, typeof brandsWithSlugs>,
  );

  const sortedLetters = Object.keys(groupedBrands).sort();

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search brands..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Brands List */}
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {sortedLetters.map((letter) => (
          <div key={letter}>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 sticky top-0 bg-white py-1">
              {letter}
            </h3>
            <div className="space-y-1">
              {groupedBrands[letter].map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandSelect(brand.slug)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-colors text-sm",
                    "hover:bg-gray-50 flex items-center gap-2",
                    brand.slug === currentBrandSlug
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700",
                  )}
                >
                  {brand.logoUrl && (
                    <div className="w-6 h-6 shrink-0">
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <span className="truncate">{brand.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredBrands.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No brands found
        </div>
      )}
    </div>
  );
}
