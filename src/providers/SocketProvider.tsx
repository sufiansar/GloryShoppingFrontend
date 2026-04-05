"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useHydrated } from "@/hooks/use-hydrated";
import { getAllChatsForAdmin } from "@/action/chat/chat.action";
import { getSocketUrl } from "@/lib/url-utils";
import { storage } from "@/lib/storage-utils";
import { toast } from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  chats: Record<string, any>;
  notifications: any[];
  addChat: (chatId: string, chat: any) => void;
  updateChat: (chatId: string, message: any) => void;
  setChatsBulk: (chats: Record<string, any>, append?: boolean) => void;
  clearNotifications: () => void;
  setEphemeralGuestId: (id: string | null) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState<Record<string, any>>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const hydrated = useHydrated();
  const [ephemeralGuestId, setEphemeralGuestId] = useState<string | null>(null);

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

  const addChat = (chatId: string, chat: any) => {
    setChats((prev) => ({
      ...prev,
      [chatId]: chat,
    }));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const setChatsBulk = (newChats: Record<string, any>, append: boolean = true) => {
    setChats((prev) => {
      if (append) {
        return { ...prev, ...newChats };
      }
      return newChats;
    });
  };

  useEffect(() => {
    const BASE_URL = getSocketUrl(process.env.NEXT_PUBLIC_BASE_API);

    if (!BASE_URL) {
      console.warn("⚠️ No Socket BASE_URL configured for SocketProvider");
      return;
    }

    // Use current ephemeral ID if available, otherwise fallback to storage
    const guestId = ephemeralGuestId || (hydrated ? storage.local.get("guestId") : null);
    
    console.log("🔌 Initializing Global Socket:", { 
      userId: session?.user?.id, 
      guestId, 
      role: session?.user?.role || "GUEST" 
    });

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

    const joinAdmin = () => {
      const roleStr = String(session?.user?.role || "");
      if (roleStr.includes("ADMIN") || roleStr.includes("SUPER_ADMIN")) {
        console.log("🔑 Joining/Refreshing admin room");
        newSocket.emit("join-admin-room");
      }
    };

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Global Socket connected:", newSocket.id);
      setIsConnected(true);
      joinAdmin();
    });

    // Heartbeat for admin room (every 60s)
    const adminHeartbeat = setInterval(joinAdmin, 60000);

    newSocket.on("disconnect", () => {
      console.log("❌ Global Socket disconnected");
      setIsConnected(false);
    });

    // Admin-specific listener
    newSocket.on("new-message-admin", (data: any) => {
      console.log("📨 Admin received message (Raw):", data);
      
      // Robust Chat ID detection (handles backend variations)
      const chatId = data.chatId || data.message?.chatId || data.id || data.chatID;
      const message = data.message || (data.content ? data : null);

      if (!chatId || !message) {
        console.warn("⚠️ Received admin message with missing ID or content:", data);
        return;
      }

      // Update Notifications
      setNotifications(prev => {
        const msgContent = message.content || "New message";
        const sender = message.senderName || "Guest";
        
        // De-dupe notifications
        if (prev.some(n => n.message?.id === message.id && message.id)) return prev;

        return [{
          chatId,
          message,
          title: `Message from ${sender}`,
          body: msgContent
        }, ...prev].slice(0, 20);
      });

      // Update Chats State
      setChats(prev => {
        const existing = prev[chatId];
        const messages = existing?.messages || [];
        
        // De-dupe messages
        if (messages.some((m: any) => m.id === message.id && message.id)) return prev;

        // Better categorization for new chats arriving via socket
        const isGuest = message.senderType === "GUEST" || !!message.guestId || !!data.guestId;
        const gName = message.senderName || existing?.guestName || data.guestName || "Guest";
        const gId = message.guestId || data.guestId || (isGuest ? chatId : null);
        const uId = message.senderId || data.userId || existing?.userId || null;

        return {
          ...prev,
          [chatId]: {
            ...(existing || { 
              id: chatId, 
              createdAt: new Date(),
              guestId: gId,
              userId: uId,
              guestName: gName,
              senderInfo: {
                type: isGuest ? "GUEST" : "USER",
                name: gName,
                id: gId || uId || chatId
              }
            }),
            messages: [...messages, message],
            updatedAt: new Date(),
            lastMessage: message,
            guestName: gName,
            status: "ACTIVE"
          }
        };
      });

      // Show Toast Notification for Admin
      if (session?.user?.role?.includes("ADMIN")) {
        const sender = message.senderName || data.guestName || "Guest";
        toast.success(`New message from ${sender}`, {
          duration: 4000,
          position: "top-right",
          icon: "💬",
        });

        // Play Sound (Fallback to system beep or silent if context fails)
        try {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
          audio.volume = 0.4;
          audio.play().catch(() => {});
        } catch (e) {}
      }

      // UI Trigger
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("chatNotification", { detail: { chatId, message } }));
      }
    });

    // Backup Notification Listener
    newSocket.on("notification", (data: any) => {
      console.log("🔔 Backend notification received:", data);
      if (data.type === "NEW_MESSAGE" && data.chatId) {
        // Trigger a fake event to force sidebar refresh
        window.dispatchEvent(new CustomEvent("chatNotification", { detail: { chatId: data.chatId, message: data.message } }));
      }
    });

    // General listener (for users/guests themselves)
    newSocket.on("message-received", (message: any) => {
      console.log("📨 Message received (Self/Reply):", message);
      const chatId = message.chatId;
      if (!chatId) return;

      setChats(prev => {
        const existing = prev[chatId];
        const messages = existing?.messages || [];
        if (messages.some((m: any) => m.id === message.id && message.id)) return prev;

        return {
          ...prev,
          [chatId]: {
            ...(existing || { id: chatId, createdAt: new Date() }),
            messages: [...messages, message],
            updatedAt: new Date()
          }
        };
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("new-message-admin");
      newSocket.off("message-received");
      newSocket.off("notification");
      clearInterval(adminHeartbeat);
      newSocket.disconnect();
    };
  }, [session?.user?.id, session?.user?.role, hydrated, ephemeralGuestId]);

  // Initial Fetch for Admins
  useEffect(() => {
    if (session?.user?.role?.includes("ADMIN") && session?.accessToken) {
      const fetchAdminChats = async () => {
        const result = await getAllChatsForAdmin(1, 100);
        if (result.success && result.data) {
          const list = result.data.data || result.data;
          const map: Record<string, any> = {};
          if (Array.isArray(list)) {
            list.forEach((c: any) => {
              map[c.id] = { ...c, messages: c.messages || [] };
            });
          }
          setChats(map);
        }
      };
      fetchAdminChats();
    }
  }, [session?.user?.role, session?.accessToken]);

  return (
    <SocketContext.Provider
      value={{ 
        socket, 
        isConnected, 
        chats, 
        notifications, 
        addChat, 
        updateChat, 
        setChatsBulk,
        clearNotifications, 
        setEphemeralGuestId 
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
}
