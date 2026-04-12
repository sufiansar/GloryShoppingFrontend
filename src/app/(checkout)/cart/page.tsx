"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ChevronRight,
  AlertCircle,
  Home,
  Heart,
  Shield,
} from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "@/action/addToCart/addToCart.action";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  originalPrice?: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshCartCount } = useCart();

  const baseColor = "oklch(52.801% 0.15987 344.323)";

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }
      const result = await getCart();
      console.log("[CartPage] API Result:", result);

      // Parse cart items from response - handle various possible structures
      let items: any[] = [];

      if (result?.data?.items && Array.isArray(result.data.items)) {
        items = result.data.items;
      } else if (result?.items && Array.isArray(result.items)) {
        items = result.items;
      } else if (result?.data?.data?.items && Array.isArray(result.data.data.items)) {
        items = result.data.data.items;
      } else if (result?.data?.cartItems && Array.isArray(result.data.cartItems)) {
        items = result.data.cartItems;
      } else if (result?.cartItems && Array.isArray(result.cartItems)) {
        items = result.cartItems;
      } else if (Array.isArray(result?.data)) {
        items = result.data;
      } else if (Array.isArray(result)) {
        items = result;
      }

      console.log("[CartPage] Raw parsed items:", items);

      const validItems = items.filter(item => item !== null && typeof item === 'object');

      const normalizedItems: CartItem[] = validItems.map((item) => {
        let productImage = "/placeholder.png";
        if (item.productImage) productImage = item.productImage;
        else if (item.product?.images && item.product.images.length > 0) productImage = item.product.images[0];
        else if (item.variant?.images && item.variant.images.length > 0) productImage = item.variant.images[0];
        else if (item.image) productImage = item.image;
        else if (item.variant?.image) productImage = item.variant.image;

        return {
          id: item.id || item._id || Math.random().toString(),
          productId: item.productId || item.product?.id || item.variantId || item.id,
          productName: item.productName || item.product?.name || item.name || item.variant?.productName || "Unknown Product",
          productImage: productImage,
          price: item.price || item.unitPrice || item.product?.price || item.variant?.price || 0,
          quantity: item.quantity || 1,
          originalPrice: item.originalPrice || item.product?.originalPrice,
        };
      });

      console.log("[CartPage] Normalized items:", normalizedItems);
      setCartItems(normalizedItems);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Error loading cart");
      setCartItems([]);
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem({
        productId,
        quantity: newQuantity,
      });

      setCartItems((items) =>
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );

      fetchCart({ showLoader: false });

      await refreshCartCount();
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeCartItem(productId);
      setCartItems((items) =>
        items.filter((item) => item.productId !== productId),
      );
      fetchCart({ showLoader: false });

      await refreshCartCount();
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const total = subtotal;

  if (isLoading) {
    return (
      <div
        className="min-h-screen py-12 "
        style={{
          background: `linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse"
                  style={{ backgroundColor: baseColor }}
                />
                <ShoppingCart
                  className="h-16 w-16 mx-auto relative animate-bounce"
                  style={{ color: baseColor }}
                />
              </div>
              <p className="text-slate-600 mt-4">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen py-12"
        style={{
          background: `linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)`,
        }}
      >
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div
              className="h-2 w-full"
              style={{
                background: `linear-gradient(90deg, ${baseColor}, #db2777, #2563eb)`,
              }}
            />
            <CardContent className="p-12 text-center">
              <div className="inline-flex p-4 bg-linear-to-br from-pink-50 to-purple-50 rounded-3xl mb-6 border border-pink-100">
                <ShoppingCart
                  className="h-16 w-16"
                  style={{ color: baseColor }}
                  strokeWidth={1.5}
                />
              </div>
              <h2
                className="text-3xl font-bold mb-3"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Your cart is empty
              </h2>
              <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                Add some beautiful products to get started!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
                  }}
                >
                  <Link href="/product" className="px-8">
                    <Home className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-2"
                  style={{ borderColor: `${baseColor}40` }}
                >
                  <Link href="/wishlist">
                    <Heart
                      className="mr-2 h-4 w-4"
                      style={{ color: baseColor }}
                    />
                    View Wishlist
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #fff5f7 0%, #ffffff 100%)`,
      }}
    >
      {/* Decorative background elements */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20"
        style={{ backgroundColor: baseColor }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20"
        style={{ backgroundColor: "#3b82f6" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:bg-white/60 transition-all duration-300"
          >
            <Home
              className="w-4 h-4"
              style={{ color: baseColor }}
            />
            <span className="text-sm font-semibold text-slate-700">Home</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-500">Cart</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-8 max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-6">
            <div 
              className="absolute inset-0 blur-2xl opacity-20 rounded-full"
              style={{ backgroundColor: baseColor }}
            />
            <div className="relative bg-white/60 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/80 shadow-xl shadow-pink-500/5">
              <ShoppingCart
                className="h-10 w-10"
                style={{ color: baseColor }}
                strokeWidth={1.5}
              />
            </div>
            <Badge 
              className="absolute -top-2 -right-2 h-8 w-8 flex items-center justify-center rounded-full border-2 border-white shadow-lg text-sm font-bold p-0"
              style={{ background: baseColor }}
            >
              {cartItems.length}
            </Badge>
          </div>
          
          <h1
            className="text-4xl md:text-6xl font-black mb-4 tracking-tight"
            style={{
              background: `linear-gradient(to right, ${baseColor}, #db2777, #7c3aed)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Shopping Bag
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Review your selection and proceed to checkout
          </p>
        </div>

        {error && (
          <div className="mb-8 max-w-xl mx-auto">
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 max-w-7xl mx-auto">
          {/* Main Cart Content */}
          <div className="xl:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] hover:bg-white/60 transition-all duration-500 overflow-hidden"
              >
                {/* Thin top accent bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, ${baseColor}, #db2777)` }}
                />

                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Visual: Product Frame */}
                    <div className="relative w-40 h-40 md:w-36 md:h-36 rounded-3xl overflow-hidden bg-white shadow-inner-lg shadow-pink-500/5 group/img p-2 border border-slate-100/50">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                        />
                      </div>
                    </div>

                    {/* Content: Details & Actions */}
                    <div className="flex-1 w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div className="space-y-1">
                          <Link href={`/product/${item.productId}`}>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-800 hover:opacity-80 transition-opacity line-clamp-2">
                              {item.productName}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-center md:justify-start gap-4">
                             <div className="flex items-center gap-1 text-slate-400">
                                <Shield className="w-3 h-3" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Authentic product</span>
                             </div>
                          </div>
                        </div>
                        
                        <div className="text-center md:text-right">
                          <div className="text-2xl font-black" style={{ color: baseColor }}>
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.originalPrice && (
                             <div className="flex items-center justify-center md:justify-end gap-2 mt-1">
                               <span className="text-sm text-slate-300 line-through font-medium">
                                 ৳{(item.originalPrice * item.quantity).toFixed(2)}
                               </span>
                               <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 font-bold text-[10px] py-0 px-2 h-5">
                                 -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                               </Badge>
                             </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-6 border-t border-slate-100/50">
                        {/* Custom Robust Quantity Controller */}
                        <div className="flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-600"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-bold text-lg text-slate-800">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-600"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                           <Button
                             variant="ghost"
                             className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl px-4 py-6 transition-all font-semibold flex items-center gap-2"
                             onClick={() => handleRemoveItem(item.productId)}
                           >
                             <Trash2 className="h-5 w-5" />
                             <span>Remove</span>
                           </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Section: Sidebar Summary */}
          <div className="xl:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white border-b-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-8 md:p-10 space-y-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Summary</h2>
                    <div className="h-1.5 w-12 rounded-full mt-2" style={{ backgroundColor: baseColor }} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-slate-500 font-medium">
                      <span>Bag total</span>
                      <span className="text-slate-800">৳{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.1em]">Final amount</span>
                        <div className="text-4xl font-black tracking-tighter text-slate-900">
                          ৳{total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      className="w-full h-16 text-lg font-bold text-white shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-500 transform hover:-translate-y-1 rounded-[1.5rem] group"
                      style={{
                        background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
                      }}
                      asChild
                    >
                      <Link href="/checkout" className="flex items-center justify-center gap-3">
                        Checkout Now
                        <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </div>
                      </Link>
                    </Button>
                    
                    <div className="mt-6 flex flex-col items-center gap-4 text-center">
                       <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          SECURED TRANSACTION GUARANTEED
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complementary Card: Fast Shipping Promo */}
              <div className="mt-6 bg-linear-to-br from-indigo-500/5 to-purple-500/5 border border-white/40 backdrop-blur-md rounded-[2rem] p-6 flex items-center gap-4">
                 <div className="bg-white h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm">
                    <Shield className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-800">Premium Protection</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Your order is protected by our global security policy.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
