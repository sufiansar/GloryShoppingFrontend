"use client";

import React from "react";
import { MessageSquare, Clock, User, ArrowRight } from "lucide-react";
import { useSocket } from "@/providers/SocketProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NotificationDropdown() {
  const { notifications, clearNotifications } = useSocket();

  if (notifications.length === 0) {
    return (
      <div className="w-80 p-6 text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-900">No new notifications</p>
        <p className="text-xs text-gray-500 mt-1">When you get messages, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="w-80 flex flex-col max-h-[480px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">Recent Notifications</h3>
        <button 
          onClick={clearNotifications}
          className="text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        {notifications.map((notif, index) => {
          const senderName = notif.message?.senderName || notif.title?.split(" from ")?.[1] || "Guest";
          const content = notif.message?.content || notif.body || "New support request";
          const time = new Date(notif.message?.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <Link
              key={index}
              href="/admin/dashboard/chat"
              className={cn(
                "flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group",
              )}
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200 text-purple-600">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900 truncate">{senderName}</p>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{time}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                  {content}
                </p>
                <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-purple-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
                  Open Chat <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Link 
        href="/admin/dashboard/chat"
        className="block w-full py-3 text-center text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
      >
        View All Conversations
      </Link>
    </div>
  );
}
