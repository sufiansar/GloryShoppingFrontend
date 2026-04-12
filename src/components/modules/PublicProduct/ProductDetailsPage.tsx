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
  Sparkles,
  CheckCircle2,
  Award,
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
import { ReviewForm } from "../Review/CreateReview";

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

interface ReviewItem {
  id?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  user?: {
    name?: string;
    fullName?: string;
    email?: string;
  };
  userId?: string;
}

interface ProductDetailsPageProps {
  product: Product;
  relatedProducts: Product[];
  variants?: Variant[];
  reviews?: ReviewItem[];
}

export default function ProductDetailsPage({
  product,
  relatedProducts,
  variants = [],
  reviews = [],
}: ProductDetailsPageProps) {
  const router = useRouter();

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
    createReview: boolean;
    faq: boolean;
  }>({
    description: false,
    specifications: false,
    ingredients: false,
    skinTypes: false,
    concerns: false,
    reviews: false,
    createReview: false,
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

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50/30 via-white to-pink-50/30">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Back Button - Enhanced */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-8 group inline-flex items-center gap-2 rounded-xl border border-rose-200/60 bg-white/90 px-5 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-[oklch(52.801%_0.15987_344.323)]"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Products</span>
        </Button>

        {/* Enhanced Quick Stats Strip */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-10">
          <div className="group rounded-2xl border border-rose-100/80 bg-white p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-50 p-3 border border-amber-100">
                <Star className="h-6 w-6 text-amber-600 fill-amber-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Rating
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {product?.averageRating || 4.5} / 5
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-rose-100/80 bg-white p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div
                className="rounded-xl p-3 border border-rose-100"
                style={{ backgroundColor: "oklch(97% 0.02 344.323)" }}
              >
                <Truck
                  className="h-6 w-6"
                  style={{ color: "oklch(52.801% 0.15987 344.323)" }}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Delivery
                </p>
                <p className="text-xl font-bold text-gray-900">
                  Fast & Tracked
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-rose-100/80 bg-white p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Guarantee
                </p>
                <p className="text-xl font-bold text-gray-900">
                  Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-16">
          <div className="lg:col-span-1">
            {/* Enhanced Main Image Card */}
            <Card className="mb-6 overflow-hidden border-0 shadow-xl rounded-3xl bg-white">
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
                        className={`w-full h-full ${isZoomed ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                      >
                        <Image
                          src={selectedImage}
                          alt={product.name}
                          fill
                          className="object-contain p-8"
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

                  {/* Enhanced Zoom Indicator */}
                  {selectedImage && (
                    <div className="absolute top-6 right-6 bg-black/70 text-white px-4 py-2.5 rounded-2xl hidden lg:flex items-center gap-2 backdrop-blur-sm hover:bg-black/80 transition-all duration-300 shadow-lg">
                      <ZoomIn className="h-4 w-4" />
                      <span className="text-sm font-medium">Hover to zoom</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Image Thumbnail Gallery */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mb-6">
                {allImages.map((img, index) => (
                  <Card
                    key={`${img}-${index}`}
                    className={`cursor-pointer overflow-hidden transition-all duration-300 rounded-2xl hover:scale-105 ${selectedImage === img
                        ? "ring-2 ring-[oklch(52.801%_0.15987_344.323)] shadow-lg scale-105"
                        : "hover:ring-2 hover:ring-rose-300 shadow-md"
                      }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square relative bg-gray-50">
                        <Image
                          src={img}
                          alt={`View ${index + 1}`}
                          fill
                          className="object-contain p-2"
                          sizes="100px"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Enhanced Variant Size Options */}
            {productVariants.length > 0 && (
              <div className="space-y-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-100/50 shadow-sm">
                <div>
                  <p className="text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">
                    Available Sizes:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {productVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantSelect(variant)}
                        className={`px-5 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${selectedVariant?.id === variant.id
                            ? "border-[oklch(52.801%_0.15987_344.323)] text-white shadow-lg"
                            : "border-rose-200 bg-white hover:border-rose-300 hover:shadow-md"
                          }`}
                        style={
                          selectedVariant?.id === variant.id
                            ? {
                              backgroundColor:
                                "oklch(52.801% 0.15987 344.323)",
                            }
                            : {}
                        }
                      >
                        {variant.size}
                        {variant.stock !== undefined && variant.stock < 10 && (
                          <span className="ml-2 text-xs opacity-80">
                            ({variant.stock} left)
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Product Badges */}
            <div className="flex flex-wrap gap-2 mt-6">
              {product?.isNew && (
                <Badge className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-xs font-semibold rounded-full shadow-md">
                  <Sparkles className="h-3 w-3 mr-1" />
                  New Arrival
                </Badge>
              )}
              {product?.isFeatured && (
                <Badge className="bg-amber-400 hover:bg-amber-500 text-amber-900 px-4 py-1.5 text-xs font-semibold rounded-full shadow-md">
                  <Star className="h-3 w-3 mr-1 fill-amber-900" />
                  Featured
                </Badge>
              )}
              {product?.isTrending && (
                <Badge className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 text-xs font-semibold rounded-full shadow-md">
                  Trending
                </Badge>
              )}
              {product?.isBestSeller && (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-semibold rounded-full shadow-md">
                  <Award className="h-3 w-3 mr-1" />
                  Best Seller
                </Badge>
              )}
              {product?.discount && product.discount > 0 && (
                <Badge className="bg-red-600 hover:bg-red-700 px-4 py-1.5 text-xs font-semibold rounded-full shadow-md">
                  <Percent className="h-3 w-3 mr-1" />
                  {product.discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info - Enhanced */}
          <div className="lg:col-span-1">
            <div className="space-y-7 lg:sticky lg:top-24">
              {/* Enhanced Product Name and SKU */}
              <div className="space-y-4">
                <h1
                  className="text-xl lg:text-3xl font-bold leading-tight"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(52.801% 0.15987 344.323), #db2777)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {product?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge
                    variant="outline"
                    className="font-mono bg-white/90 backdrop-blur-sm border-rose-200 px-3 py-1.5 rounded-lg"
                  >
                    SKU: {selectedVariant?.sku || product?.slug || product?.id}
                  </Badge>
                  <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 shadow-sm border border-amber-200">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-amber-900">
                      {product?.averageRating || 4.5}
                    </span>
                    <span className="text-amber-700">
                      ({product?.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Price Card */}
              <Card className="border-0 bg-rose-50/50 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-baseline gap-4 mb-3">
                    <span className="text-3xl font-black text-gray-900">
                      ৳{(displayPrice * quantity)?.toFixed(2) || "0.00"}
                    </span>
                    {originalPrice && originalPrice > displayPrice && (
                      <>
                        <span className="text-xl text-gray-400 line-through font-medium">
                          ৳{(originalPrice * quantity).toFixed(2)}
                        </span>
                        <Badge className="bg-red-600 text-white text-sm px-4 py-1 rounded-full shadow-md">
                          Save {product?.discount}%
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Inclusive of all taxes • Free returns within 30 days
                  </p>
                </CardContent>
              </Card>

              {/* Enhanced Category and Brand */}
              <div className="flex flex-wrap items-center gap-3">
                {product?.brand && (
                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm border border-rose-200">
                    <IconBrand4chan
                      className="h-4 w-4"
                      style={{ color: "oklch(52.801% 0.15987 344.323)" }}
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {product.brand.name}
                    </span>
                  </div>
                )}
                {product?.category && (
                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm border border-rose-200">
                    <IconCategory
                      className="h-4 w-4"
                      style={{ color: "oklch(52.801% 0.15987 344.323)" }}
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {product.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Stock Status */}
              <div className="flex items-center gap-3 rounded-2xl border-2 border-rose-100/80 bg-white px-5 py-4 shadow-sm">
                {(selectedVariant?.stock || product?.stock) === 0 ? (
                  <Badge className="bg-red-600 text-white px-5 py-2 text-sm font-semibold rounded-full shadow-md">
                    Out of Stock
                  </Badge>
                ) : (selectedVariant?.stock || product?.stock || 0) < 10 ? (
                  <Badge className="bg-amber-500 text-white px-5 py-2 text-sm font-semibold rounded-full shadow-md">
                    Only {selectedVariant?.stock || product?.stock} left in
                    stock
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-600 text-white px-5 py-2 text-sm font-semibold rounded-full shadow-md flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    In Stock
                  </Badge>
                )}
                <span className="text-sm text-gray-600 font-medium">
                  {selectedVariant?.stock || product?.stock || 0} units
                  available
                </span>
              </div>

              {/* Enhanced Quantity Selector */}
              <div className="flex items-center gap-5">
                <div className="flex items-center rounded-2xl border-2 border-rose-200 bg-white shadow-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="rounded-l-2xl h-12 w-12 hover:bg-rose-50 transition-colors disabled:opacity-40"
                  >
                    <Minus className="h-5 w-5 text-gray-700" />
                  </Button>
                  <span className="w-16 text-center font-bold text-xl text-gray-900">
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
                    className="rounded-r-2xl h-12 w-12 hover:bg-rose-50 transition-colors disabled:opacity-40"
                  >
                    <Plus className="h-5 w-5 text-gray-700" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Max: {selectedVariant?.stock || product?.stock || 0} units
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <AddToCartButton
                  productId={product.id!}
                  quantity={quantity}
                  isOutOfStock={
                    (selectedVariant?.stock || product?.stock) === 0
                  }
                  className="flex-1 min-w-52 h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold"
                />

                <Button
                  size="lg"
                  className="flex-1 min-w-52 h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white text-base font-semibold"
                  style={{ backgroundColor: "oklch(52.801% 0.15987 344.323)" }}
                  onClick={handleBuyNow}
                  disabled={(selectedVariant?.stock || product?.stock) === 0}
                >
                  Buy Now
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="h-14 w-14 rounded-2xl border-2 border-rose-200 hover:bg-rose-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Heart
                    className={`h-5 w-5 transition-all ${isWishlisted ? "fill-red-500 text-red-500 scale-110" : "text-gray-600"}`}
                  />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleShare}
                  className="h-14 w-14 rounded-2xl border-2 border-rose-200 hover:bg-rose-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </Button>
              </div>

              {/* Enhanced Product Features */}
              <div className="grid grid-cols-1 gap-4 border-t-2 border-rose-100 pt-7 sm:grid-cols-2 md:grid-cols-3">
                <div className="group rounded-2xl border-2 border-rose-100/80 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-rose-50 p-3 border border-rose-100">
                      <Truck
                        className="h-6 w-6"
                        style={{ color: "oklch(52.801% 0.15987 344.323)" }}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Fastest Delivery
                      </p>
                      <p className="text-xs text-gray-600">
                        Same-day in select cities
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border-2 border-rose-100/80 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-50 p-3 border border-purple-100">
                      <Diamond className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">100% Authentic</p>
                      <p className="text-xs text-gray-600">
                        Factory sealed & verified
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border-2 border-rose-100/80 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 border border-blue-100">
                      <IconCertificate className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Certified Advisors
                      </p>
                      <p className="text-xs text-gray-600">
                        Chat for personalized picks
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Accordion Section */}
              <div className="space-y-3 mt-8">
                {/* Description Accordion */}
                <div className="border-2 border-rose-100/80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleSection("description")}
                    className="w-full flex items-center justify-between p-5 hover:bg-rose-50/50 transition-all duration-300"
                  >
                    <span className="font-bold text-gray-900 text-left">
                      DESCRIPTION
                    </span>
                    <div
                      className={`rounded-full p-1 transition-all duration-300 ${expandedSections.description ? "text-white" : "bg-rose-100 text-gray-600"}`}
                      style={
                        expandedSections.description
                          ? {
                            backgroundColor: "oklch(52.801% 0.15987 344.323)",
                          }
                          : {}
                      }
                    >
                      {expandedSections.description ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  {expandedSections.description && (
                    <div className="px-5 pb-5 border-t-2 border-rose-50 bg-rose-50/30">
                      <div className="pt-5 prose max-w-none">
                        {product?.shortDesc && (
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {product.shortDesc}
                          </p>
                        )}
                        {product?.longDesc && (
                          <div className="mb-4">
                            <h4 className="text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">
                              Details
                            </h4>
                            <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                              {product.longDesc}
                            </p>
                          </div>
                        )}
                        {product?.description && (
                          <div>
                            <h4 className="text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">
                              Additional Information
                            </h4>
                            <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        )}
                        {!product?.description && !product?.longDesc && (
                          <p className="text-sm text-gray-500 italic">
                            No description available for this product.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ingredients Accordion */}
                <div className="border-2 border-rose-100/80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleSection("ingredients")}
                    className="w-full flex items-center justify-between p-5 hover:bg-rose-50/50 transition-all duration-300"
                  >
                    <span className="font-bold text-gray-900 text-left">
                      INGREDIENTS
                    </span>
                    <div
                      className={`rounded-full p-1 transition-all duration-300 ${expandedSections.ingredients ? "text-white" : "bg-rose-100 text-gray-600"}`}
                      style={
                        expandedSections.ingredients
                          ? {
                            backgroundColor: "oklch(52.801% 0.15987 344.323)",
                          }
                          : {}
                      }
                    >
                      {expandedSections.ingredients ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  {expandedSections?.ingredients && (
                    <div className="px-5 pb-5 border-t-2 border-rose-50 bg-rose-50/30">
                      {product?.ingredients &&
                        product?.ingredients?.length > 0 ? (
                        <div className="pt-5 space-y-4">
                          {product?.ingredients?.map((item, idx) => {
                            const ingredient = item?.ingredient;
                            if (!ingredient) return null;
                            return (
                              <div
                                key={idx}
                                className="border-b border-rose-100 pb-4 last:border-b-0"
                              >
                                <h4 className="font-bold text-sm mb-2 text-gray-900">
                                  {ingredient?.name}
                                </h4>
                                {ingredient?.description && (
                                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                                    {ingredient?.description}
                                  </p>
                                )}
                                {ingredient?.benefits && (
                                  <div className="mb-3 bg-emerald-50 rounded-lg p-3">
                                    <p className="text-xs font-bold text-emerald-700 mb-1 uppercase tracking-wide">
                                      Benefits:
                                    </p>
                                    <p className="text-sm text-emerald-900">
                                      {ingredient?.benefits}
                                    </p>
                                  </div>
                                )}
                                {ingredient?.usage && (
                                  <div className="mb-3 bg-blue-50 rounded-lg p-3">
                                    <p className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">
                                      Usage:
                                    </p>
                                    <p className="text-sm text-blue-900">
                                      {ingredient?.usage}
                                    </p>
                                  </div>
                                )}
                                {ingredient?.sideEffects && (
                                  <div className="mb-3 bg-red-50 rounded-lg p-3">
                                    <p className="text-xs font-bold text-red-700 mb-1 uppercase tracking-wide">
                                      Side Effects:
                                    </p>
                                    <p className="text-sm text-red-900">
                                      {ingredient?.sideEffects}
                                    </p>
                                  </div>
                                )}
                                {ingredient?.precautions && (
                                  <div className="bg-amber-50 rounded-lg p-3">
                                    <p className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wide">
                                      Precautions:
                                    </p>
                                    <p className="text-sm text-amber-900">
                                      {ingredient?.precautions}
                                    </p>
                                  </div>
                                )}
                                {ingredient?.safetyLevel && (
                                  <Badge
                                    variant="outline"
                                    className={`mt-3 font-semibold ${ingredient?.safetyLevel === "SAFE"
                                        ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                                        : ingredient?.safetyLevel === "MODERATE"
                                          ? "border-amber-500 text-amber-700 bg-amber-50"
                                          : "border-red-500 text-red-700 bg-red-50"
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
                        <p className="text-sm text-gray-500 pt-5 italic">
                          No ingredients information available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Specifications Accordion */}
                <div className="border-2 border-rose-100/80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleSection("specifications")}
                    className="w-full flex items-center justify-between p-5 hover:bg-rose-50/50 transition-all duration-300"
                  >
                    <span className="font-bold text-gray-900 text-left">
                      SPECIFICATIONS
                    </span>
                    <div
                      className={`rounded-full p-1 transition-all duration-300 ${expandedSections.specifications ? "text-white" : "bg-rose-100 text-gray-600"}`}
                      style={
                        expandedSections.specifications
                          ? {
                            backgroundColor: "oklch(52.801% 0.15987 344.323)",
                          }
                          : {}
                      }
                    >
                      {expandedSections.specifications ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  {expandedSections.specifications && (
                    <div className="px-5 pb-5 border-t-2 border-rose-50 bg-rose-50/30">
                      <div className="pt-5 space-y-2">
                        {product?.brand && (
                          <div className="flex justify-between py-3 border-b border-rose-100">
                            <span className="text-sm font-semibold text-gray-700">
                              Brand
                            </span>
                            <span className="text-sm text-gray-600 font-medium">
                              {product.brand.name}
                            </span>
                          </div>
                        )}
                        {product?.category && (
                          <div className="flex justify-between py-3 border-b border-rose-100">
                            <span className="text-sm font-semibold text-gray-700">
                              Category
                            </span>
                            <span className="text-sm text-gray-600 font-medium">
                              {product.category.name}
                            </span>
                          </div>
                        )}
                        {selectedVariant?.sku && (
                          <div className="flex justify-between py-3 border-b border-rose-100">
                            <span className="text-sm font-semibold text-gray-700">
                              SKU
                            </span>
                            <span className="text-sm text-gray-600 font-mono">
                              {selectedVariant.sku}
                            </span>
                          </div>
                        )}
                        {(selectedVariant?.stock || product?.stock) && (
                          <div className="flex justify-between py-3 border-b border-rose-100">
                            <span className="text-sm font-semibold text-gray-700">
                              Availability
                            </span>
                            <span className="text-sm text-gray-600 font-medium">
                              {selectedVariant?.stock || product?.stock} in
                              stock
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Skin Types Accordion */}
                {/* <div className="border-2 border-rose-100/80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleSection("skinTypes")}
                    className="w-full flex items-center justify-between p-5 hover:bg-rose-50/50 transition-all duration-300"
                  >
                    <span className="font-bold text-gray-900 text-left">
                      Suitable For Skin Types ({product?.skinTypes?.length || 0}
                      )
                    </span>
                    <div
                      className={`rounded-full p-1 transition-all duration-300 ${expandedSections.skinTypes ? "text-white" : "bg-rose-100 text-gray-600"}`}
                      style={
                        expandedSections.skinTypes
                          ? {
                              backgroundColor: "oklch(52.801% 0.15987 344.323)",
                            }
                          : {}
                      }
                    >
                      {expandedSections?.skinTypes ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  {expandedSections?.skinTypes && (
                    <div className="px-5 pb-5 border-t-2 border-rose-50 bg-rose-50/30">
                      {product?.skinTypes && product?.skinTypes?.length > 0 ? (
                        <div className="pt-5 flex flex-wrap gap-2">
                          {product?.skinTypes?.map((item, idx) => (
                            <Badge
                              key={idx}
                              className="px-4 py-2 bg-purple-100 text-purple-900 border-2 border-purple-300 rounded-full font-semibold"
                            >
                              {item?.skinType?.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 pt-5 italic">
                          No skin type information available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Skin Concerns Accordion */}
                {/* <div className="border-2 border-rose-100/80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleSection("concerns")}
                    className="w-full flex items-center justify-between p-5 hover:bg-rose-50/50 transition-all duration-300"
                  >
                    <span className="font-bold text-gray-900 text-left">
                      Addresses Skin Concerns ({product?.concerns?.length || 0})
                    </span>
                    <div
                      className={`rounded-full p-1 transition-all duration-300 ${expandedSections.concerns ? "text-white" : "bg-rose-100 text-gray-600"}`}
                      style={
                        expandedSections.concerns
                          ? {
                              backgroundColor: "oklch(52.801% 0.15987 344.323)",
                            }
                          : {}
                      }
                    >
                      {expandedSections?.concerns ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  {expandedSections?.concerns && (
                    <div className="px-5 pb-5 border-t-2 border-rose-50 bg-rose-50/30">
                      {product?.concerns && product?.concerns?.length > 0 ? (
                        <div className="pt-5 space-y-3">
                          {product?.concerns?.map((item, idx) => (
                            <div
                              key={idx}
                              className="pb-3 border-b border-rose-100 last:border-b-0 bg-white rounded-lg p-3"
                            >
                              <h4 className="font-bold text-sm mb-2 text-gray-900">
                                {item?.skinConcern?.name}
                              </h4>
                              {item?.skinConcern?.description && (
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {item?.skinConcern?.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 pt-5 italic">
                          No skin concern information available.
                        </p>
                      )}
                    </div>
                  )}
                </div>  */}

                {/* Reviews Accordion */}

                {/* Reviews Accordion */}
                <div className="border-2 border-rose-100/80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow mt-8">
                  <button
                    onClick={() => toggleSection("reviews")}
                    className="w-full flex items-center justify-between p-5 hover:bg-rose-50/50 transition-all duration-300"
                  >
                    <span className="font-bold text-gray-900 text-left">
                      REVIEWS ({product?.reviewCount || 0})
                    </span>
                    <div
                      className={`rounded-full p-1 transition-all duration-300 ${expandedSections.reviews
                          ? "text-white"
                          : "bg-rose-100 text-gray-600"
                        }`}
                      style={
                        expandedSections.reviews
                          ? {
                            backgroundColor: "oklch(52.801% 0.15987 344.323)",
                          }
                          : {}
                      }
                    >
                      {expandedSections.reviews ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  {expandedSections.reviews && (
                    <div className="px-5 pb-5 border-t-2 border-rose-50 bg-rose-50/30">
                      <div className="pt-5">
                        <div className="flex items-center gap-3 mb-4 bg-amber-50 rounded-xl p-4">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-5 w-5 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-amber-900 font-semibold">
                            {product?.reviewCount || reviews.length || 0}{" "}
                            reviews
                          </span>
                        </div>

                        <div className="mb-4">
                          <Button
                            className="text-white hover:opacity-90 transition-all"
                            style={{
                              backgroundColor: "oklch(52.801% 0.15987 344.323)",
                            }}
                            onClick={() => toggleSection("createReview")}
                          >
                            Create Review
                          </Button>
                        </div>

                        {expandedSections.createReview && (
                          <div className="mb-4">
                            <ReviewForm productId={product.id ?? ""} />
                          </div>
                        )}

                        {reviews.length > 0 ? (
                          <div className="space-y-4">
                            {reviews.map((review) => (
                              <div
                                key={review.id}
                                className="bg-white rounded-lg p-4 border border-rose-100"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-4 w-4 ${star <= (review.rating || 0)
                                              ? "fill-amber-400 text-amber-400"
                                              : "text-slate-300"
                                            }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-slate-500">
                                      {review.rating || 0} / 5
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-400">
                                    {review.createdAt
                                      ? new Date(
                                        review.createdAt,
                                      ).toDateString()
                                      : ""}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-800 mb-2">
                                  {review.comment || "No comment provided."}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {review.user?.name ||
                                    review.user?.fullName ||
                                    review.user?.email ||
                                    "Anonymous"}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 bg-white rounded-lg p-4 border border-rose-100">
                            No reviews yet. Be the first to review this product!
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* <div className="border-2 border-rose-100/80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleSection("reviews")}
                    className="w-full flex items-center justify-between p-5 hover:bg-rose-50/50 transition-all duration-300"
                  >
                    <span className="font-bold text-gray-900 text-left">
                      REVIEWS
                    </span>
                    <div
                      className={`rounded-full p-1 transition-all duration-300 ${expandedSections.reviews ? "text-white" : "bg-rose-100 text-gray-600"}`}
                      style={
                        expandedSections.reviews
                          ? {
                              backgroundColor: "oklch(52.801% 0.15987 344.323)",
                            }
                          : {}
                      }
                    >
                      {expandedSections?.reviews ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  {expandedSections?.reviews && (
                    <div className="px-5 pb-5 border-t-2 border-rose-50 bg-rose-50/30">
                      <div className="pt-5">
                        <div className="flex items-center gap-3 mb-4 bg-amber-50 rounded-xl p-4">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-5 w-5 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-amber-900 font-semibold">
                            {product?.reviewCount || 0} reviews
                          </span>
                        </div> */}

                {/* <div className="mb-4">
                          <ReviewForm productId={product.id ?? ""} />
                        </div> */}

                {/* <p className="text-sm text-gray-600 bg-white rounded-lg p-4 border border-rose-100">
                          No reviews yet. Be the first to review this product!
                        </p>
                      </div>
                    </div>
                  )}
                </div> */}

                {/* FAQ Accordion */}
                <div className="border-2 border-rose-100/80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleSection("faq")}
                    className="w-full flex items-center justify-between p-5 hover:bg-rose-50/50 transition-all duration-300"
                  >
                    <span className="font-bold text-gray-900 text-left">
                      FAQ
                    </span>
                    <div
                      className={`rounded-full p-1 transition-all duration-300 ${expandedSections.faq ? "text-white" : "bg-rose-100 text-gray-600"}`}
                      style={
                        expandedSections.faq
                          ? {
                            backgroundColor: "oklch(52.801% 0.15987 344.323)",
                          }
                          : {}
                      }
                    >
                      {expandedSections.faq ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  {expandedSections.faq && (
                    <div className="px-5 pb-5 border-t-2 border-rose-50 bg-rose-50/30">
                      <div className="pt-5 space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-rose-100">
                          <h4 className="text-sm font-bold mb-2 text-gray-900">
                            How do I use this product?
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Follow the instructions provided with the product
                            for best results.
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-rose-100">
                          <h4 className="text-sm font-bold mb-2 text-gray-900">
                            What is the return policy?
                          </h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
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

        {/* Enhanced Related Products */}
        {relatedProducts?.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="h-1 w-12 rounded-full"
                style={{ backgroundColor: "oklch(52.801% 0.15987 344.323)" }}
              ></div>
              <h2 className="text-3xl font-bold text-gray-900">
                Related Products
              </h2>
              <div className="h-1 flex-1 bg-rose-200 rounded-full"></div>
            </div>
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
