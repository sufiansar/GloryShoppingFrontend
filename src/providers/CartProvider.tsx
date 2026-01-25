"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getCartCount } from "@/action/addToCart/addToCart.action";

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  decrementCart: () => void;
  refreshCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const { data: session } = useSession();

  // Fetch cart count on mount and when session changes
  const fetchCartCount = async () => {
    try {
      const result = await getCartCount();

      if (result?.data?.totalItems !== undefined) {
        setCartCount(result.data.totalItems);
      } else if (result?.totalItems !== undefined) {
        setCartCount(result.totalItems);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [session]);

  const incrementCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const decrementCart = () => {
    setCartCount((prev) => Math.max(0, prev - 1));
  };

  const refreshCartCount = () => {
    return fetchCartCount();
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        incrementCart,
        decrementCart,
        refreshCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
