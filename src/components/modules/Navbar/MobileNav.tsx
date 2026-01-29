"use client";
import { navItems } from "@/components/Shared/NavItems/Navitems";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plus, Minus } from "lucide-react";
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
        <div className="flex flex-col mt-8 h-full">
          {navItems.map((item) => (
            <div key={item.title} className="space-y-2 px-4">
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  className="text-lg font-semibold text-white hover:text-white/80 transition-colors flex-1"
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
                  <div className="animate-in slide-in-from-top-2 duration-200 mb-4 bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                    {item.title === "BRAND" ? (
                      // Grid layout for BRAND items
                      <div className="grid grid-cols-2 gap-2 max-h-100 overflow-y-auto">
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
                      // List layout for other items
                      <div className="space-y-2 border-l-2 border-white/30 pl-4">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="block text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all py-2 px-3 rounded-md"
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
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
