"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Send, MessageSquare } from "lucide-react";
import { ChatWindow } from "@/components/modules/Chat/ChatWindow";
import { FloatingChatWidget } from "@/components/modules/Chat/FloatingChatWidget";
import { IChat, IMessage } from "@/types/chat.interface";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeChat, setActiveChat] = useState<IChat | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [guestMode, setGuestMode] = useState(!session);
  const [formData, setFormData] = useState({
    email: session?.user?.email || "",
    subject: "",
    message: "",
  });

  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

  useEffect(() => {
    if (status === "unauthenticated") {
      setGuestMode(true);
    }
  }, [status]);

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (!session?.user?.id && !formData.email.trim()) {
      alert("Please enter your email");
      return;
    }

    setIsCreatingChat(true);

    try {
      let response;

      if (session?.user?.id) {
        // Authenticated user
        response = await fetch(`${BASE_API}/chat/start-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.id || ""}`,
          },
          body: JSON.stringify({
            subject: formData.subject,
            initialMessage: formData.message,
          }),
        });
      } else {
        // Guest user
        response = await fetch(`${BASE_API}/chat/start-guest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            subject: formData.subject,
            initialMessage: formData.message,
          }),
        });
      }

      const data = await response.json();

      if (data.success || response.ok) {
        const chatData = data.data || data;

        // Fetch messages for this chat
        const messagesEndpoint = session?.user?.id
          ? `${BASE_API}/chat/${chatData.id}/messages-user`
          : `${BASE_API}/chat/${chatData.id}/messages-guest`;

        const messagesResponse = await fetch(messagesEndpoint, {
          headers: {
            Authorization: `Bearer ${session?.user?.id || ""}`,
          },
        });
        const messagesData = await messagesResponse.json();

        const initialMessage: IMessage = {
          id: "initial-" + Date.now(),
          content: formData.message,
          senderId: session?.user?.id || formData.email,
          senderType: session?.user?.id ? "USER" : "GUEST",
          senderName: session?.user?.name || "Guest User",
          createdAt: new Date(),
          isEdited: false,
        };

        setActiveChat({
          ...chatData,
          messages: [...(messagesData.data?.messages || []), initialMessage],
        });
        setFormData({ email: "", subject: "", message: "" });
      } else {
        alert(data.message || "Failed to start chat");
      }
    } catch (error: any) {
      console.error("Failed to create chat:", error);
      alert("Failed to start chat. Please try again.");
    } finally {
      setIsCreatingChat(false);
    }
  };

  // Show guest widget if no session
  if (status === "unauthenticated" || guestMode) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-full">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-purple-400 via-pink-300 to-purple-400 bg-clip-text text-transparent">
                Live Chat Support
              </h1>
            </div>
            <p className="text-purple-200/70 max-w-2xl mx-auto">
              Connect with our support team for immediate assistance with your
              orders, products, or any questions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Guest Chat Widget */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-0 overflow-hidden shadow-2xl h-full">
                <FloatingChatWidget />
              </Card>
            </div>

            {/* Features */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-6 hover:bg-white/15 transition-all">
                <h3 className="text-lg font-bold text-white mb-2">
                  Instant Response
                </h3>
                <p className="text-purple-200/70">
                  Get answers from our support team within minutes, available
                  24/7.
                </p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-6 hover:bg-white/15 transition-all">
                <h3 className="text-lg font-bold text-white mb-2">
                  Secure & Private
                </h3>
                <p className="text-purple-200/70">
                  Your conversations are encrypted and kept completely
                  confidential.
                </p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-6 hover:bg-white/15 transition-all">
                <h3 className="text-lg font-bold text-white mb-2">
                  Real-time Updates
                </h3>
                <p className="text-purple-200/70">
                  See typing indicators and get notified of new responses
                  instantly.
                </p>
              </Card>

              {session && (
                <Button
                  onClick={() => setGuestMode(false)}
                  className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Use My Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in user view
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-full">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 via-pink-300 to-purple-400 bg-clip-text text-transparent">
                Support Chat
              </h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-purple-300 hover:text-white hover:bg-purple-500/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {!activeChat ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chat Form */}
            <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-8 shadow-2xl lg:col-span-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                Start a Conversation
              </h2>
              <p className="text-purple-200/70 mb-6">
                Tell us how we can help you today.
              </p>

              <form onSubmit={handleCreateChat} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!!session}
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Subject
                  </label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="What is this about?"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Message
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-200/50 focus:border-purple-400 focus:ring-purple-400 resize-none"
                    placeholder="Tell us more details..."
                    rows={5}
                    required
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isCreatingChat}
                  className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isCreatingChat ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin">⏳</div>
                      Starting Chat...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Start Chat
                    </span>
                  )}
                </Button>
              </form>
            </Card>

            {/* Info Section */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-6 hover:bg-white/15 transition-all">
                <h3 className="text-lg font-bold text-white mb-2">
                  Response Times
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200/70">Peak Hours:</span>
                    <Badge className="bg-yellow-500/20 text-yellow-300">
                      5-15 min
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200/70">Standard Hours:</span>
                    <Badge className="bg-green-500/20 text-green-300">
                      1-5 min
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200/70">Off-Hours:</span>
                    <Badge className="bg-purple-500/20 text-purple-300">
                      Within 1 hr
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-6 hover:bg-white/15 transition-all">
                <h3 className="text-lg font-bold text-white mb-3">
                  Common Topics
                </h3>
                <div className="space-y-2">
                  {[
                    "Product Recommendations",
                    "Order Status",
                    "Returns & Refunds",
                    "Shipping Info",
                    "Account Help",
                  ].map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center gap-2 text-sm text-purple-200/70 hover:text-purple-200 cursor-pointer transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                      {topic}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-6 hover:bg-white/15 transition-all">
                <h3 className="text-lg font-bold text-white mb-2">
                  Available 24/7
                </h3>
                <p className="text-purple-200/70 text-sm">
                  Our support team is always ready to help. Whether you have
                  questions about products, orders, or need technical
                  assistance, we're here for you.
                </p>
              </Card>
            </div>
          </div>
        ) : (
          // Chat Window
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ChatWindow
                chat={activeChat}
                onClose={() => setActiveChat(null)}
                userInfo={session?.user}
                onMessageSent={() => {
                  // Refresh chat if needed
                }}
              />
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Chat Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-purple-200/50 uppercase tracking-wider">
                      Subject
                    </p>
                    <p className="text-white font-semibold">
                      {activeChat.subject}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-200/50 uppercase tracking-wider">
                      Status
                    </p>
                    <Badge
                      className={cn(
                        "mt-1",
                        activeChat.status === "OPEN"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-gray-500/20 text-gray-300",
                      )}
                    >
                      {activeChat.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-purple-200/50 uppercase tracking-wider">
                      Messages
                    </p>
                    <p className="text-white font-semibold">
                      {activeChat.messages?.length || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-purple-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-purple-200/70">
                  <li>• Be specific about your issue</li>
                  <li>• Include order numbers when relevant</li>
                  <li>• Attach screenshots if needed</li>
                  <li>• Check response time estimates</li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
