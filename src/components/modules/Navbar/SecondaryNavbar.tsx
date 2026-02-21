"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, MessageCircle, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogoutButton from "./Logout";
import logo from "@/components/Assets/Logo.png";

const SecondaryNavbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { data: session, status } = useSession();

  const canAccessDashboard =
    session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedSearchTerm = searchTerm.trim().replace(/\s+/g, " ");
    if (normalizedSearchTerm) {
      const params = new URLSearchParams({
        searchTerm: normalizedSearchTerm,
        page: "1",
      });
      router.push(`/product?${params.toString()}`);
      setSearchTerm("");
      setIsSearchVisible(false);
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "8801577437554";
    const message = "Hello! I'm interested in your products.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleMessengerClick = () => {
    const messengerUrl = "https://www.facebook.com/GloryShopingBD";
    window.open(messengerUrl, "_blank");
  };

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

          {/* Desktop Search - Enhanced UI */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <form onSubmit={handleSearch} className="relative w-80 xl:w-96">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="pl-12 pr-4 h-12 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Messenger Button */}
            <Button
              onClick={handleMessengerClick}
              className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-10 w-10 sm:h-11 sm:w-auto sm:px-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
              size="icon"
              title="Chat on Messenger"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Messenger</span>
            </Button>

            {/* WhatsApp Button */}
            <Button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white h-10 w-10 sm:h-11 sm:w-auto sm:px-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
              size="icon"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">WhatsApp</span>
            </Button>
          </div>
        </div>

        {/* Mobile Search - Enhanced UI */}
        {isSearchVisible && (
          <div className="lg:hidden mt-3 pb-2">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="pl-12 pr-4 h-12 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SecondaryNavbar;
