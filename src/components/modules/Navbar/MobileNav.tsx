"use client";
import { navItems } from "@/components/Shared/NavItems/Navitems";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const MobileNav = () => {
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
