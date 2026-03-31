"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WhatsAppFloatEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const phoneNumber = "+8801577437554"; // BD country code: 880
  const businessHours = "24/7 Available";
  const message = "Hello! I'm interested in your services.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    setIsVisible(true);

    // Update current time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    // Buffering animation
    const bufferInterval = setInterval(() => {
      setIsBuffering((prev) => !prev);
    }, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(bufferInterval);
    };
  }, []);

  const handleWhatsAppClick = () => {
    setIsBuffering(true);
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsBuffering(false);
      setIsOpen(false);
    }, 500);
  };

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Expanded Panel */}
      {isOpen && (
        <div
          className={cn(
            "absolute bottom-16 left-0 w-72 bg-white rounded-xl shadow-2xl p-4",
            "border border-gray-200 animate-in slide-in-from-bottom-5 duration-300",
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-800">
              Contact Business
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Phone Number */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Business WhatsApp</p>
                <p className="font-semibold text-green-700">{phoneNumber}</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Business Hours</p>
                <p className="font-semibold text-gray-800">{businessHours}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Current time: {currentTime}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleWhatsAppClick}
                disabled={isBuffering}
                className={cn(
                  "flex-1 py-3 rounded-lg font-semibold transition-all",
                  "bg-green-500 hover:bg-green-600 text-white",
                  "flex items-center justify-center space-x-2",
                  isBuffering && "opacity-80",
                )}
              >
                {isBuffering ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>Message</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCallClick}
                className="flex-1 py-3 rounded-lg font-semibold transition-all bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button with Buffering Animation */}
      <div className="relative">
        {/* Animated Rings */}
        <div className="absolute inset-0">
          {[0, 1, 2].map((ring) => (
            <div
              key={ring}
              className={cn(
                "absolute inset-0 rounded-full border-2 border-green-400",
                "animate-ping opacity-20",
                isBuffering ? "visible" : "invisible",
              )}
              style={{
                animationDelay: `${ring * 0.5}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative w-16 h-16 rounded-full shadow-xl",
            "bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
            "flex items-center justify-center transition-all duration-300",
            "hover:scale-110 active:scale-95",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10",
            "group",
          )}
        >
          {/* Unread indicator */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">1</span>
          </div>

          {/* Icon */}
          {isBuffering ? (
            <div className="flex space-x-1">
              {[0, 1, 2].map((dot) => (
                <div
                  key={dot}
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: `${dot * 0.15}s` }}
                />
              ))}
            </div>
          ) : (
            <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
}
