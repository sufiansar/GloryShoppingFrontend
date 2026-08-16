"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/components/Assets/Logo.png";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Ghost, AlertTriangle, MessageCircle, X, Heart, Loader2, RefreshCcw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChatWindow } from "./ChatWindow";
import { useHydrated } from "@/hooks/use-hydrated";
import { storage } from "@/lib/storage-utils";
import { IChat, IMessage } from "@/types/chat.interface";
import { useSocket } from "@/providers/SocketProvider";
import {
  getChatMessagesAsGuest,
  startChatAsUser,
  startChatAsGuest,
  getAllUserMessages,
} from "@/action/chat/chat.action";
import { toast } from "sonner";

interface FloatingChatButtonProps {
  displayName?: string;
}

export function FloatingChatButtonImproved({
  displayName = "Glory Chat Support",
}: FloatingChatButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [activeChat, setActiveChat] = useState<IChat | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [view, setView] = useState<"selection" | "guest-form" | "chat">("selection");
  const [tempGuestId, setTempGuestId] = useState<string | null>(null);
  const [tempGuestName, setTempGuestName] = useState<string>("Guest User");
  const router = useRouter();
  const { setEphemeralGuestId } = useSocket();
  
  const { data: session, status } = useSession(); 
  const pathname = usePathname();
  const hydrated = useHydrated();

  // STABILITY REFS: These track logic status WITHOUT triggering re-renders or function re-definitions
  const isInitializingRef = useRef(false);
  const activeChatRef = useRef<IChat | null>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync activeChatRef with state for use inside stable useCallback
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  // STABLE HANDLER: handleOpenChat
  const handleOpenChat = useCallback(async (isAutoOpenFromAnotherTab = false) => {
    // 1. INSTANT UI FEEDBACK
    setIsExpanded(true);
    storage.local.set("isChatExpanded", "true");

    // 2. DUP PREVENTION
    if (isInitializingRef.current) return;
    
    if (activeChatRef.current && activeChatRef.current.id) {
      setView("chat");
      return;
    }

    console.log("🚀 Establishing Stable Chat Connection...", { status, userId: session?.user?.id });
    isInitializingRef.current = true;
    setIsInitializing(true);

    // Cleanup any existing timeout
    if (initializationTimeoutRef.current) clearTimeout(initializationTimeoutRef.current);
    // Safety timeout: if it takes more than 15s, something is wrong
    initializationTimeoutRef.current = setTimeout(() => {
      if (isInitializingRef.current && !activeChatRef.current) {
        console.error("🕒 Chat initialization timed out");
        setIsInitializing(false);
        isInitializingRef.current = false;
      }
    }, 15000);

    try {
      // Flow A: Authenticated User with valid backend token
      if (session?.user?.id && (session as any)?.accessToken) {
        console.log("👤 Initializing for authenticated user:", session.user.id);
        let userChatId = storage.local.get(`userChatId_${session.user.id}`);
        
        // Always try to fetch first if we are logged in
        const result = await getAllUserMessages();
        if (result.success && result.data) {
          const rawData = result.data.data || result.data || [];
          const messagesData = Array.isArray(rawData) ? rawData : [];
          
          if (messagesData.length > 0 || userChatId) {
            const messages: IMessage[] = messagesData.map((msg: any) => ({
              id: msg.id, content: msg.content, senderId: msg.senderId || null, guestId: null, senderType: msg.senderType, senderName: msg.senderName || (msg.senderType === "ADMIN" ? "Support" : "You"), createdAt: new Date(msg.createdAt), isEdited: false, type: msg.type || "TEXT", url: msg.url || null, isRead: msg.isRead || false,
            }));
            const latestChatId = messagesData.length > 0 ? messagesData[messagesData.length - 1].chatId : (userChatId as string);
            
            if (latestChatId) {
              const chatObject: IChat = { id: latestChatId, status: "ACTIVE", messages: messages, createdAt: new Date(), updatedAt: new Date() };
              setActiveChat(chatObject);
              setView("chat");
              setIsExpanded(true); 
              storage.local.set("isChatExpanded", "true");
              storage.local.set(`userChatId_${session.user.id}`, latestChatId);
              return;
            }
          }
        }
        
        // No existing messages, start new chat
        const startResult = await startChatAsUser({ subject: "Support", initialMessage: "Hi" });
        if (startResult.success && startResult.data) {
          const chatData = startResult.data;
          const newId = chatData.id || chatData.chatId;
          if (newId) {
            storage.local.set(`userChatId_${session.user.id}`, newId as string);
            setActiveChat({ id: newId as string, status: "ACTIVE", messages: [], createdAt: new Date(), updatedAt: new Date() });
            setView("chat");
            setIsExpanded(true);
            storage.local.set("isChatExpanded", "true");
            return;
          }
        }
        throw new Error(startResult?.error || "Initialization failed");
      } 
      // --- Flow B: Guest User (Selection Screen) ---
      else {
        // Just show selection screen, don't initialize API yet
        setView("selection");
        setIsExpanded(true);
        storage.local.set("isChatExpanded", "true");
        return;
      }
    } catch (error: any) {
      console.error("❌ Initialization failed:", error);
      toast.error(error.message || "Support chat is temporarily unavailable.");
    } finally {
      setIsInitializing(false);
      isInitializingRef.current = false;
      if (initializationTimeoutRef.current) clearTimeout(initializationTimeoutRef.current);
    }
  }, [session?.user?.id, status]);

  // STABLE SYNC: Ensure session status is respected
  useEffect(() => {
    if (status === "authenticated") {
      if (storage.local.get("isChatExpanded") === "true" || storage.local.get("autoOpenChat") === "true") {
        handleOpenChat();
        if (storage.local.get("autoOpenChat") === "true") {
          storage.local.remove("autoOpenChat");
        }
      }
    }
  }, [status, handleOpenChat]);

  // Dedicated function for guest chat start (called from UI selection)
  const handleStartGuestChat = async () => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    isInitializingRef.current = true;

    try {
      const newGuestId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log("🆕 Creating new ephemeral guest session:", newGuestId);

      const startResult = await startChatAsGuest({ guestId: newGuestId, name: "Guest" });
      if (startResult.success && startResult.data) {
        const chatData = startResult.data.data || startResult.data;
        const newId = chatData.id || chatData.chatId;
        if (newId) {
          setTempGuestId(newGuestId);
          setEphemeralGuestId(newGuestId);
          setTempGuestName("Guest");
          
          // NEW: Backup ephemeral Guest ID to session storage for the current tab
          if (typeof window !== "undefined") {
            sessionStorage.setItem("glory_temp_guest_id", newGuestId);
          }

          setActiveChat({ 
            id: newId, 
            status: "ACTIVE", 
            messages: [], 
            createdAt: new Date(), 
            updatedAt: new Date(), 
            guestId: newGuestId 
          });
          setView("chat");
          return;
        }
      }
      throw new Error("Guest initialization failed");
    } catch (error) {
      console.error("❌ Guest initialization failed:", error);
      toast.error("Failed to start guest chat. Please try again.");
    } finally {
      setIsInitializing(false);
      isInitializingRef.current = false;
    }
  };


  // Tab Sync & Events
  useEffect(() => {
    if (!hydrated) return;
    const handleOpenFloatingChat = () => handleOpenChat();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isChatExpanded") {
        if (e.newValue === "true") {
           // Tab Sync Case: Open instantly and then fetch
           handleOpenChat(true); 
        } else {
           setIsExpanded(false);
        }
      }
    };
    window.addEventListener("openFloatingChat", handleOpenFloatingChat);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("openFloatingChat", handleOpenFloatingChat);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [hydrated, handleOpenChat]);

  // Initial Auto-open
  useEffect(() => {
    if (hydrated && status !== "loading" && storage.local.get("isChatExpanded") === "true") { 
      handleOpenChat(true); 
    }
  }, [hydrated, status, handleOpenChat]);

  // Notification Badge
  useEffect(() => {
    if (!hydrated || isExpanded) return;
    const countNotification = () => setNotificationCount(p => p + 1);
    window.addEventListener("chatNotification", countNotification);
    return () => window.removeEventListener("chatNotification", countNotification);
  }, [hydrated, isExpanded]);

  useEffect(() => { if (isExpanded) setNotificationCount(0); }, [isExpanded]);

  // Session boundary protection - improved to be less aggressive during loads
  useEffect(() => {
    if (!hydrated || status === "loading" || !activeChat) return;
    
    const isGuestChat = activeChat.id?.startsWith("guest-") || !!activeChat.guestId;
    
    // If we have a guest chat but we are now logged in
    if (session?.user && isGuestChat) {
      console.log("♻️ Switching from guest chat to user chat");
      setActiveChat(null);
      handleOpenChat();
    }
    
    // If we have a user chat but we are now logged out
    if (!session?.user && !isGuestChat) {
      console.log("♻️ Switching from user chat to guest chat");
      setActiveChat(null);
      handleOpenChat();
    }
  }, [session?.user, activeChat, hydrated, status, handleOpenChat]);

  // NEW: Auto-initialize for logged-in users to skip selection screen
  useEffect(() => {
    if (hydrated && session?.user && view !== "chat" && !activeChat && status === "authenticated") {
      console.log("⚡ Logged in user detected, auto-initializing chat...");
      handleOpenChat();
    }
  }, [session, hydrated, status, view, activeChat, handleOpenChat]);

  const isDashboardRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");
  if (isDashboardRoute || !hydrated) return null;

  const GLORY_MAGENTA = "#d12a7a";

  if (isExpanded) {
    return (
      <div
        className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 w-full md:w-96 h-full md:h-150 z-[1000] flex flex-col md:rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300"
        style={{ animation: "slideInUp 0.5s ease-out forwards", boxShadow: "0 20px 60px -15px rgba(209, 42, 122, 0.3)" }}
      >
        <style>{`@keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        
        {activeChat && view === "chat" ? (
          <ChatWindow 
            chat={activeChat} 
            onClose={() => { setIsExpanded(false); storage.local.set("isChatExpanded", "false"); }} 
            tempGuestId={tempGuestId}
            tempGuestName={tempGuestName}
          />
        ) : (isInitializing) ? (
          /* Loading State (Improved) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 relative">
             <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-5" style={{ background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)` }}>
                <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-white/20 animate-pulse" /><div className="h-4 w-32 bg-white/30 rounded-full animate-pulse" /></div>
                <Button variant="ghost" size="icon" onClick={() => { setIsExpanded(false); storage.local.set("isChatExpanded", "false"); }} className="text-white hover:bg-white/20"><X className="h-6 w-6" /></Button>
             </div>
             <div className="text-center mt-16 animate-in zoom-in duration-300">
                <div className="relative mb-6 inline-block">
                  <Heart className="h-16 w-16 text-rose-500 animate-pulse" fill="currentColor" />
                  <Loader2 className="h-8 w-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  Please Wait...
                </h3>
                <p className="text-sm text-slate-500">
                  {status === "authenticated" ? "Loading your chat history..." : "Setting up your secure session..."}
                </p>
                
                {!isInitializing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleOpenChat()}
                    className="mt-6 border-rose-200 text-rose-500 hover:bg-rose-50 rounded-full"
                  >
                    <RefreshCcw className="h-3.5 w-3.5 mr-2" />
                    Retry Connection
                  </Button>
                )}
             </div>
          </div>
        ) : view === "selection" ? (
          /* Selection View */
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
             {/* Header */}
             <div className="h-16 flex items-center justify-between px-5 shrink-0" style={{ background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)` }}>
                <h3 className="font-bold text-white tracking-wide">Customer Support</h3>
                <Button variant="ghost" size="icon" onClick={() => { setIsExpanded(false); storage.local.set("isChatExpanded", "false"); }} className="text-white hover:bg-white/20"><X className="h-6 w-6" /></Button>
             </div>
             
             <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 text-center space-y-6 md:space-y-8 overflow-y-auto">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-2">
                  <MessageCircle className="h-8 w-8 text-rose-500" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Need Assistance?</h4>
                  <p className="text-xs text-slate-500 font-medium px-4">
                    Our direct chat is available for members. Please login to chat with our agents and save your history.
                  </p>
                </div>

                {/* Main Action: Login */}
                <Button 
                  onClick={() => {
                    storage.local.set("autoOpenChat", "true");
                    router.push("/login");
                  }}
                  className="w-full text-white rounded-xl h-12 font-bold shadow-lg shadow-pink-200"
                  style={{ backgroundColor: "oklch(52.801% 0.15987 344.323)" }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login to Chat
                </Button>

                <div className="w-full flex items-center gap-3 py-2">
                  <div className="h-[1px] flex-1 bg-slate-100" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Emergency Contact</span>
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </div>

                {/* Emergency Options */}
                <div className="grid grid-cols-2 gap-3 w-full">
                   <button 
                    onClick={() => window.open("https://wa.me/8801577437554", "_blank")}
                    className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 transition-all flex flex-col items-center gap-2 group"
                   >
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-[10px] text-emerald-700 uppercase tracking-wider">WhatsApp</span>
                   </button>

                   <button 
                    onClick={() => window.open("https://www.facebook.com/GloryShopingBD", "_blank")}
                    className="p-3 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 group"
                   >
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.453 5.518 3.73 7.234V22l3.352-1.841c.294.041.593.064.898.064 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.082 12.186l-2.454-2.62-4.79 2.62 5.267-5.594 2.52 2.62 4.724-2.62-5.267 5.594z"/></svg>
                      </div>
                      <span className="font-bold text-[10px] text-blue-700 uppercase tracking-wider">Messenger</span>
                   </button>
                </div>
                
                <p className="text-[10px] text-slate-400 font-medium animate-pulse">
                  Support typically replies within minutes
                </p>
             </div>
          </div>
        ) : view === "guest-form" ? (
          /* Guest Transition / Ready View */
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
             <div className="h-16 flex items-center justify-between px-5 shrink-0" style={{ background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)` }}>
                <Button variant="ghost" size="sm" onClick={() => setView("selection")} className="text-white hover:bg-white/20 p-0 h-auto">{"< Back"}</Button>
                <h3 className="font-bold text-white tracking-wide">Guest Chat</h3>
                <Button variant="ghost" size="icon" onClick={() => { setIsExpanded(false); storage.local.set("isChatExpanded", "false"); }} className="text-white hover:bg-white/20"><X className="h-6 w-6" /></Button>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3 text-left">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-400">Ephemeral Session</p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-500 leading-tight">
                      Guest chats are temporary. All messages will be wiped if you refresh or close the tab.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Heart className="h-12 w-12 text-rose-500 animate-pulse mx-auto" fill="currentColor" />
                </div>
                
                <div className="space-y-4 w-full">
                  <Button 
                    onClick={() => handleStartGuestChat()}
                    disabled={isInitializing}
                    className="w-full text-white rounded-xl h-11"
                    style={{ backgroundColor: "oklch(52.801% 0.15987 344.323)" }}
                  >
                    {isInitializing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageCircle className="h-4 w-4 mr-2" />}
                    Start Chatting Now
                  </Button>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 group" style={{ animation: "slideInUp 0.5s ease-out forwards" }}>
      <button
        onClick={() => handleOpenChat()}
        className="relative h-16 w-16 border-[3.5px] border-white dark:border-slate-800 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgba(209,42,122,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 z-50 group"
        style={{ background: `linear-gradient(135deg, ${GLORY_MAGENTA} 0%, #ec4899 100%)` }}
        disabled={isInitializing}
      >
        <span className="absolute inset-0 rounded-full animate-ping opacity-40 duration-1000" style={{ backgroundColor: GLORY_MAGENTA }}></span>
        <span className="absolute -inset-2 rounded-full animate-ping opacity-20 duration-1500" style={{ backgroundColor: GLORY_MAGENTA }}></span>
        {notificationCount > 0 && <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white border-2 border-white shadow-lg animate-bounce z-50">{notificationCount > 9 ? "9+" : notificationCount}</div>}
        <Heart className="absolute -top-4 -left-2 h-4 w-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 group-hover:-translate-y-2 group-hover:-translate-x-1" fill="currentColor" />
        <Heart className="absolute top-0 -right-4 h-3 w-3 text-rose-300 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 group-hover:-translate-y-1 group-hover:translate-x-2" fill="currentColor" />
        {isInitializing ? (
          <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 border-2 border-t-white border-white/30 rounded-full animate-spin"></div></div>
        ) : (
          <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-110"><Image src={logo} alt="Chat" fill className="object-contain brightness-0 invert" /></div>
        )}
      </button>
    </div>
  );
}
