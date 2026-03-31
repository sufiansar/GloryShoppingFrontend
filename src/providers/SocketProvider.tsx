"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

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

  useEffect(() => {
    const BASE_URL =
      process.env.NEXT_PUBLIC_BASE_API?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const guestId =
      typeof window !== "undefined" ? localStorage.getItem("guestId") : null;

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
      console.log("✅ Global Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Global Socket disconnected");
      setIsConnected(false);
    });

    // For admins - receive new messages from guests
    newSocket.on("new-message-admin", (data: any) => {
      console.log("📨 New message for admin:", data);
      const { chatId, message } = data;

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
  }, [session?.user?.id, session?.user?.role]);

  // Fetch all chats for admin on component mount
  useEffect(() => {
    const fetchAdminChats = async () => {
      if (session?.user?.role?.includes("ADMIN")) {
        try {
          const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
          const response = await fetch(`${BASE_API}/chat/admin/all-chats`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            const chatsArray = data.data || (Array.isArray(data) ? data : []);

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
          }
        } catch (error) {
          console.error("Failed to fetch admin chats:", error);
        }
      }
    };

    fetchAdminChats();
  }, [session?.user?.role]);

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
