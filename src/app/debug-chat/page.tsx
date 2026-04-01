"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DebugChatPage() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${message}`,
    ]);
  };

  useEffect(() => {
    addLog("🔍 Debug page loaded");
    addLog(`Session Status: ${status}`);
    addLog(`User ID: ${session?.user?.id || "Not found"}`);
    addLog(`User Role: ${session?.user?.role || "Not found"}`);
    addLog(`Token: ${session?.accessToken ? "✅ Present" : "❌ Missing"}`);
    addLog(`Base API: ${process.env.NEXT_PUBLIC_BASE_API || "Not configured"}`);
  }, [session, status]);

  const testChatAPI = async () => {
    setLoading(true);
    addLog("🚀 Testing /chat/admin/all-chats endpoint...");

    try {
      if (!session?.accessToken) {
        addLog("❌ No access token available");
        setLoading(false);
        return;
      }

      const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
      const endpoint = `${BASE_API}/chat/admin/all-chats?page=1&limit=50`;

      addLog(`📡 Fetching from: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
      });

      addLog(`📊 Status: ${response.status} ${response.statusText}`);

      const data = await response.json();
      addLog(`📦 Response data: ${JSON.stringify(data, null, 2)}`);

      if (response.ok) {
        const chatsData = data.data || data;
        const chatArray = Array.isArray(chatsData)
          ? chatsData
          : chatsData?.data || [];
        addLog(`✅ Found ${chatArray.length} chats`);
        if (chatArray.length > 0) {
          addLog(`📋 First chat: ${JSON.stringify(chatArray[0], null, 2)}`);
        }
      } else {
        addLog(`❌ API Error: ${data.message || "Unknown error"}`);
      }
    } catch (error: any) {
      addLog(`❌ Fetch Error: ${error.message}`);
      addLog(`Details: ${JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testInternalAPI = async () => {
    setLoading(true);
    addLog("🔄 Testing internal /api/test-chat-api endpoint...");

    try {
      const response = await fetch("/api/test-chat-api", {
        method: "GET",
      });

      const data = await response.json();
      addLog(`📊 Internal API Status: ${response.status}`);
      addLog(`📦 Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      addLog(`❌ Internal API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">🐛 Chat API Debug</h1>

        <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-6 space-y-2">
          <div>
            <strong>Session Status:</strong>{" "}
            <span
              className={
                status === "authenticated" ? "text-green-600" : "text-red-600"
              }
            >
              {status}
            </span>
          </div>
          <div>
            <strong>User ID:</strong> {session?.user?.id || "N/A"}
          </div>
          <div>
            <strong>User Role:</strong> {session?.user?.role || "N/A"}
          </div>
          <div>
            <strong>Token:</strong>{" "}
            {session?.accessToken ? "✅ Present" : "❌ Missing"}
          </div>
          <div>
            <strong>Base API:</strong>{" "}
            {process.env.NEXT_PUBLIC_BASE_API || "Not configured"}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Button
            onClick={testChatAPI}
            disabled={loading || status !== "authenticated"}
          >
            {loading ? "Testing..." : "Test Chat API Directly"}
          </Button>
          <Button
            onClick={testInternalAPI}
            disabled={loading}
            variant="outline"
          >
            Test Internal API
          </Button>
        </div>

        <div className="bg-black dark:bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">
              No logs yet. Click a button to start testing.
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
