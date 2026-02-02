"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogoutButton from "./Logout";
import logo from "@/components/Assets/Logo.png";

const SecondaryNavbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { data: session, status } = useSession();

  // console.log(session);
  const canAccessDashboard =
    session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN";

  return (
    <nav className="top-0 z-50 w-full border-b bg-white p-1 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src={logo}
              alt="Logo"
              className="h-12 w-auto sm:h-16 md:h-20 lg:h-24"
              priority
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <div className="relative w-80 xl:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products"
                className="pl-10"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchVisible && (
          <div className="lg:hidden mt-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products"
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SecondaryNavbar;
