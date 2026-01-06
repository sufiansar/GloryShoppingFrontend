"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

const SecondaryNavbar = () => {
  return (
    <nav className=" z-50 w-full border-b bg-white p-4 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-wider">
            Glory Shopping BD
          </Link>

          {/* Search Bar */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products"
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus-visible:ring-primary"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="gap-2">
              <User className="h-4 w-4 text-[#ca428b] " />
              <p className="text-[#ca428b]"> My Account</p>
            </Button>

            <Button variant="outline" className="gap-2 relative">
              <ShoppingBag className="h-4 w-4 text-[#ca428b] " />
              <p className="text-[#ca428b]"> Cart</p>
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                0
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SecondaryNavbar;
