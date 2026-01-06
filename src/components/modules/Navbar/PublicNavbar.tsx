// components/navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavItem, navItems } from "@/components/Shared/NavItems/Navitems";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden bg-transparent border border-white/30 hover:border-white/70"
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-75 sm:w-100 bg-[#6b205a] border-[#6b205a]"
      >
        <div className="flex flex-col space-y-4 mt-8">
          {navItems.map((item) => (
            <div key={item.title} className="space-y-2">
              <Link
                href={item.href}
                className="text-lg font-medium text-white hover:text-white/80 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Link>
              {item.subItems && (
                <div className="pl-4 space-y-2 border-l-2 border-white/20">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="block text-sm text-white/80 hover:text-white transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const NavDropdown = ({ item }: { item: NavItem }) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="px-4 py-2 hover:bg-[#ca428b] rounded-md transition-colors text-white data-[state=open]:bg-[#ca428b] border border-white/30 hover:border-white bg-transparent">
        {item.title}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-[#6b205a] border-[#6b205a] text-white">
        <div className="grid gap-3 p-6 md:w-100 lg:w-125 lg:grid-cols-2">
          {item.featured && item.featured.length > 0 && (
            <>
              {item.featured.map((featuredItem) => (
                <Link
                  key={featuredItem.title}
                  href={featuredItem.href}
                  className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10"
                >
                  <div className="text-sm font-medium leading-none text-white">
                    {featuredItem.title}
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-white/80">
                    {featuredItem.description}
                  </p>
                </Link>
              ))}
              <div className="h-px bg-white/20 lg:col-span-2" />
            </>
          )}
          <div className={`${item.featured ? "lg:col-span-2" : ""}`}>
            <div className="grid grid-cols-2 gap-3">
              {item.subItems?.map((subItem) => (
                <Link
                  key={subItem.title}
                  href={subItem.href}
                  className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10"
                >
                  <div className="text-sm font-medium leading-none text-white">
                    {subItem.title}
                  </div>
                  {subItem.description && (
                    <p className="line-clamp-2 text-sm leading-snug text-white/80">
                      {subItem.description}
                    </p>
                  )}
                  {/* Nested sub-items */}
                  {subItem.subItems && (
                    <div className="mt-2 space-y-1">
                      {subItem.subItems.map((nestedItem) => (
                        <Link
                          key={nestedItem.title}
                          href={nestedItem.href}
                          className="block text-xs text-white/80 hover:text-white"
                        >
                          {nestedItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

// Main Navbar Component
const Navbar = ({ cartCount = 3 }: { cartCount?: number }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#ca428b] backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <MobileNav />
            <Link href="/" className="ml-4 flex items-center space-x-2 md:ml-0">
              {/* <span className="text-xl font-bold text-white">ChetceLrcacy</span> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-2">
                {navItems.map((item) => (
                  <NavDropdown key={item.title} item={item} />
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex text-white hover:bg-[#ca428b] hover:text-white border border-white/30 hover:border-white bg-transparent"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User Account */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#ca428b] hover:text-white border border-white/30 hover:border-white bg-transparent"
              asChild
            >
              <Link href="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Shopping Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-[#ca428b] hover:text-white border border-white/30 hover:border-white bg-transparent"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-white text-[#ca428b]">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
