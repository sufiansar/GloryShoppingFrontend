"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Search, Clock } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import { IChat, IMessage } from "@/types/chat.interface";
import { useSocket } from "@/providers/SocketProvider";

interface AdminChatListProps {
  onlineChats?: any[];
}

export function AdminChatList({ onlineChats = [] }: AdminChatListProps) {
  const { data: session } = useSession();
  const { chats: globalChats, isConnected } = useSocket();
  const [chats, setChats] = useState<IChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessagesCount, setNewMessagesCount] = useState<
    Record<string, number>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch all admin chats from backend on component mount
  useEffect(() => {
    const fetchAdminChats = async (pageNum = 1) => {
      try {
        const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
        setIsLoading(pageNum === 1);
        setIsLoadingMore(pageNum > 1);

        // Check if session and token are available
        if (!session?.accessToken) {
          console.warn("❌ No access token available, skipping chat fetch");
          console.log("Session object:", session);
          setChats([]);
          setIsLoading(false);
          setIsLoadingMore(false);
          return;
        }

        console.log(
          "🔍 Fetching admin chats from:",
          `${BASE_API}/chat/admin/all-chats?page=${pageNum}&limit=50`,
        );
        console.log("👤 Admin ID:", session?.user?.id);
        console.log(
          "🔑 Token:",
          session?.accessToken?.substring(0, 20) + "...",
        );

        const response = await fetch(
          `${BASE_API}/chat/admin/all-chats?page=${pageNum}&limit=50`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
            credentials: "include",
          },
        );

        console.log("📡 API Status:", response.status, response.statusText);
        const data = await response.json();
        console.log("📊 Admin chats response:", data);
        console.log("📊 data.data:", data.data);
        console.log("📊 data.meta:", data.meta);

        if (response.ok) {
          // Backend returns { data: [...chats], meta: {...} }
          let chatArray = [];

          console.log("🔍 Analyzing response structure:");
          console.log("  - Is data.data array?", Array.isArray(data.data));
          console.log("  - Is data array?", Array.isArray(data));
          console.log("  - data.data type:", typeof data.data);
          console.log("  - data type:", typeof data);
          console.log("  - data.data?.data type:", typeof data.data?.data);

          if (Array.isArray(data.data)) {
            chatArray = data.data;
            console.log("✅ Found chats in data.data");
          } else if (Array.isArray(data)) {
            chatArray = data;
            console.log("✅ Found chats in data directly");
          } else if (data.data && Array.isArray(data.data.data)) {
            chatArray = data.data.data;
            console.log("✅ Found chats in data.data.data");
          } else {
            console.log("⚠️ Could not find chats array in response");
            console.log("  - Full data keys:", Object.keys(data));
            if (data.data) {
              console.log("  - data.data keys:", Object.keys(data.data));
            }
          }

          console.log("✅ Chats parsed successfully. Count:", chatArray.length);

          if (chatArray.length > 0) {
            const fetchedChats: IChat[] = chatArray.map((chat: any) => ({
              id: chat.id,
              userId: chat.userId || null,
              guestId: chat.guestId || null,
              guestName: chat.guestName || null,
              guestEmail: chat.guestEmail || null,
              status: chat.status || "ACTIVE",
              messages: chat.messages || [],
              createdAt: new Date(chat.createdAt || new Date()),
              updatedAt: new Date(chat.updatedAt || new Date()),
              lastMessage: chat.lastMessage || null,
              senderInfo: chat.senderInfo || {
                type: chat.guestId ? "GUEST" : "USER",
                name: chat.guestName || "Guest",
                email: chat.guestEmail || null,
                id: chat.guestId || chat.userId || "",
              },
            }));

            if (pageNum === 1) {
              setChats(fetchedChats);
            } else {
              setChats((prev) => [...prev, ...fetchedChats]);
            }

            // Check if there are more pages
            setHasMore(fetchedChats.length === 50);
          } else {
            console.log("⚠️ No chats found in response");
            if (pageNum === 1) {
              setChats([]);
            }
            setHasMore(false);
          }
        } else {
          console.error("❌ Failed to fetch chats. Status:", response.status);
          console.error("Error response:", data);
          if (pageNum === 1) {
            setChats([]);
          }
          setHasMore(false);
        }
      } catch (error) {
        console.error("❌ Failed to fetch admin chats:", error);
        console.error("Error details:", (error as any)?.message);
        if (pageNum === 1) {
          setChats([]);
        }
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    const roleStr = String(session?.user?.role || "");
    const isAdmin =
      roleStr.includes("ADMIN") || roleStr.includes("SUPER_ADMIN");

    console.log("🔐 Role check:", roleStr, "| Is Admin:", isAdmin);
    console.log("🔑 Token available:", !!session?.accessToken);

    if (isAdmin && session?.accessToken) {
      console.log("🚀 Triggering fetch admin chats");
      fetchAdminChats(1);
    } else {
      console.log("⚠️ Skipping fetch - not admin or no token");
    }
  }, [session?.user?.role, session?.accessToken]);

  // Handle infinite scroll
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && session?.accessToken) {
      setPage((prev) => prev + 1);
      const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
      const fetchMore = async () => {
        try {
          setIsLoadingMore(true);

          // Check if token is available
          if (!session?.accessToken) {
            console.warn("No access token available, skipping load more");
            setIsLoadingMore(false);
            return;
          }

          const response = await fetch(
            `${BASE_API}/chat/admin/all-chats?page=${page + 1}&limit=50`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
              },
              credentials: "include",
            },
          );
          const data = await response.json();
          if (response.ok) {
            // Parse response - handle { data: [...], meta: {...} } format
            let chatArray = [];
            if (Array.isArray(data.data)) {
              chatArray = data.data;
            } else if (Array.isArray(data)) {
              chatArray = data;
            } else if (data.data && Array.isArray(data.data.data)) {
              chatArray = data.data.data;
            }

            if (chatArray.length > 0) {
              setChats((prev) => [
                ...prev,
                ...chatArray.map((chat: any) => ({
                  id: chat.id,
                  userId: chat.userId || null,
                  guestId: chat.guestId || null,
                  guestName: chat.guestName || null,
                  guestEmail: chat.guestEmail || null,
                  status: chat.status || "ACTIVE",
                  messages: chat.messages || [],
                  createdAt: new Date(chat.createdAt || new Date()),
                  updatedAt: new Date(chat.updatedAt || new Date()),
                  lastMessage: chat.lastMessage || null,
                  senderInfo: chat.senderInfo || {
                    type: chat.guestId ? "GUEST" : "USER",
                    name: chat.guestName || "Guest",
                    email: chat.guestEmail || null,
                    id: chat.guestId || chat.userId || "",
                  },
                })),
              ]);
              setHasMore(chatArray.length === 50);
            } else {
              setHasMore(false);
            }
          }
        } catch (error) {
          console.error("Failed to load more chats:", error);
          setHasMore(false);
        } finally {
          setIsLoadingMore(false);
        }
      };
      fetchMore();
    }
  };

  // Update local chats from global socket context (real-time updates)
  useEffect(() => {
    const chatArray: IChat[] = Object.values(globalChats)
      .map((chat: any) => ({
        id: chat.id,
        userId: chat.userId || null,
        guestId: chat.guestId || null,
        guestName: chat.guestName || null,
        guestEmail: chat.guestEmail || null,
        status: chat.status || "ACTIVE",
        messages: chat.messages || [],
        createdAt: new Date(chat.createdAt || new Date()),
        updatedAt: new Date(chat.updatedAt || new Date()),
        lastMessage: chat.lastMessage || null,
        senderInfo: chat.senderInfo || {
          type: chat.guestId ? "GUEST" : "USER",
          name: chat.guestName || "Guest",
          email: chat.guestEmail || null,
          id: chat.guestId || chat.userId || "",
        },
      }))
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

    // Merge fetched chats with real-time socket updates
    setChats((prevChats) => {
      const merged = new Map(prevChats.map((c) => [c.id, c]));
      chatArray.forEach((c) => {
        if (merged.has(c.id)) {
          // Update existing chat with new messages safely
          const existing = merged.get(c.id)!;

          // Deduplicate messages efficiently by ID
          const msgMap = new Map(
            (existing.messages || []).map((m: any) => [
              m.id || Date.now() + Math.random(),
              m,
            ]),
          );
          (c.messages || []).forEach((m: any) =>
            msgMap.set(m.id || Date.now() + Math.random(), m),
          );
          const updatedMessages = Array.from(msgMap.values());

          merged.set(c.id, {
            ...existing,
            messages: updatedMessages,
            updatedAt:
              c.updatedAt > existing.updatedAt
                ? c.updatedAt
                : existing.updatedAt,
            lastMessage:
              c.lastMessage ||
              existing.lastMessage ||
              (updatedMessages.length > 0
                ? updatedMessages[updatedMessages.length - 1]
                : null),
          });
        } else {
          // Add new chat
          merged.set(c.id, c);
        }
      });
      return Array.from(merged.values()).sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    });
  }, [globalChats]);

  // Helper function to get display name - first 5 words
  const getDisplayName = (chat: IChat): string => {
    const name = chat.senderInfo?.name || chat.guestName || "Guest";
    const words = name.split(" ").slice(0, 5).join(" ");
    return words;
  };

  // Helper function to get display email or identifier
  const getDisplayIdentifier = (chat: IChat): string => {
    if (chat.guestEmail) {
      return chat.guestEmail;
    }
    if (chat.senderInfo?.email) {
      return chat.senderInfo.email;
    }
    if (chat.guestId) {
      return `Guest: ${chat.guestId.slice(0, 8)}...`;
    }
    return "No email";
  };

  const filteredChats = chats.filter((chat) => {
    const displayName = getDisplayName(chat);
    const displayId = getDisplayIdentifier(chat);
    const searchLower = searchTerm.toLowerCase();
    return (
      displayName.toLowerCase().includes(searchLower) ||
      displayId.toLowerCase().includes(searchLower)
    );
  });

  const roleStrCheck = String(session?.user?.role || "");
  const isAuthorized =
    roleStrCheck.includes("ADMIN") || roleStrCheck.includes("SUPER_ADMIN");

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 text-center">
          <p className="text-red-500 font-semibold">Access Denied</p>
          <p className="text-gray-600">Only admins can access this page</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-(var(--header-height,0px)))] max-h-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* Chat List Sidebar */}
      <div className="w-96 border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col h-full overflow-hidden shadow-sm shrink-0">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-slate-700 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="h-7 w-7 text-purple-500" />
              Support Chats
            </h1>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300">
              {filteredChats.length} chats
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 rounded-lg transition-colors text-sm"
            />
          </div>
        </div>

        {/* Chat List with proper scrolling */}
        <div className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {!isConnected ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin mb-3">
                <MessageCircle className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-purple-300 font-medium">
                Connecting...
              </p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No chats found
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {searchTerm
                  ? "Try a different search"
                  : "Waiting for new chats..."}
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-3">
              {filteredChats.map((chat, index) => {
                const isSelected = selectedChat?.id === chat.id;
                const messageCount = newMessagesCount[chat.id] || 0;

                return (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setNewMessagesCount((prev) => ({
                        ...prev,
                        [chat.id]: 0,
                      }));
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-100 dark:hover:bg-slate-800/50 border-transparent"
                    }`}
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <div className="relative w-12 h-12 shrink-0">
                      <div className="w-full h-full rounded-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg shadow-xs">
                        {getDisplayName(chat).charAt(0).toUpperCase()}
                      </div>
                      {chat.status === "ACTIVE" && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 truncate">
                            {getDisplayName(chat)}
                          </h3>
                          {chat.guestId && (
                            <span className="shrink-0 bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300 text-[10px] px-1.5 py-0.5 rounded-sm font-medium">
                              Guest
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(chat.updatedAt).toLocaleTimeString(
                            "en-US",
                            { hour: "numeric", minute: "2-digit" },
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p
                          className={`text-sm truncate ${messageCount > 0 ? "font-bold text-gray-900 dark:text-gray-100" : isSelected ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          {chat.lastMessage?.content || "No messages yet"}
                        </p>
                        {messageCount > 0 && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0 ml-2 shadow-xs">
                            {messageCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && !isLoading && (
          <div className="p-3 border-t border-gray-200 dark:border-slate-700">
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isLoadingMore ? "Loading..." : "Load More Chats"}
            </Button>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin">
              <MessageCircle className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Loading chats...
            </p>
          </div>
        )}
      </div>

      {/* Chat Window Container */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden min-w-0">
        {selectedChat ? (
          <ChatWindow
            key={selectedChat.id}
            chat={selectedChat}
            isAdmin={true}
            onMessageSent={(message) => {
              setSelectedChat((prev) =>
                prev
                  ? {
                      ...prev,
                      messages: [...(prev.messages || []), message],
                    }
                  : null,
              );
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <MessageCircle className="h-20 w-20 mx-auto mb-4 text-gray-300 dark:text-slate-700" />
              <p className="text-gray-600 dark:text-slate-300 text-lg font-medium">
                Select a chat to view conversation
              </p>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-2">
                Choose from {filteredChats.length} available chats
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
