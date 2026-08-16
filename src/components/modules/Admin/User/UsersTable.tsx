"use client";

import { useState } from"react";
import { format } from"date-fns";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from"@/components/ui/table";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from"@/components/ui/avatar";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from"@/components/ui/dropdown-menu";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from"@/components/ui/alert-dialog";
import {
 MoreHorizontal,
 User,
 Mail,
 Phone,
 Edit,
 Trash2,
 Shield,
 Eye, // Add Eye icon import
} from"lucide-react";
import { IUser } from"@/types/User.interface";
import { UserRole } from"@/lib/navItems.confiq";
import RoleChangeDialog from"./RoleChangeDialog";
import UserEditDialog from"./UserEditDialog";
import UserDetailsDialog from"./UserDetailsDialog";
import { deleteUserAccount } from"@/action/user/user.action";

interface UsersTableProps {
 users: IUser[];
 onUserUpdated: () => void;
}

export default function UsersTable({ users, onUserUpdated }: UsersTableProps) {
 const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
 const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
 const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
 const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false); // Add this state
 const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

 const getRoleColor = (role: UserRole) => {
 switch (role) {
 case"SUPER_ADMIN":
 return"bg-red-100 text-red-800 hover:bg-red-100";
 case"ADMIN":
 return"bg-blue-100 text-blue-800 hover:bg-blue-100";
 case"USER":
 return"bg-green-100 text-green-800 hover:bg-green-100";
 default:
 return"bg-gray-100 text-gray-800 hover:bg-gray-100";
 }
 };

 const getStatusColor = (isActive: boolean, isVerified: boolean) => {
 if (!isActive) return"bg-gray-100 text-gray-800";
 if (!isVerified) return"bg-yellow-100 text-yellow-800";
 return"bg-green-100 text-green-800";
 };

 const handleViewDetails = (user: IUser) => {
 setSelectedUser(user);
 setIsDetailsDialogOpen(true);
 };

 const handleRoleChange = (user: IUser) => {
 setSelectedUser(user);
 setIsRoleDialogOpen(true);
 };

 const handleEditUser = (user: IUser) => {
 setSelectedUser(user);
 setIsEditDialogOpen(true);
 };

 const handleDeleteUser = (user: IUser) => {
 setSelectedUser(user);
 setIsDeleteDialogOpen(true);
 };

 const confirmDelete = async () => {
 if (!selectedUser) return;

 setIsLoading(true);
 try {
 await deleteUserAccount(selectedUser.id);

 onUserUpdated();
 setIsDeleteDialogOpen(false);
 } catch (error) {
 console.error("Error deleting user:", error);
 } finally {
 setIsLoading(false);
 }
 };

 const getInitials = (name: string) => {
 return name
 .split("")
 .map((part) => part[0])
 .join("")
 .toUpperCase()
 .slice(0, 2);
 };

 return (
 <>
 {/* Users Intelligent List - Premium Card Experience */}
 <div className="rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
 <div className="overflow-x-auto scrollbar-premium">
 <Table>
 <TableHeader>
 <TableRow className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-transparent px-6 text-left">
 <TableHead className="py-6 pl-8 text-sm font-medium text-slate-400">User</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Contact</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Role</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Status</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Joined</TableHead>
 <TableHead className="text-right py-6 pr-8 text-sm font-medium text-slate-400">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {users?.map((user) => (
 <TableRow key={user.id} className="premium-table-row border-b border-slate-100/30 dark:border-slate-800/20 group/row">
 <TableCell className="py-5 pl-8">
 <div className="flex items-center gap-4">
 <div className="relative group/avatar">
 <div className="absolute -inset-1.5 bg-linear-to-tr from-primary-custom/40 to-indigo-500/40 rounded-2xl blur-md opacity-0 group-hover/avatar:opacity-100 transition duration-500"/>
 <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-white dark:ring-slate-800 shadow-sm relative z-10">
 <AvatarImage src={user.profileImage ||""} className="object-cover"/>
 <AvatarFallback className="bg-primary-custom/10 text-primary-custom font-medium">
 {getInitials(user.name)}
 </AvatarFallback>
 </Avatar>
 </div>
 <div className="flex flex-col gap-0.5">
 <span className="text-sm font-medium text-slate-900 dark:text-white group-hover/row:text-primary-custom transition-colors">
 {user.name}
 </span>
 <div className="flex items-center gap-1.5">
 <code className="text-[9px] font-bold text-slate-400 er">
 ID: {user.id.substring(0, 8)}...
 </code>
 </div>
 </div>
 </div>
 </TableCell>
 <TableCell>
 <div className="flex flex-col gap-1.5">
 <div className="flex items-center gap-2 px-2 py-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/30 w-fit">
 <Mail className="h-3 w-3 text-slate-400"/>
 <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{user.email}</span>
 </div>
 {user.phone && (
 <div className="flex items-center gap-2 px-2 py-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/30 w-fit">
 <Phone className="h-3 w-3 text-slate-400"/>
 <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{user.phone}</span>
 </div>
 )}
 </div>
 </TableCell>
 <TableCell>
 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border font-medium text-[9px] ${
 user.role === 'SUPER_ADMIN' ? 'bg-rose-500/5 border-rose-500/20 text-rose-600' :
 user.role === 'ADMIN' ? 'bg-blue-500/5 border-blue-500/20 text-blue-600' :
 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600'
 }`}>
 <div className={`w-1.5 h-1.5 rounded-full ${
 user.role === 'SUPER_ADMIN' ? 'bg-rose-500' :
 user.role === 'ADMIN' ? 'bg-blue-500' :
 'bg-emerald-500'
 }`} />
 {user.role}
 </div>
 </TableCell>
 <TableCell>
 <div className="flex flex-col gap-2">
 <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[9px] font-medium er ${
 user.isActive && user.isVerified ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 
 !user.isActive ? 'bg-slate-500/10 text-slate-600 border border-slate-500/20' :
 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
 }`}>
 {user.isActive ? (user.isVerified ?"Active":"Pending") :"Inactive"}
 </div>
 <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
 <div className="w-1 h-1 rounded-full bg-slate-300"/>
 {user.addresses.length} address{user.addresses.length !== 1 ?"es":""}
 </div>
 </div>
 </TableCell>
 <TableCell>
 <div className="flex flex-col">
 <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
 {format(new Date(user.createdAt),"MMM dd, yyyy")}
 </span>
 </div>
 </TableCell>
 <TableCell className="text-right pr-8">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost"size="icon"className="h-10 w-10 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all active:scale-90">
 <MoreHorizontal className="h-5 w-5 text-slate-400"/>
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end"className="w-60 p-2 rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-3xl glass-card animate-in zoom-in-95 duration-200">
 <DropdownMenuLabel className="text-sm font-medium text-slate-400 px-3 py-2">Actions</DropdownMenuLabel>
 <DropdownMenuItem 
 onClick={() => handleViewDetails(user)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
 >
 <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
 <Eye className="h-4 w-4 text-blue-500"/>
 </div>
 View Details
 </DropdownMenuItem>
 <DropdownMenuItem 
 onClick={() => handleEditUser(user)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
 >
 <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
 <Edit className="h-4 w-4 text-amber-500"/>
 </div>
 Edit Profile
 </DropdownMenuItem>
 <DropdownMenuItem 
 onClick={() => handleRoleChange(user)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
 >
 <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
 <Shield className="h-4 w-4 text-purple-500"/>
 </div>
 Change Role
 </DropdownMenuItem>
 <DropdownMenuSeparator className="mx-2 bg-slate-100 dark:bg-slate-800/50"/>
 <DropdownMenuItem
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 transition-all cursor-pointer font-bold text-rose-500"
 onClick={() => handleDeleteUser(user)}
 >
 <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
 <Trash2 className="h-4 w-4"/>
 </div>
 Delete User
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>
 </div>

 <RoleChangeDialog
 open={isRoleDialogOpen}
 onOpenChange={setIsRoleDialogOpen}
 user={selectedUser}
 onSuccess={onUserUpdated}
 />

 <UserEditDialog
 open={isEditDialogOpen}
 onOpenChange={setIsEditDialogOpen}
 user={selectedUser}
 onSuccess={onUserUpdated}
 />

 <UserDetailsDialog
 open={isDetailsDialogOpen}
 onOpenChange={setIsDetailsDialogOpen}
 user={selectedUser}
 />

 <AlertDialog
 open={isDeleteDialogOpen}
 onOpenChange={setIsDeleteDialogOpen}
 >
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription>
 This action cannot be undone. This will permanently delete the
 user account and remove all associated data including addresses
 and reviews.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={confirmDelete}
 disabled={isLoading}
 className="bg-red-600 hover:bg-red-700"
 >
 {isLoading ?"Deleting...":"Delete User"}
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </>
 );
}
