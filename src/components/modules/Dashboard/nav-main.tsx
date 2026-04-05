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
    <SidebarGroup className="py-4">
      <SidebarGroupContent className="flex flex-col gap-1 px-4">
        {sections?.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <div className="px-3 py-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h4>
              </div>
            )}

            <SidebarMenu className="gap-1">
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
                      className="px-0"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 relative group",
                          isActive
                            ? "bg-primary-custom/10 text-primary-custom shadow-sm ring-1 ring-primary-custom/20"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-5",
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary-custom shadow-[0_0_8px_rgba(194,88,145,0.6)]" />
                        )}
                        {Icon && (
                          <Icon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                              isActive ? "text-primary-custom" : "text-slate-400 group-hover:text-slate-600",
                            )}
                          />
                        )}
                        <span className="flex-1 truncate tracking-tight">{item.title}</span>

                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                              isActive
                                ? "bg-primary-custom text-white shadow-lg shadow-primary-custom/30"
                                : "bg-slate-100 text-slate-500",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            {idx < sections.length - 1 && (
              <Separator className="my-3 bg-gray-100" />
            )}
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
