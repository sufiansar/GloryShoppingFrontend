"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/types/User.interface";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User as UserIcon,
} from "lucide-react";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
}

export default function UserDetailsDialog({
  open,
  onOpenChange,
  user,
}: UserDetailsDialogProps) {
  if (!user) return null;

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-100 text-red-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-800";
      case "USER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return <XCircle className="h-4 w-4 text-red-500" />;
    if (!isVerified) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return "Inactive";
    if (!isVerified) return "Pending Verification";
    return "Active";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Complete information for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2">
              <AvatarImage src={user.profileImage || undefined} />
              <AvatarFallback className="bg-primary/10 text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <Badge className={getRoleColor(user.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {getStatusIcon(user.isActive, user.isVerified)}
                <span>{getStatusText(user.isActive, user.isVerified)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                User ID: {user.id.substring(0, 8)}...
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm">
                    {new Date(
                      user.updatedAt || user.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Statistics */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">User Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Addresses</p>
                </div>
                <p className="text-2xl font-bold">
                  {user.addresses?.length || 0}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Reviews</p>
                </div>
                <p className="text-2xl font-bold">
                  {user.reviews?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Addresses List */}
          {user.addresses && user.addresses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Saved Addresses</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {user.addresses.map((address, index) => (
                  <div key={index} className="rounded-lg border p-3 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {address.label || `Address ${index + 1}`}
                      </span>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {address.street}, {address.city}, {address.district},{" "}
                      {address.country}
                      {address.postalCode && `, ${address.postalCode}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {user.passwordHash && (
            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="text-sm font-medium">Security Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Password: </span>
                  <span className="font-medium text-green-600">••••••••</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Hash Type: </span>
                  <span className="font-medium">bcrypt</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
