// components/admin/variants/VariantsTable.tsx
"use client";

import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from"@/components/ui/table";
import { Badge } from"@/components/ui/badge";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from"@/components/ui/dropdown-menu";
import {
 Eye,
 Edit,
 Trash2,
 MoreVertical,
 Package,
 Image as ImageIcon,
 Search,
 X,
} from"lucide-react";

import { useState, useCallback } from"react";

import Image from"next/image";
import { useDebouncedCallback } from"use-debounce";
import { ProductVariant } from"@/types/variants.interface";
import { useRouter, useSearchParams } from"next/navigation";
import Pagination from"@/components/Shared/Pagination";
import DeleteAlert from"./DeleteAlert";

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
 searchTerm: initialSearchTerm ="",
 productId: initialProductId ="",
 sortBy: initialSortBy ="createdAt",
 sortOrder: initialSortOrder ="desc",
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
 router.push(`/admin/dashboard/variants/${variant.id}`);
 };

 const handleEdit = (variant: ProductVariant) => {
 router.push(`/admin/dashboard/variants/${variant.id}/edit`);
 };

 const handleSearch = useDebouncedCallback((term: string) => {
 const params = new URLSearchParams(searchParams);

 if (term) {
 params.set("searchTerm", term);
 } else {
 params.delete("searchTerm");
 }
 params.set("page","1"); // Reset to first page on new search
 router.push(`/admin/dashboard/variants?${params.toString()}`);
 }, 500);

 const handleClearSearch = () => {
 setLocalSearchTerm("");
 const params = new URLSearchParams(searchParams);
 params.delete("searchTerm");
 params.set("page","1");
 router.push(`/admin/dashboard/variants?${params.toString()}`);
 };

 const handlePageChange = (page: number) => {
 const params = new URLSearchParams(searchParams);
 params.set("page", page.toString());
 router.push(`/admin/dashboard/variants?${params.toString()}`);
 };

 const handleItemsPerPageChange = (limit: number) => {
 const params = new URLSearchParams(searchParams);
 params.set("limit", limit.toString());
 params.set("page","1");
 router.push(`/admin/dashboard/variants?${params.toString()}`);
 };

 const handleSortChange = (field: string) => {
 const params = new URLSearchParams(searchParams);
 const currentSortBy = params.get("sortBy") ||"createdAt";
 const currentSortOrder = params.get("sortOrder") ||"desc";

 let newSortOrder ="asc";
 if (currentSortBy === field && currentSortOrder ==="asc") {
 newSortOrder ="desc";
 }

 params.set("sortBy", field);
 params.set("sortOrder", newSortOrder);
 router.push(`/admin/dashboard/variants?${params.toString()}`);
 };

 if (variants.length === 0) {
 return (
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 rounded-[2.5rem] p-16 text-center shadow-inner">
 <div className="flex flex-col items-center gap-4">
 <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
 <Package className="h-10 w-10 text-slate-300"/>
 </div>
 <p className="text-[14px] font-medium text-slate-400">No variants found</p>
 <Button className="mt-4 rounded-2xl h-12 px-8 bg-primary-custom text-white font-medium text-sm shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none"asChild>
 <a href="/admin/dashboard/variants/create">
 Create Your First Variant
 </a>
 </Button>
 </div>
 </div>
 );
 }

 return (
 <>
 {/* Inline Search and Sort Controls */}
 <div className="flex items-center justify-between mb-6 px-2">
 <div className="relative w-72 group">
 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4"/>
 <Input
 placeholder="Search SKU, size..."
 value={localSearchTerm}
 onChange={(e) => {
 setLocalSearchTerm(e.target.value);
 handleSearch(e.target.value);
 }}
 className="h-12 pl-11 pr-10 bg-white/50 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-sm focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
 />
 {localSearchTerm && (
 <Button
 type="button"
 variant="ghost"
 size="icon"
 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl"
 onClick={handleClearSearch}
 >
 <X className="h-4 w-4 text-slate-500"/>
 </Button>
 )}
 </div>

 <div className="flex items-center gap-3">
 <span className="text-sm font-medium text-slate-400">Sort by:</span>
 <div className="flex items-center bg-white/50 dark:bg-slate-800/40 p-1 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm backdrop-blur-md">
 <Button
 variant="ghost"
 onClick={() => handleSortChange("sku")}
 className={`rounded-xl h-10 px-4 text-sm font-medium transition-all ${initialSortBy ==="sku"?"bg-white dark:bg-slate-700 shadow-sm text-primary-custom":"text-slate-500 hover:text-slate-700"}`}
 >
 SKU{""}
 {initialSortBy ==="sku"&&
 (initialSortOrder ==="asc"?"↑":"↓")}
 </Button>
 <Button
 variant="ghost"
 onClick={() => handleSortChange("createdAt")}
 className={`rounded-xl h-10 px-4 text-sm font-medium transition-all ${initialSortBy ==="createdAt"?"bg-white dark:bg-slate-700 shadow-sm text-primary-custom":"text-slate-500 hover:text-slate-700"}`}
 >
 Date{""}
 {initialSortBy ==="createdAt"&&
 (initialSortOrder ==="asc"?"↑":"↓")}
 </Button>
 </div>
 </div>
 </div>

 <div className="rounded-[2rem] bg-white/20 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/50 shadow-inner overflow-hidden flex flex-col mx-2 mb-2">
 <div className="overflow-x-auto scrollbar-premium">
 <Table>
 <TableHeader>
 <TableRow className="border-b border-white/20 dark:border-slate-800/30 hover:bg-transparent px-6 text-left">
 <TableHead className="py-6 pl-8 text-sm font-medium text-slate-400">SKU</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Product</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Size</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Price</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Stock</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Images</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Created At</TableHead>
 <TableHead className="text-right py-6 pr-8 text-sm font-medium text-slate-400">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {variants.map((variant) => (
 <TableRow key={variant.id} className="premium-table-row border-b border-slate-100/30 dark:border-slate-800/20 group/row">
 <TableCell className="py-5 pl-8 font-medium">
 <span className="text-xs font-medium text-primary-custom bg-primary-custom/5 px-3 py-1.5 rounded-xl border border-primary-custom/10 w-fit inline-block">
 {variant.sku}
 </span>
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-3">
 <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
 <Package className="h-4 w-4 text-emerald-500"/>
 </div>
 <span className="truncate max-w-50 font-bold text-slate-700 dark:text-slate-300 group-hover/row:text-primary-custom transition-colors">
 {variant.product?.name || `Product ${variant.productId}`}
 </span>
 </div>
 </TableCell>
 <TableCell>
 <span className="font-medium text-sm px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
 {variant.size}
 </span>
 </TableCell>
 <TableCell>
 <div className="font-medium text-slate-900 dark:text-white">
 ${variant.price?.toFixed(2) ||"0.00"}
 </div>
 </TableCell>
 <TableCell>
 <span className={`text-sm font-medium px-3 py-1.5 rounded-xl border ${
 variant.stock === 0
 ?"bg-rose-500/10 text-rose-600 border-rose-500/20"
 : variant.stock && variant.stock < (variant.lowStockThreshold || 10)
 ?"bg-amber-500/10 text-amber-600 border-amber-500/20"
 :"bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
 }`}>
 {variant.stock || 0} units
 </span>
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-3">
 <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20">
 <ImageIcon className="h-4 w-4 text-sky-500"/>
 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[8px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
 {variant.images?.length || 0}
 </span>
 </div>
 {variant.images && variant.images.length > 0 && (
 <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200/50 shadow-sm">
 <Image
 src={variant.images[0]}
 alt="Variant image"
 fill
 className="object-cover"
 />
 </div>
 )}
 </div>
 </TableCell>
 <TableCell>
 <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
 {new Date(variant.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
 </span>
 </TableCell>
 <TableCell className="text-right pr-8">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost"size="icon"className="h-10 w-10 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all active:scale-90">
 <MoreVertical className="h-5 w-5 text-slate-400"/>
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end"className="w-48 p-2 rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-3xl glass-card animate-in zoom-in-95 duration-200">
 <DropdownMenuItem
 onClick={() => handleViewDetails(variant)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-blue-500/10 focus:text-blue-500 transition-all cursor-pointer font-bold"
 >
 <Eye className="h-4 w-4"/>
 View Details
 </DropdownMenuItem>
 <DropdownMenuItem 
 onClick={() => handleEdit(variant)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-amber-500/10 focus:text-amber-500 transition-all cursor-pointer font-bold"
 >
 <Edit className="h-4 w-4"/>
 Edit
 </DropdownMenuItem>
 <DropdownMenuItem
 onClick={() => handleDeleteClick(variant)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 transition-all cursor-pointer font-bold text-rose-500"
 >
 <Trash2 className="h-4 w-4"/>
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
