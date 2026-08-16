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
    <header className="flex sticky top-0 z-50 h-16 shrink-0 items-center gap-2 bg-white border-b border-slate-100 transition-all duration-300">
      <div className="flex w-full items-center gap-4 px-4 md:px-8">
        <div className="flex items-center gap-2 group">
          <SidebarTrigger className="h-10 w-10 hover:bg-primary-custom/10 hover:text-primary-custom rounded-xl text-slate-500 transition-all duration-300 active:scale-90" />
          <div className="hidden h-6 w-[1px] bg-slate-200/50 dark:bg-slate-800/50 md:block mx-2" />
          <h1 className="text-xs font-black tracking-[0.2em] text-slate-400 hidden md:block uppercase group-hover:text-primary-custom transition-colors">
            Operations Center
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {/* Search Bar - Premium Visuals */}
          <div className="hidden lg:flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-primary/40 dark:border-primary/40 w-72 group focus-within:ring-4 focus-within:ring-primary-custom/10 focus-within:border-primary-custom/30 transition-all duration-500 premium-input-focus">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary-custom transition-colors" />
            <input 
              type="text" 
              placeholder="Search products by name, brand, or category..." 
              className="bg-transparent border-none outline-none text-xs font-medium text-slate-600 dark:text-slate-300 placeholder:text-slate-400 w-full"
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <div className="flex items-center gap-1 md:gap-2 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
            {isAdmin && (
              <>
                <Link
                  href="/admin/dashboard/chat"
                  className="relative p-2.5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:shadow-primary-custom/5 rounded-xl transition-all duration-300 text-slate-500 hover:text-primary-custom group active:scale-95"
                  title="Communication Terminal"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary-custom ring-2 ring-white dark:ring-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Popover onOpenChange={(open) => open && setNotificationCount(0)}>
                  <PopoverTrigger asChild>
                    <button
                      className="relative p-2.5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:shadow-primary-custom/5 rounded-xl transition-all duration-300 text-slate-500 hover:text-primary-custom group focus:outline-none active:scale-95"
                      title="Alert System"
                    >
                      <Bell className="w-5 h-5" />
                      {notificationCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-3.5 w-3.5 items-center justify-center bg-primary-custom rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse text-[8px] font-bold text-white">
                          {notificationCount}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-85 mt-3 shadow-[0_20px_50px_rgba(194,88,145,0.15)] border-white/20 dark:border-slate-800/50 rounded-3xl overflow-hidden glass-card" align="end">
                    <NotificationDropdown />
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>

          <div className="h-8 w-[1px] bg-slate-200/50 dark:bg-slate-800/50 mx-1"></div>

          <div className="hover:scale-110 transition-all duration-500 hover:rotate-2">
            <UserDropdown userInfo={userInfo} />
          </div>
        </div>
      </div>
    </header>
  );
}
