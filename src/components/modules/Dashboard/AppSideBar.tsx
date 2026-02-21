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
      collapsible="offcanvas"
      className="bg-white border-r border-gray-100"
      {...props}
    >
      <SidebarHeader className="border-b border-gray-100 bg-white py-6 px-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <Image
                  src={logo}
                  width={40}
                  height={40}
                  alt="logo"
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-gray-900">
                  Glory Shopping BD
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto scrollbar-hide">
        <NavMain sections={mappedSections} />
      </SidebarContent>

      {mappedSections?.length > 0 && <Separator className="my-4 bg-gray-200" />}

      {userInfo && (
        <SidebarMenuItem className="mx-4 mb-4 px-3 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br bg-pink-500 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-sm font-bold text-white">
                {userInfo.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {userInfo.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 truncate">{userInfo.role}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <LogoutButton />
          </div>
        </SidebarMenuItem>
      )}
    </Sidebar>
  );
}
