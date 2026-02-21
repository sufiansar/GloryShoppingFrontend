"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { IUser, RoleChangeRequest } from "@/types/User.interface";
import { UserRole } from "@/lib/navItems.confiq";
import { userRoleChangeRequest } from "@/action/user/user.action";

interface RoleChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
  onSuccess: () => void;
}

export default function RoleChangeDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: RoleChangeDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user?.role || "USER",
  );
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = (await userRoleChangeRequest(
        user.id,
        selectedRole,
        reason.trim() || undefined,
      )) as { success: boolean; message?: string };

      if (result?.success) {
        toast.success("User role updated successfully");
        onSuccess();
        onOpenChange(false);
        setReason("");
      } else {
        toast.error(result?.message || "Failed to update role");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: "USER",
      label: "User",
      description: "Regular user with basic permissions",
    },
    { value: "ADMIN", label: "Admin", description: "Full system access" },
    {
      value: "SUPER_ADMIN",
      label: "Super Admin",
      description: "Full system access",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update role for {user?.name} ({user?.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Select New Role</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              className="grid grid-cols-2 gap-3"
            >
              {roles?.map((role: any) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={role.value}
                    id={`role-${role.value}`}
                  />
                  <Label
                    htmlFor={`role-${role.value}`}
                    className="cursor-pointer"
                  >
                    <div className="font-medium">{role.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {role.description}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Change (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Provide a reason for the role change..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedRole === user?.role}
          >
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
