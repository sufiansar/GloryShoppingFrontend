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
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2 max-w-6xl mx-auto">
      <Link href="/admin/dashboard/skin-management">
        <Button variant="ghost" className="mb-2 rounded-2xl h-12 px-6 hover:bg-white/40 dark:hover:bg-slate-800/40 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-all">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Skin Management
        </Button>
      </Link>

      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col p-8 lg:p-12">
        <div className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Add Products to Skin Concern
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            Configure product recommendations for specific skin profiles
          </p>
        </div>

        <div className="space-y-10">
          {success && (
            <div className="flex items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 shadow-sm animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="mr-3 h-6 w-6 text-emerald-600 font-black" />
              <span className="text-[12px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Products added successfully
              </span>
            </div>
          )}

          {/* Skin Concern & Type */}
          <div className="grid gap-8 md:grid-cols-2 p-8 rounded-[2rem] bg-white/20 dark:bg-slate-800/20 border border-white/40 dark:border-slate-800/50 shadow-inner">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Skin Concern *</Label>
              <Select
                value={selectedSkinConcern}
                onValueChange={setSelectedSkinConcern}
              >
                <SelectTrigger className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/40 dark:border-slate-700/50 rounded-2xl shadow-sm focus:ring-primary-custom/30 font-bold transition-all duration-300">
                  <SelectValue placeholder="Select concern" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
                  {skinConcerns.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="rounded-xl font-bold py-3 cursor-pointer focus:bg-primary-custom/10 focus:text-primary-custom">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Skin Type *</Label>
              <Select
                value={selectedSkinType}
                onValueChange={setSelectedSkinType}
              >
                <SelectTrigger className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/40 dark:border-slate-700/50 rounded-2xl shadow-sm focus:ring-primary-custom/30 font-bold transition-all duration-300">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
                  {skinTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="rounded-xl font-bold py-3 cursor-pointer focus:bg-primary-custom/10 focus:text-primary-custom">
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="space-y-4 p-8 rounded-[2rem] bg-primary-custom/5 border border-primary-custom/10 shadow-inner">
              <Label className="text-[12px] font-black uppercase tracking-widest text-primary-custom">Selected Products ({selectedProducts.length})</Label>
              <div className="flex flex-wrap gap-3">
                {getSelectedProducts().map((product) => (
                  <Badge key={product.id} className="bg-white dark:bg-slate-800 hover:bg-white/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all group">
                    {product.name}
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="ml-3 h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-rose-500/10 group-hover:text-rose-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Label className="text-[12px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Select Products *</Label>
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-custom transition-colors" />
                <Input
                  className="pl-11 h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/40 dark:border-slate-700/50 rounded-2xl shadow-sm focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                  placeholder="Search globally..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {fetchingProducts ? (
              <div className="flex flex-col items-center justify-center py-20">
                 <div className="animate-spin rounded-full h-14 w-14 border-[4px] border-primary-custom/20 border-t-primary-custom"></div>
                 <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Loading directory...</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      className={`relative overflow-hidden cursor-pointer rounded-[2rem] border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        selectedProducts.includes(product.id)
                          ? "border-primary-custom bg-primary-custom/5 shadow-primary-custom/10"
                          : "border-white/40 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 shadow-sm"
                      }`}
                    >
                      {selectedProducts.includes(product.id) && (
                        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary-custom text-white flex items-center justify-center shadow-md animate-in zoom-in-50">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 pr-8">{product.name}</h4>

                        {product.price && (
                          <p className="mt-2 text-xs font-black text-primary-custom bg-primary-custom/10 px-2.5 py-1 rounded-lg w-fit">
                            {formatPrice(product.price)}
                          </p>
                        )}

                        {product.description && (
                          <p className="mt-3 line-clamp-2 text-[11px] font-medium text-slate-500">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {currentPage < totalPages && (
                  <div className="flex justify-center pt-8">
                    <Button
                      variant="outline"
                      className="rounded-2xl h-12 px-8 border-slate-200/50 bg-white/40 dark:bg-slate-800/40 hover:bg-white text-[10px] font-black uppercase tracking-widest shadow-sm transition-all"
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
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-8 mt-10">
            <Button
              className="w-full md:w-auto rounded-2xl h-14 px-10 bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[12px] shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none"
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
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Adding Products...
                </>
              ) : (
                `Confirm & Add ${selectedProducts.length} Product(s)`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
