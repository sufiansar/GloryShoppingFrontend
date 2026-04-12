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
      className="border-none bg-transparent group-data-[side=left]:pl-4 group-data-[side=right]:pr-4 py-4"
      {...props}
    >
      <div className="flex flex-col h-full rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 group-data-[collapsible=icon]:rounded-[2rem]">
        <SidebarHeader className="h-20 border-b border-slate-200/20 px-6 py-0 flex items-center">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-transparent h-auto p-0 group/logo">
                <Link href="/admin/dashboard" className="flex items-center gap-4">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-custom shadow-xl shadow-primary-custom/30 ring-2 ring-white/20 transition-transform duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-3">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
                    <Image
                      src={logo}
                      width={24}
                      height={24}
                      alt="logo"
                      className="brightness-0 invert relative z-10"
                    />
                  </div>
                  <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                      Glory Shop
                    </span>
                    <span className="text-[10px] font-bold text-primary-custom tracking-[0.2em] uppercase mt-1 opacity-80">
                      Enterprise
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-3 py-6 scrollbar-hide">
          <NavMain sections={mappedSections} />
        </SidebarContent>

        <div className="mt-auto border-t border-slate-200/20 p-5 group-data-[collapsible=icon]:p-3">
          {userInfo ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 overflow-hidden rounded-[2rem] bg-white/30 dark:bg-slate-800/30 p-2.5 shadow-sm border border-white/20 dark:border-slate-700/50 group-data-[collapsible=icon]:p-1.5 transition-all duration-300">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-custom shadow-lg ring-2 ring-white/20">
                  <span className="text-sm font-black text-white uppercase mt-0.5">
                    {userInfo.name?.charAt(0)}
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-800 bg-primary-custom shadow-xs" />
                </div>
                <div className="flex flex-1 flex-col truncate group-data-[collapsible=icon]:hidden">
                  <span className="text-[13px] font-black text-slate-900 dark:text-white truncate">
                    {userInfo.name}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary-custom mt-0.5">
                    {userInfo.role}
                  </span>
                </div>
              </div>
              <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <div className="group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:rounded-xl transition-all duration-300">
                  <LogoutButton />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
