"use client";

import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
} from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from"@/components/ui/table";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";
import { Search, X, Check, Filter } from"lucide-react";
import { useState, useEffect } from"react";
import { useDebouncedCallback } from"use-debounce";
import { Product } from"@/types/product.interface";
import Pagination from"@/components/Shared/Pagination";
import { getAllProducts } from"@/action/product/product.action";

interface ProductSelectionDialogProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
 onSelect: (product: Product) => void;
}

export default function ProductSelectionDialog({
 open,
 onOpenChange,
 onSelect,
}: ProductSelectionDialogProps) {
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(false);
 const [searchTerm, setSearchTerm] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [totalItems, setTotalItems] = useState(0);
 const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 const [sortBy, setSortBy] = useState("name");
 const [sortOrder, setSortOrder] = useState("asc");
 const [statusFilter, setStatusFilter] = useState<string>("all");

 const fetchProducts = async () => {
 try {
 setLoading(true);

 const queryParams = new URLSearchParams({
 page: currentPage.toString(),
 limit:"10",
 sortBy,
 sortOrder,
 ...(searchTerm && { searchTerm }),
 ...(statusFilter !=="all"&& { status: statusFilter }),
 }).toString();

 const result = await getAllProducts(queryParams);

 setProducts(result.data || []);
 setTotalPages(result.meta?.totalPages || 1);
 setTotalItems(result.meta?.total || 0);
 } catch (error) {
 console.error("Error fetching products:", error);
 setProducts([]);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 if (open) {
 fetchProducts();
 }
 }, [open, currentPage, searchTerm, sortBy, sortOrder, statusFilter]);

 const handleSearch = useDebouncedCallback((term: string) => {
 setSearchTerm(term);
 setCurrentPage(1);
 }, 500);

 const handlePageChange = (page: number) => {
 setCurrentPage(page);
 };

 const handleSelect = () => {
 if (selectedProduct) {
 onSelect(selectedProduct);
 onOpenChange(false);
 setSelectedProduct(null);
 // Reset filters when dialog closes
 setSearchTerm("");
 setSortBy("name");
 setSortOrder("asc");
 setStatusFilter("all");
 }
 };

 const handleSortChange = (value: string) => {
 setSortBy(value);
 setCurrentPage(1);
 };

 const handleSortOrderChange = (value: string) => {
 setSortOrder(value);
 setCurrentPage(1);
 };

 const handleStatusFilterChange = (value: string) => {
 setStatusFilter(value);
 setCurrentPage(1);
 };

 const handleClearFilters = () => {
 setSearchTerm("");
 setSortBy("name");
 setSortOrder("asc");
 setStatusFilter("all");
 setCurrentPage(1);
 };

 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
 <DialogHeader>
 <DialogTitle>Select a Product</DialogTitle>
 <DialogDescription>
 Choose a product to create variant for
 </DialogDescription>
 </DialogHeader>

 <div className="flex-1 overflow-hidden flex flex-col">
 {/* Search and Filter Controls */}
 <div className="mb-4 space-y-4">
 {/* Search Bar */}
 <div className="relative">
 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
 <Input
 placeholder="Search products by name..."
 value={searchTerm}
 onChange={(e) => {
 const value = e.target.value;
 setSearchTerm(value);
 handleSearch(value);
 }}
 className="pl-10"
 />
 {searchTerm && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
 onClick={() => {
 setSearchTerm("");
 handleSearch("");
 }}
 >
 <X className="h-3 w-3"/>
 </Button>
 )}
 </div>

 {/* Filter Controls */}
 <div className="flex flex-wrap items-center gap-3">
 <div className="flex items-center gap-2">
 <Filter className="h-4 w-4 text-muted-foreground"/>
 <span className="text-sm text-muted-foreground">Filters:</span>
 </div>

 {/* Sort By */}
 <div className="flex items-center gap-2">
 <span className="text-sm">Sort by:</span>
 <Select value={sortBy} onValueChange={handleSortChange}>
 <SelectTrigger className="w-35">
 <SelectValue placeholder="Sort by"/>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="name">Name</SelectItem>
 <SelectItem value="createdAt">Date Created</SelectItem>
 <SelectItem value="price">Price</SelectItem>
 </SelectContent>
 </Select>
 </div>

 {/* Sort Order */}
 <div className="flex items-center gap-2">
 <span className="text-sm">Order:</span>
 <Select value={sortOrder} onValueChange={handleSortOrderChange}>
 <SelectTrigger className="w-25">
 <SelectValue placeholder="Order"/>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="asc">Ascending</SelectItem>
 <SelectItem value="desc">Descending</SelectItem>
 </SelectContent>
 </Select>
 </div>

 {/* Status Filter */}
 <div className="flex items-center gap-2">
 <span className="text-sm">Status:</span>
 <Select
 value={statusFilter}
 onValueChange={handleStatusFilterChange}
 >
 <SelectTrigger className="w-30">
 <SelectValue placeholder="Status"/>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">All Status</SelectItem>
 <SelectItem value="active">Active</SelectItem>
 <SelectItem value="inactive">Inactive</SelectItem>
 </SelectContent>
 </Select>
 </div>

 {/* Clear Filters Button */}
 {(searchTerm ||
 sortBy !=="name"||
 sortOrder !=="asc"||
 statusFilter !=="all") && (
 <Button
 variant="ghost"
 size="sm"
 onClick={handleClearFilters}
 className="text-muted-foreground hover:text-foreground"
 >
 <X className="mr-1 h-3 w-3"/>
 Clear Filters
 </Button>
 )}
 </div>
 </div>

 {/* Products Table */}
 <div className="border rounded-lg flex-1 overflow-auto">
 <Table>
 <TableHeader className="sticky top-0 bg-background">
 <TableRow>
 <TableHead className="w-12"></TableHead>
 <TableHead>Name</TableHead>
 <TableHead>SKU</TableHead>
 <TableHead>Price</TableHead>
 <TableHead>Category</TableHead>
 <TableHead>Status</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {loading ? (
 <TableRow>
 <TableCell colSpan={6} className="text-center py-8">
 Loading...
 </TableCell>
 </TableRow>
 ) : products.length === 0 ? (
 <TableRow>
 <TableCell colSpan={6} className="text-center py-8">
 {searchTerm || statusFilter !=="all"
 ?"No products found matching your criteria"
 :"No products available"}
 </TableCell>
 </TableRow>
 ) : (
 products.map((product) => (
 <TableRow
 key={product.id}
 className={`cursor-pointer hover:bg-accent ${
 selectedProduct?.id === product.id ?"bg-accent":""
 }`}
 onClick={() => setSelectedProduct(product)}
 >
 <TableCell>
 {selectedProduct?.id === product.id ? (
 <Check className="h-4 w-4 text-primary"/>
 ) : (
 <div className="h-4 w-4 rounded-full border"/>
 )}
 </TableCell>
 <TableCell className="font-medium">
 {product.name}
 </TableCell>
 <TableCell className="font-mono text-sm">
 {product.slug ||"—"}
 </TableCell>
 <TableCell>
 ${product.price?.toFixed(2) ||"0.00"}
 </TableCell>
 <TableCell>{product?.category?.name ||"—"}</TableCell>
 <TableCell>
 <span
 className={`inline-block px-2 py-1 text-xs rounded-full ${
 product.isActive
 ?"bg-green-100 text-green-800"
 :"bg-gray-100 text-gray-800"
 }`}
 >
 {product.isActive ?"Active":"Inactive"}
 </span>
 </TableCell>
 </TableRow>
 ))
 )}
 </TableBody>
 </Table>
 </div>

 {/* Pagination */}
 {totalPages > 0 && (
 <div className="mt-4">
 <Pagination
 currentPage={currentPage}
 totalPages={totalPages}
 totalItems={totalItems}
 itemsPerPage={10}
 showPageNumbers={false}
 showTotalItems={false}
 onPageChange={handlePageChange}
 />
 </div>
 )}
 </div>

 {/* Footer Actions */}
 <div className="flex justify-between items-center pt-4 border-t">
 <div className="text-sm text-muted-foreground">
 {selectedProduct ? (
 <>
 Selected:{""}
 <span className="font-medium">{selectedProduct.name}</span>
 <span className="ml-2 text-xs">
 (${selectedProduct.price?.toFixed(2) ||"0.00"})
 </span>
 </>
 ) : (
"No product selected"
 )}
 </div>
 <div className="flex gap-2">
 <Button
 variant="outline"
 onClick={() => {
 onOpenChange(false);
 setSelectedProduct(null);
 handleClearFilters();
 }}
 >
 Cancel
 </Button>
 <Button onClick={handleSelect} disabled={!selectedProduct}>
 Select Product
 </Button>
 </div>
 </div>
 </DialogContent>
 </Dialog>
 );
}
