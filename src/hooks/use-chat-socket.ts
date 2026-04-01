import { useEffect, useState, useCallback, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { storage } from "@/lib/storage-utils";
import { getSocketUrl } from "@/lib/url-utils";

interface SocketEvents {
  onMessageReceived?: (message: any) => void;
  onUserTyping?: (data: any) => void;
  onUserStopTyping?: (data: any) => void;
  onAdminReply?: (message: any) => void;
  onError?: (error: any) => void;
}

export function useChatSocket(chatId: string | null, events?: SocketEvents) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const BASE_URL = getSocketUrl(process.env.NEXT_PUBLIC_BASE_API);

  useEffect(() => {
    if (!chatId) {
      console.log("No chatId, skipping socket connection");
      return;
    }

    console.log("Initializing socket with chatId:", chatId);
    console.log("BASE_URL:", BASE_URL);

    const guestId = typeof window !== "undefined" ? storage.local.get("guestId") : null;

    const newSocket = io(BASE_URL, {
      auth: {
        userId: session?.user?.id,
        guestId: guestId,
        role: session?.user?.role || "GUEST",
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
      newSocket.emit("join-chat", { chatId });
      console.log("Joined chat room:", chatId);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("message-received", (message) => {
      console.log("📨 Message received:", message);
      if (events?.onMessageReceived) {
        events.onMessageReceived(message);
      }
    });

    // For admins - receive guest/user messages
    newSocket.on("guest-message", (message) => {
      console.log("📨 Guest message received by admin:", message);
      if (events?.onMessageReceived) {
        events.onMessageReceived(message);
      }
    });

    newSocket.on("user-message", (message) => {
      console.log("📨 User message received by admin:", message);
      if (events?.onMessageReceived) {
        events.onMessageReceived(message);
      }
    });

    newSocket.on("user-typing", (data) => {
      console.log("User typing:", data);
      if (events?.onUserTyping) {
        events.onUserTyping(data);
      }
    });

    newSocket.on("user-stop-typing", (data) => {
      console.log("User stop typing:", data);
      if (events?.onUserStopTyping) {
        events.onUserStopTyping(data);
      }
    });

    newSocket.on("admin-reply", (message) => {
      console.log("Admin reply:", message);
      if (events?.onAdminReply) {
        events.onAdminReply(message);
      }
    });

    newSocket.on("error", (error) => {
      console.error("❌ Socket error:", error);
      if (events?.onError) {
        events.onError(error);
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit("leave-chat", { chatId });
        newSocket.disconnect();
        console.log("Socket disconnected on cleanup");
      }
    };
  }, [chatId, BASE_URL]);

  const sendMessage = useCallback(
    (content: string, senderType: "USER" | "GUEST" | "ADMIN" = "USER") => {
      if (!socket || !chatId) {
        console.error("Socket not connected or no chatId", {
          socket: !!socket,
          chatId,
        });
        return;
      }

      const guestId = typeof window !== "undefined" ? storage.local.get("guestId") : null;
      const messagePayload = {
        chatId,
        content,
        senderType,
        guestId: (senderType === "GUEST" || !session?.user) ? guestId : null,
        senderName:
          session?.user?.name || (typeof window !== "undefined" ? storage.local.get("guestName") : null) || "User",
        guestEmail: typeof window !== "undefined" ? storage.local.get("guestEmail") : null,
      };

      console.log("📤 Sending message via Socket.io:", messagePayload);
      socket.emit("send-message", messagePayload);
      
      // Also emit specialized event for guest messages if needed by backend
      if (senderType === "GUEST" || !session?.user) {
        socket.emit("guest-message", messagePayload);
      }
    },
    [socket, chatId, session?.user, session?.user?.name],
  );

  const sendAdminReply = useCallback(
    (content: string, adminName: string = "Admin") => {
      if (!socket || !chatId) {
        console.error("Socket not connected or no chatId for admin reply", {
          socket: !!socket,
          chatId,
        });
        return;
      }

      const replyPayload = {
        chatId,
        content,
        adminName,
      };

      console.log("📤 Sending admin reply via Socket.io:", replyPayload);
      socket.emit("admin-reply", replyPayload);
    },
    [socket, chatId],
  );

  const joinAdminRoom = useCallback(() => {
    if (!socket) return;
    socket.emit("join-admin-room");
  }, [socket]);

  const sendTyping = useCallback(() => {
    if (!socket || !chatId || isTyping) return;

    setIsTyping(true);
    socket.emit("typing", {
      chatId,
      senderName:
        session?.user?.name || (typeof window !== "undefined" ? storage.local.get("guestName") : null) || "User",
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { chatId });
      setIsTyping(false);
    }, 1000);
  }, [socket, chatId, session?.user?.name, isTyping]);

  return {
    socket,
    isConnected,
    isTyping,
    sendMessage,
    sendAdminReply,
    sendTyping,
    joinAdminRoom,
  };
}
