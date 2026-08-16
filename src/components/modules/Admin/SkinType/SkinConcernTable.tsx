// components/skin-management/SkinConcernTable.tsx
"use client";

import { useState, useEffect } from"react";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from"@/components/ui/table";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
 DropdownMenuLabel,
 DropdownMenuSeparator
} from"@/components/ui/dropdown-menu";
import { MoreVertical, Search, Trash2, Edit3, Calendar, FileText, Zap, ShieldCheck, RefreshCw } from"lucide-react";
import { SkinConcernForm } from"./SkinConcernForm";

import { Badge } from"@/components/ui/badge";
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
 deleteSkinConcern,
 getAllSkinConcerns,
} from"@/action/skinConcerns/skinConcern.action";
import Pagination from"@/components/Shared/Pagination";

export default function SkinConcernTable() {
 const [skinConcerns, setSkinConcerns] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState("");
 const [deleteId, setDeleteId] = useState<string | null>(null);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 const fetchSkinConcerns = async (page = 1) => {
 setLoading(true);
 try {
 const queryString = `?page=${page}&limit=10&searchTerm=${searchTerm}`;
 const result = (await getAllSkinConcerns(queryString)) as any;
 setSkinConcerns(result.data || []);
 setTotalPages(result.pagination?.totalPages || 1);
 setCurrentPage(page);
 } catch (error) {
 console.error("Failed to fetch skin concerns:", error);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchSkinConcerns();
 }, [searchTerm]);

 const handleDelete = async (id: string) => {
 try {
 await deleteSkinConcern(id);
 fetchSkinConcerns(currentPage);
 setDeleteId(null);
 } catch (error) {
 console.error("Failed to delete skin concern:", error);
 }
 };

 return (
 <div className="space-y-6">
 {/* Search and Action Bar */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/40 dark:border-slate-800/50 shadow-sm">
 <div className="relative w-full md:w-96 group">
 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
 <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-custom transition-colors"/>
 </div>
 <Input
 placeholder="Search skin concerns..."
 className="pl-11 h-12 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-xl shadow-inner focus-visible:ring-primary-custom/30 font-medium text-slate-700 dark:text-slate-300 transition-all duration-300"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 <SkinConcernForm mode="create"onSuccess={() => fetchSkinConcerns()} />
 </div>

 {/* Table Container - Hybrid List UI */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-slate-800/50 shadow-sm overflow-hidden">
 <div className="overflow-x-auto scrollbar-premium">
 <Table>
 <TableHeader>
 <TableRow className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-transparent">
 <TableHead className="py-4 pl-8 text-xs font-semibold text-slate-500 tracking-wider">Target Concern</TableHead>
 <TableHead className="py-4 text-xs font-semibold text-slate-500 tracking-wider">Clinical Description</TableHead>
 <TableHead className="py-4 text-xs font-semibold text-slate-500 tracking-wider">Created</TableHead>
 <TableHead className="text-right py-4 pr-8 text-xs font-semibold text-slate-500 tracking-wider">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {loading ? (
 <TableRow>
 <TableCell colSpan={4} className="text-center py-24">
 <div className="flex flex-col items-center gap-4">
 <RefreshCw className="h-8 w-8 animate-spin text-primary-custom/40"/>
 <span className="text-sm font-medium text-slate-400">Loading concerns...</span>
 </div>
 </TableCell>
 </TableRow>
 ) : skinConcerns.length === 0 ? (
 <TableRow>
 <TableCell colSpan={4} className="text-center py-24">
 <div className="flex flex-col items-center gap-2">
 <Zap className="h-10 w-10 text-slate-200"/>
 <span className="text-sm font-semibold text-slate-600">No Concerns Found</span>
 <p className="text-sm text-slate-400">No data matches your query.</p>
 </div>
 </TableCell>
 </TableRow>
 ) : (
 skinConcerns.map((concern) => (
 <TableRow key={concern.id} className="premium-table-row border-b border-slate-100/30 dark:border-slate-800/20 group/row">
 <TableCell className="py-4 pl-8">
 <div className="flex items-center gap-4">
 <div className="h-10 w-10 rounded-xl bg-primary-custom/10 flex items-center justify-center border border-primary-custom/20 group-hover/row:scale-105 transition-all duration-300">
 <Zap className="h-5 w-5 text-primary-custom"/>
 </div>
 <div className="flex flex-col">
 <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{concern.name}</span>
 <span className="text-xs text-slate-400">ID: {concern.id.slice(0, 8)}</span>
 </div>
 </div>
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-3 max-w-[400px]">
 <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 transition-colors">
 <FileText className="h-4 w-4 text-slate-400"/>
 </div>
 <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
 {concern.description ||"No description provided."}
 </p>
 </div>
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-2 text-slate-500">
 <Calendar className="h-4 w-4 opacity-70"/>
 <span className="text-sm font-medium">
 {new Date(concern.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
 </span>
 </div>
 </TableCell>
 <TableCell className="text-right pr-10">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost"className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all active:scale-90 p-0">
 <MoreVertical className="h-5 w-5 text-slate-400"/>
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end"className="w-56 p-2 rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-3xl glass-card">
 <DropdownMenuLabel className="text-sm font-medium text-slate-400 px-3 py-2">Matrix Context</DropdownMenuLabel>
 <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
 <SkinConcernForm
 mode="edit"
 initialData={concern}
 onSuccess={() => fetchSkinConcerns(currentPage)}
 />
 </DropdownMenuItem>
 <DropdownMenuSeparator className="mx-2 bg-slate-100 dark:bg-slate-800/50"/>
 <DropdownMenuItem
 onClick={() => setDeleteId(concern.id)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 transition-all cursor-pointer font-bold text-rose-500"
 >
 <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
 <Trash2 className="h-4 w-4"/>
 </div>
 Purge Concern
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </TableCell>
 </TableRow>
 ))
 )}
 </TableBody>
 </Table>
 </div>

 {/* Pagination Console */}
 <Pagination
 currentPage={currentPage}
 totalPages={totalPages}
 totalItems={skinConcerns.length > 0 ? (totalPages > 1 ? totalPages * 10 : skinConcerns.length) : 0} // Approximating totalItems if not specifically returned
 itemsPerPage={10}
 onPageChange={fetchSkinConcerns}
 className="p-8 bg-slate-50/30 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-800/30"
 />
 </div>

 {/* Delete Confirmation Dialog */}
 <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
 <AlertDialogContent className="max-w-md p-0 overflow-hidden premium-glass-dialog border-none rounded-[3rem]">
 <div className="p-10 flex flex-col items-center text-center gap-8">
 <div className="relative">
 <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full scale-110"/>
 <div className="relative h-20 w-20 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
 <Trash2 className="h-10 w-10 text-rose-500"/>
 </div>
 </div>

 <div className="space-y-2">
 <span className="text-sm font-medium tracking-[0.3em] text-rose-500">Clinical Alert: Purge Sequence</span>
 <AlertDialogTitle className="text-3xl font-medium text-slate-900 dark:text-white leading-tight">Confirm Purge</AlertDialogTitle>
 <AlertDialogDescription className="font-medium text-slate-500 text-sm max-w-[300px] mx-auto leading-relaxed">
 Are you absolutely sure you want to purge this symptomatic concern? This action is non-reversible and will permanently erase the record.
 </AlertDialogDescription>
 </div>

 <div className="flex flex-col w-full gap-3">
 <Button 
 variant="destructive"
 onClick={() => deleteId && handleDelete(deleteId)}
 className="h-16 rounded-2xl bg-rose-500 text-white font-medium text-sm hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 active:scale-[0.98]"
 >
 Execute Purge
 </Button>
 <AlertDialogCancel className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98] bg-transparent">
 Abort Command
 </AlertDialogCancel>
 </div>
 </div>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}
