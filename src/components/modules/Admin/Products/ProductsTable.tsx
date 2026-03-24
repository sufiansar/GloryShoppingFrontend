"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Package,
  Tag,
  Star,
  TrendingUp,
  Award,
  Search,
  X,
  Filter,
} from "lucide-react";
import DeleteAlert from "./DeleteAlert";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import { Product } from "@/types/product.interface";
import Pagination from "@/components/Shared/Pagination";

interface ProductsTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  searchTerm?: string;
  brandId?: string;
  categoryId?: string;
  isActive?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default function ProductsTable({
  products,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  searchTerm: initialSearchTerm = "",
  brandId: initialBrandId = "",
  categoryId: initialCategoryId = "",
  isActive: initialIsActive = "",
  sortBy: initialSortBy = "createdAt",
  sortOrder: initialSortOrder = "desc",
}: ProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm);

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteAlertOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    router.push(`/admin/dashboard/products/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/dashboard/products/${product.id}/edit`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("searchTerm", term);
    } else {
      params.delete("searchTerm");
    }
    params.set("page", "1");
    router.push(`/admin/dashboard/products?${params.toString()}`);
  }, 500);

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    const params = new URLSearchParams(searchParams);
    params.delete("searchTerm");
    params.set("page", "1");
    router.push(`/admin/dashboard/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin/dashboard/products?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`/admin/dashboard/products?${params.toString()}`);
  };

  const handleSortChange = (field: string) => {
    const params = new URLSearchParams(searchParams);
    const currentSortBy = params.get("sortBy") || "createdAt";
    const currentSortOrder = params.get("sortOrder") || "desc";

    let newSortOrder = "asc";
    if (currentSortBy === field && currentSortOrder === "asc") {
      newSortOrder = "desc";
    }

    params.set("sortBy", field);
    params.set("sortOrder", newSortOrder);
    router.push(`/admin/dashboard/products?${params.toString()}`);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(filterName, value);
    } else {
      params.delete(filterName);
    }
    params.set("page", "1");
    router.push(`/admin/dashboard/products?${params.toString()}`);
  };

  const hasActiveFilters =
    localSearchTerm || initialBrandId || initialCategoryId || initialIsActive;

  if (products.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No products found</p>
        <Button className="mt-4" asChild>
          <a href="/admin/dashboard/products/create">
            Create Your First Product
          </a>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="space-y-4 mb-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products by name, SKU..."
              value={localSearchTerm}
              onChange={(e) => {
                setLocalSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10"
            />
            {localSearchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
                onClick={handleClearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set(
                "isActive",
                initialIsActive === "true" ? "false" : "true",
              );
              params.set("page", "1");
              router.push(`/admin/dashboard/products?${params.toString()}`);
            }}
            className={initialIsActive ? "bg-accent" : ""}
          >
            <Filter className="mr-2 h-4 w-4" />
            Status:{" "}
            {initialIsActive === "true"
              ? "Active"
              : initialIsActive === "false"
                ? "Inactive"
                : "All"}
          </Button>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange("name")}
            className={initialSortBy === "name" ? "bg-accent" : ""}
          >
            Name{" "}
            {initialSortBy === "name" &&
              (initialSortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange("createdAt")}
            className={initialSortBy === "createdAt" ? "bg-accent" : ""}
          >
            Date{" "}
            {initialSortBy === "createdAt" &&
              (initialSortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange("price")}
            className={initialSortBy === "price" ? "bg-accent" : ""}
          >
            Price{" "}
            {initialSortBy === "price" &&
              (initialSortOrder === "asc" ? "↑" : "↓")}
          </Button>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>

            {localSearchTerm && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Search: "{localSearchTerm}"
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-blue-200"
                  onClick={handleClearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {initialBrandId && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                Brand ID: {initialBrandId}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-gray-200"
                  onClick={() => handleFilterChange("brandId", "")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {initialCategoryId && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                Category ID: {initialCategoryId}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-gray-200"
                  onClick={() => handleFilterChange("categoryId", "")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {initialIsActive && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                Status: {initialIsActive === "true" ? "Active" : "Inactive"}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-gray-200"
                  onClick={() => handleFilterChange("isActive", "")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Clear All Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const params = new URLSearchParams();
                params.set("page", "1");
                params.set("limit", itemsPerPage.toString());
                router.push(`/admin/dashboard/products?${params.toString()}`);
                setLocalSearchTerm("");
              }}
            >
              <X className="mr-1 h-3 w-3" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.thumbleImage ? (
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.thumbleImage}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="line-clamp-1">{product.name}</span>
                    <div className="flex gap-1 mt-1">
                      {product.isNew && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                      {product.isFeatured && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {product.isTrending && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {product.isBestSeller && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          Best Seller
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {product.slug || "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      ${product.price?.toFixed(2) || "0.00"}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-sm text-red-600 line-through">
                        $
                        {(
                          (product.price || 0) *
                          (1 + product.discount / 100)
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.stock === 0
                        ? "destructive"
                        : product.stock < 10
                          ? "secondary"
                          : "default"
                    }
                  >
                    {product.stock || 0} units
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {product.categoryId ? `Cat-${product.categoryId}` : "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {product.brandId ? `Brand-${product.brandId}` : "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.isActive ? "default" : "secondary"}
                    className={
                      product.isActive
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          className="mt-6"
        />
      )}

      {/* Delete Alert */}
      {selectedProduct && (
        <DeleteAlert
          open={deleteAlertOpen}
          onOpenChange={setDeleteAlertOpen}
          productId={selectedProduct.id!}
          productName={selectedProduct.name}
        />
      )}
    </>
  );
}
