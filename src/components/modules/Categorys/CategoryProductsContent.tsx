"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Product } from "@/types/product.interface";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Grid, List, Search, ChevronRight, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/types/categorys.interface";
import { getAllProductByCategoryBySlug } from "@/action/categories/categories.action";
import ProductCard from "../PublicProduct/ProductCard";
import { ProductListItem } from "./ProductListItem";
import { FilterSidebar } from "./FilterSidebar";

interface CategoryProductsContentProps {
  category: Category;
  searchParams: { [key: string]: string | string[] | undefined };
  categories?: Category[];
  brands?: {
    id: string;
    name: string;
    slug?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  }[];
  currentCategorySlug?: string;
}

export default function CategoryProductsContent({
  category,
  searchParams,
  categories = [],
  brands = [],
  currentCategorySlug,
}: CategoryProductsContentProps) {
  const router = useRouter();
  const params = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  // Extract query parameters
  const page = params.get("page") || "1";
  const limit = params.get("limit") || "12";
  const searchTerm = params.get("searchTerm") || "";
  const sort = params.get("sort") || "featured";
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      const queryParams = new URLSearchParams();
      if (page) queryParams.set("page", page);
      if (limit) queryParams.set("limit", limit);
      if (searchTerm) queryParams.set("searchTerm", searchTerm);
      if (sort) queryParams.set("sort", sort);
      if (minPrice) queryParams.set("minPrice", minPrice);
      if (maxPrice) queryParams.set("maxPrice", maxPrice);

      const result = await getAllProductByCategoryBySlug(
        category.slug,
        queryParams.toString(),
      );

      console.log(
        "Slug:",
        category.slug,
        "Query:",
        queryParams.toString(),
        result,
      );
      if (result && result.data) {
        setProducts(result.data);
        setPagination({
          currentPage: result.page || 1,
          totalPages:
            result.totalPages || Math.ceil(result.total / result.limit),
          totalItems: result.total || 0,
          itemsPerPage: result.limit || 12,
        });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category.slug, page, limit, searchTerm, sort, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (value: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (value) {
      newParams.set("searchTerm", value);
    } else {
      newParams.delete("searchTerm");
    }
    newParams.set("page", "1");
    router.push(`/categorys/${category.slug}?${newParams.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("sort", value);
    newParams.set("page", "1");
    router.push(`/categorys/${category.slug}?${newParams.toString()}`);
  };

  const handleFilterChange = (filters: any) => {
    const newParams = new URLSearchParams(params.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });

    newParams.set("page", "1");
    router.push(`/categorys/${category.slug}?${newParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", page.toString());
    router.push(`/categorys/${category.slug}?${newParams.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("limit", limit.toString());
    newParams.set("page", "1");
    router.push(`/categorys/${category.slug}?${newParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-6 md:py-12">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#ca428b] mb-4 tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 text-lg max-w-3xl">
              {category.description}
            </p>
          )}
        </div>

        {/* Category Image Gallery */}
        {category.images && category.images.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {category.images.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className={`h-48 md:h-64 rounded-xl overflow-hidden ${index === 0 && category?.images?.length === 1
                      ? "md:col-span-3"
                      : ""
                    }`}
                >
                  <img
                    src={image}
                    alt={`${category.name} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4 md:my-8" />

        {/* Unified Premium Filter Bar */}
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-[2rem] border-2 border-pink-50 shadow-xl shadow-pink-500/5 mb-10 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
            {/* Search Section */}
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-pink-400 group-focus-within:text-pink-600 transition-colors" />
              </div>
              <Input
                placeholder={`Find your perfect ${category.name.toLowerCase()}...`}
                defaultValue={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-13 h-14 w-full bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Desktop Controls Divider */}
            <div className="hidden lg:block w-px h-8 bg-pink-100 mx-2" />

            <div className="flex items-center gap-2 p-1">
              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="lg:hidden h-12 px-6 rounded-2xl text-pink-600 hover:bg-pink-50 font-bold border border-pink-100">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-[400px] border-r-pink-50">
                  <div className="mt-8">
                    <FilterSidebar
                      onFilterChange={handleFilterChange}
                      initialFilters={{
                        minPrice: minPrice ? parseInt(minPrice) : undefined,
                        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
                      }}
                      brands={brands}
                      categories={categories}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Selection */}
              <div className="flex-1 lg:flex-none">
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="h-12 w-full lg:w-48 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-pink-500/20 font-semibold px-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Sort</span>
                      <SelectValue placeholder="Featured" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-pink-50 shadow-2xl">
                    <SelectItem value="featured" className="rounded-lg">Featured</SelectItem>
                    <SelectItem value="newest" className="rounded-lg">Newest Arrival</SelectItem>
                    <SelectItem value="price_low_high" className="rounded-lg">Price: Low to High</SelectItem>
                    <SelectItem value="price_high_low" className="rounded-lg">Price: High to Low</SelectItem>
                    <SelectItem value="rating" className="rounded-lg">Highest Rated</SelectItem>
                    <SelectItem value="popular" className="rounded-lg">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop View Toggles */}
              <div className="hidden lg:flex items-center bg-gray-50 p-1 rounded-xl gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`h-10 w-10 rounded-lg transition-all duration-300 ${viewMode === "grid"
                      ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                      : "text-gray-400 hover:text-pink-600 hover:bg-pink-50"
                    }`}
                >
                  <Grid className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`h-10 w-10 rounded-lg transition-all duration-300 ${viewMode === "list"
                      ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                      : "text-gray-400 hover:text-pink-600 hover:bg-pink-50"
                    }`}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Categories Sidebar */}
            {categories && categories.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border shadow-sm premium-shadow-hover">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                  <span className="bg-pink-50 text-pink-600 text-xs font-bold px-2 py-1 rounded-full">
                    {categories.length}
                  </span>
                </div>
                <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-premium pr-2">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/categorys/${cat.slug}`}
                      className={`group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 ${currentCategorySlug === cat.slug || category.slug === cat.slug
                          ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                          : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                        }`}
                    >
                      <span className="text-sm font-medium truncate">{cat.name}</span>
                      <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${currentCategorySlug === cat.slug || category.slug === cat.slug
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Sidebar */}
            <FilterSidebar
              onFilterChange={handleFilterChange}
              initialFilters={{
                minPrice: minPrice ? parseInt(minPrice) : undefined,
                maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
              }}
              brands={brands}
            />
          </div>

          {/* Products Section */}
          <div className="lg:col-span-4 flex flex-col">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">😔</div>
                <h3 className="text-xl font-semibold mb-2">
                  Error Loading Products
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => fetchProducts()}>Try Again</Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
              </div>
            ) : (
              <>
                <div
                  className={`flex-1 mb-8 ${viewMode === "list" ? "space-y-6" : ""}`}
                >
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {products.map((product) => (
                        <ProductListItem key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {pagination.totalPages >= 1 && (
                  <div className="mt-auto mb-4 py-6 md:py-10 border-t border-pink-50">
                    <div className="flex flex-col items-center gap-6 md:gap-10">
                      {/* Page Numbers */}
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="h-12 w-12 rounded-full border border-gray-100 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300 disabled:opacity-20"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-2">
                          {[...Array(pagination.totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            if (
                              pagination.totalPages > 7 &&
                              pageNum !== 1 &&
                              pageNum !== pagination.totalPages &&
                              Math.abs(pageNum - pagination.currentPage) > 1
                            ) {
                              if (Math.abs(pageNum - pagination.currentPage) === 2) {
                                return <span key={pageNum} className="w-8 text-center text-gray-300 font-bold">...</span>;
                              }
                              return null;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={pagination.currentPage === pageNum ? "default" : "ghost"}
                                size="icon"
                                onClick={() => handlePageChange(pageNum)}
                                className={`h-12 w-12 rounded-full text-base font-bold transition-all duration-500 ${pagination.currentPage === pageNum
                                    ? "bg-pink-600 text-white shadow-[0_10px_20px_-5px_rgba(202,66,139,0.4)] scale-110"
                                    : "text-gray-500 hover:bg-pink-50 hover:text-pink-600 hover:scale-105"
                                  }`}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="h-12 w-12 rounded-full border border-gray-100 hover:bg-pink-50 hover:text-pink-600 transition-all duration-300 disabled:opacity-20"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Info & Settings */}
                      <div className="flex flex-col md:flex-row items-center gap-6 px-8 py-4 bg-gray-50/50 rounded-2xl border border-gray-100 backdrop-blur-sm">
                        <p className="text-sm font-semibold text-gray-500">
                          Showing <span className="text-pink-600 font-extrabold italic mx-1 text-base">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}—{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of <span className="text-gray-900 font-bold">{pagination.totalItems}</span> products
                        </p>

                        <div className="hidden md:block w-px h-4 bg-gray-200" />

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Per Page</span>
                          <Select
                            value={pagination.itemsPerPage.toString()}
                            onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}
                          >
                            <SelectTrigger className="w-[120px] h-9 rounded-lg border-2 border-white bg-white shadow-sm focus:ring-pink-500/20 font-bold text-gray-700">
                              <SelectValue placeholder="12" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-2 border-pink-50 shadow-2xl">
                              <SelectItem value="12" className="font-medium text-gray-600">12 Products</SelectItem>
                              <SelectItem value="24" className="font-medium text-gray-600">24 Products</SelectItem>
                              <SelectItem value="48" className="font-medium text-gray-600">48 Products</SelectItem>
                              <SelectItem value="96" className="font-medium text-gray-600">96 Products</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
