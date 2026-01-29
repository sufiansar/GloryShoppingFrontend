"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckoutForm } from "@/components/modules/Checkout/CheckoutFrom";
import { OrderSuccess } from "@/components/modules/Checkout/OrderSuccess";
import { ICartItem } from "@/types/checkout.interface";
import { getCart } from "@/action/addToCart/addToCart.action";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

// Client-side fetch for variant info
const fetchVariant = async (variantId: string) => {
  const API_BASE = process.env.NEXT_PUBLIC_BASE_API;
  const res = await fetch(`${API_BASE}/variant/${variantId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch variant");
  return res.json();
};

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const checkoutType = searchParams.get("type") || "CART";
  const directVariantId = searchParams.get("variantId");
  const directQuantity = parseInt(searchParams.get("quantity") || "1");

  const [order, setOrder] = useState<any>(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableVariants, setAvailableVariants] = useState<any[]>([]);
  const { refreshCartCount } = useCart();

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);

      // If direct purchase, fetch variant info instead of cart
      if (checkoutType === "DIRECT" && directVariantId) {
        try {
          const variantData = await fetchVariant(directVariantId);
          if (variantData?.data) {
            const variant = variantData.data;
            setAvailableVariants([
              {
                id: variant.id,
                name: variant.name || variant.sku || "Variant",
                price: variant.price || 0,
                productName: variant.product?.name || "Product",
                stock: variant.stock || 0,
              },
            ]);
          }
        } catch (err) {
          console.error("Error loading variant:", err);
          setError("Unable to load product details. Please try again.");
        }
        setCartItems([]);
        setIsLoading(false);
        return;
      }

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
  }, [checkoutType, directVariantId]);

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

  if (cartItems.length === 0 && checkoutType !== "DIRECT") {
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
      availableVariants={availableVariants}
      onOrderSuccess={handleOrderSuccess}
      initialCheckoutType={checkoutType as "CART" | "DIRECT"}
      directVariantId={directVariantId || undefined}
      directQuantity={directQuantity}
    />
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
