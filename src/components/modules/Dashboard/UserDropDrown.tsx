"use client";

import { useState } from "react";
import Link from "next/link";
import { User, KeyRound, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IUserCreate } from "@/types/User.interface";

interface UserDropdownProps {
  userInfo: IUserCreate | null;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {userInfo ? (
            <div className="space-y-1">
              <p className="font-medium text-sm">{userInfo.name}</p>
              <p className="text-xs text-muted-foreground">{userInfo.email}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not logged in</p>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {userInfo && (
          <>
            <DropdownMenuItem>
              <span className="text-xs text-muted-foreground">
                Role: {userInfo.role}
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/my-profile" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                My Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/change-password" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Change Password
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <div className="flex items-center gap-2 text-red-600 cursor-pointer">
                <Link href={"/logout"}>Logout </Link>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
