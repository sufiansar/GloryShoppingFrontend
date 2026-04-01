"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useHydrated } from "@/hooks/use-hydrated";
import { getAllChatsForAdmin } from "@/action/chat/chat.action";
import { getSocketUrl } from "@/lib/url-utils";
import { storage } from "@/lib/storage-utils";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  chats: Record<string, any>;
  addChat: (chatId: string, chat: any) => void;
  updateChat: (chatId: string, message: any) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState<Record<string, any>>({});
  const hydrated = useHydrated();

  useEffect(() => {
    const BASE_URL = getSocketUrl(process.env.NEXT_PUBLIC_BASE_API);
    
    if (!BASE_URL) {
      console.warn("⚠️ No Socket BASE_URL configured for SocketProvider");
      return;
    }

    const guestId = hydrated ? storage.local.get("guestId") : null;

    const newSocket = io(BASE_URL, {
      auth: {
        userId: session?.user?.id,
        guestId: guestId,
        role: session?.user?.role || "GUEST",
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Global Socket connected:", newSocket.id, "to", BASE_URL);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Global Socket disconnected");
      setIsConnected(false);
    });

    // For admins - receive new messages from guests/users
    newSocket.on("new-message-admin", (data: any) => {
      console.log("📨 New message for admin received:", data);
      const chatId = data.chatId || (data.message?.chatId);
      const message = data.message || data;

      if (!chatId) return;

      setChats((prevChats) => {
        const existingChat = prevChats[chatId];
        // Deduplicate messages
        const messages = existingChat?.messages || [];
        const isDuplicate = messages.some((m: any) => m.id === message.id);
        
        if (isDuplicate) return prevChats;

        if (existingChat) {
          return {
            ...prevChats,
            [chatId]: {
              ...existingChat,
              messages: [...messages, message],
              updatedAt: new Date(),
              lastMessage: message,
            },
          };
        } else {
          return {
            ...prevChats,
            [chatId]: {
              id: chatId,
              messages: [message],
              updatedAt: new Date(),
              lastMessage: message,
              guestName: message.senderName || "Guest",
              status: "ACTIVE"
            },
          };
        }
      });
    });

    // For guests - receive messages from admin
    newSocket.on("message-received", (message: any) => {
      console.log("📨 Message received:", message);
      const chatId = message.chatId;

      setChats((prevChats) => {
        const existingChat = prevChats[chatId];
        if (existingChat) {
          return {
            ...prevChats,
            [chatId]: {
              ...existingChat,
              messages: [...(existingChat.messages || []), message],
              updatedAt: new Date(),
            },
          };
        } else {
          return {
            ...prevChats,
            [chatId]: {
              id: chatId,
              messages: [message],
              updatedAt: new Date(),
            },
          };
        }
      });
    });

    newSocket.on("error", (error: any) => {
      console.error("❌ Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [session?.user?.id, session?.user?.role, hydrated]);

  // Fetch all chats for admin on component mount
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchAdminChats = async () => {
      // Ensure we have both the role and token before making the request
      if (!session?.user?.role?.includes("ADMIN") || !session?.accessToken) {
        return;
      }

      try {
        const result = await getAllChatsForAdmin();

        if (result.success && result.data) {
          const rawData = result.data.data || result.data || [];
          const chatsArray = Array.isArray(rawData) ? rawData : [];

          const chatsMap: Record<string, any> = {};
          if (Array.isArray(chatsArray)) {
            chatsArray.forEach((chat: any) => {
              chatsMap[chat.id] = {
                id: chat.id,
                guestId: chat.guestId,
                userId: chat.userId,
                guestName: chat.guestName || "Guest",
                guestEmail: chat.guestEmail,
                status: chat.status || "ACTIVE",
                messages: chat.messages || [],
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
              };
            });
          }
          setChats(chatsMap);
        } else {
          console.warn("Failed to fetch admin chats:", result.error);
          setChats({});
        }
      } catch (error) {
        console.error("Failed to fetch admin chats:", error);
      }
    };

    // Delay fetch slightly to allow session to fully initialize
    if (session?.user?.role?.includes("ADMIN") && session?.accessToken) {
      timeoutId = setTimeout(fetchAdminChats, 100);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [session?.user?.role, session?.accessToken]);

  const addChat = (chatId: string, chat: any) => {
    setChats((prev) => ({
      ...prev,
      [chatId]: chat,
    }));
  };

  const updateChat = (chatId: string, message: any) => {
    setChats((prev) => ({
      ...prev,
      [chatId]: {
        ...(prev[chatId] || {}),
        messages: [...(prev[chatId]?.messages || []), message],
        updatedAt: new Date(),
      },
    }));
  };

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, chats, addChat, updateChat }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}
