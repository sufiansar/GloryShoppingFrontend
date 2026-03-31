import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    }

    return () => {
      // Don't disconnect on unmount to keep connection alive
    };
  }, []);

  return { socket, isConnected };
}

// Chat-specific socket functions
export function useChatSocket(chatId: string) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket || !isConnected || !chatId) return;

    // Join chat room
    socket.emit("join-chat", { chatId });

    // Listen for new messages
    socket.on("message-received", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicators
    socket.on("user-typing", (data) => {
      setTypingUsers((prev) => new Set([...prev, data.senderName]));
    });

    socket.on("user-stop-typing", (data) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.senderName);
        return newSet;
      });
    });

    // Listen for admin notifications
    socket.on("new-message-admin", (data) => {
      console.log("New message from admin:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket?.off("message-received");
      socket?.off("user-typing");
      socket?.off("user-stop-typing");
      socket?.off("new-message-admin");
    };
  }, [socket, isConnected, chatId]);

  const sendMessage = (
    content: string,
    senderType: string,
    senderName: string,
  ) => {
    if (!socket || !isConnected) return false;

    socket.emit("send-message", {
      chatId,
      content,
      senderType,
      senderName,
    });

    return true;
  };

  const sendAdminReply = (content: string, adminName: string) => {
    if (!socket || !isConnected) return false;

    socket.emit("admin-reply", {
      chatId,
      content,
      adminName,
    });

    return true;
  };

  const startTyping = (senderName: string) => {
    if (!socket || !isConnected) return;
    socket.emit("typing", { chatId, senderName });
  };

  const stopTyping = () => {
    if (!socket || !isConnected) return;
    socket.emit("stop-typing", { chatId });
  };

  return {
    socket,
    isConnected,
    messages,
    typingUsers: Array.from(typingUsers),
    sendMessage,
    sendAdminReply,
    startTyping,
    stopTyping,
  };
}
