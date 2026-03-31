"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageSquare, Clock, User } from "lucide-react";
import { IChat } from "@/types/chat.interface";
import { cn } from "@/lib/utils";

interface ChatListProps {
  chats: IChat[];
  selectedChat?: IChat;
  onSelectChat: (chat: IChat) => void;
  isLoading?: boolean;
}

export function ChatList({
  chats,
  selectedChat,
  onSelectChat,
  isLoading = false,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(
    (chat) =>
      (chat.subject &&
        chat.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (chat.userId && chat.userId.includes(searchQuery)) ||
      (chat.guestEmail && chat.guestEmail.includes(searchQuery)),
  );

  return (
    <Card className="flex flex-col h-full bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-500/30">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-purple-500/20 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <h2 className="font-bold text-gray-900 dark:text-white mb-3">
          Chat Conversations
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-500/30"
          />
        </div>
      </div>

      {/* Chats List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-purple-200/50">Loading...</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <div>
              <MessageSquare className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-purple-200/50">
                {searchQuery ? "No chats found" : "No active chats"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 border",
                  selectedChat?.id === chat.id
                    ? "bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-300 dark:border-purple-500"
                    : "border-transparent hover:border-purple-200 dark:hover:border-purple-500/30",
                )}
              >
                {/* Chat Info */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {chat.subject}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {chat.userId ? (
                        <>
                          <User className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-purple-200/70">
                            User
                          </span>
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-purple-200/70 truncate">
                            {chat.guestEmail || "Guest"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status & Unread */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge
                      className={cn(
                        chat.status === "OPEN"
                          ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300",
                      )}
                    >
                      {chat.status}
                    </Badge>
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white dark:bg-red-500">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Last Message Preview */}
                {chat.lastMessage && (
                  <p className="text-xs text-gray-600 dark:text-purple-200/70 line-clamp-1 mb-2">
                    {chat.lastMessage.content}
                  </p>
                )}

                {/* Time */}
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-purple-200/50">
                  <Clock className="h-3 w-3" />
                  {new Date(chat.updatedAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
