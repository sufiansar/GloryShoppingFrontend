"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { storage } from "@/lib/storage-utils";
import { ChatWindow } from "./ChatWindow";
import { IChat } from "@/types/chat.interface";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [activeChat, setActiveChat] = useState<IChat | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

  const handleStartChat = async () => {
    setIsCreatingChat(true);

    try {
      const guestId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      console.log("Starting chat with guestId:", guestId);
      console.log("API URL:", `${BASE_API}/chat/start-guest`);

      const response = await fetch(`${BASE_API}/chat/start-guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guestId,
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      // Handle both response formats: {data: {...}} or direct object
      const chatData = data.data || data;

      if (response.ok && chatData && (chatData.id || chatData.chatId)) {
        // Store guest info in localStorage for Socket.io
        const chatId = chatData.id || chatData.chatId;
        const guestIdFromResponse = chatData.guestId || guestId;

        storage.local.set("guestId", guestIdFromResponse);
        storage.local.set("guestName", "Guest User");

        const chatObject: IChat = {
          id: chatId,
          status: chatData.status || "ACTIVE",
          messages: [],
          createdAt: new Date(chatData.createdAt || new Date()),
          updatedAt: new Date(chatData.updatedAt || new Date()),
        };

        console.log("Chat created successfully:", chatObject);
        setActiveChat(chatObject);
      } else {
        console.error("Invalid response format:", data);
        alert("Failed to start chat. Please try again.");
      }
    } catch (error: any) {
      console.error("Failed to start chat error:", error.message);
      alert(`Failed to start chat: ${error.message}`);
    } finally {
      setIsCreatingChat(false);
    }
  };

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
        <div className="flex-1 overflow-hidden">
          {activeChat ? (
            <ChatWindow
              chat={activeChat}
              onClose={() => {
                setActiveChat(null);
              }}
              isAdmin={false}
            />
          ) : (
            /* Start Chat UI */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MessageCircle className="h-16 w-16 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Start a Conversation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Chat with our support team anytime. We're here to help!
              </p>
              <Button
                onClick={handleStartChat}
                disabled={isCreatingChat}
                className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2"
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
          )}
        </div>
      </Card>
    </div>
  );
}
