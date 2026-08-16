"use client";

import { useState } from "react";

import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/action/addToCart/addToCart.action";
import { useCart } from "@/providers/CartProvider";
import { toast as toastNotification } from "sonner";
import { trackAddToCart } from "@/lib/gtm";

interface AddToCartButtonProps {
  productId: string;
  productName?: string;
  price?: number;
  variantId?: string;
  quantity?: number;
  size?: "default" | "lg" | "sm" | "icon";
  variant?: "default" | "secondary" | "outline";
  disabled?: boolean;
  isOutOfStock?: boolean;
  onSuccess?: () => void;
  className?: string;
  showIcon?: boolean;
}

export default function AddToCartButton({
  productId,
  productName,
  price,
  variantId,
  quantity = 1,
  size = "lg",
  variant = "default",
  disabled = false,
  isOutOfStock = false,
  onSuccess,
  className = "",
  showIcon = true,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { refreshCartCount } = useCart();

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isOutOfStock || disabled || isLoading) return;

    console.log("🛒 [AddToCartButton] Adding product:", productId, "variant:", variantId, "qty:", quantity);
    setIsLoading(true);
    
    try {
      const result = await addToCart({
        productId,
        variantId,
        quantity,
      });

      console.log("🛒 [AddToCartButton] API Result:", result);

      // Robust check for success across different API response formats
      const isSuccessful = 
        result?.success === true || 
        !!result?.cartItem || 
        !!result?.data?.cartItem ||
        result?.status === "success";

      if (isSuccessful) {
        setIsSuccess(true);
        toastNotification.success("Product added to cart!");

        // Track GTM add_to_cart event
        trackAddToCart({
          item_id: productId,
          item_name: productName || productId,
          price: price || 0,
          quantity,
        });

        // Refresh cart count from backend to sync navbar
        try {
          await refreshCartCount();
        } catch (refreshError) {
          console.error("🛒 [AddToCartButton] Failed to refresh cart count:", refreshError);
        }

        // Reset success state after a delay if want consistent behavior, but for now just callback
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);

        onSuccess?.();
      } else {
        const errorMessage = result?.message || result?.error || "Failed to add to cart";
        console.error("🛒 [AddToCartButton] Server rejected add to cart:", errorMessage);
        toastNotification.error(errorMessage);
        
        // If it's an auth issue, the message might be "Unauthorized"
        if (errorMessage.toLowerCase().includes("unauthorized") || result?.statusCode === 401) {
          toastNotification.error("Please login to add items to your cart");
        }
      }
    } catch (error: any) {
      console.error("🛒 [AddToCartButton] Critical Error:", error);
      toastNotification.error(
        error?.message || "Failed to add product to cart. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isOutOfStock || disabled || isLoading}
      variant={isSuccess ? "default" : variant}
      size={size}
      className={`relative transition-all duration-300 ${className} ${isSuccess
        ? "bg-green-600 hover:bg-green-700"
        : isOutOfStock
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#ca428b] hover:bg-[#b93a7e] text-white"
        }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Adding...
        </>
      ) : isSuccess ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Added!
        </>
      ) : isOutOfStock ? (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Out of Stock
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="mr-2 h-5 w-5" />}
          Add to Cart
        </>
      )}
    </Button>
  );
}
