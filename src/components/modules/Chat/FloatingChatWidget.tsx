"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FloatingChatWidgetProps {
  displayName?: string;
}

export function FloatingChatWidget({
  displayName = "Chat Support",
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestId, setGuestId] = useState("");
  const [phase, setPhase] = useState<"intro" | "chat">("intro");

  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

  const handleStartChat = async () => {
    if (!guestEmail.trim()) {
      alert("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_API}/chat/start-guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: guestEmail.trim(),
          subject: "Support request",
          initialMessage: "Hi, I need help!",
        }),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        const chatData = data.data || data;
        setChatSession(chatData);
        setGuestId(chatData.guestId);
        setMessages([
          {
            id: "1",
            content: `Hello! 👋 How can we help you today?`,
            senderType: "ADMIN",
            senderName: "Support Team",
            createdAt: new Date(),
          },
        ]);
        setPhase("chat");
      } else {
        alert(data.message || "Failed to start chat");
      }
    } catch (error: any) {
      console.error("Failed to start chat:", error);
      alert("Failed to start chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !chatSession) return;

    const messageContent = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${BASE_API}/chat/${chatSession.id}/send-guest`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: messageContent,
            guestId: guestId,
            guestName: "Guest User",
          }),
        },
      );

      const data = await response.json();

      if (data.success || response.ok) {
        setMessages([
          ...messages,
          {
            id: data.data?.id || "msg-" + Date.now(),
            content: messageContent,
            senderType: "GUEST",
            senderName: "You",
            createdAt: new Date(),
          },
        ]);
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      setInput(messageContent);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-screen-80 z-40 flex flex-col">
      <Card className="flex-1 flex flex-col bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-500/30 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-linear-to-r from-purple-500 to-pink-500 text-white">
          <div>
            <h3 className="font-bold">{displayName}</h3>
            <p className="text-xs opacity-90">We typically reply in minutes</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsOpen(false);
              setPhase("intro");
              setChatSession(null);
              setMessages([]);
              setGuestEmail("");
              setGuestId("");
            }}
            className="hover:bg-white/20 text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {phase === "intro" ? (
            // Intro Form
            <div className="flex-1 flex flex-col justify-center p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Your Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="mt-2 bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-500/30"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleStartChat();
                  }}
                />
              </div>

              <Button
                onClick={handleStartChat}
                disabled={isLoading || !guestEmail.trim()}
                className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Starting chat...
                  </>
                ) : (
                  "Start Chat"
                )}
              </Button>
            </div>
          ) : (
            // Chat Messages
            <>
              <div className="flex-1 overflow-y-auto space-y-3 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.senderType === "GUEST"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs px-4 py-2 rounded-lg",
                        message.senderType === "GUEST"
                          ? "bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-none",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-purple-500/20 bg-gray-50 dark:bg-slate-900/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-500/30"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
