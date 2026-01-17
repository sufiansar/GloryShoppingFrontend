// components/admin/variants/VariantsTable.tsx
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
  Image as ImageIcon,
  Search,
  X,
} from "lucide-react";

import { useState, useCallback } from "react";

import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import { ProductVariant } from "@/types/variants.interface";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Shared/Pagination";
import DeleteAlert from "./DeleteAlert";

interface VariantsTableProps {
  variants: ProductVariant[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  searchTerm?: string;
  productId?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default function VariantsTable({
  variants,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  searchTerm: initialSearchTerm = "",
  productId: initialProductId = "",
  sortBy: initialSortBy = "createdAt",
  sortOrder: initialSortOrder = "desc",
}: VariantsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm);

  const handleDeleteClick = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setDeleteAlertOpen(true);
  };

  const handleViewDetails = (variant: ProductVariant) => {
    router.push(`/admin/variants/${variant.id}`);
  };

  const handleEdit = (variant: ProductVariant) => {
    router.push(`/admin/variants/${variant.id}/edit`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("searchTerm", term);
    } else {
      params.delete("searchTerm");
    }
    params.set("page", "1"); // Reset to first page on new search
    router.push(`/admin/variants?${params.toString()}`);
  }, 500);

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    const params = new URLSearchParams(searchParams);
    params.delete("searchTerm");
    params.set("page", "1");
    router.push(`/admin/variants?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin/variants?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`/admin/variants?${params.toString()}`);
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
    router.push(`/admin/variants?${params.toString()}`);
  };

  if (variants.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No variants found</p>
        <Button className="mt-4" asChild>
          <a href="/admin/variants/create">Create Your First Variant</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Inline Search and Sort Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search SKU, size..."
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

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange("sku")}
            className={initialSortBy === "sku" ? "bg-accent" : ""}
          >
            SKU{" "}
            {initialSortBy === "sku" &&
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
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell className="font-medium">
                  <Badge variant="outline" className="font-mono">
                    {variant.sku}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-50">
                      {variant.product?.name || `Product ${variant.productId}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>{variant.size}</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    ${variant.price?.toFixed(2) || "0.00"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      variant.stock === 0
                        ? "destructive"
                        : variant.stock &&
                            variant.stock < (variant.lowStockThreshold || 10)
                          ? "secondary"
                          : "default"
                    }
                  >
                    {variant.stock || 0} units
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{variant.images?.length || 0}</span>
                    {variant.images && variant.images.length > 0 && (
                      <div className="relative w-8 h-8">
                        <Image
                          src={variant.images[0]}
                          alt="Variant image"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(variant.createdAt).toLocaleDateString()}
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
                        onClick={() => handleViewDetails(variant)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(variant)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteClick(variant)}
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
      {selectedVariant && (
        <DeleteAlert
          open={deleteAlertOpen}
          onOpenChange={setDeleteAlertOpen}
          variantId={selectedVariant.id}
          variantSKU={selectedVariant.sku}
        />
      )}
    </>
  );
}
