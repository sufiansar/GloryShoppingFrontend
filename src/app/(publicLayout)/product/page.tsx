// app/products/page.tsx
"use client";

import ProductGrid from "@/components/modules/product/Product-grid";
import { Product } from "@/types/product.interface";
import React, { useState } from "react";

// Mock data
const mockProducts: Product[] = [
  {
    name: "Organic Face Serum with Vitamin C",
    slug: "organic-face-serum-vitamin-c",
    description: "Brightening serum with natural ingredients",
    country: "USA",
    salesCount: 1250,
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    averageRating: 4.5,
    reviewCount: 234,
    brandName: "Natural Beauty",
    categoryName: "Skincare",
    thumbleImage: "/products/serum.jpg",
    price: 49.99,
    discount: 10.0,
    stock: 45,
    shortDesc: "Brightens and evens skin tone",
    tags: ["Organic", "Vegan", "Cruelty-Free", "Anti-Aging"],
    isActive: true,
  },
  {
    name: "Hydrating Face Moisturizer",
    slug: "hydrating-face-moisturizer",
    description: "Daily moisturizer for all skin types",
    country: "France",
    salesCount: 890,
    isNew: false,
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    averageRating: 4.7,
    reviewCount: 156,
    brandName: "French Beauty",
    categoryName: "Skincare",
    thumbleImage: "/products/moisturizer.jpg",
    price: 34.99,
    discount: null,
    stock: 120,
    shortDesc: "24-hour hydration",
    tags: ["Hydrating", "Sensitive Skin", "Daily Use"],
    isActive: true,
  },
  // Add more products...
];

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [filterBy, setFilterBy] = useState({
    category: "",
    brand: "",
    priceRange: [0, 100] as [number, number],
    tags: [] as string[],
  });

  const handleSelect = (productName: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productName)
        ? prev.filter((name) => name !== productName)
        : [...prev, productName]
    );
  };

  const handleSelectMultiple = (productNames: string[]) => {
    setSelectedProducts(productNames);
  };

  const handleAddToCart = (productName: string) => {
    console.log("Add to cart:", productName);
    // Implement your add to cart logic
  };

  const handleAddToWishlist = (productName: string) => {
    console.log("Add to wishlist:", productName);
    // Implement your wishlist logic
  };

  const handleQuickView = (productName: string) => {
    console.log("Quick view:", productName);
    // Implement quick view modal
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleFilterChange = (newFilter: any) => {
    setFilterBy((prev) => ({ ...prev, ...newFilter }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
        <p className="text-gray-600 mt-2">
          Select products to add to your cart or compare
        </p>
      </div>

      <ProductGrid
        products={mockProducts}
        selectedProducts={selectedProducts}
        onSelect={handleSelect}
        onSelectMultiple={handleSelectMultiple}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onQuickView={handleQuickView}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        filterBy={filterBy}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
