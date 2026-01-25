"use server";

import Link from "next/link";
// import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Search, User, Menu } from "lucide-react";
import { NavItem, navItems } from "@/components/Shared/NavItems/Navitems";
import { getSession, useSession } from "next-auth/react";
import UserMenu from "../Profile/ProfileForNavbar";
import { MobileNav } from "./MobileNav";
import { CartIcon } from "./CartIcon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";

const NavDropdown = ({ item }: { item: NavItem }) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="px-4 py-2 hover:bg-[#ca428b] rounded-md transition-colors text-white data-[state=open]:bg-[#ca428b] border border-white/30 hover:border-white bg-transparent">
        <Link href={item.href}>{item.title}</Link>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-[#6b205a] border-[#6b205a] text-white">
        <div className="grid gap-3 p-6 md:w-100 lg:w-125 lg:grid-cols-2">
          {/* View All link for main category */}
          <Link
            href={item.href}
            className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10 lg:col-span-2 border-2 border-white/30 font-semibold"
          >
            <div className="text-sm font-bold leading-none text-white">
              View All {item.title} Products
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-white/80">
              Browse all products in this category
            </p>
          </Link>

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
const Navbar = async () => {
  // const pathname = usePathname();
  const userInfo = await getServerSession(authOptions);
  console.log("SERVER SESSION:", userInfo);
  // const userInfo: any = await getSession();
  // console.log("SERVER SESSION:", userInfo);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#ca428b] backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <MobileNav />
            <Link href="/" className="ml-4 flex items-center space-x-2 md:ml-0">
              <span className="text-xl font-bold text-white">
                Glory Shopping
              </span>
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
              <UserMenu user={userInfo} />
            </Button>

            {/* Shopping Cart */}
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
