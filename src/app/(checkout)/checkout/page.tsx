"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckoutForm } from "@/components/modules/Checkout/CheckoutFrom";
import { OrderSuccess } from "@/components/modules/Checkout/OrderSuccess";
import { ICartItem } from "@/types/checkout.interface";
import { getCart } from "@/action/addToCart/addToCart.action";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function CheckoutPage() {
  const [order, setOrder] = useState<any>(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshCartCount } = useCart();

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getCart();

      let items: any[] = [];
      if (result?.data?.items) {
        items = result.data.items;
      } else if (result?.items) {
        items = result.items;
      } else if (result?.data?.data?.items) {
        items = result.data.data.items;
      }

      const normalized: ICartItem[] = (items || []).map((item) => ({
        id: item.id ?? item.cartItemId ?? item.productId,
        variantId: item.variantId ?? item.productId ?? item.id,
        quantity: item.quantity ?? 1,
        productName:
          item.productName ?? item.product?.name ?? item.name ?? "Product",
        price:
          item.price ??
          item.unitPrice ??
          item.product?.price ??
          item.variant?.price ??
          0,
      }));

      setCartItems(normalized);
      setError(null);
    } catch (err) {
      console.error("Error loading cart for checkout", err);
      setError("Unable to load your cart. Please try again.");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleOrderSuccess = async (createdOrder: any) => {
    setOrder(createdOrder);
    setIsOrderComplete(true);
    try {
      await refreshCartCount();
    } catch (err) {
      console.error("Error refreshing cart count after order", err);
    }
  };

  const handleContinueShopping = () => {
    window.location.href = "/product";
  };

  const cartItemIds = useMemo(
    () =>
      cartItems
        .map((item) => item.id || item.variantId)
        .filter((id): id is string => Boolean(id)),
    [cartItems],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Loading your checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
        <div className="max-w-md text-center space-y-4">
          <p className="text-lg font-semibold text-gray-900">{error}</p>
          <Button onClick={fetchCart}>Retry</Button>
          <div>
            <Button asChild variant="secondary">
              <Link href="/product">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
        <div className="max-w-md text-center space-y-4">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-400" />
          <p className="text-lg font-semibold text-gray-900">
            Your cart is empty.
          </p>
          <Button asChild>
            <Link href="/product">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isOrderComplete && order) {
    return (
      <OrderSuccess order={order} onContinueShopping={handleContinueShopping} />
    );
  }

  return (
    <CheckoutForm
      cartItems={cartItems}
      cartItemIds={cartItemIds}
      deliveryCharge={0}
      availableVariants={[]}
      onOrderSuccess={handleOrderSuccess}
    />
  );
}
