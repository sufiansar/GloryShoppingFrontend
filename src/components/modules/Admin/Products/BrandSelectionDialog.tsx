// components/admin/products/BrandSelectionDialog.tsx
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
import { Search, X, Check, Building2, Flag } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { getAllBrand } from "@/action/brand/brand.action";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/Shared/Pagination";

interface Brand {
  id: string;
  name: string;
  country?: string;
  logoUrl?: string;
}

interface BrandSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (brand: Brand) => void;
}

export default function BrandSelectionDialog({
  open,
  onOpenChange,
  onSelect,
}: BrandSelectionDialogProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const fetchBrands = async (params?: Record<string, string>) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { searchTerm }),
        ...params,
      }).toString();

      const result = await getAllBrand(queryParams);

      setBrands(result.data || []);
      setTotalPages(result.meta?.totalPages || 1);
      setTotalItems(result.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBrands();
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
    if (selectedBrand) {
      onSelect(selectedBrand);
      onOpenChange(false);
      setSelectedBrand(null);
      setSearchTerm("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select a Brand</DialogTitle>
          <DialogDescription>Choose a brand for your product</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search brands by name..."
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

          {/* Brands Table */}
          <div className="border rounded-lg flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Products</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : brands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchTerm
                        ? "No brands found matching your search"
                        : "No brands available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  brands.map((brand) => (
                    <TableRow
                      key={brand.id}
                      className={`cursor-pointer hover:bg-accent ${
                        selectedBrand?.id === brand.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedBrand(brand)}
                    >
                      <TableCell>
                        {selectedBrand?.id === brand.id ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border" />
                        )}
                      </TableCell>
                      <TableCell>
                        {brand.logoUrl ? (
                          <div className="relative w-10 h-10">
                            <img
                              src={brand.logoUrl}
                              alt={brand.name}
                              className="object-contain w-full h-full rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {brand.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <span>{brand.country || "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {/* You can add product count here if available */}—
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
            {selectedBrand && (
              <>
                Selected:{" "}
                <span className="font-medium">{selectedBrand.name}</span>
                {selectedBrand.country && (
                  <span className="ml-2 text-xs">
                    ({selectedBrand.country})
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedBrand(null);
                setSearchTerm("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedBrand}>
              Select Brand
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
