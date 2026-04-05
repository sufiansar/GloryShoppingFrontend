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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl h-[600px] bg-white dark:bg-slate-900 flex flex-col shadow-2xl">
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
            /* Selection View */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  How would you like to chat?
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Save your messages or continue anonymously
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                <Card 
                  className="p-6 cursor-pointer hover:border-purple-500 hover:shadow-md transition-all group flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-800/50"
                  onClick={() => router.push("/login")}
                >
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <LogIn className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Login / Sign Up</h4>
                    <p className="text-xs text-gray-500 mt-1">Keep your chat history forever</p>
                  </div>
                  <Button variant="outline" className="w-full mt-2 border-purple-200">
                    Go to Login
                  </Button>
                </Card>

                <Card 
                   className="p-6 cursor-pointer hover:border-pink-500 hover:shadow-md transition-all group flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-800/50"
                   onClick={() => setView("guest-form")}
                >
                  <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                    <Ghost className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Guest Chat</h4>
                    <p className="text-xs text-gray-500 mt-1">Fast & anonymous help</p>
                  </div>
                  <Button variant="outline" className="w-full mt-2 border-pink-200">
                    Continue
                  </Button>
                </Card>
              </div>
            </div>
          ) : (
            /* Guest Form View (Current Start Chat UI) */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-6 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3 text-left">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Ephemeral Session</p>
                  <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
                    Guest messages will be permanently deleted if you refresh the page or close this session.
                  </p>
                </div>
              </div>

              <MessageCircle className="h-16 w-16 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Start a Guest Conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our support team is ready to assist you.
              </p>
              
              <div className="flex gap-4 w-full max-w-sm">
                <Button
                  variant="outline"
                  onClick={() => setView("selection")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleStartChat}
                  disabled={isCreatingChat}
                  className="flex-[2] bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {isCreatingChat ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chatting
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
