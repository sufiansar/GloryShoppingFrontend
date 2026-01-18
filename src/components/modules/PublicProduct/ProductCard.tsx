"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, Percent } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/product.interface";

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

export default function ProductCard({
  product,
  showActions = true,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const originalPrice =
    product.price && product.discount
      ? product.price * (1 + product.discount / 100)
      : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Added to cart:", product.id);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    console.log("Wishlisted:", product.id);
  };

  return (
    <Link href={`/product/${product.slug || product.id}`} className="block">
      <Card
        className="group transition-all duration-300 hover:shadow-lg group overflow-hidden border border-gray-200 rounded-lg bg-white cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Container */}
        <div className="relative w-full aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          {product.thumbleImage ? (
            <Image
              src={product.thumbleImage}
              alt={product.name}
              width={350}
              height={350}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              No Image
            </div>
          )}

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
              <Percent className="h-3 w-3" />
              {product.discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="p-2.5 flex flex-col h-full space-y-1.5">
          <div className="grow space-y-1">
            {/* Brand and Category */}
            <div className="flex items-center gap-1 flex-wrap">
              {product?.brand?.country && (
                <Badge className="text-xs font-normal bg-pink-100 text-pink-700 border-pink-200 px-1 py-0">
                  {product.brand.country}
                </Badge>
              )}
              {product?.category?.name && (
                <Badge className="text-xs font-normal bg-pink-100 text-pink-700 border-pink-200 px-1 py-0">
                  {product.category.name}
                </Badge>
              )}
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-gray-900 hover:text-pink-600 transition-colors">
              {product.name}
            </h3>

            {/* Price and Rating */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-pink-600">
                  ৳{product.price?.toFixed(0) || "0"}
                </span>
                {originalPrice && originalPrice > (product.price || 0) && (
                  <span className="text-xs text-gray-400 line-through">
                    ৳{originalPrice.toFixed(0)}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-0.5">
                <div className="flex items-center gap-0.5 bg-pink-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                  <Star className="h-2.5 w-2.5 fill-white" />
                  <span>
                    {product?.reviews && product.reviews.length > 0
                      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
                      : "0"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({product?.reviewCount || 0})
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full mt-1.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs py-1.5 px-2 rounded transition-colors"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
