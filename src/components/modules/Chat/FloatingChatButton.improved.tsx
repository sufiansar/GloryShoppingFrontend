"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { MessageCircle, X, Heart } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import { IChat, IMessage } from "@/types/chat.interface";
import { 
  getChatMessagesAsGuest, 
  getChatMessagesAsUser, 
  startChatAsUser, 
  startChatAsGuest 
} from "@/action/chat/chat.action";
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

  // Hide the floating widget entirely on admin dashboard pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  // Listen for navbar chat button click and auto-open based on session storage
  useEffect(() => {
    const handleOpenFloatingChat = () => {
      console.log("📱 Opening floating chat from navbar");
      handleOpenChat();
    };

    window.addEventListener("openFloatingChat", handleOpenFloatingChat);

    // Auto-open if it was expanded before reload
    if (sessionStorage.getItem("isChatExpanded") === "true") {
      handleOpenChat();
    }

    return () => {
      window.removeEventListener("openFloatingChat", handleOpenFloatingChat);
    };
  }, [session]); // Add session to dependency to respond when user logs in

  const handleOpenChat = async () => {
    if (activeChat) {
      setIsExpanded(true);
      sessionStorage.setItem("isChatExpanded", "true");
      return;
    }

    setIsInitializing(true);

    try {
      // 1. Authenticated User Flow (PRIORITY)
      if (session?.user) {
        let userChatId = localStorage.getItem(`userChatId_${session.user.id}`);
        
        if (userChatId) {
          console.log("📖 Loading existing User chat:", userChatId);
          const result = await getChatMessagesAsUser(userChatId);
          
          if (result.success && result.data) {
            const messagesData = result.data || [];
            
            const messages: IMessage[] = messagesData.map((msg: any) => ({
              id: msg.id,
              content: msg.content,
              senderId: msg.senderId || null,
              guestId: null,
              senderType: msg.senderType,
              senderName: msg.senderName || "Support",
              createdAt: new Date(msg.createdAt),
              isEdited: false,
              type: msg.type || "TEXT",
              url: msg.url || null,
              isRead: msg.isRead || false,
            }));

            const chatObject: IChat = {
              id: userChatId,
              status: "ACTIVE",
              messages: messages,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            setActiveChat(chatObject);
            setIsExpanded(true);
            sessionStorage.setItem("isChatExpanded", "true");
            setIsInitializing(false);
            return;
          }
        }

        // Start a new User chat
        console.log("🆕 Starting new chat for logged-in User");
        const startResult = await startChatAsUser({
          subject: "Support Request",
          initialMessage: "Hi, I need some help."
        });
        
        if (startResult.success && startResult.data) {
          const chatData = startResult.data;
          userChatId = chatData.id || chatData.chatId;
          
          if (userChatId) {
            localStorage.setItem(`userChatId_${session.user.id}`, userChatId as string);
            
            const chatObject: IChat = {
              id: userChatId as string,
              status: chatData.status || "ACTIVE",
              messages: [],
              createdAt: new Date(chatData.createdAt || new Date()),
              updatedAt: new Date(chatData.updatedAt || new Date()),
            };

            setActiveChat(chatObject);
            setIsExpanded(true);
            sessionStorage.setItem("isChatExpanded", "true");
          }
        }
        setIsInitializing(false);
        return;
      }

      // 2. Guest User Flow
      let guestId = localStorage.getItem("guestId");
      let chatId = localStorage.getItem("chatId");

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
        sessionStorage.setItem("isChatExpanded", "true");
        return;
      }

      // Create new chat
      console.log("🆕 Starting new chat for Guest");
      const startResult = await startChatAsGuest();

      if (startResult.success && startResult.data) {
        const chatData = startResult.data;
        chatId = chatData.id || chatData.chatId;
        const guestIdFromResponse = chatData.guestId || `guest-${Date.now()}`;

        localStorage.setItem("guestId", guestIdFromResponse);
        localStorage.setItem("chatId", chatId as string);
        localStorage.setItem("guestName", "Guest User");

        const chatObject: IChat = {
          id: chatId as string,
          status: chatData.status || "ACTIVE",
          messages: [],
          createdAt: new Date(chatData.createdAt || new Date()),
          updatedAt: new Date(chatData.updatedAt || new Date()),
        };

        setActiveChat(chatObject);
        setIsExpanded(true);
        sessionStorage.setItem("isChatExpanded", "true");
      } else {
        console.error("❌ Failed to create guest chat:", startResult.error);
      }
    } catch (error: any) {
      console.error("❌ Error starting chat:", error);
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
          style={{ background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)` }}
          disabled={isInitializing}
          aria-label="Open support chat"
        >
          {/* Continuous pulsing ripple rings in brand color */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-40 duration-1000" style={{ backgroundColor: GLORY_MAGENTA }}></span>
          <span className="absolute -inset-2 rounded-full animate-ping opacity-20 duration-1500" style={{ backgroundColor: GLORY_MAGENTA }}></span>
          
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
          boxShadow: "0 20px 60px -15px rgba(209, 42, 122, 0.3)" 
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
            sessionStorage.setItem("isChatExpanded", "false");
          }}
        />
      </div>
    );
  }

  return null;
}
