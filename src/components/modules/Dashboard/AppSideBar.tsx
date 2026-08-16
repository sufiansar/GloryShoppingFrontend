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
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      className="border-r border-slate-200 bg-white group-data-[side=left]:border-r group-data-[side=right]:border-l py-0"
      {...props}
    >
      <div className="flex flex-col flex-1 min-h-0 bg-white transition-all duration-500">
        <SidebarHeader className="h-16 border-b border-slate-100 px-4 group-data-[collapsible=icon]:px-0 py-0 flex items-center group-data-[collapsible=icon]:justify-center">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center justify-between">
              <div className="group-data-[collapsible=icon]:hidden w-full">
                <SidebarMenuButton asChild className="hover:bg-slate-50 h-auto p-2 rounded-lg group/logo">
                  <Link href="/admin/dashboard" className="flex items-center gap-3">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary-custom text-white font-bold text-lg">
                      G
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-slate-900 leading-none">
                        Glory Shop
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </div>
              <div className="hidden group-data-[collapsible=icon]:flex w-full justify-center">
                 <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
              </div>
              <div className="group-data-[collapsible=icon]:hidden ml-2">
                 <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto group-data-[collapsible=icon]:overflow-y-auto px-3 group-data-[collapsible=icon]:px-1 py-4 scrollbar-hide">
          <NavMain sections={mappedSections} />
        </SidebarContent>

        <div className="mt-auto p-4 group-data-[collapsible=icon]:p-2 shrink-0">
          {userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 bg-pink-50 hover:bg-pink-100 rounded-xl p-3 border border-pink-100 group-data-[collapsible=icon]:p-1.5 transition-all duration-300 cursor-pointer">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-pink-100">
                    <span className="text-sm font-bold text-primary-custom uppercase">
                      {userInfo.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col truncate group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {userInfo.name}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {userInfo.email || userInfo.role}
                    </span>
                  </div>
                  <Icons.ChevronsUpDown className="ml-auto h-4 w-4 text-slate-500 group-data-[collapsible=icon]:hidden" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="top">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100">
                    <span className="text-xs font-bold text-primary-custom uppercase">
                      {userInfo.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {userInfo.name}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {userInfo.email || userInfo.role}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard/profile" className="cursor-pointer flex items-center gap-2">
                    <Icons.User className="h-4 w-4" /> Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                  <div className="w-full flex items-center">
                    <LogoutButton />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex justify-center group-data-[collapsible=icon]:hidden">
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
