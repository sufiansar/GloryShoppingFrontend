"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Star, Percent } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/product.interface";
import AddToCartButton from "../Cart/AddToCartButton";

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

export default function ProductCard({
  product,
  showActions = true,
}: ProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const originalPrice =
    product.price && product.discount
      ? product.price * (1 + product.discount / 100)
      : product.price;

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    console.log("Wishlisted:", product.id);
  };

  return (
    <div 
      className="block h-full cursor-pointer"
      onClick={() => router.push(`/product/${product.slug || product.id}`)}
    >
      <Card
        className="group transition-all duration-300 hover:shadow-lg overflow-hidden border border-gray-200 rounded-lg bg-white p-0 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          {product.thumbleImage ? (
            <Image
              src={product.thumbleImage}
              alt={product.name}
              width={350}
              height={350}
              className={`w-full h-full object-contain p-2 transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"
                }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              No Image
            </div>
          )}

          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
              <Percent className="h-3 w-3" />
              {product.discount}%
            </div>
          )}
        </div>

        <CardContent className="p-2 sm:p-2.5 flex flex-col flex-1 space-y-1 sm:space-y-1.5">
          <div className="grow space-y-1">
            <div className="flex items-center gap-1 flex-wrap">
              {product?.brand?.country && (
                <Badge className="text-xs font-normal bg-pink-100 text-pink-700 border-pink-200 px-1 py-0">
                  {product.brand.logoUrl && (
                    <Image
                      src={product.brand.logoUrl}
                      alt={product.brand.name}
                      width={12}
                      height={12}
                      className="inline-block mr-1 rounded-full"
                    />
                  )}
                  {product.brand.country}
                </Badge>
              )}
              {product?.category?.name && (
                <Badge className="text-xs font-normal bg-pink-100 text-pink-700 border-pink-200 px-1 py-0">
                  {product.category.name}
                </Badge>
              )}

              {product?.skinTypes?.[0]?.skinType?.name && (
                <Badge className="text-xs font-normal bg-pink-100 text-pink-600 border-pink-200 px-1 py-0">
                  {product?.skinTypes[0]?.skinType?.name}
                </Badge>
              )}
            </div>

            <h3
              className="font-semibold text-[13px] md:text-sm leading-tight text-gray-900 hover:text-pink-600 transition-colors line-clamp-2 min-h-[2.5rem]"
              title={product.name}
            >
              {product.name}
            </h3>

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

              <div className="flex items-center gap-0.5">
                <div className="flex items-center gap-0.5 bg-pink-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                  <Star className="h-2.5 w-2.5 fill-white" />
                  <span>
                    {product?.reviews && product.reviews.length > 0
                      ? (
                        product.reviews.reduce(
                          (sum, r) => sum + r.rating,
                          0,
                        ) / product.reviews.length
                      ).toFixed(1)
                      : "0"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({product?.reviewCount || 0})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            {product.id && (
              <AddToCartButton
                productId={product.id}
                variantId={product.variants?.[0]?.id}
                quantity={1}
                isOutOfStock={product.stock === 0}
                className="w-full mt-1.5 text-[11px] md:text-xs py-1.5 md:py-2 px-2"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
