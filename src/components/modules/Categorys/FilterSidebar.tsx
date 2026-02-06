import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";
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
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Filter className="h-4 w-4" />
        Filters
      </h3>

      <div className="space-y-6">
        {/* Categories List */}
        {categories && categories.length > 0 && (
          <div>
            <h4 className="font-medium mb-4">Categories</h4>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categorys/${cat.slug}`}
                  className="text-sm text-left px-3 py-2 rounded hover:bg-gray-100"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Brands List */}
        {brands && brands.length > 0 && (
          <div>
            <h4 className="font-medium mb-4">Brands</h4>
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/categorys/brand"
                className="text-sm text-left px-3 py-2 rounded transition-colors hover:bg-gray-100"
              >
                All Brands
              </Link>
              {brands.map((brand) => {
                const slug = brand.slug || toSlug(brand.name);
                return (
                  <Link
                    key={brand.id}
                    href={`/categorys/brand?brand=${slug}`}
                    className="text-sm text-left px-3 py-2 rounded transition-colors hover:bg-gray-100"
                  >
                    {brand.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <Separator />

        {/* Product Flags */}
        <div>
          <h4 className="font-medium mb-4">Product Flags</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                onChange={(e) => onFilterChange({ isNew: e.target.checked })}
              />
              <span className="text-sm">New</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                onChange={(e) =>
                  onFilterChange({ isFeatured: e.target.checked })
                }
              />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                onChange={(e) =>
                  onFilterChange({ isTrending: e.target.checked })
                }
              />
              <span className="text-sm">Trending</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                onChange={(e) =>
                  onFilterChange({ isBestSeller: e.target.checked })
                }
              />
              <span className="text-sm">Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                onChange={(e) => onFilterChange({ isActive: e.target.checked })}
              />
              <span className="text-sm">Active</span>
            </label>
          </div>
        </div>

        <Separator />

        {/* Clear Filters */}
        <Button
          variant="outline"
          className="w-full"
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
