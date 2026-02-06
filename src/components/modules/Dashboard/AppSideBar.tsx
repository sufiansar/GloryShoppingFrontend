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
      className="bg-white border-r border-gray-200 shadow-xl"
      {...props}
    >
      <SidebarHeader className="border-b border-gray-200 bg-white py-5 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:scale-110 active:scale-95 transition-transform duration-300"
            >
              <Link
                href="/dashboard"
                className="text-xl font-bold flex items-center justify-center"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-lg group-hover:blur-xl opacity-60 group-hover:opacity-80 transition-all duration-300" />
                  <div className="relative p-3 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/40 shadow-lg">
                    <Image
                      src={logo}
                      width={40}
                      height={40}
                      alt="logo"
                      className="rounded-lg"
                    />
                  </div>
                </div>
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
        <SidebarMenuItem className="mx-3 mb-4 px-4 py-4 bg-primary/5 border border-primary/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/40 rounded-full blur-lg opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="relative w-12 h-12 rounded-full bg-primary border-2 border-primary/30 flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="text-base font-black text-white drop-shadow-lg">
                    {userInfo.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate group-hover:text-primary transition-colors">
                  {userInfo.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-600 truncate group-hover:text-gray-700 transition-colors">
                  {userInfo.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-primary text-white border border-primary/30 font-bold shadow-md drop-shadow-md">
                {userInfo.role}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-primary/20">
            <LogoutButton />
          </div>
        </SidebarMenuItem>
      )}
    </Sidebar>
  );
}
