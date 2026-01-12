// components/product/product-card.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Star,
  ShoppingCart,
  Heart,
  Zap,
  Award,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Product } from "@/types/product.interface";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productName: string) => void;
  onAddToWishlist?: (productName: string) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  className = "",
}) => {
  const discountPercentage = product.discount
    ? Math.round((product.discount / product.price) * 100)
    : 0;

  const finalPrice = product.discount
    ? product.price - product.discount
    : product.price;

  const isOutOfStock = product.stock <= 0;

  return (
    <TooltipProvider>
      <Card
        className={`group relative overflow-hidden transition-all duration-300 
        hover:shadow-lg hover:-translate-y-1 ${
          isOutOfStock ? "opacity-70" : ""
        } ${className}`}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
          <Link
            href={`/product/${
              product.slug || encodeURIComponent(product.name)
            }`}
          >
            <Image
              src={product.thumbleImage || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>

          {/* Status Badges */}
          <div className="absolute top-3 left-3 space-y-1">
            {product.isNew && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 text-xs">
                <Zap className="h-3 w-3 mr-1" />
                New
              </Badge>
            )}

            {product.isBestSeller && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-0.5 text-xs">
                <Award className="h-3 w-3 mr-1" />
                Bestseller
              </Badge>
            )}

            {discountPercentage > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 text-xs">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm shadow-sm hover:bg-white"
                  onClick={() => onAddToWishlist?.(product.name)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save for later</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/product/${
                    product.slug || encodeURIComponent(product.name)
                  }`}
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm shadow-sm hover:bg-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quick view</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Stock Status */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center">
              <Badge variant="destructive" className="px-4 py-2 font-semibold">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Brand & Category */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {product.brandName}
            </span>
            <Badge variant="outline" className="text-xs px-2 py-0">
              {product.categoryName}
            </Badge>
          </div>

          {/* Product Name */}
          <Link
            href={`/product/${
              product.slug || encodeURIComponent(product.name)
            }`}
          >
            <h3
              className="font-medium text-gray-900 line-clamp-2 min-h-12 
              hover:text-primary transition-colors group-hover:underline"
            >
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${finalPrice.toFixed(2)}
            </span>

            {product.discount && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => onAddToCart?.(product.name)}
            disabled={isOutOfStock}
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ProductCard;
