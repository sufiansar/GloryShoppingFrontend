"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Edit,
  Trash2,
  Eye,
  LinkIcon,
} from "lucide-react";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { IIngredient } from "@/types/ingrediant.interface";
import { deleteIngredient } from "@/action/ingredian/ingrediant.action";

interface IngredientTableProps {
  ingredients: IIngredient[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  currentSearch: string;
}

export default function IngredientTable({
  ingredients,
  pagination,
  currentSearch,
}: IngredientTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/admin/dashboard/ingredients?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!ingredientToDelete) return;

    setIsDeleting(true);
    try {
      await deleteIngredient(ingredientToDelete);
      toast.success("Ingredient deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete ingredient");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setIngredientToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", page.toString());
    router.push(`/admin/dashboard/ingredients?${params.toString()}`);
  };

  const getSafetyLevelColor = (level: string) => {
    switch (level) {
      case "SAFE":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "CAUTION":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "UNSAFE":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <form onSubmit={handleSearch} className="mb-8 flex items-center gap-4 bg-white/20 dark:bg-slate-800/20 p-4 rounded-3xl border border-white/40 dark:border-slate-800/50 shadow-inner">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-custom transition-colors" />
          <Input
            placeholder="Search ingredients globally..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-xl shadow-inner focus-visible:ring-primary-custom/30 font-medium text-slate-700 dark:text-slate-300 transition-all duration-300"
          />
        </div>
        <Button type="submit" className="h-12 px-8 rounded-xl bg-primary-custom text-white hover:bg-primary-custom/80 transition-all font-bold">Search</Button>
        {currentSearch && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearch("");
              router.push("/admin/dashboard/ingredients");
            }}
            className="h-12 px-6 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all font-bold text-slate-500"
          >
            Clear
          </Button>
        )}
      </form>

      <div className="overflow-x-auto scrollbar-premium">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-transparent">
              <TableHead className="py-4 pl-8 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</TableHead>
              <TableHead className="py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</TableHead>
              <TableHead className="py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Safety Level</TableHead>
              <TableHead className="py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right py-4 pr-8 text-xs font-semibold text-slate-500 uppercase tracking-wider w-25">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id} className="premium-table-row border-b border-slate-100/30 dark:border-slate-800/20 group/row">
                <TableCell className="py-4 pl-8 font-bold text-slate-900 dark:text-white">{ingredient.name}</TableCell>
                <TableCell className="max-w-xs truncate text-sm text-slate-500">
                  {ingredient.description || "No description provided"}
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl font-bold text-[10px] tracking-widest uppercase border ${
                    ingredient.safetyLevel === 'SAFE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                    ingredient.safetyLevel === 'MODERATE' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                    ingredient.safetyLevel === 'RESTRICTED' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                    'bg-slate-500/10 text-slate-600 border-slate-500/20'
                  }`}>
                    {ingredient.safetyLevel}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center justify-center px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                     ingredient.isActive ? 'bg-primary-custom/10 text-primary-custom border-primary-custom/20' : 'bg-slate-200/50 text-slate-500 border-slate-300/50'
                  }`}>
                    {ingredient.isActive ? "Active" : "Inactive"}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all active:scale-90">
                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-3xl glass-card animate-in zoom-in-95 duration-200">
                      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Operations</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/ingredients/${ingredient.id}`,
                          )
                        }
                      >
                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Eye className="h-4 w-4 text-blue-500" />
                        </div>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/ingredients/${ingredient.id}/edit`,
                          )
                        }
                      >
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Edit className="h-4 w-4 text-emerald-500" />
                        </div>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
                        onClick={() =>
                          router.push(`/admin/dashboard/ingredients/join`)
                        }
                      >
                        <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <LinkIcon className="h-4 w-4 text-amber-500" />
                        </div>
                        Link to Products
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="mx-2 bg-slate-100 dark:bg-slate-800/50" />
                      <DropdownMenuItem
                        className="flex items-center gap-3 p-3 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 transition-all cursor-pointer font-bold text-rose-500"
                        onClick={() => {
                          setIngredientToDelete(ingredient.id!);
                          setDeleteDialogOpen(true);
                        }}
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
            {ingredients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24">
                   <div className="flex flex-col items-center gap-2">
                      <Search className="h-10 w-10 text-slate-200" />
                      <span className="text-sm font-semibold text-slate-600 mt-2">No ingredients found</span>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 px-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Showing <span className="text-primary-custom">{ingredients.length}</span> of {pagination.totalItems} ingredients
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="rounded-xl h-10 px-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-slate-200/50 disabled:opacity-50"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <div className="flex items-center gap-1 bg-white/30 dark:bg-slate-800/30 p-1 rounded-xl border border-slate-200/30">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, pagination.currentPage - 3),
                  Math.min(pagination.totalPages, pagination.currentPage + 2),
                )
                .map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={
                      pageNum === pagination.currentPage ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 w-8 rounded-lg font-black transition-all ${
                      pageNum === pagination.currentPage
                        ? "bg-primary-custom text-white shadow-md border-none"
                        : "text-slate-500 hover:bg-white dark:hover:bg-slate-700"
                    }`}
                  >
                    {pageNum}
                  </Button>
                ))}
            </div>
            <Button
              variant="ghost"
              className="rounded-xl h-10 px-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-slate-200/50 disabled:opacity-50"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem] border-white/20 p-8 glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-rose-500">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed">
              This action cannot be undone. This will permanently delete the
              ingredient and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4 sm:gap-2">
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl h-12 px-6 font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 border-none transition-all"
            >
              {isDeleting ? "Terminating..." : "Terminate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
