"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/modules/PublicProduct/ProductCard";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  logoUrl?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount?: number;
  thumbleImage?: string;
}

interface BrandPageClientProps {
  brands: Brand[];
}

export default function BrandPageClient({ brands }: BrandPageClientProps) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Fetch products for selected brand
  useEffect(() => {
    if (!selectedBrand) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const API_BASE = process.env.NEXT_PUBLIC_BASE_API;
        const response = await fetch(
          `${API_BASE}/product?page=1&limit=20&searchTerm=${encodeURIComponent(selectedBrand.name)}`,
          { credentials: "include" },
        );
        const data = await response.json();
        setProducts(data?.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedBrand]);

  // Scroll brand list
  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("brand-scroll-container");
    if (container) {
      const scrollAmount = 300;
      const newPosition =
        direction === "left"
          ? scrollPosition - scrollAmount
          : scrollPosition + scrollAmount;
      container.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "")
      .replace(/&/g, "and");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#ca428b] mb-4">
            Shop by Brand
          </h1>
          <p className="text-gray-600 text-lg">
            Select a brand to explore all products
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Brand Filter Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-md p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Brands
              </h2>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedBrand(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                    selectedBrand === null
                      ? "bg-[#ca428b] text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-xs ${
                      selectedBrand?.id === brand.id
                        ? "bg-[#ca428b] text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {brand.logoUrl && (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="w-4 h-4 object-contain shrink-0"
                      />
                    )}
                    <span className="truncate">{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-4">
            {/* Brand Header Card with Slider */}
            {selectedBrand && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-8 border-l-4 border-[#ca428b] animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-6">
                  {selectedBrand.logoUrl ? (
                    <div className="w-24 h-24 shrink-0 flex items-center justify-center bg-[#ca428b]/10 rounded-lg">
                      <img
                        src={selectedBrand.logoUrl}
                        alt={selectedBrand.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 shrink-0 bg-[#ca428b]/10 rounded-lg flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#ca428b]">
                        {selectedBrand.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedBrand.name}
                    </h2>
                    <p className="text-gray-600">
                      {products.length > 0
                        ? `${products.length} products available`
                        : "No products available"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Brand Slider Navigation */}
            {!selectedBrand && brands.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Popular Brands
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => scroll("left")}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => scroll("right")}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div
                  id="brand-scroll-container"
                  className="flex overflow-x-auto gap-4 pb-4 scroll-smooth"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand)}
                      className="shrink-0 group"
                    >
                      <div className="w-24 h-24 bg-white rounded-lg shadow-md hover:shadow-xl transition-all flex items-center justify-center p-3 hover:scale-105">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-[#ca428b]">
                            {brand.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-gray-600 text-center mt-2 line-clamp-2">
                        {brand.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {selectedBrand ? (
              loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ca428b]"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600">
                    This brand doesn't have any products yet.
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-20">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a Brand
                </h3>
                <p className="text-gray-600">
                  Choose a brand from the sidebar or the scrollable list above
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
