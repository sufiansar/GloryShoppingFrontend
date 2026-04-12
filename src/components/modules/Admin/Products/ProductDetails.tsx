"use client";

import Image from "next/image";
import {
  Package,
  Tag,
  DollarSign,
  Percent,
  Box,
  FileText,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Building2,
  Folder,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Product } from "@/types/product.interface";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const originalPrice =
    product.price && product.discount
      ? product.price * (1 + product.discount / 100)
      : product.price;

  return (
    <div className="space-y-8 pb-10">
      {/* Header with Image and Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Product Image Section */}
        <div className="lg:col-span-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex flex-col items-center justify-start space-y-6">
          <div className="w-full aspect-square relative rounded-[2rem] overflow-hidden border-[6px] border-white/60 dark:border-slate-800/60 shadow-xl">
            {product.thumbleImage ? (
              <Image
                src={product.thumbleImage}
                alt={product.name}
                fill
                className="object-cover bg-slate-50 dark:bg-slate-900 transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-slate-100/50 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-4">
                <Package className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Image Available</p>
              </div>
            )}
          </div>

          {/* Flags Badges Wrapper */}
          <div className="flex flex-wrap gap-2 justify-center w-full bg-white/30 dark:bg-slate-800/30 p-4 rounded-[1.5rem] border border-white/40 dark:border-slate-700/50">
            {product.isActive ? (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-full border border-rose-500/20">
                <XCircle className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Inactive</span>
              </div>
            )}

            {product.isNew && (
              <span className="bg-primary-custom/10 text-primary-custom px-3 py-1.5 rounded-full border border-primary-custom/20 text-[10px] font-black uppercase tracking-widest">
                New
              </span>
            )}
            
            {product.isFeatured && (
              <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20">
                <Star className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Featured</span>
              </div>
            )}
            
            {product.isTrending && (
              <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/20">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Trending</span>
              </div>
            )}
            
            {product.isBestSeller && (
              <div className="flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-full border border-purple-500/20">
                <Award className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Best Seller</span>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Identity */}
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary-custom" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-custom bg-primary-custom/10 px-3 py-1 rounded-xl">
                {product.slug || "N/A"}
              </span>
            </div>
          </div>

          {/* Core Attr Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Brand & Category */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
              <div className="flex flex-col gap-2 p-5 bg-white/40 dark:bg-slate-800/40 rounded-[1.5rem] border border-white/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Building2 className="h-4 w-4 text-indigo-500" />
                  <span>Brand</span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                  {product.brand?.name || product.brandName || "Unassigned"}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-5 bg-white/40 dark:bg-slate-800/40 rounded-[1.5rem] border border-white/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Folder className="h-4 w-4 text-emerald-500" />
                  <span>Category</span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                  {product.category?.name || product.categoryName || "Unassigned"}
                </p>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
              <div className="flex flex-col gap-2 p-5 bg-white/40 dark:bg-slate-800/40 rounded-[1.5rem] border border-white/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span>Price</span>
                  </div>
                  {product.discount && product.discount > 0 && (
                    <span className="flex items-center gap-1 text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg">
                      <Percent className="h-3 w-3" /> {product.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    ${product.price?.toFixed(2) || "0.00"}
                  </span>
                  {product.discount && product.discount > 0 && (
                    <span className="text-lg font-bold text-slate-400 line-through">
                      ${originalPrice?.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 p-5 bg-white/40 dark:bg-slate-800/40 rounded-[1.5rem] border border-white/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Box className="h-4 w-4 text-blue-500" />
                    <span>Stock Status</span>
                  </div>
                </div>
                <div>
                  <span className={clsx(
                    "text-xl font-black px-4 py-1.5 rounded-xl border",
                    product.stock === 0
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      : product.stock && product.stock < 10
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  )}>
                    {product.stock || 0} Units
                  </span>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Footer Metadata */}
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-[2rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex items-center gap-3">
            <Calendar className="h-4 w-4 text-slate-400" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Created: <span className="text-slate-800 dark:text-slate-200 ml-1">
                {product?.createdAt ? new Date(product.createdAt).toLocaleString() : "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Description and Details */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-8">
        
        {/* Short Description */}
        {product.shortDesc && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-primary-custom/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-custom" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Short Description</h2>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-[1.5rem] border border-white/40">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.shortDesc}
              </p>
            </div>
          </div>
        )}

        {/* Detailed Descriptions (if length differs or simply show description) */}
        {product.description && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-primary-custom/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-custom" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Full Details</h2>
            </div>
            <div className="p-8 bg-white/50 dark:bg-slate-800/50 rounded-[2rem] border border-white/40">
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm font-medium">
                <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Utility to handle class merging inside the component since we aren't importing clsx by default in some setups.
// But wait, the standard for this project uses `cn` or `clsx`. I will quickly define a generic fallback to ensure it builds correctly.
function clsx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
