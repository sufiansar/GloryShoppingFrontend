"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Star,
  Percent,
  ChevronLeft,
  Package,
  Building2,
  Folder,
  ZoomIn,
  Plus,
  Minus,
  Diamond,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product.interface";
import ProductCard from "./ProductCard";
import AddToCartButton from "../Cart/AddToCartButton";
import {
  IconBrand4chan,
  IconCategory,
  IconCertificate,
} from "@tabler/icons-react";

interface Variant {
  id?: string;
  images: string[];
  name?: string;
  color?: string;
  size?: string;
  sku?: string;
  price?: number;
  stock?: number;
}

interface ProductDetailsPageProps {
  product: Product;
  relatedProducts: Product[];
  variants?: Variant[];
}

export default function ProductDetailsPage({
  product,
  relatedProducts,
  variants = [],
}: ProductDetailsPageProps) {
  const router = useRouter();

  if (!product) {
    return <div>Product not found</div>;
  }

  const productVariants =
    variants.length > 0 ? variants : product?.variants || [];

  const allImages = [
    product?.thumbleImage,
    ...productVariants.flatMap((v) => v.images || []),
  ].filter(Boolean) as string[];

  const [selectedImage, setSelectedImage] = useState(allImages[0] || "");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    productVariants.length > 0 ? productVariants[0] : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews" | "faq"
  >("description");
  const [expandedSections, setExpandedSections] = useState<{
    description: boolean;
    specifications: boolean;
    ingredients: boolean;
    skinTypes: boolean;
    concerns: boolean;
    reviews: boolean;
    faq: boolean;
  }>({
    description: false,
    specifications: false,
    ingredients: false,
    skinTypes: false,
    concerns: false,
    reviews: false,
    faq: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const originalPrice =
    product?.price && product?.discount
      ? product?.price * (1 + product?.discount / 100)
      : product?.price || null;

  const displayPrice = selectedVariant?.price || product?.price || 0;

  const handleBuyNow = () => {
    const variantId = selectedVariant?.id || product?.variants?.[0]?.id;
    if (!variantId) {
      alert("Please select a variant");
      return;
    }
    router.push(
      `/checkout?type=DIRECT&variantId=${variantId}&quantity=${quantity}`,
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleQuantityChange = (change: number) => {
    const maxStock = selectedVariant?.stock || product.stock || 10;
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    if (variant.images && variant.images.length > 0) {
      setSelectedImage(variant.images[0]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur transition hover:-translate-x-1 hover:shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Button>

        {/* Quick stats strip */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-lg font-semibold">
                  {product?.averageRating || 4.5} / 5
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Delivery</p>
                <p className="text-lg font-semibold">Fast & Tracked</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">Guarantee</p>
                <p className="text-lg font-semibold">Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 mb-14">
          <div className="lg:col-span-1">
            <Card className="mb-4 overflow-hidden p-0">
              <CardContent className="p-0">
                <div
                  className="aspect-square relative bg-gray-50 group"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  {selectedImage ? (
                    <>
                      {/* Regular Image Display */}
                      <div
                        className={`w-full h-full ${isZoomed ? "opacity-0" : "opacity-100"} transition-opacity`}
                      >
                        <Image
                          src={selectedImage}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      </div>

                      {/* Zoomed Image Overlay (Desktop only) */}
                      {isZoomed && (
                        <div
                          className="absolute inset-0 bg-white hidden lg:block cursor-crosshair"
                          style={{
                            backgroundImage: `url(${selectedImage})`,
                            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                            backgroundSize: "250%",
                            backgroundRepeat: "no-repeat",
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-24 w-24 text-gray-400" />
                    </div>
                  )}

                  {/* Zoom Indicator */}
                  {selectedImage && (
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-2 rounded-lg hidden lg:flex items-center gap-2 group-hover:bg-black/80 transition-colors">
                      <ZoomIn className="h-4 w-4" />
                      <span className="text-sm">Hover to zoom</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Image Thumbnail Gallery */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-4">
                {allImages.map((img, index) => (
                  <Card
                    key={`${img}-${index}`}
                    className={`cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                      selectedImage === img
                        ? "ring-2 ring-primary shadow-md"
                        : "hover:ring-2 hover:ring-gray-300"
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square relative bg-gray-50">
                        <Image
                          src={img}
                          alt={`View ${index + 1}`}
                          fill
                          className="object-contain p-1"
                          sizes="100px"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Variant Size Options */}
            {productVariants.length > 0 && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Available Sizes:</p>
                  <div className="flex flex-wrap gap-2">
                    {productVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantSelect(variant)}
                        className={`px-4 py-2 border rounded-md text-sm transition-all ${
                          selectedVariant?.id === variant.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {variant.size}
                        {variant.stock !== undefined && variant.stock < 10 && (
                          <span className="ml-2 text-xs">
                            ({variant.stock} left)
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {product?.isNew && (
                <Badge className="bg-blue-600 hover:bg-blue-700">
                  New Arrival
                </Badge>
              )}
              {product?.isFeatured && (
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {product?.isTrending && (
                <Badge variant="secondary">Trending</Badge>
              )}
              {product?.isBestSeller && (
                <Badge variant="secondary">Best Seller</Badge>
              )}
              {product?.discount && product.discount > 0 && (
                <Badge variant="destructive">
                  <Percent className="h-3 w-3 mr-1" />
                  {product.discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* Product Name and SKU */}
              <div>
                <h1 className="text-5xl font-bold leading-tight mb-3">
                  {product?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="outline" className="font-mono bg-white/80">
                    SKU: {selectedVariant?.sku || product?.slug || product?.id}
                  </Badge>
                  <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">
                      {product?.averageRating || 4.5}
                    </span>
                    <span className="text-muted-foreground">
                      ({product?.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <Card className="border-none bg-linear-to-r from-primary/10 via-white to-primary/10 shadow-md">
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-4xl font-extrabold text-slate-900">
                      ৳{displayPrice?.toFixed(2) || "0.00"}
                    </span>
                    {originalPrice && originalPrice > displayPrice && (
                      <>
                        <span className="text-xl text-muted-foreground line-through">
                          ৳{originalPrice.toFixed(2)}
                        </span>
                        <Badge variant="destructive" className="text-xs px-3">
                          Save {product?.discount}%
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Inclusive of all taxes. Free returns within 30 days.
                  </p>
                </CardContent>
              </Card>

              {/* Category and Brand */}
              <div className="flex flex-wrap items-center gap-3">
                {product?.brand && (
                  <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm">
                    <IconBrand4chan className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {product.brand.name}
                    </span>
                  </div>
                )}
                {product?.category && (
                  <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm">
                    <IconCategory className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {product.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm">
                {(selectedVariant?.stock || product?.stock) === 0 ? (
                  <Badge variant="destructive" className="text-xs px-4 py-2">
                    Out of Stock
                  </Badge>
                ) : (selectedVariant?.stock || product?.stock || 0) < 10 ? (
                  <Badge variant="secondary" className="text-xs px-4 py-2">
                    Only {selectedVariant?.stock || product?.stock} left in
                    stock
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-xs px-4 py-2">
                    In Stock
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {selectedVariant?.stock || product?.stock || 0} units
                  available
                </span>
              </div>

              {/* Short Description */}
              {/* {product?.shortDesc && (
              <p className="text-lg text-muted-foreground">
                {product?.shortDesc}
              </p>
            )} */}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="rounded-full"
                  >
                    -
                  </Button>
                  <span className="w-14 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={
                      quantity >=
                      (selectedVariant?.stock || product?.stock || 10)
                    }
                    className="rounded-full"
                  >
                    +
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedVariant?.stock || product?.stock || 0} units
                  available
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <AddToCartButton
                  productId={product.id!}
                  quantity={quantity}
                  isOutOfStock={
                    (selectedVariant?.stock || product?.stock) === 0
                  }
                  className="flex-1 min-w-52 shadow-sm"
                />

                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1 min-w-52 shadow-sm"
                  onClick={handleBuyNow}
                  disabled={(selectedVariant?.stock || product?.stock) === 0}
                >
                  Buy Now
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>

                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Fastest Delivery</p>
                      <p className="text-xs text-muted-foreground">
                        Same-day in select cities
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Diamond className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">100% Authentic</p>
                      <p className="text-xs text-muted-foreground">
                        Factory sealed & verified
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <IconCertificate className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Certified Advisors</p>
                      <p className="text-xs text-muted-foreground">
                        Chat for personalized picks
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion Section */}
              <div className="space-y-2 mt-6">
                {/* Description Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection("description")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-left">Description</span>
                    {expandedSections.description ? (
                      <Minus className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {expandedSections.description && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-4 prose max-w-none">
                        {product?.shortDesc && (
                          <p className="text-muted-foreground mb-3">
                            {product.shortDesc}
                          </p>
                        )}
                        {product?.longDesc && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2">
                              Details
                            </h4>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                              {product.longDesc}
                            </p>
                          </div>
                        )}
                        {product?.description && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">
                              Additional Information
                            </h4>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        )}
                        {!product?.description && !product?.longDesc && (
                          <p className="text-sm text-muted-foreground">
                            No description available for this product.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Specifications Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection("specifications")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-left">
                      Specifications
                    </span>
                    {expandedSections.specifications ? (
                      <Minus className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {expandedSections.specifications && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-4 space-y-3">
                        {product?.brand && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-sm font-medium">Brand</span>
                            <span className="text-sm text-muted-foreground">
                              {product.brand.name}
                            </span>
                          </div>
                        )}
                        {product?.category && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-sm font-medium">
                              Category
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {product.category.name}
                            </span>
                          </div>
                        )}
                        {selectedVariant?.sku && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-sm font-medium">SKU</span>
                            <span className="text-sm text-muted-foreground">
                              {selectedVariant.sku}
                            </span>
                          </div>
                        )}
                        {(selectedVariant?.stock || product?.stock) && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-sm font-medium">
                              Availability
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {selectedVariant?.stock || product?.stock} in
                              stock
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ingredients Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection("ingredients")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-left">
                      Ingredients ({product?.ingredients?.length || 0})
                    </span>
                    {expandedSections.ingredients ? (
                      <Minus className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {expandedSections?.ingredients && (
                    <div className="px-4 pb-4 border-t">
                      {product?.ingredients &&
                      product?.ingredients?.length > 0 ? (
                        <div className="pt-4 space-y-4">
                          {product?.ingredients?.map((item, idx) => {
                            const ingredient = item?.ingredient;
                            if (!ingredient) return null;
                            return (
                              <div
                                key={idx}
                                className="border-b pb-4 last:border-b-0"
                              >
                                <h4 className="font-semibold text-sm mb-2">
                                  {ingredient?.name}
                                </h4>
                                {ingredient?.description && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {ingredient?.description}
                                  </p>
                                )}
                                {ingredient?.benefits && (
                                  <div className="mb-2">
                                    <p className="text-xs font-medium text-gray-600 mb-1">
                                      Benefits:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {ingredient?.benefits}
                                    </p>
                                  </div>
                                )}
                                {ingredient?.usage && (
                                  <div className="mb-2">
                                    <p className="text-xs font-medium text-gray-600 mb-1">
                                      Usage:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {ingredient?.usage}
                                    </p>
                                  </div>
                                )}
                                {ingredient?.sideEffects && (
                                  <div className="mb-2">
                                    <p className="text-xs font-medium text-red-600 mb-1">
                                      Side Effects:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {ingredient?.sideEffects}
                                    </p>
                                  </div>
                                )}
                                {ingredient?.precautions && (
                                  <div>
                                    <p className="text-xs font-medium text-orange-600 mb-1">
                                      Precautions:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {ingredient?.precautions}
                                    </p>
                                  </div>
                                )}
                                {ingredient?.safetyLevel && (
                                  <Badge
                                    variant="outline"
                                    className={`mt-2 ${
                                      ingredient?.safetyLevel === "SAFE"
                                        ? "border-green-500 text-green-700"
                                        : ingredient?.safetyLevel === "MODERATE"
                                          ? "border-orange-500 text-orange-700"
                                          : "border-red-500 text-red-700"
                                    }`}
                                  >
                                    {ingredient?.safetyLevel}
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground pt-4">
                          No ingredients information available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Skin Types Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection("skinTypes")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-left">
                      Suitable For Skin Types ({product?.skinTypes?.length || 0}
                      )
                    </span>
                    {expandedSections?.skinTypes ? (
                      <Minus className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {expandedSections?.skinTypes && (
                    <div className="px-4 pb-4 border-t">
                      {product?.skinTypes && product?.skinTypes?.length > 0 ? (
                        <div className="pt-4 flex flex-wrap gap-2">
                          {product?.skinTypes?.map((item, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="px-3 py-1.5"
                            >
                              {item?.skinType?.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground pt-4">
                          No skin type information available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Skin Concerns Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection("concerns")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-left">
                      Addresses Skin Concerns ({product?.concerns?.length || 0})
                    </span>
                    {expandedSections?.concerns ? (
                      <Minus className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {expandedSections?.concerns && (
                    <div className="px-4 pb-4 border-t">
                      {product?.concerns && product?.concerns?.length > 0 ? (
                        <div className="pt-4 space-y-3">
                          {product?.concerns?.map((item, idx) => (
                            <div
                              key={idx}
                              className="pb-3 border-b last:border-b-0"
                            >
                              <h4 className="font-semibold text-sm mb-1">
                                {item?.skinConcern?.name}
                              </h4>
                              {item?.skinConcern?.description && (
                                <p className="text-sm text-muted-foreground">
                                  {item?.skinConcern?.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground pt-4">
                          No skin concern information available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Reviews Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection("reviews")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-left">
                      Reviews ({product?.reviewCount || 0})
                    </span>
                    {expandedSections?.reviews ? (
                      <Minus className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {expandedSections?.reviews && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-5 w-5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {product?.reviewCount || 0} reviews
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No reviews yet. Be the first to review this product!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQ Accordion */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection("faq")}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-left">FAQ</span>
                    {expandedSections.faq ? (
                      <Minus className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  {expandedSections.faq && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">
                            How do I use this product?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Follow the instructions provided with the product
                            for best results.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">
                            What is the return policy?
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            We offer a 30-day return policy for unused products
                            in original packaging.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct?.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
