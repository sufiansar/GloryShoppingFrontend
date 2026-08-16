"use client";

import { useState, useEffect } from"react";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from"@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from"@/components/ui/tabs";
import { Search, UserPlus, Download, Filter, User } from"lucide-react";

import { toast } from"sonner";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";
import { IUser } from"@/types/User.interface";
import UsersTable from"@/components/modules/Admin/User/UsersTable";
import UserCreateDialog from"@/components/modules/Admin/User/UserCreateDialog";
import { getAllUsers } from"@/action/user/user.action";
import Pagination from"@/components/Shared/Pagination";

export default function UsersManagementPage() {
 const [users, setUsers] = useState<IUser[]>([]);
 const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState("all");
 const [roleFilter, setRoleFilter] = useState("all");
 const [isLoading, setIsLoading] = useState(true);
 const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
 const [pagination, setPagination] = useState({
 page: 1,
 limit: 10,
 total: 0,
 totalPages: 1,
 });

 const fetchUsers = async (page: number = 1) => {
 setIsLoading(true);
 try {
 const result = await getAllUsers(
 `?page=${page}&limit=${pagination.limit}&searchTerm=${searchQuery}`,
 );
 console.log("userMManagement", result);

 if (result.success && result.data) {
 // The data is directly an array from your API response
 const usersData = result.data;

 setUsers(usersData);
 setFilteredUsers(usersData);

 // Update pagination based on response
 setPagination({
 page: result.page || page,
 limit: result.limit || pagination.limit,
 total: result.total || usersData.length,
 totalPages:
 result.totalPages ||
 Math.ceil(
 (result.total || usersData.length) /
 (result.limit || pagination.limit),
 ),
 });
 } else {
 toast.error("Failed to fetch users");
 }
 } catch (error) {
 console.error("Error fetching users:", error);
 toast.error("An error occurred while fetching users");
 } finally {
 setIsLoading(false);
 }
 };

 useEffect(() => {
 fetchUsers();
 }, []);

 useEffect(() => {
 let filtered = [...users];

 // Apply search filter
 if (searchQuery) {
 filtered = filtered.filter(
 (user) =>
 user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 user.phone?.toLowerCase().includes(searchQuery.toLowerCase()),
 );
 }

 // Apply status filter
 if (statusFilter !=="all") {
 if (statusFilter ==="active") {
 filtered = filtered.filter((user) => user.isActive);
 } else if (statusFilter ==="inactive") {
 filtered = filtered.filter((user) => !user.isActive);
 } else if (statusFilter ==="verified") {
 filtered = filtered.filter((user) => user.isVerified);
 }
 }

 // Apply role filter
 if (roleFilter !=="all") {
 filtered = filtered.filter((user) => user.role === roleFilter);
 }

 setFilteredUsers(filtered);
 }, [searchQuery, statusFilter, roleFilter, users]);

 // Calculate stats with safe checks
 const stats = {
 total: users?.length || 0,
 active: users?.filter((u) => u?.isActive).length || 0,
 admins: users?.filter((u) => u?.role ==="ADMIN").length || 0,
 pending: users?.filter((u) => !u?.isVerified).length || 0,
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2">
 {/* Premium Header Card */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h1 className="text-2xl font-medium text-slate-900 dark:text-white">User Management</h1>
 <p className="text-sm font-medium text-slate-400 mt-2">
 Manage all users, their roles, and account status
 </p>
 </div>
 <div className="flex items-center gap-3">
 <Button variant="outline"className="rounded-2xl h-12 px-6 border-white/40 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all shadow-sm">
 <Download className="mr-2 h-4 w-4"/>
 Export
 </Button>
 <Button onClick={() => setIsCreateDialogOpen(true)} className="rounded-2xl h-12 px-8 bg-primary-custom text-white font-medium text-sm shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none">
 <UserPlus className="mr-2 h-4 w-4"/>
 Add User
 </Button>
 </div>
 </div>

 {/* Stats Cards */}
 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
 {[
 { title:"Total Users", value: stats.total, desc: `${stats.active} active users`, icon: User, color:"text-blue-500", bg:"bg-blue-500/10"},
 { title:"Administrators", value: stats.admins, desc:"System administrators", icon: User, color:"text-purple-500", bg:"bg-purple-500/10"},
 { title:"Active Users", value: stats.active, desc: `${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% of total`, icon: User, color:"text-emerald-500", bg:"bg-emerald-500/10"},
 { title:"Pending Verification", value: stats.pending, desc:"Need email verification", icon: User, color:"text-amber-500", bg:"bg-amber-500/10"}
 ].map((stat, i) => (
 <div key={i} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/40 dark:border-slate-800/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
 <div className="flex justify-between items-start mb-4">
 <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
 <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${stat.bg}`}>
 <stat.icon className={`h-5 w-5 ${stat.color}`} />
 </div>
 </div>
 <div>
 <div className="text-3xl font-medium text-slate-900 dark:text-white group-hover:text-primary-custom transition-colors">{stat.value}</div>
 <p className="text-sm font-bold text-slate-400 mt-2">
 {stat.desc}
 </p>
 </div>
 </div>
 ))}
 </div>

 {/* Filters and Search Container */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col items-stretch p-0"> 
 
 {/* Filter Toolbar */}
 <div className="border-b border-white/40 dark:border-slate-800/50 p-6 flex flex-col xl:flex-row xl:items-center gap-4 bg-white/20 dark:bg-slate-800/20 w-full">
 <div className="relative flex-1 group min-w-0">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
 <Input
 placeholder="Search users by name, email, or phone..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e?.target?.value)}
 className="h-14 pl-11 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300 w-full"
 />
 </div>
 
 <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
 <Select value={statusFilter} onValueChange={setStatusFilter}>
 <SelectTrigger className="w-full sm:w-40 h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus:ring-primary-custom/30 font-bold transition-all duration-300 text-sm">
 <SelectValue placeholder="Status"/>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
 <SelectItem value="all"className="rounded-xl font-bold text-sm text-slate-500">All Status</SelectItem>
 <SelectItem value="active"className="rounded-xl font-bold text-sm">Active</SelectItem>
 <SelectItem value="inactive"className="rounded-xl font-bold text-sm">Inactive</SelectItem>
 <SelectItem value="verified"className="rounded-xl font-bold text-sm">Verified</SelectItem>
 </SelectContent>
 </Select>

 <Select value={roleFilter} onValueChange={setRoleFilter}>
 <SelectTrigger className="w-full sm:w-44 h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus:ring-primary-custom/30 font-bold transition-all duration-300 text-sm">
 <SelectValue placeholder="Role"/>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
 <SelectItem value="all"className="rounded-xl font-bold text-sm text-slate-500">All Roles</SelectItem>
 <SelectItem value="USER"className="rounded-xl font-bold text-sm">User</SelectItem>
 <SelectItem value="EDITOR"className="rounded-xl font-bold text-sm">Editor</SelectItem>
 <SelectItem value="MODERATOR"className="rounded-xl font-bold text-sm">Moderator</SelectItem>
 <SelectItem value="ADMIN"className="rounded-xl font-bold text-sm text-primary-custom">Admin</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>

 <div className="p-6">
 <Tabs defaultValue="all"className="w-full">
 <TabsList className="mb-6 h-14 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl w-full sm:w-auto inline-flex overflow-x-auto">
 <TabsTrigger value="all"className="rounded-xl h-11 px-6 font-medium text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-primary-custom transition-all shadow-sm">All Users</TabsTrigger>
 <TabsTrigger value="admins"className="rounded-xl h-11 px-6 font-medium text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-primary-custom transition-all shadow-sm">Admins</TabsTrigger>
 <TabsTrigger value="unverified"className="rounded-xl h-11 px-6 font-medium text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-primary-custom transition-all shadow-sm">Unverified</TabsTrigger>
 <TabsTrigger value="inactive"className="rounded-xl h-11 px-6 font-medium text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-primary-custom transition-all shadow-sm">Inactive</TabsTrigger>
 </TabsList>

 <TabsContent value="all"className="space-y-4 m-0">
 {isLoading ? (
 <div className="text-center py-20 flex flex-col items-center">
 <div className="animate-spin rounded-full h-14 w-14 border-[4px] border-primary-custom/20 border-t-primary-custom"></div>
 <p className="mt-6 text-sm font-medium text-slate-400">Loading users...</p>
 </div>
 ) : (
 <>
 {filteredUsers.length > 0 ? (
 <UsersTable
 users={filteredUsers}
 onUserUpdated={fetchUsers}
 />
 ) : (
 <div className="text-center py-20 bg-white/20 dark:bg-slate-800/20 rounded-[2rem] border border-white/40 shadow-inner">
 <p className="text-sm font-medium text-slate-400">No users found</p>
 </div>
 )}

 {/* Pagination Section */}
 {pagination.totalPages > 0 && (
 <Pagination
 currentPage={pagination.page}
 totalPages={pagination.totalPages}
 totalItems={pagination.total}
 itemsPerPage={pagination.limit}
 onPageChange={(page: number) => fetchUsers(page)}
 onItemsPerPageChange={(limit: number) => {
 setPagination(prev => ({ ...prev, limit, page: 1 }));
 // We push a re-fetch using the new limit and page 1
 setIsLoading(true);
 getAllUsers(`?page=1&limit=${limit}&searchTerm=${searchQuery}`).then(result => {
 if (result.success && result.data) {
 setUsers(result.data);
 setFilteredUsers(result.data);
 setPagination({
 page: result.page || 1,
 limit: result.limit || limit,
 total: result.total || result.data.length,
 totalPages: result.totalPages || Math.ceil((result.total || result.data.length) / (result.limit || limit)),
 });
 }
 setIsLoading(false);
 });
 }}
 className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50"
 />
 )}
 </>
 )}
 </TabsContent>
 </Tabs>
 </div>
 </div>

 <UserCreateDialog
 open={isCreateDialogOpen}
 onOpenChange={setIsCreateDialogOpen}
 onSuccess={fetchUsers}
 />
 </div>
 );
}
