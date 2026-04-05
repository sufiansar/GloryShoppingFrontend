"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "./UserDropDrown";
import { IUserCreate } from "@/types/User.interface";
import { Bell, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { useSocket } from "@/providers/SocketProvider";
import { NotificationDropdown } from "./NotificationDropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DashboardNavbarProps {
  userInfo: IUserCreate | null;
}

export function SiteHeader({ userInfo }: DashboardNavbarProps) {
  const { notifications, clearNotifications } = useSocket();
  const [notificationCount, setNotificationCount] = useState(0);
  const isAdmin = userInfo?.role === "ADMIN" || userInfo?.role === "SUPER_ADMIN";

  // Total unread notifications length
  const currentCount = notifications.length;

  useEffect(() => {
    setNotificationCount(currentCount);
  }, [currentCount]);

  const handleOpenNotifications = () => {
    // We could potentially mark as read here, but for now we just show
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="flex w-full items-center gap-4 px-4 md:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-9 w-9 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors" />
          <div className="hidden h-6 w-[1px] bg-slate-200 md:block mx-2" />
          <h1 className="text-sm font-bold tracking-tight text-slate-900 hidden md:block uppercase">
            Admin Central
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {/* Search Bar - Visual Only for now to look more like a real dashboard */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50 w-64 group focus-within:ring-2 focus-within:ring-primary-custom/20 focus-within:border-primary-custom/30 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-xs text-slate-600 placeholder:text-slate-400 w-full"
            />
          </div>

          <div className="flex items-center gap-1 md:gap-2 bg-slate-50 p-1 rounded-2xl ring-1 ring-slate-200/50">
            {isAdmin && (
              <>
                <Link
                  href="/admin/dashboard/chat"
                  className="relative p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600 hover:text-primary-custom group"
                  title="Support Chats"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                <Popover onOpenChange={(open) => open && setNotificationCount(0)}>
                  <PopoverTrigger asChild>
                    <button
                      className="relative p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600 hover:text-primary-custom group focus:outline-none"
                      title="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {notificationCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center bg-pink-500 rounded-full ring-2 ring-white animate-pulse" />
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-80 mt-2 shadow-2xl border-slate-100 rounded-2xl overflow-hidden" align="end">
                    <NotificationDropdown />
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

          <div className="hover:scale-105 transition-transform">
            <UserDropdown userInfo={userInfo} />
          </div>
        </div>
      </div>
    </header>
  );
}
