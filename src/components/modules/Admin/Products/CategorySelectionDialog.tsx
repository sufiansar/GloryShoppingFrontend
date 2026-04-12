// components/admin/products/CategorySelectionDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, X, Check, Folder, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Badge } from "@/components/ui/badge";
import { fetchAllCategories } from "@/action/categories/categories.action";
import Pagination from "@/components/Shared/Pagination";

interface Category {
  id: string;
  name: string;
  description?: string;
  isVisible?: boolean;
  products?: { id: string }[];
}

interface CategorySelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (category: Category) => void;
}

export default function CategorySelectionDialog({
  open,
  onOpenChange,
  onSelect,
}: CategorySelectionDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const fetchCategories = async (params?: Record<string, string>) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { searchTerm }),
        ...params,
      }).toString();

      const result = await fetchAllCategories(queryParams);

      setCategories(result.data || []);
      setTotalPages(result.meta?.totalPages || 1);
      setTotalItems(result.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, currentPage, searchTerm]);

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, 500);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelect = () => {
    if (selectedCategory) {
      onSelect(selectedCategory);
      onOpenChange(false);
      setSelectedCategory(null);
      setSearchTerm("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select a Category</DialogTitle>
          <DialogDescription>
            Choose a category for your product
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories by name..."
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
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Categories Table */}
          <div className="border rounded-lg flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchTerm
                        ? "No categories found matching your search"
                        : "No categories available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow
                      key={category.id}
                      className={`cursor-pointer hover:bg-accent ${
                        selectedCategory?.id === category.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <TableCell>
                        {selectedCategory?.id === category.id ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {category.description || "No description"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {category.products?.length || 0} products
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isVisible ? "default" : "secondary"}
                          className={
                            category.isVisible
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {category.isVisible ? "Visible" : "Hidden"}
                        </Badge>
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
            {selectedCategory && (
              <>
                Selected:{" "}
                <span className="font-medium">{selectedCategory.name}</span>
                <span className="ml-2 text-xs">
                  ({selectedCategory.products?.length || 0} products)
                </span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedCategory(null);
                setSearchTerm("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedCategory}>
              Select Category
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
