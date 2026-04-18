"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Loader, LogIn, UserPlus, Ghost, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { storage } from "@/lib/storage-utils";
import { ChatWindow } from "./ChatWindow";
import { IChat } from "@/types/chat.interface";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getAllUserMessages, startChatAsUser } from "@/action/chat/chat.action";
import { IMessage } from "@/types/chat.interface";
import { useSocket } from "@/providers/SocketProvider";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { setEphemeralGuestId } = useSocket();
  const [activeChat, setActiveChat] = useState<IChat | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [view, setView] = useState<"selection" | "guest-form" | "chat">("selection");
  const [tempGuestId, setTempGuestId] = useState<string | null>(null);
  const [tempGuestName, setTempGuestName] = useState<string>("Guest User");

  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

  const handleStartChat = async () => {
    setIsCreatingChat(true);

    try {
      if (session?.user) {
        // Authenticated user flow
        const result = await getAllUserMessages();
        if (result.success && result.data) {
          const rawData = result.data.data || result.data || [];
          const messagesData = Array.isArray(rawData) ? rawData : [];
          
          const messages: IMessage[] = messagesData.map((msg: any) => ({
            id: msg.id, content: msg.content, senderId: msg.senderId || null, guestId: null, senderType: msg.senderType, senderName: msg.senderName || (msg.senderType === "ADMIN" ? "Support" : "You"), createdAt: new Date(msg.createdAt), isEdited: false, type: msg.type || "TEXT", url: msg.url || null, isRead: msg.isRead || false,
          }));
          
          const chatId = messagesData.length > 0 ? messagesData[messagesData.length - 1].chatId : null;
          
          if (chatId) {
            setActiveChat({ id: chatId, status: "ACTIVE", messages: messages, createdAt: new Date(), updatedAt: new Date() });
            setView("chat");
            return;
          }
        }
        
        // No existing messages, start new
        const startResult = await startChatAsUser({ subject: "Support", initialMessage: "Hi" });
        if (startResult.success && startResult.data) {
          const chatData = startResult.data;
          const newId = chatData.id || chatData.chatId;
          if (newId) {
            setActiveChat({ id: newId as string, status: "ACTIVE", messages: [], createdAt: new Date(), updatedAt: new Date() });
            setView("chat");
            return;
          }
        }
      } else {
        // Guest user flow (Existing logic)
        const guestId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        console.log("Starting chat with guestId:", guestId);

        const response = await fetch(`${BASE_API}/chat/start-guest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestId: guestId,
          }),
        });

        const data = await response.json();
        const chatData = data.data || data;

        if (response.ok && chatData && (chatData.id || chatData.chatId)) {
          const chatId = chatData.id || chatData.chatId;
          const guestIdFromResponse = chatData.guestId || guestId;

          setTempGuestId(guestIdFromResponse);
          setEphemeralGuestId(guestIdFromResponse);
          setTempGuestName("Guest User");

          const chatObject: IChat = {
            id: chatId,
            status: chatData.status || "ACTIVE",
            messages: [],
            createdAt: new Date(chatData.createdAt || new Date()),
            updatedAt: new Date(chatData.updatedAt || new Date()),
          };

          setActiveChat(chatObject);
          setView("chat");
        }
      }
    } catch (error: any) {
      console.error("Failed to start chat error:", error.message);
    } finally {
      setIsCreatingChat(false);
    }
  };

  // Sync logic for logged-in users
  useEffect(() => {
    if (isOpen && session?.user && view !== "chat" && !activeChat) {
      handleStartChat();
    }
  }, [isOpen, session, view, activeChat]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
      <Card className="w-full h-full md:max-w-2xl md:h-[650px] bg-white dark:bg-slate-900 flex flex-col shadow-2xl md:rounded-2xl border-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h2 className="text-lg font-bold">Chat with Support</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-white/20 text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {view === "chat" && activeChat ? (
            <ChatWindow
              chat={activeChat}
              onClose={() => {
                setActiveChat(null);
                setView("selection");
              }}
              isAdmin={false}
              tempGuestId={tempGuestId}
              tempGuestName={tempGuestName}
            />
          ) : isCreatingChat ? (
            /* Loading State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <Loader className="h-12 w-12 text-purple-500 animate-spin" />
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connecting...</h3>
                <p className="text-sm text-gray-500">Retrieving your conversation history...</p>
              </div>
            </div>
          ) : view === "selection" ? (
            /* Guest Welcome View */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-2">
                <MessageCircle className="h-10 w-10 text-rose-500" />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Need Assistance?
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Our direct chat is reserved for members. Please login to chat with our support team and save your conversation history.
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-md">
                <Button 
                  className="h-14 rounded-xl text-white font-bold text-lg shadow-xl shadow-pink-200 transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: "oklch(52.801% 0.15987 344.323)" }}
                  onClick={() => {
                    storage.local.set("autoOpenChat", "true");
                    onClose();
                    router.push("/login");
                  }}
                >
                  <LogIn className="h-5 w-5 mr-3" />
                  Login to Start Chat
                </Button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-1 bg-gray-100 dark:bg-slate-800" />
                  <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">Emergency Contact</span>
                  <div className="h-[1px] flex-1 bg-gray-100 dark:bg-slate-800" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline"
                    className="h-12 border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-700 font-bold rounded-xl"
                    onClick={() => window.open("https://wa.me/8801577437554", "_blank")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-12 border-blue-200 bg-blue-50/30 hover:bg-blue-50 text-blue-700 font-bold rounded-xl"
                    onClick={() => window.open("https://www.facebook.com/GloryShopingBD", "_blank")}
                  >
                    <svg className="h-4 w-4 mr-2 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.453 5.518 3.73 7.234V22l3.352-1.841c.294.041.593.064.898.064 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.082 12.186l-2.454-2.62-4.79 2.62 5.267-5.594 2.52 2.62 4.724-2.62-5.267 5.594z"/></svg>
                    Messenger
                  </Button>
                </div>
              </div>

              <p className="text-xs text-gray-400 italic animate-pulse">
                Support typically replies within minutes
              </p>
            </div>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </Card>
    </div>
  );
}
