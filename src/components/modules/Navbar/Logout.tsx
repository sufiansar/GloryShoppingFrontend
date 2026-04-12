"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { signOut } from "next-auth/react";

import { toast } from "sonner";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      // 1. Call backend logout to clear HTTP-only cookies
      const { logout } = await import("@/action/auth/login.action");
      await logout().catch((err) => console.error("Backend logout error:", err));

      // 2. Clear client-side cookies if not HTTP-only (fallback)
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // 3. NextAuth logout
      await signOut({ redirect: true, callbackUrl: "/login" });
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Logout process error:", error);
      // Fallback: at least try to sign out from NextAuth
      await signOut({ redirect: true, callbackUrl: "/login" });
    }
  };
  return (
    <Button
      variant={"destructive"}
      className=" inline-flex"
      onClick={handleLogout}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
