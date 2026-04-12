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
      <div className="rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="overflow-x-auto scrollbar-premium">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-transparent px-6 text-left">
                <TableHead className="py-6 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Name</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Images</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created At</TableHead>
                <TableHead className="text-right py-6 pr-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="premium-table-row border-b border-slate-100/30 dark:border-slate-800/20 group/row">
                  <TableCell className="py-5 pl-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-slate-900 dark:text-white group-hover/row:text-primary-custom transition-colors">
                        {category.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Classification</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xs line-clamp-2 italic">
                      {category.description || "No narrative established"}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-custom/5 text-primary-custom rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-custom/10">
                      {category.images?.length || 0} Assets
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {new Date(category?.createdAt!).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
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
                          onClick={() => handleView(category)}
                          className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
                        >
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Eye className="h-4 w-4 text-blue-500" />
                          </div>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEdit(category)}
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
                          onClick={() => handleDeleteClick(category)}
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
