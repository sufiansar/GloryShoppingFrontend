import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Category } from "@/types/categorys.interface";

export function FilterSidebar({
  onFilterChange,
  initialFilters,
  categories,
}: {
  onFilterChange: (filters: any) => void;
  initialFilters?: { minPrice?: number; maxPrice?: number };
  categories?: Category[];
}) {
  const [priceRange, setPriceRange] = useState([0, 100000]);

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
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-4">Price Range</h4>
          <div className="space-y-4">
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full mt-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                placeholder="Min"
                className="text-sm"
              />
              <span className="text-gray-400">to</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value) || 0])
                }
                placeholder="Max"
                className="text-sm"
              />
            </div>
            <Button onClick={handlePriceApply} className="w-full">
              Apply Price
            </Button>
          </div>
        </div>

        <Separator />

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

        {/* Availability */}
        <div>
          <h4 className="font-medium mb-4">Availability</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                onChange={(e) => onFilterChange({ inStock: e.target.checked })}
              />
              <span className="text-sm">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary rounded"
                onChange={(e) => onFilterChange({ onSale: e.target.checked })}
              />
              <span className="text-sm">On Sale</span>
            </label>
          </div>
        </div>

        <Separator />

        {/* Clear Filters */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setPriceRange([0, 100000]);
            onFilterChange({});
          }}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
