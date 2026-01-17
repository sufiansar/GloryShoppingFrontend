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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import BrandDialog from "./BrandDialog";
import DeleteAlert from "./DeleteAlert";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import { Brand } from "@/types/brand.interface";
import Pagination from "@/components/Shared/Pagination";

interface BrandsTableProps {
  brands: Brand[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function BrandsTable({
  brands,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: BrandsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">(
    "view",
  );

  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setDeleteAlertOpen(true);
  };

  const handleView = (brand: Brand) => {
    setSelectedBrand(brand);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDialogClose = (refresh = false) => {
    setDialogOpen(false);
    if (refresh) {
      router.refresh();
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin/dashboard/brand/brand-management?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`/admin/dashboard/brand/brand-management?${params.toString()}`);
  };

  if (brands.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No brands found</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  {brand.logoUrl ? (
                    <div className="relative w-10 h-10">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">No logo</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {brand.slug || "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {brand.country ? (
                    <Badge variant="secondary">{brand.country}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(brand.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(brand)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(brand)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteClick(brand)}
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
          itemsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          className="mt-6"
        />
      )}

      {/* Brand Dialog */}
      <BrandDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        brand={selectedBrand}
        mode={dialogMode}
      />

      {/* Delete Alert */}
      {selectedBrand && (
        <DeleteAlert
          open={deleteAlertOpen}
          onOpenChange={setDeleteAlertOpen}
          brandId={selectedBrand.id}
          brandName={selectedBrand.name}
        />
      )}
    </>
  );
}
