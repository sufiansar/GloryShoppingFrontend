"use client";

import { Search, Filter, X } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { useRouter } from"next/navigation";
import { useDebouncedCallback } from"use-debounce";
import { useState } from"react";

interface SearchFormProps {
 initialSearchTerm: string;
 initialPage: string;
 initialLimit: string;
}

export default function SearchForm({
 initialSearchTerm,
 initialPage,
 initialLimit,
}: SearchFormProps) {
 const router = useRouter();
 const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

 const handleSearch = useDebouncedCallback((term: string) => {
 const params = new URLSearchParams({
 page:"1",
 limit: initialLimit,
 });

 if (term) {
 params.set("searchTerm", term);
 }

 router.push(`/admin/dashboard/categories-management?${params.toString()}`);
 }, 500);

 const handleClear = () => {
 setSearchTerm("");
 const params = new URLSearchParams({
 page:"1",
 limit: initialLimit,
 });
 router.push(`/admin/dashboard/categories-management?${params.toString()}`);
 };

 return (
 <div className="flex items-center gap-4">
 <div className="relative flex-1 group">
 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4"/>
 <Input
 placeholder="Search categories by name..."
 value={searchTerm}
 onChange={(e) => {
 setSearchTerm(e.target.value);
 handleSearch(e.target.value);
 }}
 className="h-14 pl-11 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
 />
 {searchTerm && (
 <Button
 type="button"
 variant="ghost"
 size="icon"
 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl"
 onClick={handleClear}
 >
 <X className="h-4 w-4 text-slate-500"/>
 </Button>
 )}
 </div>
 <Button variant="outline"className="rounded-2xl h-14 px-6 border-white/40 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all shadow-sm">
 <Filter className="mr-2 h-4 w-4"/>
 Filters
 </Button>
 </div>
 );
}
