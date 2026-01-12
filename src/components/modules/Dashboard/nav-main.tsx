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
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-4">
        {sections?.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {section.title && (
              <h4 className="px-2 text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h4>
            )}

            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon as unknown as React.ComponentType<{
                  className: string;
                }>;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        <span className="flex-1 truncate">{item.title}</span>

                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto rounded-md px-2 py-0.5 text-xs",
                              isActive ? "bg-secondary" : "bg-primary/10"
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

            {idx < sections.length - 1 && <Separator className="my-3" />}
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
