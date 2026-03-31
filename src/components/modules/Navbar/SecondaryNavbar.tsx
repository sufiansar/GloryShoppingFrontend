"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, MessageCircle, Send, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LogoutButton from "./Logout";
import logo from "@/components/Assets/Logo.png";

const SecondaryNavbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2); // Demo: replace with real count from state/context
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

  const handleChatClick = () => {
    // Signal the floating chat to open
    window.dispatchEvent(new CustomEvent("openFloatingChat"));
  };

  return (
    <nav className="top-0 z-50 w-full bg-white shadow-xl border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <div className="relative flex items-center gap-3">
              {/* Glowing background */}
              <div className="absolute -inset-3 bg-linear-to-br from-[#ca428b] to-[#f59e0b] rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 blur-xl group-hover:blur-2xl" />

              {/* Logo container with border */}
              <div className="relative bg-linear-to-br from-white to-gray-50 rounded-xl p-2 border border-gray-200 group-hover:border-[#ca428b]/50 transition-all duration-300 shadow-md group-hover:shadow-xl">
                <Image
                  src={logo}
                  alt="Logo"
                  className="h-10 w-auto sm:h-12 md:h-16 lg:h-20 transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>

              {/* Brand text */}
              <div className="flex flex-col gap-0.5">
                <span className="text-sm sm:text-base md:text-lg font-black bg-linear-to-r from-[#ca428b] via-pink-500 to-[#f59e0b] bg-clip-text text-transparent drop-shadow-sm">
                  Glory Shopping
                </span>
                <span className="text-[10px] sm:text-xs md:text-xs text-gray-600 font-semibold tracking-wide uppercase">
                  Premium Beauty & Skincare
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Search - Enhanced UI */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <form
              onSubmit={handleSearch}
              className="relative w-96 2xl:w-120 group"
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#ca428b]/30 via-purple-300/30 to-[#f59e0b]/30 rounded-full opacity-0 group-focus-within:opacity-100 transition-all duration-300 blur-2xl group-hover:blur-3xl" />
              <div className="absolute inset-0 bg-linear-to-r from-[#ca428b]/20 to-[#f59e0b]/20 rounded-full opacity-0 group-focus-within:opacity-60 transition-all duration-300 blur-xl" />
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#ca428b] via-pink-500 to-[#f59e0b] opacity-0 group-focus-within:opacity-100 transition-opacity p-[2.5px]">
                  <div className="w-full h-full rounded-full bg-white" />
                </div>
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ca428b] transition-all group-focus-within:text-[#f59e0b] group-focus-within:scale-110" />
                <Input
                  type="search"
                  placeholder="Search for amazing products..."
                  className="relative pl-16 pr-14 h-14 rounded-full border-2 border-gray-200 group-focus-within:border-transparent focus:border-transparent focus:ring-0 transition-all shadow-lg group-hover:shadow-2xl group-focus-within:shadow-[0_0_30px_rgba(202,66,139,0.25)] bg-linear-to-r from-white via-gray-50 to-white font-medium text-gray-800 placeholder:text-gray-500 hover:border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Search Button */}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border-2 border-[#ca428b] text-[#ca428b] hover:bg-[#ca428b] hover:text-white transition-all hover:scale-110 flex items-center justify-center group-focus-within:shadow-[0_0_20px_rgba(202,66,139,0.4)] hover:shadow-[0_0_20px_rgba(202,66,139,0.4)]"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100 text-gray-700"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Chat Button - Enhanced UI */}
            <div className="relative z-30">
              <Button
                onClick={handleChatClick}
                className="relative bg-linear-to-r from-purple-500 via-pink-500 to-rose-600 hover:from-purple-600 hover:via-pink-600 hover:to-rose-700 text-white h-10 w-10 sm:h-11 sm:w-auto sm:px-5 rounded-full transition-all shadow-lg hover:shadow-2xl hover:scale-110 font-semibold border border-pink-300/60 hover:border-pink-200 flex items-center gap-1.5 group overflow-hidden active:scale-95"
                size="icon"
                title="Live Chat Support"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                <div className="relative z-10">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 relative shrink-0 group-hover:scale-125 transition-transform duration-300" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold p-0 rounded-full animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </div>
                <span className="hidden sm:inline text-xs sm:text-sm font-bold whitespace-nowrap">
                  Chat
                </span>
              </Button>
            </div>

            {/* Messenger Button - Enhanced UI */}
            <div className="relative z-30">
              <Button
                onClick={handleMessengerClick}
                className="bg-linear-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white h-10 w-10 sm:h-11 sm:w-auto sm:px-5 rounded-full transition-all shadow-lg hover:shadow-2xl hover:scale-110 font-semibold border border-blue-300/60 hover:border-blue-200 flex items-center gap-1.5 group relative overflow-hidden active:scale-95"
                size="icon"
                title="Chat on Messenger"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                <Send className="h-4 w-4 sm:h-5 sm:w-5 relative shrink-0 group-hover:scale-125 transition-transform duration-300 z-10" />
                <span className="hidden sm:inline text-xs sm:text-sm font-bold whitespace-nowrap">
                  Messenger
                </span>
              </Button>
            </div>

            {/* WhatsApp Button - Enhanced UI */}
            <div className="hidden sm:flex relative z-30">
              <Button
                onClick={handleWhatsAppClick}
                className="bg-linear-to-r from-green-400 via-green-500 to-emerald-600 hover:from-green-500 hover:via-green-600 hover:to-emerald-700 text-white h-11 px-5 rounded-full transition-all shadow-lg hover:shadow-2xl hover:scale-110 font-semibold border border-green-300/60 hover:border-green-200 flex items-center gap-1.5 group relative overflow-hidden active:scale-95"
                size="icon"
                title="Chat on WhatsApp"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                <MessageCircle className="h-5 w-5 relative shrink-0 group-hover:scale-125 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-bold whitespace-nowrap relative z-10">
                  WhatsApp
                </span>
              </Button>
            </div>
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
