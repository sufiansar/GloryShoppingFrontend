"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatModal } from "./ChatModal";

export function FloatingChatButton() {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        title="Chat with us"
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          {/* Red notification dot */}
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            1
          </span>
        </div>
      </button>

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </>
  );
}
