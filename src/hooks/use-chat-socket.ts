import { useEffect, useState, useCallback, useRef } from "react";
import { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { storage } from "@/lib/storage-utils";
import { useSocket } from "@/providers/SocketProvider";

interface SocketEvents {
  onMessageReceived?: (message: any) => void;
  onUserTyping?: (data: any) => void;
  onUserStopTyping?: (data: any) => void;
  onAdminReply?: (message: any) => void;
  onNotification?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useChatSocket(
  chatId: string | null, 
  events?: SocketEvents,
  config?: { tempGuestId?: string | null; tempGuestName?: string | null }
) {
  const { data: session } = useSession();
  const { socket, isConnected: globalIsConnected } = useSocket();
  const eventsRef = useRef<SocketEvents | undefined>(events);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep eventsRef updated with the latest callbacks without triggering useEffect
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    if (!socket || !chatId) {
      return;
    }

    console.log("🔗 Connecting chat room listeners for:", chatId);

    // Join room - only if connected
    if (socket.connected) {
      console.log("🔑 Joining chat room:", chatId);
      socket.emit("join-chat", { chatId });
      socket.emit("mark-read", { chatId });
    } else {
      const handleConnect = () => {
        console.log("🔑 Socket connected, now joining chat room:", chatId);
        socket.emit("join-chat", { chatId });
        socket.emit("mark-read", { chatId });
      };
      socket.once("connect", handleConnect);
      // Cleanup listener if component unmounts before connect
      return () => {
        socket.off("connect", handleConnect);
        console.log("🔌 Removing chat room listeners for:", chatId);
        if (socket.connected) socket.emit("leave-chat", { chatId });
      };
    }

    // Consolidate Message Receivers to avoid duplication
    const handleMessage = (message: any) => {
      // Basic validation: ensure message belongs to THIS chat
      if (message.chatId && message.chatId !== chatId) return;

      console.log("📨 Message received in hook:", message);
      if (eventsRef.current?.onMessageReceived) {
        eventsRef.current.onMessageReceived(message);
      }
    };

    // Listen only to core events
    socket.on("message-received", handleMessage);
    socket.on("admin-reply", handleMessage);

    // Typing Status
    const handleTyping = (data: any) => {
      if (data.chatId === chatId && eventsRef.current?.onUserTyping) eventsRef.current.onUserTyping(data);
    };
    const handleStopTyping = (data: any) => {
      if (data.chatId === chatId && eventsRef.current?.onUserStopTyping) eventsRef.current.onUserStopTyping(data);
    };

    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);

    // Notifications
    const handleNotification = (data: any) => {
      if (eventsRef.current?.onNotification) eventsRef.current.onNotification(data);
    };
    socket.on("notification-received", handleNotification);

    return () => {
      console.log("🔌 Removing chat room listeners for:", chatId);
      socket.emit("leave-chat", { chatId });

      socket.off("message-received", handleMessage);
      socket.off("guest-message", handleMessage);
      socket.off("user-message", handleMessage);
      socket.off("admin-reply", handleMessage);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
      socket.off("notification-received", handleNotification);
    };
  }, [socket, chatId]); // REMOVED events from dependencies

  const sendMessage = useCallback(
    (content: string, senderType: "USER" | "GUEST" | "ADMIN" = "USER") => {
      if (!socket || !chatId) {
        console.error("Socket not connected or no chatId");
        return;
      }

      const guestId = config?.tempGuestId || (typeof window !== "undefined" ? storage.local.get("guestId") : null);
      const messagePayload = {
        chatId,
        content,
        senderType,
        socketId: socket.id,
        guestId: (senderType === "GUEST" || !session?.user) ? guestId : null,
        senderName: session?.user?.name || config?.tempGuestName || (typeof window !== "undefined" ? storage.local.get("guestName") : null) || "Guest",
        guestEmail: typeof window !== "undefined" ? storage.local.get("guestEmail") : null,
      };

      console.log("📤 Sending message via Socket.io:", messagePayload);

      // FIXED: Only emit ONE core event. 
      // If the backend needs BOTH events, it should be fixed there, 
      // but usually 'send-message' is a unified entry point.
      socket.emit("send-message", messagePayload);
    },
    [socket, chatId, session?.user],
  );

  const sendAdminReply = useCallback(
    (content: string, adminName: string = "Admin") => {
      if (!socket || !chatId) return;

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

  const sendTyping = useCallback(() => {
    if (!socket || !chatId || isTyping) return;

    setIsTyping(true);
    socket.emit("typing", {
      chatId,
      senderName: session?.user?.name || config?.tempGuestName || (typeof window !== "undefined" ? storage.local.get("guestName") : null) || "User",
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { chatId });
      setIsTyping(false);
    }, 1500);
  }, [socket, chatId, session?.user, isTyping]);

  return {
    socket,
    isConnected: globalIsConnected,
    isTyping,
    sendMessage,
    sendAdminReply,
    sendTyping,
    socketId: socket?.id
  };
}

