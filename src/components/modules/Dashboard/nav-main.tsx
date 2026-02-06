"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NavSection as Section } from "@/types/dashboard.section";

interface NavMainProps {
  sections: Section[];
}

export function NavMain({ sections }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="space-y-4 py-3">
      <SidebarGroupContent className="flex flex-col gap-5 px-2">
        {sections?.map((section, idx) => (
          <div key={idx} className="space-y-3">
            {section.title && (
              <div className="flex items-center gap-2 px-3 py-2">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-90">
                  {section.title}
                </h4>
                <div className="h-0.5 flex-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
              </div>
            )}

            <SidebarMenu className="gap-2">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon as unknown as React.ComponentType<{
                  className: string;
                }>;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="px-2"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/30 border border-primary/50 scale-105"
                            : "text-gray-700 hover:bg-primary/5 hover:text-gray-900 border border-transparent hover:border-primary/20 hover:scale-102",
                        )}
                      >
                        <div
                          className={cn(
                            "relative z-10 p-2.5 rounded-lg transition-all duration-300",
                            isActive
                              ? "bg-white/25 backdrop-blur-sm shadow-md"
                              : "bg-primary/10 group-hover:bg-primary/20",
                          )}
                        >
                          {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        </div>
                        <span className="flex-1 truncate font-semibold">
                          {item.title}
                        </span>

                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap shadow-md transition-all",
                              isActive
                                ? "bg-white/35 text-white shadow-md"
                                : "bg-primary/10 text-primary group-hover:bg-primary/20",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}

                        {isActive && (
                          <>
                            <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-white/15 to-primary/0 z-0" />
                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full bg-white/50 shadow-lg" />
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            {idx < sections.length - 1 && (
              <Separator className="my-2 bg-gray-200" />
            )}
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
