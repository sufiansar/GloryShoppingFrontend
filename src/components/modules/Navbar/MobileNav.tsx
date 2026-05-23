"use client";
import { navItems } from "@/components/Shared/NavItems/Navitems";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plus, Minus, Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isExpanded = (title: string) => expandedItems.includes(title);

  // Filter out HOME — accessible via logo; all categories including SKINCARE shown first
  const menuItems = navItems.filter((item) => item.title !== "HOME");

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
        className="w-full sm:w-100 bg-linear-to-b from-[#6b205a] to-[#4a1440] border-[#6b205a] overflow-y-auto p-0"
      >
        {/* Header with Home link */}
        <div className="px-4 py-4 border-b border-white/10 flex items-center gap-2">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <Home className="h-4 w-4 text-white/70" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Home</span>
          </Link>
        </div>

        {/* All nav items starting from SKINCARE */}
        <div className="flex flex-col py-2">
          {menuItems.map((item, idx) => (
            <div key={item.title}>
              <div className="px-4 py-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className="text-base font-semibold text-white hover:text-white/80 transition-colors flex-1 py-2"
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.subItems && item.subItems.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/10"
                      onClick={() => toggleItem(item.title)}
                    >
                      {isExpanded(item.title) ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                {item.subItems &&
                  item.subItems.length > 0 &&
                  isExpanded(item.title) && (
                    <div className="animate-in slide-in-from-top-2 duration-200 mb-2 bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                      {item.title === "BRAND" ? (
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="text-xs text-white/90 hover:text-white hover:bg-white/20 transition-all py-2 px-2 rounded-md text-center font-medium border border-white/10 hover:border-white/30"
                              onClick={() => setOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1 border-l-2 border-white/30 pl-3 max-h-60 overflow-y-auto">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="block text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all py-1.5 px-2 rounded-md"
                              onClick={() => setOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
              </div>
              {/* Divider */}
              {idx < menuItems.length - 1 && (
                <div className="mx-4 h-px bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
