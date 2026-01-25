"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/action/addToCart/addToCart.action";
import { useCart } from "@/providers/CartProvider";
import { toast as toastNotification } from "sonner";

interface AddToCartButtonProps {
  productId: string;
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
  const router = useRouter();

  const handleAddToCart = async () => {
    if (isOutOfStock || disabled || isLoading) return;

    setIsLoading(true);
    try {
      const result = await addToCart({
        productId,
        quantity,
      });

      console.log("result", result);
      if (result?.cartItem || result?.success) {
        setIsSuccess(true);

        // Refresh cart count from backend
        await refreshCartCount();

        toastNotification.success("Product added to cart!");

        // Redirect to cart page after 1 second
        setTimeout(() => {
          router.push("/cart");
        }, 1000);

        // Reset success state after 2 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);

        onSuccess?.();
      } else {
        toastNotification.error(result?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toastNotification.error(
        "Failed to add product to cart. Please try again.",
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
      className={`relative transition-all duration-300 ${className} ${
        isSuccess
          ? "bg-green-600 hover:bg-green-700"
          : isOutOfStock
            ? "bg-gray-400 cursor-not-allowed"
            : ""
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
