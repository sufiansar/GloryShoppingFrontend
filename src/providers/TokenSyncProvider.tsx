"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

export const TokenSyncProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const loginStatus = searchParams.get("login");

    const hasTokens = accessToken && refreshToken && loginStatus === "success";

    if (hasTokens) {
      if (status === "authenticated") {
        // If already authenticated, just clean the URL to prevent subsequent sync attempts
        const newUrl = window.location.pathname;
        router.replace(newUrl);
        return;
      }

      if (status === "unauthenticated" && !isSyncing) {
        // Double check status before syncing
        syncToken(accessToken, refreshToken);
      }
    }
  }, [searchParams, status, isSyncing, router]);

  const syncToken = async (accessToken: string, refreshToken: string) => {
    // Re-check authentication status one last time before calling signIn
    if (status === "authenticated") return;
    
    setIsSyncing(true);
    const toastId = toast.loading("Syncing your account...");

    try {
      const result = await signIn("credentials", {
        accessToken,
        refreshToken,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Failed to sync account. Please try logging in manually.", { id: toastId });
        console.error("Sync error:", result.error);
        router.replace(window.location.pathname);
      } else {
        toast.success("Welcome back! Login successful.", { id: toastId });
        
        // Force full page refresh to update server components (Navbar)
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("An unexpected error occurred during sync.", { id: toastId });
      console.error("Token sync exception:", error);
      router.replace(window.location.pathname);
    } finally {
      setIsSyncing(false);
    }
  };

  return <>{children}</>;
};
