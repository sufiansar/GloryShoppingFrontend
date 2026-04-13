import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Filter, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Category } from "@/types/categorys.interface";
import { Brand } from "@/types/brand.interface";

export function FilterSidebar({
  onFilterChange,
  initialFilters,
  categories,
  brands,
}: {
  onFilterChange: (filters: any) => void;
  initialFilters?: { minPrice?: number; maxPrice?: number };
  categories?: Category[];
  brands?: Brand[];
}) {
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const toSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "")
      .replace(/&/g, "and");

  const handlePriceApply = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
          <Filter className="h-5 w-5 text-pink-500" />
          Filters
        </h3>
      </div>

      <div className="space-y-8">
        {/* Categories List */}
        {categories && categories.length > 0 && (
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center justify-between">
              Categories
              <span className="bg-white px-2 py-0.5 rounded-full text-[10px] border">
                {categories.length}
              </span>
            </h4>
            <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto scrollbar-premium pr-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categorys/${cat.slug}`}
                  className="text-sm text-left px-3 py-2.5 rounded-xl transition-all hover:bg-white hover:text-pink-600 hover:shadow-sm group flex items-center justify-between"
                >
                  <span className="truncate font-medium">{cat.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Brands List */}
        {brands && brands.length > 0 && (
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center justify-between">
              Brands
              <span className="bg-white px-2 py-0.5 rounded-full text-[10px] border">
                {brands.length}
              </span>
            </h4>
            <div className="grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto scrollbar-premium pr-1">
              <Link
                href="/categorys/brand"
                className="text-sm text-left px-3 py-2.5 rounded-xl transition-all hover:bg-white hover:text-pink-600 hover:shadow-sm font-bold text-pink-600 flex items-center justify-between group"
              >
                <span>All Brands</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
              {brands.map((brand) => {
                const slug = brand.slug || toSlug(brand.name);
                return (
                  <Link
                    key={brand.id}
                    href={`/categorys/brand?brand=${slug}`}
                    className="text-sm text-left px-3 py-2.5 rounded-xl transition-all hover:bg-white hover:text-pink-600 hover:shadow-sm group flex items-center justify-between"
                  >
                    <span className="truncate font-medium">{brand.name}</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Product Flags */}
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Product Flags</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'isNew', label: 'New Arrival' },
              { key: 'isFeatured', label: 'Featured' },
              { key: 'isTrending', label: 'Trending Now' },
              { key: 'isBestSeller', label: 'Best Seller' },
              { key: 'isActive', label: 'Available' }
            ].map((flag) => (
              <label key={flag.key} className="flex items-center gap-3 cursor-pointer group px-2 py-1.5 rounded-lg hover:bg-white transition-all">
                <input
                  type="checkbox"
                  className="h-4.5 w-4.5 text-pink-600 rounded-md border-gray-300 focus:ring-pink-500 transition-all"
                  onChange={(e) => onFilterChange({ [flag.key]: e.target.checked })}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Clear Filters */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-2 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all font-bold"
          onClick={() => {
            onFilterChange({});
          }}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
