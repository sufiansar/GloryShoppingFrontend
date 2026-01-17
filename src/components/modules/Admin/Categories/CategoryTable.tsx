// components/admin/categories/CategoryTable.tsx
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
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types/categories.interface";
import Pagination from "@/components/Shared/Pagination";
import CategoryDialog from "./CategoryDialog";
import DeleteAlert from "./DeleteAlert";

interface CategoryTableProps {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function CategoryTable({
  categories,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
}: CategoryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteAlertOpen(true);
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
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
    router.push(`/admin/dashboard/categories-management?${params.toString()}`);
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1"); // Reset to first page when changing items per page
    router.push(`/admin/dashboard/categories-management?${params.toString()}`);
  };

  if (categories.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No categories found</p>
        <Button className="mt-4" asChild>
          <a href="/admin/dashboard/categories">Add Your First Category</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {category.description || "No description"}
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {category.images?.length || 0} images
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(category?.createdAt!).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(category)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteClick(category)}
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

      {/* Reusable Pagination Component */}
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

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        category={selectedCategory}
        mode={dialogMode}
      />

      {/* Delete Alert */}
      {selectedCategory && (
        <DeleteAlert
          open={deleteAlertOpen}
          onOpenChange={setDeleteAlertOpen}
          categoryId={selectedCategory.id!}
          categoryName={selectedCategory.name}
        />
      )}
    </>
  );
}
