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
  ChevronRight,
  ChevronDown,
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
  Home,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
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
import { cn } from "@/lib/utils";

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

  const getSafetyColor = (level?: string) => {
    switch (level) {
      case "SAFE": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "MODERATE": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "CAUTION": return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "RESTRICTED": return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "UNSAFE": return "bg-rose-100 text-rose-700 hover:bg-rose-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#ffffff]">
      {/* Dynamic Background Blobs */}
      <div 
        className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-[0.08] pointer-events-none"
        style={{ backgroundColor: "oklch(52.801% 0.15987 344.323)" }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-[0.08] pointer-events-none"
        style={{ backgroundColor: "#3b82f6" }}
      />

      <div className="container mx-auto px-4 py-6 md:py-10 relative z-10">
        {/* Immersive Breadcrumbs */}
        <nav className="mb-6 flex items-center flex-wrap gap-2">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-white/60 transition-all text-slate-500 hover:text-slate-800"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <Link 
            href="/product" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-white/60 transition-all text-slate-500 hover:text-slate-800"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">Products</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/50 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider line-clamp-1 max-w-[150px]">
              {product.name}
            </span>
          </div>
        </nav>

        {/* Premium Quick Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm transition-all hover:bg-white/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50/50 border border-amber-100 shadow-sm">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
              <p className="text-sm font-bold text-slate-800">{product?.averageRating || 4.5} / 5.0</p>
            </div>
          </div>

          <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm transition-all hover:bg-white/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50/50 border border-sky-100 shadow-sm">
                <Truck className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</p>
              <p className="text-sm font-bold text-slate-800">Fast & Secure</p>
            </div>
          </div>

          <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm transition-all hover:bg-white/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/50 border border-emerald-100 shadow-sm">
                <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warranty</p>
              <p className="text-sm font-bold text-slate-800">100% Guaranteed</p>
            </div>
          </div>

          <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm transition-all hover:bg-white/60 hidden lg:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50/50 border border-indigo-100 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authenticity</p>
              <p className="text-sm font-bold text-slate-800">Verified Stocks</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-16 mb-12">
          {/* Visual: Image Section */}
          <div className="xl:col-span-7 space-y-6">
            <div className="relative group">
               {/* Main Frame */}
               <div 
                 className="aspect-square relative bg-white rounded-[2.5rem] border border-slate-100/50 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden cursor-crosshair"
                 onMouseEnter={() => setIsZoomed(true)}
                 onMouseLeave={() => setIsZoomed(false)}
                 onMouseMove={handleMouseMove}
               >
                 {selectedImage ? (
                   <>
                     <div className={`w-full h-full p-8 md:p-12 transition-opacity duration-500 ${isZoomed ? "opacity-0" : "opacity-100"}`}>
                        <Image
                          src={selectedImage}
                          alt={product.name}
                          fill
                          className="object-contain"
                          priority
                        />
                     </div>
                     {isZoomed && (
                        <div
                          className="absolute inset-0 bg-white hidden lg:block"
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
                   <div className="w-full h-full flex items-center justify-center opacity-20">
                     <Package className="h-32 w-32" />
                   </div>
                 )}

                 {/* Badges Overlay */}
                 <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product?.isNew && (
                        <Badge className="bg-indigo-600/90 backdrop-blur-md border-0 text-[10px] font-bold py-1 px-3 rounded-lg shadow-lg">New Arrival</Badge>
                    )}
                    {product?.discount && product.discount > 0 && (
                        <Badge className="bg-rose-600/90 backdrop-blur-md border-0 text-[10px] font-bold py-1 px-3 rounded-lg shadow-lg">Save {product.discount}%</Badge>
                    )}
                 </div>

                 <div className="absolute top-6 right-6 lg:flex hidden items-center gap-2 px-4 py-2 bg-black/5 backdrop-blur-md rounded-xl text-[10px] font-black tracking-widest uppercase text-slate-400 border border-white/20">
                   <ZoomIn className="w-3.5 h-3.5" />
                   Hover to detail
                 </div>
               </div>
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {allImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all p-1.5 ${
                      selectedImage === img 
                      ? "bg-white shadow-lg scale-110" 
                      : "bg-slate-50 border-transparent hover:border-slate-200"
                    }`}
                    style={{ borderColor: selectedImage === img ? "oklch(52.801% 0.15987 344.323)" : "" }}
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image src={img} alt="Thumb" fill className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="xl:col-span-5 space-y-5 lg:sticky lg:top-24 h-fit">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-0 font-bold text-[10px] tracking-widest uppercase py-1 px-3">
                    SKU: {selectedVariant?.sku || product?.slug || product?.id}
                 </Badge>
              </div>
              
              <h1 
                className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-[1.1]"
              >
                {product?.name}
              </h1>

              <div className="flex items-center gap-4 flex-wrap">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-100">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-900">{product?.averageRating || 4.5}</span>
                    <div className="w-1 h-1 rounded-full bg-amber-300" />
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{product?.reviewCount || 0} Reviews</span>
                 </div>
                 {product?.isBestSeller && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
                       <Award className="w-4 h-4 text-emerald-500" />
                       <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Bestseller</span>
                    </div>
                 )}
              </div>
            </div>

            {/* Price Frame */}
            <div className="bg-slate-50/50 backdrop-blur-md rounded-[2rem] p-6 border border-slate-100/50">
               <div className="flex items-baseline gap-4 mb-2">
                 <span className="text-4xl font-black tracking-tighter text-slate-900">
                   ৳{(displayPrice * quantity)?.toFixed(2) || "0.00"}
                 </span>
                 {originalPrice && originalPrice > displayPrice && (
                   <span className="text-xl text-slate-300 line-through font-bold">
                     ৳{(originalPrice * quantity).toFixed(2)}
                   </span>
                 )}
               </div>
               <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Inclusive of taxes • Global Shipping available</p>
            </div>

            {/* Variants Selector */}
            {productVariants.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Configuration</span>
                <div className="flex flex-wrap gap-3">
                  {productVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      className={`relative px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 border-2 ${
                        selectedVariant?.id === variant.id
                        ? "text-white shadow-xl scale-[1.02]"
                        : "bg-white text-slate-600 border-slate-100 hover:border-slate-300"
                      }`}
                      style={{ 
                        backgroundColor: selectedVariant?.id === variant.id ? "oklch(52.801% 0.15987 344.323)" : "",
                        borderColor: selectedVariant?.id === variant.id ? "oklch(52.801% 0.15987 344.323)" : ""
                      }}
                    >
                      {variant.size}
                      {variant.stock !== undefined && variant.stock < 10 && (
                        <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">{variant.stock} left</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-100/50">
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</span>
                     <p className="text-[10px] text-slate-500">{selectedVariant?.stock || product?.stock || 0} units available</p>
                  </div>
                  <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200/30">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-8 w-8 rounded-lg hover:bg-white transition-all disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-10 text-center font-black text-base text-slate-800">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (selectedVariant?.stock || product?.stock || 10)}
                      className="h-8 w-8 rounded-lg hover:bg-white transition-all disabled:opacity-30"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
               </div>

               <div className="hidden lg:flex flex-col lg:flex-row gap-3">
                  <div className="flex-[3] flex gap-2">
                    <AddToCartButton
                      productId={product.id!}
                      variantId={selectedVariant?.id || product?.variants?.[0]?.id}
                      quantity={quantity}
                      isOutOfStock={(selectedVariant?.stock || product?.stock) === 0}
                      className="flex-[2] h-14 rounded-2xl text-base font-bold shadow-lg shadow-pink-500/5"
                    />
                    <Button
                      className="flex-[2] h-14 rounded-2xl text-base font-black text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
                      style={{ background: "oklch(52.801% 0.15987 344.323)" }}
                      onClick={handleBuyNow}
                      disabled={(selectedVariant?.stock || product?.stock) === 0}
                    >
                      Buy Now
                    </Button>
                  </div>
                  <Button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`h-14 w-14 rounded-2xl border transition-all shrink-0 ${
                      isWishlisted 
                      ? "bg-rose-50 border-rose-100 text-rose-500" 
                      : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
               </div>
            </div>

            {/* Trust Badges & Benefits Grid */}
            <div className="grid grid-cols-1 gap-3">
              {/* Row 1: Primary Trust Cards */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 flex flex-col gap-2 transition-all hover:bg-indigo-100/30">
                    <Truck className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Express Delivery</h4>
                      <p className="text-[10px] text-slate-500 leading-tight">Global Shipping</p>
                    </div>
                 </div>
                 <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 flex flex-col gap-2 transition-all hover:bg-emerald-100/30">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Pure Authenticity</h4>
                      <p className="text-[10px] text-slate-500 leading-tight">Verified Store</p>
                    </div>
                 </div>
              </div>

              {/* Row 2: Secondary Trust Cards */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex flex-col gap-2 transition-all hover:bg-amber-100/30">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Expert Advice</h4>
                      <p className="text-[10px] text-slate-500 leading-tight">Personalized</p>
                    </div>
                 </div>
                 <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/50 flex flex-col gap-2 transition-all hover:bg-purple-100/30">
                    <Diamond className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Premium</h4>
                      <p className="text-[10px] text-slate-500 leading-tight">Luxury Quality</p>
                    </div>
                 </div>
              </div>

              {/* Full Width Row: Secondary Benefit */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/50 flex items-center gap-4 transition-all hover:bg-slate-100/50">
                 <IconCertificate className="w-6 h-6 text-slate-400" />
                 <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Certified Stocks</h4>
                    <p className="text-[10px] text-slate-500">100% Authentic verified products</p>
                 </div>
              </div>
            </div>

            {/* Informational Accordions */}
            <div className="space-y-3 pt-6 border-t border-slate-100/50">
              {/* Description Section */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
                 <button 
                   onClick={() => setExpandedSections(prev => ({ ...prev, description: !prev.description }))}
                   className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                 >
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                         <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-500 ${expandedSections.description ? "rotate-180" : ""}`} />
                      </div>
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Description</span>
                   </div>
                 </button>
                 {expandedSections.description && (
                   <div className="px-6 pb-5 pt-1 animate-in fade-in slide-in-from-top-1 duration-300">
                       <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed font-medium text-xs">
                           {product?.shortDesc && <p className="mb-2">{product.shortDesc}</p>}
                           {product?.description && <p>{product.description}</p>}
                           {!product?.description && !product?.shortDesc && <p className="italic opacity-50 text-[10px]">No detailed information available.</p>}
                       </div>
                   </div>
                 )}
              </div>

              {/* Specifications Section */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
                 <button 
                   onClick={() => setExpandedSections(prev => ({ ...prev, specifications: !prev.specifications }))}
                   className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                 >
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                         <Package className="w-4 h-4 text-indigo-500" />
                      </div>
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Specifications</span>
                   </div>
                   <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-500 ${expandedSections.specifications ? "rotate-180" : ""}`} />
                 </button>
                 {expandedSections.specifications && (
                   <div className="px-6 pb-5 pt-1">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Brand</span>
                            <p className="text-xs font-black text-slate-800">{product?.brand?.name || "N/A"}</p>
                         </div>
                         <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                            <p className="text-xs font-black text-slate-800">{product?.category?.name || "N/A"}</p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>

              {/* Ingredients Section */}
              {product?.ingredients && product.ingredients.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
                   <button 
                     onClick={() => setExpandedSections(prev => ({ ...prev, ingredients: !prev.ingredients }))}
                     className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                   >
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                           <Sparkles className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Key Ingredients</span>
                     </div>
                     <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-500 ${expandedSections.ingredients ? "rotate-180" : ""}`} />
                   </button>
                   {expandedSections.ingredients && (
                     <div className="px-6 pb-5 pt-1 space-y-4">
                         {product.ingredients.map((item: any, idx: number) => (
                           <div key={idx} className="p-5 rounded-[1.5rem] bg-slate-50/30 border border-slate-100/50 space-y-3 transition-all hover:bg-white hover:shadow-sm">
                              <div className="flex items-center justify-between gap-4">
                                 <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-1">{item?.ingredient?.name}</h5>
                                 <Badge className={cn("text-[9px] font-bold px-3 py-1 border-0 uppercase tracking-widest shrink-0 rounded-full", getSafetyColor(item?.ingredient?.safetyLevel))}>
                                   {item?.ingredient?.safetyLevel || "SAFE"}
                                 </Badge>
                              </div>
                              {item?.ingredient?.description && (
                                <div 
                                  className="text-[11px] text-slate-500 leading-relaxed font-medium prose prose-slate prose-xs max-w-none 
                                    [&_b]:font-black [&_strong]:font-black [&_p]:mb-1 last:[&_p]:mb-0"
                                  dangerouslySetInnerHTML={{ __html: item.ingredient.description }}
                                />
                              )}
                           </div>
                         ))}
                     </div>
                   )}
                </div>
              )}

              {/* Reviews Section */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
                 <button 
                   onClick={() => setExpandedSections(prev => ({ ...prev, reviews: !prev.reviews }))}
                   className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                   id="accordion-reviews"
                 >
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                         <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </div>
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Customer Reviews</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400">({product?.reviewCount || 0})</span>
                      <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-500 ${expandedSections.reviews ? "rotate-180" : ""}`} />
                   </div>
                 </button>
                 {expandedSections.reviews && (
                   <div className="px-6 pb-5 pt-1">
                      <div className="mb-6 p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between flex-wrap gap-2">
                         <div>
                            <p className="text-[9px] font-bold text-amber-900 uppercase tracking-widest mb-0.5">Satisfaction</p>
                            <p className="text-xl font-black text-amber-900">{product?.averageRating || 4.5}/5.0</p>
                         </div>
                         <Button 
                           onClick={() => setExpandedSections(prev => ({ ...prev, createReview: !prev.createReview }))}
                           className="h-9 rounded-lg shadow-lg shadow-amber-500/10 text-[10px] font-bold px-3"
                           style={{ backgroundColor: "oklch(52.801% 0.15987 344.323)" }}
                         >
                            <MessageSquare className="w-3 h-3 mr-1.5" />
                            Write Review
                         </Button>
                      </div>

                      {expandedSections.createReview && (
                         <div className="mb-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <ReviewForm productId={product.id ?? ""} />
                         </div>
                      )}

                      <div className="space-y-4">
                         {reviews.length > 0 ? reviews.map((review) => (
                           <div key={review.id} className="p-4 rounded-xl border border-slate-100 bg-white">
                              <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-[10px]">
                                       {review.user?.name?.[0] || "U"}
                                    </div>
                                    <div>
                                       <h6 className="text-[11px] font-black text-slate-800">{review.user?.name || review.user?.fullName || "User"}</h6>
                                       <div className="flex items-center gap-0.5 mt-0.5">
                                          {[1,2,3,4,5].map(s => (
                                             <Star key={s} className={`w-2.5 h-2.5 ${s <= (review.rating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                                 <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{review.comment || "No comment."}</p>
                           </div>
                         )) : (
                           <div className="text-center py-6">
                              <p className="text-[11px] text-slate-400 font-medium italic">No reviews yet.</p>
                           </div>
                         )}
                      </div>
                   </div>
                 )}
              </div>

            </div>

          </div>
        </div>

        {/* Sticky Mobile Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-4 bg-white/80 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
           <div className="flex gap-3 max-w-lg mx-auto">
              <div className="flex-[3]">
                <AddToCartButton
                  productId={product.id!}
                  variantId={selectedVariant?.id || product.variants?.[0]?.id}
                  quantity={quantity}
                  isOutOfStock={(selectedVariant?.stock || product?.stock) === 0}
                  className="w-full h-14 rounded-2xl font-bold shadow-lg"
                />
              </div>
              <Button
                className="flex-[2] h-14 rounded-2xl font-black text-white shadow-lg"
                style={{ background: "oklch(52.801% 0.15987 344.323)" }}
                onClick={handleBuyNow}
                disabled={(selectedVariant?.stock || product?.stock) === 0}
              >
                Buy Now
              </Button>
           </div>
        </div>



        {/* Enhanced Related Products */}
        {relatedProducts?.length > 0 && (
          <div className="mt-12 border-t border-slate-100 pt-12">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">You May Also Like</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Curated for your selection</p>
               </div>
               <div className="flex h-1 gap-2 w-20">
                  <div className="flex-1 bg-slate-100 rounded-full" />
                  <div className="flex-1 rounded-full" style={{ background: "oklch(52.801% 0.15987 344.323)" }} />
               </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
