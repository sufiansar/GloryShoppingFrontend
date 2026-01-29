"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAllSkinConcerns } from "@/action/skinConcerns/skinConcern.action";
import { getAllSkinType } from "@/action/skinType/skin.action";
import { getAllProducts } from "@/action/product/product.action";
import { addToProducts } from "@/action/skinConcerns/skinConcern.action";

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  thumbleImage?: string;
}

export default function AddProductsPage() {
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  const [skinConcerns, setSkinConcerns] = useState<any[]>([]);
  const [skinTypes, setSkinTypes] = useState<any[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [selectedSkinConcern, setSelectedSkinConcern] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchData = async () => {
    try {
      setFetchingProducts(true);

      const [concernsRes, typesRes, productsRes] = (await Promise.all([
        getAllSkinConcerns("?page=1&limit=100"),
        getAllSkinType("?page=1&limit=100"),
        getAllProducts("?page=1&limit=50"),
      ])) as any[];
      console.log(productsRes);
      setSkinConcerns(concernsRes?.data || []);
      setSkinTypes(typesRes?.data || []);

      const productList = productsRes?.data || [];
      setProducts(productList);
      setFilteredProducts(productList);
      setTotalPages(productsRes?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setFetchingProducts(false);
    }
  };

  const fetchMoreProducts = async (page: number) => {
    try {
      const res = await getAllProducts(`?page=${page}&limit=50`);
      console.log("Get Skin Prodict", res);
      const newProducts = res?.data || [];

      setProducts((prev) => [...prev, ...newProducts]);
      setFilteredProducts((prev) => [...prev, ...newProducts]);
      setCurrentPage(page);
    } catch (error) {
      console.error("Load more failed:", error);
    }
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p !== id));
  };

  const getSelectedProducts = () =>
    selectedProducts
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];

  const formatPrice = (price?: number) =>
    price
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price)
      : "";

  const handleSubmit = async () => {
    if (!selectedSkinConcern || !selectedSkinType || !selectedProducts.length) {
      alert("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      await addToProducts(
        selectedSkinConcern,
        selectedSkinType,
        selectedProducts,
      );

      setSuccess(true);

      setTimeout(() => {
        setSelectedSkinConcern("");
        setSelectedSkinType("");
        setSelectedProducts([]);
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <Link href="/admin/dashboard/skin-management">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Skin Management
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Add Products to Skin Concern
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {success && (
            <div className="flex items-center rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
              <span className="text-green-800">
                Products added successfully
              </span>
            </div>
          )}

          {/* Skin Concern & Type */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label>Skin Concern *</Label>
              <Select
                value={selectedSkinConcern}
                onValueChange={setSelectedSkinConcern}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select concern" />
                </SelectTrigger>
                <SelectContent>
                  {skinConcerns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Skin Type *</Label>
              <Select
                value={selectedSkinType}
                onValueChange={setSelectedSkinType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {skinTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Products</Label>
              <div className="flex flex-wrap gap-2">
                {getSelectedProducts().map((product) => (
                  <Badge key={product.id} variant="secondary">
                    {product.name}
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Products *</Label>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {fetchingProducts ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      className={`cursor-pointer transition ${
                        selectedProducts.includes(product.id)
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{product.name}</h4>

                        {product.price && (
                          <p className="text-sm text-green-600">
                            {formatPrice(product.price)}
                          </p>
                        )}

                        {product.description && (
                          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                            {product.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {currentPage < totalPages && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => fetchMoreProducts(currentPage + 1)}
                    >
                      Load More Products
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Submit */}
          <div className="border-t pt-6">
            <Button
              size="lg"
              className="w-full md:w-auto"
              disabled={
                loading ||
                !selectedSkinConcern ||
                !selectedSkinType ||
                !selectedProducts.length
              }
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add ${selectedProducts.length} Product(s)`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
