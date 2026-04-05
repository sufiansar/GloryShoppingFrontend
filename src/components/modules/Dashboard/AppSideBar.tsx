"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import * as Icons from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { NavSection } from "@/types/dashboard.section";
import { NavMain } from "./nav-main";
import { IUserCreate } from "@/types/User.interface";
import logo from "@/components/Assets/Logo.png";
import Image from "next/image";
import LogoutButton from "../Navbar/Logout";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userInfo: IUserCreate | null;
  navItems: NavSection[];
}

export function AppSidebar({ userInfo, navItems, ...props }: AppSidebarProps) {
  const mappedSections = navItems?.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      icon: item.icon ? (Icons as any)[item.icon] : undefined,
    })),
  }));

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/50 bg-white/80 backdrop-blur-xl"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-slate-100 px-6 py-0 flex items-center justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent h-auto p-0">
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-custom shadow-lg shadow-primary-custom/20 ring-1 ring-white/20">
                  <Image
                    src={logo}
                    width={24}
                    height={24}
                    alt="logo"
                    className="brightness-0 invert"
                  />
                </div>
                <span className="text-base font-bold tracking-tight text-slate-900 group-data-[collapsible=icon]:hidden">
                  Glory Shopping BD
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 scrollbar-hide">
        <NavMain sections={mappedSections} />
      </SidebarContent>

      <div className="mt-auto border-t border-slate-100 p-4 group-data-[collapsible=icon]:p-2">
        {userInfo ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 overflow-hidden rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:ring-0 group-data-[collapsible=icon]:bg-transparent transition-all duration-300">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-custom to-secondary-custom shadow-md">
                <span className="text-sm font-bold text-white uppercase">
                  {userInfo.name?.charAt(0)}
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div className="flex flex-1 flex-col truncate group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {userInfo.name}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  {userInfo.role}
                </span>
              </div>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="group-data-[collapsible=icon]:hidden">
            <LogoutButton />
          </div>
        )}
      </div>
    </Sidebar>
  );
}
