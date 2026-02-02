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
import { Filter, Grid, List, Search, SlidersHorizontal } from "lucide-react";
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
  currentCategorySlug?: string;
}

export default function CategoryProductsContent({
  category,
  searchParams,
  categories = [],
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
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
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
                  className={`h-48 md:h-64 rounded-xl overflow-hidden ${
                    index === 0 && category?.images?.length === 1
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

        <Separator className="my-8" />

        {/* Mobile Filter Sheet */}
        <Sheet>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={`Search in ${category.name}...`}
                  defaultValue={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-11 rounded-full border-2 border-gray-200 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>

              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-45 h-11">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_low_high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price_high_low">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10 rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10 rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <SheetContent side="left" className="w-75 sm:w-100">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              initialFilters={{
                minPrice: minPrice ? parseInt(minPrice) : undefined,
                maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
              }}
            />
          </SheetContent>
        </Sheet>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Categories Sidebar */}
            {categories && categories.length > 0 && (
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/categorys/${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        currentCategorySlug === cat.slug
                          ? "bg-pink-600 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
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
            />
          </div>

          {/* Products Section */}
          <div className="lg:col-span-4">
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
                  className={`mb-8 ${viewMode === "list" ? "space-y-6" : ""}`}
                >
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="mt-8">
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={pagination.currentPage === 1}
                        >
                          ←
                        </Button>

                        {[...Array(Math.min(5, pagination.totalPages))].map(
                          (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (
                              pagination.currentPage >=
                              pagination.totalPages - 2
                            ) {
                              pageNum = pagination.totalPages - 4 + i;
                            } else {
                              pageNum = pagination.currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  pagination.currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          },
                        )}

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages
                          }
                        >
                          →
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-600">
                      Showing{" "}
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}{" "}
                      to{" "}
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems,
                      )}{" "}
                      of {pagination.totalItems} products
                    </div>

                    <div className="mt-4 flex justify-center">
                      <Select
                        value={pagination.itemsPerPage.toString()}
                        onValueChange={(value) =>
                          handleItemsPerPageChange(parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-30">
                          <SelectValue placeholder="Items per page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 per page</SelectItem>
                          <SelectItem value="24">24 per page</SelectItem>
                          <SelectItem value="48">48 per page</SelectItem>
                          <SelectItem value="96">96 per page</SelectItem>
                        </SelectContent>
                      </Select>
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
