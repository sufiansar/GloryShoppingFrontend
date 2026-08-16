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
              <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
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
                  <SidebarMenuItem key={item.href} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="px-0 group-data-[collapsible=icon]:!w-11 group-data-[collapsible=icon]:!h-11"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 relative group",
                          "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
                          isActive
                            ? "bg-primary-custom text-white shadow-md"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        {Icon && (
                          <Icon
                            className={cn(
                              "shrink-0 transition-transform duration-300 group-hover:scale-110",
                              "h-5 w-5 group-data-[collapsible=icon]:!w-6 group-data-[collapsible=icon]:!h-6",
                              isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600",
                            )}
                          />
                        )}
                        <span className="flex-1 truncate tracking-tight group-data-[collapsible=icon]:hidden">{item.title}</span>

                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              isActive
                                ? "bg-white/20 text-white"
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
