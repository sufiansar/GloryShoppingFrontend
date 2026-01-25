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

      // Re-sync with backend in case pricing/totals change server-side
      fetchCart({ showLoader: false });
      // Refresh cart count in navbar
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
      // Refresh cart count in navbar
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
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Add some beautiful products to get started!
              </p>
              <Button asChild>
                <Link href="/product">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-15">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-linear-to-r from-red-50 to-pink-50 shadow-md">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300 bg-white/80 backdrop-blur"
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 shrink-0 shadow-md">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-semibold text-lg text-gray-900 hover:text-purple-600 transition-colors mb-2">
                          {item.productName}
                        </h3>
                      </Link>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ৳{(item.originalPrice * item.quantity).toFixed(2)}
                            </span>
                            <Badge className="bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-semibold">
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

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center border border-purple-200 rounded-lg bg-linear-to-r from-purple-50 to-pink-50">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 hover:bg-purple-200 transition-colors"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="h-4 w-4 text-purple-600" />
                          </Button>
                          <span className="w-8 text-center font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 hover:bg-purple-200 transition-colors"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="h-4 w-4 text-purple-600" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:bg-red-100 h-9 w-9 transition-colors rounded-lg"
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
            <Card className="sticky top-24 shadow-2xl border-0 bg-linear-to-br from-white to-purple-50 backdrop-blur-xl">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Order Summary
                  </h2>
                  <div className="h-1 w-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-purple-100">
                    <span className="text-gray-700 font-medium">Subtotal</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ৳{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="py-4 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-lg px-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ৳{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full py-6 text-base font-semibold bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
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
                  className="w-full py-5 text-base font-semibold border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-colors"
                  asChild
                >
                  <Link href="/product">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
