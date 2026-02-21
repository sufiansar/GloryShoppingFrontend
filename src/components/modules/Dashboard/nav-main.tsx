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
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        )}
                      >
                        {Icon && (
                          <Icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive ? "text-blue-600" : "text-gray-400",
                            )}
                          />
                        )}
                        <span className="flex-1 truncate">{item.title}</span>

                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto rounded-md px-2 py-0.5 text-xs font-semibold",
                              isActive
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600",
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
