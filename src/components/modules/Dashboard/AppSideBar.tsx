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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="text-xl font-bold">
                <Image src={logo} width={60} height={60} alt="logo" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain sections={mappedSections} />
      </SidebarContent>
      {mappedSections?.length > 0 && <Separator className="my-3" />}
      {userInfo && (
        <SidebarMenuItem className="mt-3 px-2">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-primary">
              {userInfo.name || "Unknown"}
            </p>
            <p className="text-xs font-bold">{userInfo.email}</p>
            <p className="text-[12px] font-bold text-gray-500 mt-1">
              Role: {userInfo.role}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-red-600 cursor-pointer">
            <LogoutButton />
          </div>
        </SidebarMenuItem>
      )}
    </Sidebar>
  );
}
