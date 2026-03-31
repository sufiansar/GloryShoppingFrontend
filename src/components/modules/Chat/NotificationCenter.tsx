"use client";

import { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INotification } from "@/types/chat.interface";
import { markNotificationAsRead } from "@/action/notification/notification.action";
import { cn } from "@/lib/utils";

interface NotificationCenterProps {
  notifications: INotification[];
  onNotificationClick?: (notification: INotification) => void;
  onRefresh?: () => void;
}

export function NotificationCenter({
  notifications,
  onNotificationClick,
  onRefresh,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(notifications);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.success) {
        setItems(
          items.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDismiss = (notificationId: string) => {
    setItems(items.filter((n) => n.id !== notificationId));
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-purple-300" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-purple-500/30 shadow-2xl z-50 max-h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-purple-500/20 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  className="text-xs hover:bg-purple-100 dark:hover:bg-purple-500/20"
                >
                  Mark all as read
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-200 dark:hover:bg-slate-800 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {items.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-center">
                <div>
                  <Bell className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-purple-200/50">
                    No notifications yet
                  </p>
                </div>
              </div>
            ) : (
              items.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 border-b border-gray-100 dark:border-purple-500/10 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer",
                    !notification.isRead &&
                      "bg-purple-50 dark:bg-purple-900/10 border-l-4 border-l-purple-500",
                  )}
                  onClick={() => {
                    if (onNotificationClick) {
                      onNotificationClick(notification);
                    }
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {!notification.isRead ? (
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                      ) : (
                        <Check className="h-4 w-4 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-purple-200/70 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-purple-200/50 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(notification.id);
                      }}
                      className="hover:bg-gray-200 dark:hover:bg-slate-700 p-1 rounded shrink-0"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-purple-500/20 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/10"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
