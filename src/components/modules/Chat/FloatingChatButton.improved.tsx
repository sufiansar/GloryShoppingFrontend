"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { MessageCircle, X, Heart, Loader2, AlertCircle } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import { useHydrated } from "@/hooks/use-hydrated";
import { storage } from "@/lib/storage-utils";
import { IChat, IMessage } from "@/types/chat.interface";
import {
  getChatMessagesAsGuest,
  getChatMessagesAsUser,
  startChatAsUser,
  startChatAsGuest,
  getAllUserMessages,
} from "@/action/chat/chat.action";
import { toast } from "sonner";
import logo from "@/components/Assets/Logo.png";

interface FloatingChatButtonProps {
  displayName?: string;
}

export function FloatingChatButtonImproved({
  displayName = "Glory Chat Support",
}: FloatingChatButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeChat, setActiveChat] = useState<IChat | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const { data: session } = useSession(); // Add session hook for logged-in users
  const pathname = usePathname();

  const hydrated = useHydrated();

  // Listen for navbar chat button click and auto-open based on session storage
  useEffect(() => {
    if (!hydrated) return;
    
    const handleOpenFloatingChat = () => {
      console.log("📱 Opening floating chat from navbar");
      handleOpenChat();
    };

    window.addEventListener("openFloatingChat", handleOpenFloatingChat);

    // Auto-open if it was expanded before reload
    if (storage.session.get("isChatExpanded") === "true") {
      handleOpenChat();
    }

    return () => {
      window.removeEventListener("openFloatingChat", handleOpenFloatingChat);
    };
  }, [hydrated]); // Run when hydrated

  // Handle session changes (login/logout)
  useEffect(() => {
    if (!hydrated) return;

    // If user just logged in, clear guest chat and reset state to allow new user chat
    if (session?.user && !activeChat?.id?.startsWith("guest-")) {
      // User is logged in, their flow will handle it
      return;
    }

    // If user logged out, reset chat
    if (!session?.user && activeChat) {
      // User logged out, keep guest chat if it exists
      return;
    }
  }, [session?.user, activeChat, hydrated]);

  // Hide the floating widget entirely on admin dashboard pages
  // IMPORTANT: This must be BELOW all hook declarations to avoid React Error #300
  const isDashboardRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

  if (isDashboardRoute) {
    return null;
  }

  // Hide entirely until hydrated to prevent storage-related mismatch
  if (!hydrated) return null;

  const handleOpenChat = async () => {
    if (activeChat) {
      setIsExpanded(true);
      storage.session.set("isChatExpanded", "true");
      return;
    }

    setIsInitializing(true);

    try {
      // 1. Authenticated User Flow (PRIORITY)
      if (session?.user) {
        let userChatId = storage.local.get(`userChatId_${session.user.id}`);

        if (userChatId) {
          console.log("📖 Loading existing User chat:", userChatId);
            const result = await getAllUserMessages();

            if (result.success && result.data) {
              const messagesData = result.data.data || result.data || [];

              const messages: IMessage[] = messagesData.map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                senderId: msg.senderId || null,
                guestId: null,
                senderType: msg.senderType,
                senderName: msg.senderName || (msg.senderType === "ADMIN" ? "Support" : "You"),
                createdAt: new Date(msg.createdAt),
                isEdited: false,
                type: msg.type || "TEXT",
                url: msg.url || null,
                isRead: msg.isRead || false,
              }));

              // Use the latest chatId for socket connection
              const latestChatId = messagesData.length > 0 ? messagesData[messagesData.length - 1].chatId : null;

              const chatObject: IChat = {
                id: (latestChatId as string) || `user-${session.user.id}`,
                status: "ACTIVE",
                messages: messages,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              setActiveChat(chatObject);
              setIsExpanded(true);
              storage.session.set("isChatExpanded", "true");
              setIsInitializing(false);
              return;
            }
          }

        // Start a new User chat
        console.log("🆕 Starting new chat for logged-in User");
        const startResult = await startChatAsUser({
          subject: "Support Request",
          initialMessage: "Hi, I need some help.",
        });

        if (startResult.success && startResult.data) {
          const chatData = startResult.data;
          userChatId = chatData.id || chatData.chatId;

          if (userChatId) {
            storage.local.set(
              `userChatId_${session.user.id}`,
              userChatId as string,
            );

            const chatObject: IChat = {
              id: userChatId as string,
              status: chatData.status || "ACTIVE",
              messages: [],
              createdAt: new Date(chatData.createdAt || new Date()),
              updatedAt: new Date(chatData.updatedAt || new Date()),
            };

            setActiveChat(chatObject);
            setIsExpanded(true);
            storage.session.set("isChatExpanded", "true");
          }
        } else {
          toast.error("Could not start chat. Please try again.");
        }
        setIsInitializing(false);
        return;
      }

      // 2. Guest User Flow
      let guestId = storage.local.get("guestId");
      let chatId = storage.local.get("chatId");

      // If we have existing chat, just load it
      if (chatId && guestId) {
        console.log("📖 Loading existing chat:", chatId);

        const messagesResult = await getChatMessagesAsGuest(
          chatId as string,
          guestId as string,
        );
        const messagesData = messagesResult.success
          ? messagesResult.data || []
          : [];

        // Convert API response to IMessage format
        const messages: IMessage[] = messagesData.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId || null,
          guestId: msg.guestId || null,
          senderType: msg.senderType,
          senderName: msg.senderName || "Support",
          createdAt: new Date(msg.createdAt),
          isEdited: false,
          type: msg.type || "TEXT",
          url: msg.url || null,
          isRead: msg.isRead || false,
        }));

        const chatObject: IChat = {
          id: chatId as string,
          status: "ACTIVE",
          messages: messages,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log("✅ Chat loaded with", messages.length, "messages");
        setActiveChat(chatObject);
        setIsExpanded(true);
        storage.session.set("isChatExpanded", "true");
        return;
      }

      // Create new chat
      console.log("🆕 Starting new chat for Guest");
      
      // Generate or retrieve guestId
      let newGuestId = storage.local.get("guestId");
      if (!newGuestId) {
        newGuestId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        storage.local.set("guestId", newGuestId);
      }

      const startResult = await startChatAsGuest({
        guestId: newGuestId,
        name: "Guest User",
      });

      if (startResult.success && startResult.data) {
        const chatData = startResult.data.data || startResult.data;
        const chatId = chatData.id || chatData.chatId;

        // Save chatId for persistence
        if (chatId) {
          storage.local.set("chatId", chatId);
        }

        const chatObject: IChat = {
          id: chatId,
          status: chatData.status || "ACTIVE",
          messages: chatData.messages || [],
          createdAt: new Date(chatData.createdAt || new Date()),
          updatedAt: new Date(chatData.updatedAt || new Date()),
          guestId: newGuestId,
          guestName: "Guest User",
        };

        setActiveChat(chatObject);
        setIsExpanded(true);
        storage.session.set("isChatExpanded", "true");
        toast.success("Connected to support!");
      } else {
        console.error("❌ Failed to create guest chat:", startResult.error);
        toast.error(startResult.error || "Could not connect to chat server. Please check your internet or try again later.");
      }
    } catch (error: any) {
      console.error("❌ Error starting guest chat:", error);
      toast.error("Connection error. Please check your internet.");
    } finally {
      setIsInitializing(false);
    }
  };

  // BRAND DESIGN TOKENS
  const GLORY_MAGENTA = "#d12a7a";

  // Closed state - Show floating button with brand colors and heart animation
  if (!isExpanded) {
    return (
      <div
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 group"
        style={{ animation: "slideInUp 0.5s ease-out forwards" }}
      >
        <button
          onClick={handleOpenChat}
          className="relative h-16 w-16 border-[3.5px] border-white dark:border-slate-800 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgba(209,42,122,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 z-50 disabled:opacity-50 group"
          style={{
            background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)`,
          }}
          disabled={isInitializing}
          aria-label="Open support chat"
        >
          {/* Continuous pulsing ripple rings in brand color */}
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-40 duration-1000"
            style={{ backgroundColor: GLORY_MAGENTA }}
          ></span>
          <span
            className="absolute -inset-2 rounded-full animate-ping opacity-20 duration-1500"
            style={{ backgroundColor: GLORY_MAGENTA }}
          ></span>

          {/* Decorative Hearts that pop out on hover */}
          <Heart
            className="absolute -top-4 -left-2 h-4 w-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 group-hover:-translate-y-2 group-hover:-translate-x-1"
            fill="currentColor"
          />
          <Heart
            className="absolute top-0 -right-4 h-3 w-3 text-rose-300 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 group-hover:-translate-y-1 group-hover:translate-x-2"
            fill="currentColor"
          />

          {isInitializing ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-110">
              <Image
                src={logo}
                alt="Chat Support"
                fill
                className="object-contain drop-shadow-md brightness-0 invert"
              />
            </div>
          )}
        </button>
      </div>
    );
  }

  // Expanded state - Show full chat window (Responsive: Fullscreen on mobile, Floating on desktop)
  if (activeChat) {
    return (
      <div
        className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 w-full md:w-96 h-full md:h-150 z-50 flex flex-col md:rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300"
        style={{
          animation: "slideInUp 0.5s ease-out forwards",
          boxShadow: "0 20px 60px -15px rgba(209, 42, 122, 0.3)",
        }}
      >
        <style>{`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <ChatWindow
          chat={activeChat}
          onClose={() => {
            setIsExpanded(false);
            storage.session.set("isChatExpanded", "false");
          }}
        />
      </div>
    );
  }

  return null;
}
