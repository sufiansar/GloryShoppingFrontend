"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/CartProvider";

export function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-white hover:bg-[#ca428b] hover:text-white border border-white/30 hover:border-white bg-transparent"
      asChild
    >
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-white text-[#ca428b] font-bold">
            {cartCount > 99 ? "99+" : cartCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
