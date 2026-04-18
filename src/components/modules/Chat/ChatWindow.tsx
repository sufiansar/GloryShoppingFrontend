"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  X,
  Wifi,
  WifiOff,
  MessageCircle,
  Heart,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { storage } from "@/lib/storage-utils";
import { IChat, IMessage } from "@/types/chat.interface";
import { useHydrated } from "@/hooks/use-hydrated";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
  sendMessageAsAdmin,
  sendMessageAsGuest,
  sendMessageAsUser,
} from "@/action/chat/chat.action";

interface ChatWindowProps {
  chat: IChat;
  onClose?: () => void;
  isAdmin?: boolean;
  onMessageSent?: (message: IMessage) => void;
  userInfo?: any;
  onRefresh?: () => Promise<void>;
  tempGuestId?: string | null;
  tempGuestName?: string | null;
}

export function ChatWindow({
  chat,
  onClose,
  isAdmin = false,
  onMessageSent,
  userInfo,
  onRefresh,
  tempGuestId,
  tempGuestName,
}: ChatWindowProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<IMessage[]>(chat.messages || []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messageIdsRef = useRef<Set<string>>(new Set());
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSendingRef = useRef(false);

  // Initialize message IDs from initial messages
  useEffect(() => {
    // Only update internal messages from prop if prop messages are newer or more complete
    // This is important for real-time socket updates received by the parent
    if (chat.messages && chat.messages.length > 0) {
      setMessages((prev) => {
        const msgMap = new Map<string, any>(prev.map(m => [m.id, m]));
        let hasNew = false;
        chat.messages?.forEach(m => {
          if (!msgMap.has(m.id)) {
            msgMap.set(m.id, m);
            hasNew = true;
          }
        });
        return hasNew ? Array.from(msgMap.values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) : prev;
      });
      messageIdsRef.current = new Set(chat.messages.map((m) => m.id));
    }
  }, [chat.id, chat.messages]);

  // Fetch full conversation history from DB for Admins on mount
  useEffect(() => {
    if (isAdmin && chat.id) {
      const fetchFullHistory = async () => {
        try {
          // Import this dynamically or assume it's imported at top
          const { getFullChatConversation } =
            await import("@/action/chat/chat.action");
          const result = await getFullChatConversation(chat.id);

          if (result.success && result.data) {
            const fetchedMessages = result.data.messages || result.data || [];
            if (Array.isArray(fetchedMessages) && fetchedMessages.length > 0) {
              const formattedMessages: IMessage[] = fetchedMessages.map(
                (msg: any) => ({
                  id: msg.id,
                  content: msg.content,
                  senderId: msg.senderId || null,
                  guestId: msg.guestId || null,
                  senderType: msg.senderType,
                  senderName:
                    msg.senderName ||
                    (msg.senderType === "GUEST" ? "Guest" : "User"),
                  createdAt: new Date(msg.createdAt),
                  isEdited: false,
                  type: msg.type || "TEXT",
                  url: msg.url || null,
                  isRead: msg.isRead || false,
                }),
              );

              setMessages(formattedMessages);
              messageIdsRef.current = new Set(
                formattedMessages.map((m) => m.id),
              );
              console.log("✅ Fetched full history for chat:", chat.id);
            }
          }
        } catch (error) {
          console.error("Failed to fetch full chat history:", error);
        }
      };
      fetchFullHistory();
    }
  }, [chat.id, isAdmin]);

  // Get guest info from props or storage only if no user session and mounted on client
  // Priority: Prop -> Object Property -> SessionStorage (Backup) -> LocalStorage
  const getEphemeralId = () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("glory_temp_guest_id");
  };

  const guestId =
    tempGuestId || 
    chat.guestId || 
    getEphemeralId() ||
    (hydrated && !session?.user ? storage.local.get("guestId") : null);
    
  const guestName =
    tempGuestName || (hydrated && !session?.user ? storage.local.get("guestName") : null);

  // Determine if this is a guest chat
  const isGuestChat = !!chat.guestId;

  const { isConnected, sendMessage, sendAdminReply, sendTyping, socketId } =
    useChatSocket(chat.id, {
      onMessageReceived: (message) => {
        console.log("📨 Incoming WebSocket Message:", message);

        // 1. Context validation
        if (message.chatId && message.chatId !== chat.id) return;

        // 2. Self-echo detection (Matching SocketId)
        if (message.socketId && socketId && message.socketId === socketId) {
          console.log("♻️ Ignoring self-broadcast echo (matching socketId)");
          if (message.id && !message.id.startsWith("temp-")) {
            setMessages(prev => {
              const updated = prev.map(m =>
                (m.id.startsWith("temp-") && m.content === message.content)
                  ? { ...m, id: message.id, status: "SENT" as const }
                  : m
              );
              return updated;
            });
            messageIdsRef.current.add(message.id);
          }
          return;
        }

        // 3. Robust Deduplication (by ID)
        const realId = message.id || `${message.chatId}-${message.content}-${new Date(message.createdAt).getTime()}`;
        if (messageIdsRef.current.has(realId)) {
          console.log("❌ Duplicate message ignored (ID exists):", realId);
          return;
        }

        // 4. Optimistic Match (by Content + Time) - if ID wasn't found yet
        setMessages((prev) => {
          // Double-check if it's already in the array to be absolutely safe
          if (prev.some(m => m.id === realId)) return prev;

          // Check for optimistic match to swap
          const isFromMe = isAdmin
            ? message.senderType === "ADMIN"
            : (message.senderType === "USER" || message.senderType === "GUEST");

          if (isFromMe) {
            const matchingOptimistic = prev.find(m =>
              m.id.startsWith("temp-") &&
              m.content === message.content &&
              Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 15000
            );

            if (matchingOptimistic) {
               console.log("✅ Matching optimistic message found, swapping ID:", realId);
               messageIdsRef.current.add(realId);
               return prev.map(m => m.id === matchingOptimistic.id ? { ...m, id: realId, status: "SENT" as const } : m);
            }
            
            // VERY AGGRESSIVE: If it's from me and identical content/time but no temp match found, 
            // it might be a race condition where the temp message was already replaced by another event.
            const exactMatch = prev.find(m => m.id !== realId && m.content === message.content && Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 2000);
            if (exactMatch) {
               console.log("❌ Aggressive content-match duplicate ignored:", realId);
               return prev;
            }
          }

          // Otherwise, add as new message
          const newMsg: IMessage = {
            id: realId,
            content: message.content,
            senderId: message.senderId || null,
            guestId: message.guestId || null,
            senderType: message.senderType,
            senderName: message.senderName || (message.senderType === "GUEST" ? "Guest" : "Admin"),
            createdAt: new Date(message.createdAt),
            isEdited: false,
            type: message.type || "TEXT",
            url: message.url || null,
            isRead: message.isRead || false,
          };
          
          messageIdsRef.current.add(realId);
          if (onMessageSent) onMessageSent(newMsg);
          
          return [...prev, newMsg];
        });
        },
        onUserTyping: (data) => {
          setTypingUsers((prev) => new Set(prev).add(data.userId));
        },
        onUserStopTyping: (data) => {
          setTypingUsers((prev) => {
            const updated = new Set(prev);
            updated.delete(data.userId);
            return updated;
          });
        },
      }, {
        tempGuestId: guestId,
        tempGuestName: guestName
      });

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    // Find the scrollable container (the parent div)
    const scrollContainer = messagesContainerRef.current?.parentElement;
    if (scrollContainer) {
      // Scroll to bottom immediately
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const messageContent = input.trim();
    setInput("");

    // Determine sender type
    let senderType: "USER" | "ADMIN" | "GUEST" = "GUEST";
    let senderName = "Guest";

    if (isAdmin) {
      senderType = "ADMIN";
      senderName = session?.user?.name || "Admin";
    } else if (session?.user?.id) {
      senderType = "USER";
      senderName = session?.user?.name || "You";
    } else if (guestId || isGuestChat) {
      senderType = "GUEST";
      senderName = guestName || "Guest";
    }

    // Create optimistic message for UI
    const optimisticMessage: IMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      senderId: session?.user?.id || null,
      guestId: guestId || null,
      senderType: senderType,
      senderName: senderName,
      createdAt: new Date(),
      isEdited: false,
      type: "TEXT",
      url: null,
      isRead: false,
      status: "SENDING", // NEW: Set initial sending status
    };

    // Add message to UI immediately (optimistic update)
    setMessages((prev) => [...prev, optimisticMessage]);
    messageIdsRef.current.add(optimisticMessage.id);

    if (isSendingRef.current) return;
    isSendingRef.current = true;

    try {
      if (isAdmin) {
        console.log("📨 Sending admin message (HTTP)...");
        const result = await sendMessageAsAdmin(chat.id, messageContent);
        
        // Update optimistic message with real ID and SUCCESS status
        const realId = result.data?.id;
        if (realId) messageIdsRef.current.add(realId);
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticMessage.id
              ? { ...msg, id: realId || msg.id, status: "SENT" as const }
              : msg,
          ),
        );
      } else {
        if (senderType === "GUEST" && guestId) {
          console.log("📨 Sending guest message (HTTP)...");
          const result = await sendMessageAsGuest(
            chat.id,
            messageContent,
            guestId,
          );

          const realId = result.data?.id;
          if (realId) messageIdsRef.current.add(realId);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === optimisticMessage.id
                ? { ...msg, id: realId || msg.id, status: "SENT" as const }
                : msg,
            ),
          );
        } else {
          console.log("📨 Sending user message (HTTP)...");
          const result = await sendMessageAsUser(chat.id, messageContent);

          const realId = result.data?.id;
          if (realId) messageIdsRef.current.add(realId);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === optimisticMessage.id
                ? { ...msg, id: realId || msg.id, status: "SENT" as const }
                : msg,
            ),
          );
        }
      }
    } catch (error: any) {
      console.error("❌ Failed to save message via HTTP API:", error);
      
      // NEW: Show toast for better debugging
      toast.error("Message failed to send. Please try again.");

      // Mark optimistic message as FAILED
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticMessage.id
            ? { ...msg, status: "FAILED" as const }
            : msg,
        ),
      );
    } finally {
      isSendingRef.current = false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // Send typing indicator
    sendTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Determine display name
  const displayName = isAdmin
    ? chat.senderInfo?.name || chat.guestName || "Guest"
    : chat.subject || "Glory Support";

  // BRAND DESIGN TOKENS
  const GLORY_MAGENTA = "#d12a7a";
  const GLORY_LIGHT_PINK = "#fff5f9";

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 overflow-hidden relative md:rounded-2xl border-0 md:border-2 border-rose-100 dark:border-rose-900/30">
      {/* Premium Branded Header */}
      <div
        className="flex items-center justify-between px-5 py-4 text-white shadow-lg relative z-20 overflow-hidden shrink-0"
        style={{
          background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)`,
        }}
      >
        {/* Background Heart Decoration */}
        <Heart
          className="absolute -top-2 -right-2 h-16 w-16 text-white/10 -rotate-12"
          fill="currentColor"
        />

        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2 tracking-wide">
                {displayName}
                <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" />
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
                  {isConnected ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  )}
                  {isConnected ? "Online" : "Connecting..."}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center relative z-10 shrink-0">
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white/20 text-white rounded-full transition-all active:scale-95 h-10 w-10 md:h-8 md:w-8"
            >
              <X className="h-6 w-6 md:h-5 md:w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Unique Branded Background with Heart Pattern */}
      <div
        className="flex-1 w-full overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-rose-300 dark:scrollbar-thumb-rose-900"
        style={{
          backgroundColor: GLORY_LIGHT_PINK,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 38c-.5-.5-5.5-5-8.5-8-3.5-3.5-5.5-7.5-5.5-11 0-7.5 7-10 10-6 1.5 1.5 2.5 3 4 4.5 1.5-1.5 2.5-3 4-4.5 3-4 10-1.5 10 6 0 3.5-2 7.5-5.5 11-3 3-8 7.5-8.5 8z' fill='${encodeURIComponent(GLORY_MAGENTA)}' fill-opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      >
        <div ref={messagesContainerRef} className="flex flex-col gap-4 p-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 text-center space-y-6 md:space-y-8 overflow-y-auto">
              <div className="animate-in zoom-in duration-500">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-200"
                  style={{
                    background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)`,
                  }}
                >
                  <Heart
                    className="h-10 w-10 text-white animate-pulse"
                    fill="currentColor"
                  />
                </div>
                <h4
                  className="font-bold text-xl mb-2"
                  style={{ color: GLORY_MAGENTA }}
                >
                  Hello Beautiful! 👋
                </h4>
                <p className="text-slate-500 max-w-50 text-sm font-medium">
                  We're here to help you shine. Send us a message to start!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 p-4 w-full">
              {messages.map((message, index) => {
                // Properly determine side based on who is viewing
                const isMe = isAdmin
                  ? message.senderType === "ADMIN"
                  : message.senderType === "USER" ||
                  message.senderType === "GUEST";
                const showAvatar = !isMe;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 mt-2",
                      isMe ? "justify-end" : "justify-start",
                    )}
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    {showAvatar && (
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shrink-0 mt-auto shadow-sm">
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          {(
                            message.senderName ||
                            (message.senderType === "ADMIN" ? "A" : "U")
                          )
                            ?.charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div
                      className={cn(
                        "relative flex flex-col max-w-[80%] px-4 py-2.5 text-[15px] leading-relaxed shadow-md transition-all",
                        isMe
                          ? "text-white rounded-2xl rounded-br-lg border-0"
                          : "bg-white border border-rose-100 text-slate-800 rounded-2xl rounded-bl-lg",
                      )}
                      style={
                        isMe
                          ? {
                            background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)`,
                          }
                          : {}
                      }
                    >
                      <p className="word-break break-word whitespace-pre-wrap font-medium">
                        {typeof message.content === "string"
                          ? message.content
                          : JSON.stringify(message.content)}
                      </p>
                      <div className="flex items-center justify-between gap-4 mt-1 opacity-70">
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-tighter",
                            isMe ? "text-white" : "text-slate-400",
                          )}
                        >
                          {new Date(message.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                        {isMe && (
                          <div className="flex items-center gap-1.5 min-w-6">
                            {message.status === "SENDING" ? (
                              <Loader2 className="h-2.5 w-2.5 text-white/50 animate-spin" />
                            ) : message.status === "FAILED" ? (
                              <AlertCircle className="h-2.5 w-2.5 text-rose-200 animate-pulse" />
                            ) : (
                              <Heart className="h-2.5 w-2.5 text-white/70" fill="currentColor" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 animate-pulse">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl shadow-md">
                <div
                  className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDuration: "0.6s" }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s", animationDuration: "0.6s" }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s", animationDuration: "0.6s" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Responsive Input Area */}
      <div className="px-3 pt-3 pb-safe-area border-t border-rose-100 dark:border-rose-900/10 bg-white dark:bg-slate-900 shrink-0" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center gap-2 max-w-full">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-400 shrink-0 h-11 w-11"
          >
            <Paperclip className="h-6 w-6" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="bg-slate-100/50 dark:bg-slate-800/80 border-0 focus-visible:ring-2 focus-visible:ring-rose-500/20 h-12 md:h-11 pr-10 text-[16px] rounded-2xl"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 h-10 w-10"
            >
              <Smile className="h-6 w-6" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="text-white shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0 h-12 w-12 rounded-2xl border-0"
            style={{
              background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)`,
            }}
          >
            <Send className="h-5 w-5 rotate-0 transition-transform active:rotate-12" />
          </Button>
        </div>

        {chat.status !== "OPEN" && chat.status !== "ACTIVE" && (
          <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mt-4">
            Consultation Closed
          </p>
        )}
      </div>
    </div>
  );
}
