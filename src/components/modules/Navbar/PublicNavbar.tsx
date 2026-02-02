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
  // Calculate grid columns based on number of subitems
  const subItemCount = item.subItems?.length || 0;
  let gridCols = "grid-cols-2";
  let dropdownWidth = "md:w-100 lg:w-125";

  if (subItemCount > 20) {
    gridCols = "grid-cols-5";
    dropdownWidth = "w-[900px]";
  } else if (subItemCount > 12) {
    gridCols = "grid-cols-4";
    dropdownWidth = "w-[800px]";
  } else if (subItemCount > 8) {
    gridCols = "grid-cols-3";
    dropdownWidth = "w-[600px]";
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="px-4 py-2 hover:bg-[#ca428b] rounded-md transition-colors text-white data-[state=open]:bg-[#ca428b] border border-white/30 hover:border-white bg-transparent">
        <Link href={item.href}>{item.title}</Link>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-[#6b205a] border-[#6b205a] text-white overflow-hidden">
        <div className={`grid gap-3 p-6 ${dropdownWidth}`}>
          {/* View All link for main category */}
          {!item.title.includes("BRAND") && (
            <>
              <Link
                href={item.href}
                className="block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10 col-span-full border-2 border-white/30 font-semibold"
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
                  <div className="flex gap-3 col-span-full">
                    {item.featured.map((featuredItem) => (
                      <Link
                        key={featuredItem.title}
                        href={featuredItem.href}
                        className="flex-1 block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10"
                      >
                        <div className="text-sm font-medium leading-none text-white">
                          {featuredItem.title}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-white/80">
                          {featuredItem.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <div className="h-px bg-white/20 col-span-full" />
                </>
              )}
            </>
          )}

          {/* Grid layout for all subitems */}
          <div
            className={`col-span-full grid ${gridCols} gap-2 ${subItemCount > 15 ? "max-h-100 overflow-y-auto pr-2" : ""}`}
          >
            {item.subItems?.map((subItem) => (
              <Link
                key={subItem.title}
                href={subItem.href}
                className="block text-center text-xs font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all py-2 px-2 rounded-md border border-white/10 hover:border-white/30"
              >
                {subItem.title}
              </Link>
            ))}
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
  // const canAccessDashboard =
  //   userInfo?.user?.role === "SUPER_ADMIN" || userInfo?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#ca428b] backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <MobileNav />
            {/* <Link href="/" className="ml-4 flex items-center space-x-2 md:ml-0">
              <span className="text-xl font-bold text-white">
                Glory Shopping
              </span>
            </Link> */}
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
