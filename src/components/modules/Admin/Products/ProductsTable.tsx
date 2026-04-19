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
      {/* Search and Filter Controls - Premium Command Center */}
      <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <div className="absolute inset-0 bg-primary-custom/5 blur-xl group-focus-within:bg-primary-custom/10 transition-all duration-500 rounded-3xl" />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-primary-custom transition-colors" />
            <Input
              placeholder="Search products by name, SKU..."
              value={localSearchTerm}
              onChange={(e) => {
                setLocalSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-12 h-12 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-white/20 dark:border-slate-800/50 rounded-2xl shadow-sm premium-input-focus relative z-10 font-medium"
            />
            {localSearchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all z-10"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
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
              className={`h-12 px-6 rounded-2xl border-primary/40 dark:border-primary/40 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 font-bold ${initialIsActive ? "ring-2 ring-primary-custom/20 text-primary-custom" : "text-slate-600 dark:text-slate-400"}`}
            >
              <Filter className={`mr-2 h-4 w-4 ${initialIsActive ? 'animate-bounce' : ''}`} />
              Status:{" "}
              {initialIsActive === "true"
                ? "Active"
                : initialIsActive === "false"
                  ? "Inactive"
                  : "All"}
            </Button>
          </div>
        </div>

        {/* Sort Controls - Minimalist Chic */}
        <div className="flex flex-wrap items-center gap-3 p-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl w-fit border border-slate-200/30 dark:border-slate-800/30">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3">
            Sort by:
          </span>
          {[
            { id: "name", label: "Name" },
            { id: "createdAt", label: "Date" },
            { id: "price", label: "Price" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSortChange(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 ${initialSortBy === item.id ? 'bg-white dark:bg-slate-800 text-primary-custom shadow-md shadow-primary-custom/5 ring-1 ring-primary-custom/10' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
            >
              {item.label}
              {initialSortBy === item.id && (
                <span className="ml-1.5 opacity-60">
                  {initialSortOrder === "asc" ? "↑" : "↓"}
                </span>
              )}
            </button>
          ))}
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

      {/* Products Intelligent List - Premium Card Experience */}
      <div className="rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="overflow-x-auto scrollbar-premium">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-transparent px-6">
                <TableHead className="w-24 py-6 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Image</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Name</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SKU</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</TableHead>
                <TableHead className="text-right py-6 pr-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, idx) => (
                <TableRow key={product.id} className="premium-table-row border-b border-slate-100/30 dark:border-slate-800/20 group/row">
                  <TableCell className="py-5 pl-8">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white dark:ring-slate-800 transition-transform duration-500 group-hover/row:scale-105 group-hover/row:rotate-3 group-hover/row:shadow-primary-custom/20">
                      {product.thumbleImage ? (
                        <Image
                          src={product.thumbleImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Package className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5 min-w-[200px]">
                      <span className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 group-hover/row:text-primary-custom transition-colors">
                        {product.name}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.isNew && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-wider border border-blue-500/20">
                            New
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-wider border border-amber-500/20 flex items-center gap-1">
                            <Star className="h-2 w-2 fill-amber-500" /> Featured
                          </span>
                        )}
                        {product.isTrending && (
                          <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-500 text-[9px] font-black uppercase tracking-wider border border-pink-500/20 flex items-center gap-1">
                            <TrendingUp className="h-2 w-2" /> Trending
                          </span>
                        )}
                        {product.isStock && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
                            <Package className="h-2 w-2" /> In Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${product.stock === 0 ? 'bg-rose-500 animate-ping' : product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                          {product.stock || 0}
                          <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Units</span>
                        </span>
                      </div>
                      <div className="w-24 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock === 0 ? 'bg-rose-500' : product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((product.stock || 0) * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {product.categoryId ? `Cat-${product.categoryId.substring(0, 8)}` : "Uncategorized"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                        ${product.price?.toFixed(2) || "0.00"}
                      </span>
                      {product.discount && product.discount > 0 && (
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter line-through opacity-70">
                          ${((product.price || 0) * (1 + product.discount / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <code className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] text-primary-custom w-fit">
                        {product.slug?.substring(0, 15) || "—"}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${product.isActive ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' : 'bg-slate-500/5 border-slate-500/20 text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all active:scale-90">
                          <MoreVertical className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-3xl glass-card animate-in zoom-in-95 duration-200">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(product)}
                          className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
                        >
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Eye className="h-4 w-4 text-blue-500" />
                          </div>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEdit(product)}
                          className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
                        >
                          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Edit className="h-4 w-4 text-amber-500" />
                          </div>
                          Edit
                        </DropdownMenuItem>
                        <div className="h-[1px] bg-slate-100 dark:bg-slate-800/50 my-1 mx-2" />
                        <DropdownMenuItem
                          className="flex items-center gap-3 p-3 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 transition-all cursor-pointer font-bold text-rose-500"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                            <Trash2 className="h-4 w-4" />
                          </div>
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
