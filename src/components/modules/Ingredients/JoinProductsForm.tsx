"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Check,
  X,
  Loader2,
  Package,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllProducts } from "@/action/product/product.action";
import { joinIngredientsToProduct } from "@/action/ingredian/ingrediant.action";
import { IIngredient } from "@/types/ingrediant.interface";

interface IProduct {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  stock?: number;
}

interface PaginatedResponse {
  data: IProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface JoinProductsFormProps {
  ingredients: IIngredient[];
}

export default function JoinProductsForm({
  ingredients,
}: JoinProductsFormProps) {
  const router = useRouter();

  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryString = new URLSearchParams({
          page: pagination?.currentPage?.toString(),
          limit: "10",
          ...(searchTerm && { searchTerm }),
        }).toString();

        const result: PaginatedResponse = await getAllProducts(queryString);

        if (result?.data) {
          setProducts(result.data);
          setPagination(result.pagination);
        }
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, pagination?.currentPage]);

  const filteredProducts = products;

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleSubmit = async () => {
    if (!selectedIngredient) {
      toast.error("Please select an ingredient");
      return;
    }

    if (!selectedProducts.length) {
      toast.error("Select at least one product");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("📝 [handleSubmit] Starting join with:", {
        selectedIngredient,
        selectedProducts,
      });

      for (const productId of selectedProducts) {
        console.log(
          `📝 [handleSubmit] Joining product ${productId} with ingredient ${selectedIngredient}`,
        );
        await joinIngredientsToProduct(selectedIngredient, productId);
      }

      toast.success("Ingredient joined successfully");
      router.push("/admin/dashboard/ingredients");
      router.refresh();
    } catch (error) {
      console.error("❌ [handleSubmit] Error:", error);
      toast.error("Failed to join ingredient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4 flex items-center gap-3">
        <Package className="h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="font-semibold">Select Ingredient</h3>
          <p className="text-sm text-muted-foreground">
            Choose an ingredient to join with products
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ingredient</label>
        <Select
          value={selectedIngredient}
          onValueChange={setSelectedIngredient}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an ingredient..." />
          </SelectTrigger>
          <SelectContent>
            {ingredients.map((ingredient) => (
              <SelectItem key={ingredient.id} value={ingredient.id || ""}>
                {ingredient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product?.id)}
                      onCheckedChange={() => handleProductToggle(product?.id)}
                    />
                  </TableCell>
                  <TableCell>{product?.name}</TableCell>
                  {/* <TableCell>{product?.category || "-"}</TableCell> */}
                  <TableCell>{product?.stock ?? 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
