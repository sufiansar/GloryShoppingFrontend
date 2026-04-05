"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Search, MessageCircle, Send, MessageSquare, Loader2, Package, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getAllProducts } from "@/action/product/product.action";

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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
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
      setShowResults(false);
    }
  };

  // Real-time Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 1) {
        setIsSearching(true);
        setShowResults(true);
        try {
          const res = await getAllProducts(`searchTerm=${searchTerm}&limit=6`);
          if (res?.data) {
            const products = res.data.data || res.data || [];
            console.log("Search results received:", products);
            setSearchResults(Array.isArray(products) ? products : []);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node);

      if (isOutsideDesktop && isOutsideMobile) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <nav className="relative z-[100] w-full bg-white shadow-xl border-b border-gray-100 font-sans">
      <div className="w-full px-4 lg:px-8 xl:px-12">
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
                  Glory Shopping BD
                </span>
                <span className="text-[10px] sm:text-xs md:text-xs text-gray-600 font-semibold tracking-wide uppercase">
                  Premium Beauty & Skincare
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Search - Enhanced UI */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2" ref={desktopSearchRef}>
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
                  onFocus={() => {
                    if (searchTerm.length >= 1) {
                      setShowResults(true);
                    }
                  }}
                />

                {/* Loader or Clear Button */}
                <div className="absolute right-14 top-1/2 -translate-y-1/2">
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 text-[#ca428b] animate-spin" />
                  ) : searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white border-2 border-[#ca428b] text-[#ca428b] hover:bg-[#ca428b] hover:text-white transition-all hover:scale-110 flex items-center justify-center group-focus-within:shadow-[0_0_20px_rgba(202,66,139,0.4)] hover:shadow-[0_0_20px_rgba(202,66,139,0.4)]"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {/* Real-time Results Dropdown */}
              {showResults && searchTerm.trim().length >= 1 && (
                <div className="absolute top-full left-4 right-4 mt-4 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {isSearching ? "Searching..." : `Search Results (${searchResults.length})`}
                    </span>
                    {searchTerm && (
                      <Link
                        href={`/product?searchTerm=${searchTerm}`}
                        onClick={() => setShowResults(false)}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-custom hover:underline"
                      >
                        View All
                      </Link>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                    {isSearching ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-8 w-8 text-primary-custom animate-spin" />
                        <p className="text-xs font-bold text-slate-400 animate-pulse">Finding matching products...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((product, index) => (
                        <Link
                          key={product.id || product.slug || index}
                          href={`/product/${product.slug}`}
                          onClick={() => {
                            setShowResults(false);
                            setSearchTerm("");
                          }}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                            {product.thumbleImage ? (
                              <Image
                                src={product.thumbleImage}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-custom transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-[10px] font-semibold text-slate-400 truncate tracking-tight uppercase">
                              {product?.category?.name || "Premium Product"}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-slate-900">${product.price.toLocaleString()}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center gap-4 text-center px-6">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                          <Search className="h-6 w-6 text-slate-300" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900">No results found</p>
                          <p className="text-xs font-medium text-slate-400">Try searching with different keywords</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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

            {/* Chat Button - Premium UI */}
            <div className="relative z-30">
              <button
                onClick={handleChatClick}
                className="relative bg-linear-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white h-[42px] px-3 sm:px-5 rounded-full transition-all shadow-sm hover:shadow-lg hover:shadow-pink-500/30 font-semibold flex items-center justify-center gap-2 group active:scale-95 border-none outline-none"
                title="Live Chat Support"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300" />
                <MessageSquare className="h-4 w-4 sm:h-[18px] sm:w-[18px] relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline text-[13px] sm:text-[14px] font-bold relative z-10 tracking-wide">Chat</span>
              </button>
              {unreadCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] flex items-center justify-center bg-red-600 text-white text-[10px] font-extrabold px-1.5 rounded-full shadow-md z-40 border-2 border-white animate-bounce">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </div>

            {/* Messenger Button - Premium UI */}
            <div className="relative z-30">
              <button
                onClick={handleMessengerClick}
                className="relative bg-linear-to-r from-[#0084FF] to-[#0064C8] hover:from-[#0064C8] hover:to-[#004A99] text-white h-[42px] px-3 sm:px-5 rounded-full transition-all shadow-sm hover:shadow-lg hover:shadow-blue-500/30 font-semibold flex items-center justify-center gap-2 group active:scale-95 border-none outline-none"
                title="Chat on Messenger"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300" />
                <Send className="h-4 w-4 sm:h-[18px] sm:w-[18px] relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline text-[13px] sm:text-[14px] font-bold relative z-10 tracking-wide">Messenger</span>
              </button>
            </div>

            {/* WhatsApp Button - Premium UI */}
            <div className="hidden sm:flex relative z-30">
              <button
                onClick={handleWhatsAppClick}
                className="relative bg-linear-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white h-[42px] px-3 sm:px-5 rounded-full transition-all shadow-sm hover:shadow-lg hover:shadow-green-500/30 font-semibold flex items-center justify-center gap-2 group active:scale-95 border-none outline-none"
                title="Chat on WhatsApp"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300" />
                <MessageCircle className="h-4 w-4 sm:h-[18px] sm:w-[18px] relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[13px] sm:text-[14px] font-bold relative z-10 tracking-wide">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search - Enhanced UI */}
        {isSearchVisible && (
          <div className="lg:hidden mt-3 pb-2 relative" ref={mobileSearchRef}>
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

            {/* Mobile Results Dropdown */}
            {showResults && searchTerm.trim().length >= 1 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-[350px] overflow-y-auto scrollbar-hide py-2">
                  {isSearching ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 text-primary-custom animate-spin" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((product, index) => (
                      <Link
                        key={product.id || product.slug || index}
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          setShowResults(false);
                          setIsSearchVisible(false);
                          setSearchTerm("");
                        }}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                          {product.thumbleImage ? (
                            <Image
                              src={product.thumbleImage}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{product.name}</h4>
                          <span className="text-xs font-black text-primary-custom">${product.price}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="py-8 text-center text-xs font-bold text-slate-400">No results found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default SecondaryNavbar;
