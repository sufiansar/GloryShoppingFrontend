"use client";

import { useState, useEffect } from"react";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Switch } from"@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from"@/components/ui/avatar";
import { Textarea } from"@/components/ui/textarea";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";

import { toast } from"sonner";
import { Loader2 } from"lucide-react";
import { IUser, IUserUpdate } from"@/types/User.interface";
import { updateUserProfile } from"@/action/user/user.action";
import { UserRole } from"@/lib/navItems.confiq";

interface UserEditDialogProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
 user: IUser | null;
 onSuccess: () => void;
}

export default function UserEditDialog({
 open,
 onOpenChange,
 user,
 onSuccess,
}: UserEditDialogProps) {
 const [formData, setFormData] = useState<IUserUpdate>({
 name:"",
 email:"",
 phone:"",
 role:"USER",
 profileImage:"",
 isVerified: false,
 isActive: true,
 });
 const [loading, setLoading] = useState(false);
 const [isDirty, setIsDirty] = useState(false);

 // Initialize form data when user changes
 useEffect(() => {
 if (user) {
 setFormData({
 name: user.name ||"",
 email: user.email ||"",
 phone: user.phone ||"",
 role: user.role ||"USER",
 profileImage: user.profileImage ||"",
 isVerified: user.isVerified || false,
 isActive: user.isActive || true,
 });
 setIsDirty(false);
 }
 }, [user]);

 const handleInputChange = (
 e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
 ) => {
 const { name, value } = e.target;
 setFormData((prev) => ({ ...prev, [name]: value }));
 setIsDirty(true);
 };

 const handleSwitchChange = (name: keyof IUserUpdate, checked: boolean) => {
 setFormData((prev) => ({ ...prev, [name]: checked }));
 setIsDirty(true);
 };

 const handleSelectChange = (name: keyof IUserUpdate, value: string) => {
 setFormData((prev) => ({ ...prev, [name]: value }));
 setIsDirty(true);
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!user || !isDirty) {
 onOpenChange(false);
 return;
 }

 setLoading(true);
 try {
 // Prepare the update data
 const updateData: IUserUpdate = {};

 // Only include fields that have changed
 if (formData.name !== user.name) updateData.name = formData.name;
 if (formData.email !== user.email) updateData.email = formData.email;
 if (formData.phone !== user.phone) updateData.phone = formData.phone;
 if (formData.role !== user.role) updateData.role = formData.role;
 if (formData.profileImage !== user.profileImage)
 updateData.profileImage = formData.profileImage;
 if (formData.isVerified !== user.isVerified)
 updateData.isVerified = formData.isVerified;
 if (formData.isActive !== user.isActive)
 updateData.isActive = formData.isActive;

 if (Object.keys(updateData).length === 0) {
 onOpenChange(false);
 return;
 }

 const result = (await updateUserProfile(updateData)) as {
 success: boolean;
 message?: string;
 };

 if (result.success) {
 toast.success("User profile updated successfully");
 onSuccess();
 onOpenChange(false);
 } else {
 toast.error(result.message ||"Failed to update user profile");
 }
 } catch (error) {
 console.error("Error updating user:", error);
 toast.error("An error occurred while updating the user");
 } finally {
 setLoading(false);
 }
 };

 const getInitials = (name: string) => {
 if (!name) return"??";
 return name
 .split("")
 .map((part) => part[0])
 .join("")
 .toUpperCase()
 .slice(0, 2);
 };

 if (!user) return null;

 const roles: { value: UserRole; label: string }[] = [
 { value:"USER", label:"User"},
 { value:"ADMIN", label:"ADMIN"},
 { value:"SUPER_ADMIN", label:"SUPER_ADMIN"},
 ];

 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
 <form onSubmit={handleSubmit}>
 <DialogHeader>
 <DialogTitle>Edit User Profile</DialogTitle>
 <DialogDescription>
 Update profile information for {user.name}
 </DialogDescription>
 </DialogHeader>

 <div className="space-y-6 py-4">
 {/* Profile Image Section */}
 <div className="flex items-center gap-4">
 <Avatar className="h-20 w-20 border">
 <AvatarImage src={formData.profileImage || undefined} />
 <AvatarFallback className="bg-primary/10 text-lg">
 {getInitials(formData.name ||"")}
 </AvatarFallback>
 </Avatar>
 <div className="flex-1 space-y-2">
 <Label htmlFor="profileImage">Profile Image URL</Label>
 <Input
 id="profileImage"
 name="profileImage"
 value={formData.profileImage ||""}
 onChange={handleInputChange}
 placeholder="https://example.com/avatar.jpg"
 />
 <p className="text-xs text-muted-foreground">
 Enter a valid URL for the profile image
 </p>
 </div>
 </div>

 {/* Personal Information */}
 <div className="space-y-4">
 <h3 className="text-sm font-medium">Personal Information</h3>
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label htmlFor="name">Full Name *</Label>
 <Input
 id="name"
 name="name"
 value={formData.name}
 onChange={handleInputChange}
 required
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="email">Email *</Label>
 <Input
 id="email"
 name="email"
 type="email"
 value={formData.email}
 onChange={handleInputChange}
 required
 />
 </div>
 </div>

 <div className="space-y-2">
 <Label htmlFor="phone">Phone Number</Label>
 <Input
 id="phone"
 name="phone"
 value={formData.phone ||""}
 onChange={handleInputChange}
 placeholder="+1 (555) 123-4567"
 />
 </div>

 <div className="space-y-2">
 <Label htmlFor="role">User Role</Label>
 <Select
 value={formData.role}
 onValueChange={(value) => handleSelectChange("role", value)}
 >
 <SelectTrigger>
 <SelectValue placeholder="Select role"/>
 </SelectTrigger>
 <SelectContent>
 {roles.map((role) => (
 <SelectItem key={role.value} value={role.value}>
 {role.label}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 </div>

 {/* Account Status */}
 <div className="space-y-4">
 <h3 className="text-sm font-medium">Account Status</h3>

 <div className="flex items-center justify-between rounded-lg border p-4">
 <div className="space-y-0.5">
 <Label htmlFor="isActive">Account Active</Label>
 <p className="text-sm text-muted-foreground">
 {formData.isActive
 ?"User can log in and use the system"
 :"User account is suspended"}
 </p>
 </div>
 <Switch
 id="isActive"
 checked={formData.isActive}
 onCheckedChange={(checked) =>
 handleSwitchChange("isActive", checked)
 }
 />
 </div>

 <div className="flex items-center justify-between rounded-lg border p-4">
 <div className="space-y-0.5">
 <Label htmlFor="isVerified">Email Verified</Label>
 <p className="text-sm text-muted-foreground">
 {formData.isVerified
 ?"User has verified their email address"
 :"User needs to verify their email"}
 </p>
 </div>
 <Switch
 id="isVerified"
 checked={formData.isVerified}
 onCheckedChange={(checked) =>
 handleSwitchChange("isVerified", checked)
 }
 />
 </div>
 </div>

 {/* User Notes (Optional) */}
 <div className="space-y-2">
 <Label htmlFor="notes">Admin Notes (Optional)</Label>
 <Textarea
 id="notes"
 name="notes"
 placeholder="Add any notes about this user..."
 rows={3}
 onChange={handleInputChange}
 />
 </div>

 {/* User Stats */}
 <div className="rounded-lg border p-4 space-y-2">
 <h3 className="text-sm font-medium">User Statistics</h3>
 <div className="grid grid-cols-2 gap-2 text-sm">
 <div>
 <span className="text-muted-foreground">Addresses: </span>
 <span className="font-medium">
 {user.addresses?.length || 0}
 </span>
 </div>
 <div>
 <span className="text-muted-foreground">Reviews: </span>
 <span className="font-medium">
 {user.reviews?.length || 0}
 </span>
 </div>
 <div>
 <span className="text-muted-foreground">Member Since: </span>
 <span className="font-medium">
 {new Date(user.createdAt).toLocaleDateString()}
 </span>
 </div>
 <div>
 <span className="text-muted-foreground">Last Updated: </span>
 <span className="font-medium">
 {new Date(user.updatedAt).toLocaleDateString()}
 </span>
 </div>
 </div>
 </div>
 </div>

 <DialogFooter>
 <Button
 type="button"
 variant="outline"
 onClick={() => onOpenChange(false)}
 disabled={loading}
 >
 Cancel
 </Button>
 <Button type="submit"disabled={loading || !isDirty}>
 {loading ? (
 <>
 <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
 Saving...
 </>
 ) : (
"Save Changes"
 )}
 </Button>
 </DialogFooter>
 </form>
 </DialogContent>
 </Dialog>
 );
}
