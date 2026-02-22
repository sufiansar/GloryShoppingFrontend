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
      let items = [];

      if (result?.data?.items) {
        // Structure: { data: { items: [...] } }
        items = result.data.items;
      } else if (result?.items) {
        // Structure: { items: [...] }
        items = result.items;
      } else if (result?.data?.data?.items) {
        // Structure: { data: { data: { items: [...] } } }
        items = result.data.data.items;
      }

      console.log("[CartPage] Parsed items:", items);
      setCartItems(items || []);
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
      className="min-h-screen py-16"
      style={{
        background: `linear-gradient(135deg, #fdf2f8, #fce7f3, #fbcfe8)`,
      }}
    >
      <div className="container mx-auto px-4">
        {/* Back to Home Indicator */}
        <div className="mb-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200"
            style={{
              boxShadow: `0 4px 12px ${baseColor}20`,
            }}
          >
            <Home
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              style={{ color: baseColor }}
              strokeWidth={2}
            />
            <span className="text-sm font-medium text-slate-700">
              Back to Home
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex p-4 bg-white/80 backdrop-blur-sm rounded-3xl mb-4 border border-pink-100 shadow-lg">
            <ShoppingCart
              className="h-10 w-10"
              style={{ color: baseColor }}
              strokeWidth={1.5}
            />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{
              background: `linear-gradient(135deg, ${baseColor}, #db2777, #2563eb)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Shopping Cart
          </h1>
          <p className="text-slate-600 text-lg">
            You have{" "}
            <span style={{ color: baseColor, fontWeight: 600 }}>
              {cartItems.length}
            </span>{" "}
            {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-0 shadow-lg rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${baseColor}, #db2777)`,
              }}
            />
            <CardContent className="p-6 flex items-center gap-3 bg-red-50/50">
              <AlertCircle
                className="h-5 w-5 shrink-0"
                style={{ color: baseColor }}
              />
              <p className="text-slate-700">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur rounded-2xl"
              >
                <div
                  className="h-1 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${baseColor}, #db2777)`,
                  }}
                />
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-linear-to-br from-pink-50 to-purple-50 shrink-0 shadow-md group">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <Link href={`/product/${item.productId}`}>
                        <h3
                          className="font-semibold text-xl text-slate-800 hover:transition-colors mb-2"
                          style={{ color: baseColor }}
                        >
                          {item.productName}
                        </h3>
                      </Link>

                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: baseColor }}
                        >
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <>
                            <span className="text-sm text-slate-400 line-through">
                              ৳{(item.originalPrice * item.quantity).toFixed(2)}
                            </span>
                            <Badge
                              className="text-white text-xs font-semibold border-0"
                              style={{
                                background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
                              }}
                            >
                              Save{" "}
                              {Math.round(
                                ((item.originalPrice - item.price) /
                                  item.originalPrice) *
                                  100,
                              )}
                              %
                            </Badge>
                          </>
                        )}
                      </div>

                      {/* Price per unit */}
                      <p className="text-xs text-slate-400 mt-1">
                        ৳{item.price.toFixed(2)} per unit
                      </p>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center gap-3">
                        <div
                          className="flex items-center rounded-xl overflow-hidden border"
                          style={{ borderColor: `${baseColor}30` }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 hover:bg-transparent rounded-none"
                            style={{ color: baseColor }}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold text-slate-700">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 hover:bg-transparent rounded-none"
                            style={{ color: baseColor }}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 hover:bg-red-50 transition-colors rounded-xl"
                          style={{ color: "#ef4444" }}
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-2xl bg-white/90 backdrop-blur rounded-2xl overflow-hidden">
              <div
                className="h-2 w-full"
                style={{
                  background: `linear-gradient(90deg, ${baseColor}, #db2777, #2563eb)`,
                }}
              />
              <CardContent className="p-8 space-y-6">
                <div>
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: baseColor }}
                  >
                    Order Summary
                  </h2>
                  <div
                    className="h-1 w-16 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${baseColor}, #db2777)`,
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="text-lg font-semibold text-slate-800">
                      ৳{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="py-4 bg-slate-50 rounded-xl px-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-slate-800">
                        Total
                      </span>
                      <span
                        className="text-3xl font-bold"
                        style={{ color: baseColor }}
                      >
                        ৳{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Note about delivery */}
                  <p className="text-xs text-slate-400 text-center">
                    Delivery charge will be calculated at checkout
                  </p>
                </div>

                <Button
                  className="w-full py-6 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
                  }}
                  asChild
                >
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-5 text-base font-semibold border-2 rounded-xl hover:bg-transparent transition-all"
                  style={{ borderColor: `${baseColor}40` }}
                  asChild
                >
                  <Link href="/product">
                    <Home
                      className="mr-2 h-4 w-4"
                      style={{ color: baseColor }}
                    />
                    Continue Shopping
                  </Link>
                </Button>

                {/* Secure Checkout Badge */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <p className="text-xs text-slate-400">Secure Checkout</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400">
            Need help? Contact our{" "}
            <Link
              href="/support"
              className="font-medium hover:underline"
              style={{ color: baseColor }}
            >
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
