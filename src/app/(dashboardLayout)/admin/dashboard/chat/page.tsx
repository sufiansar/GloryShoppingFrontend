"use client";

import { AdminChatList } from "@/components/modules/Chat/AdminChatList";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function AdminChatPage() {
  const { data: session, status } = useSession();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only render chat list when session is fully loaded and token is available
    if (status === "authenticated" && session?.accessToken) {
      setIsReady(true);
    } else if (status === "unauthenticated") {
      setIsReady(false);
    }
  }, [status, session?.accessToken]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8">
          <p className="text-gray-600">Loading chat...</p>
        </Card>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 text-center">
          <p className="text-red-500 font-semibold">Session Error</p>
          <p className="text-gray-600 text-sm mt-2">
            Please refresh the page or login again
          </p>
        </Card>
      </div>
    );
  }

  return <AdminChatList />;
}
