// components/product/product-grid.tsx
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Grid3x3, List, Filter } from "lucide-react";
import { Product } from "@/types/product.interface";
import ProductCard from "./Product";

interface ProductGridProps {
  products: Product[];
  selectedProducts: string[]; // Array of product names
  onSelect: (productName: string) => void;
  onSelectMultiple?: (productNames: string[]) => void;
  onAddToCart?: (productName: string) => void;
  onAddToWishlist?: (productName: string) => void;
  onQuickView?: (productName: string) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  filterBy?: {
    category?: string;
    brand?: string;
    priceRange?: [number, number];
    tags?: string[];
  };
  onFilterChange?: (filter: any) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedProducts,
  onSelect,
  onSelectMultiple,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  viewMode = "grid",
  onViewModeChange,
  sortBy = "featured",
  onSortChange,
  filterBy,
  onFilterChange,
}) => {
  const handleSelectAll = () => {
    if (onSelectMultiple) {
      const allNames = products.map((p) => p.name);
      onSelectMultiple(allNames);
    }
  };

  const handleClearSelection = () => {
    if (onSelectMultiple) {
      onSelectMultiple([]);
    }
  };

  // Filter products based on filterBy
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    if (filterBy?.category) {
      result = result.filter((p) => p.categoryName === filterBy.category);
    }

    if (filterBy?.brand) {
      result = result.filter((p) => p.brandName === filterBy.brand);
    }

    if (filterBy?.priceRange) {
      const [min, max] = filterBy.priceRange;
      result = result.filter((p) => {
        const finalPrice = p.discount ? p.price - p.discount : p.price;
        return finalPrice >= min && finalPrice <= max;
      });
    }

    if (filterBy?.tags && filterBy.tags.length > 0) {
      result = result.filter((p) =>
        filterBy.tags!.some((tag) => p.tags.includes(tag))
      );
    }

    return result;
  }, [products, filterBy]);

  // Sort products based on sortBy
  const sortedProducts = React.useMemo(() => {
    const result = [...filteredProducts];

    switch (sortBy) {
      case "newest":
        // Assuming newer products have isNew = true
        return result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

      case "price-low":
        return result.sort((a, b) => {
          const priceA = a.discount ? a.price - a.discount : a.price;
          const priceB = b.discount ? b.price - b.discount : b.price;
          return priceA - priceB;
        });

      case "price-high":
        return result.sort((a, b) => {
          const priceA = a.discount ? a.price - a.discount : a.price;
          const priceB = b.discount ? b.price - b.discount : b.price;
          return priceB - priceA;
        });

      case "rating":
        return result.sort((a, b) => b.averageRating - a.averageRating);

      case "popular":
        return result.sort((a, b) => b.salesCount - a.salesCount);

      case "featured":
      default:
        // Featured products first, then by sales count
        return result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.salesCount - a.salesCount;
        });
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {selectedProducts.length > 0 ? (
              <span className="flex items-center gap-2">
                <span className="font-medium">
                  {selectedProducts.length} of {products.length} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              </span>
            ) : (
              <span>
                Showing {filteredProducts.length} of {products.length} products
              </span>
            )}
          </div>

          {onSelectMultiple && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={selectedProducts.length === products.length}
            >
              Select All
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Sort By */}
          {onSortChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => onViewModeChange("grid")}
                className="h-9 w-9 rounded-none border-r"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => onViewModeChange("list")}
                className="h-9 w-9 rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              //   onSelect={onSelect}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              //   onQuickView={onQuickView}
              //   isSelected={selectedProducts.includes(product.name)}
              className={viewMode === "list" ? "flex flex-row h-64" : ""}
            />
          ))}
        </div>
      )}

      {/* Selected Products Summary (Optional) */}
      {selectedProducts.length > 0 && (
        <div className="sticky bottom-4 bg-white border rounded-lg shadow-lg p-4 mt-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">
                {selectedProducts.length} products selected
              </span>
              <p className="text-sm text-gray-600">
                Total: $
                {selectedProducts
                  .reduce((total, productName) => {
                    const product = products.find(
                      (p) => p.name === productName
                    );
                    if (!product) return total;
                    const price = product.discount
                      ? product.price - product.discount
                      : product.price;
                    return total + price;
                  }, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearSelection}>
                Clear Selection
              </Button>
              <Button
                onClick={() => {
                  // Handle bulk actions
                  console.log("Bulk action for:", selectedProducts);
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
