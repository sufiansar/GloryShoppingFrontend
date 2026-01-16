"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { signOut } from "next-auth/react";

import { toast } from "sonner";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
    toast.success("Successfully logged out!");
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
