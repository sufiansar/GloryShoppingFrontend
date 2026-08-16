// app/admin/dashboard/reviews/page.tsx
import { Suspense } from"react";
import { Metadata } from"next";

import { Card } from"@/components/ui/card";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";
import { Search, Filter, Download, Star } from"lucide-react";
import { ReviewsTableSkeleton } from"@/components/modules/Admin/Reviews/reviews-table-skeleton";
import { getAllReviews } from"@/action/review/review.action";
import { ReviewsTable } from"@/components/modules/Admin/Reviews/reviews-table";

export const metadata: Metadata = {
 title:"Review Management | Admin Dashboard",
 description:"Manage customer reviews and ratings",
};

interface ReviewsPageProps {
 searchParams: {
 page?: string;
 limit?: string;
 sortBy?: string;
 sortOrder?: string;
 search?: string;
 rating?: string;
 };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
 const queryString = new URLSearchParams({
 page: searchParams.page ||"1",
 limit: searchParams.limit ||"12",
 sortBy: searchParams.sortBy ||"createdAt",
 sortOrder: searchParams.sortOrder ||"desc",
 ...(searchParams.search && { search: searchParams.search }),
 ...(searchParams.rating && { rating: searchParams.rating }),
 }).toString();

 return (
 <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2">
 {/* Premium Header Card */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h1 className="text-2xl font-medium text-slate-900 dark:text-white">
 Reviews Management
 </h1>
 <p className="text-sm font-medium text-slate-400 mt-2">
 Manage and moderate customer reviews and ratings
 </p>
 </div>
 <div className="flex items-center gap-3">
 <Button variant="outline"className="rounded-2xl h-12 px-6 border-white/40 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all shadow-sm">
 <Download className="mr-2 h-4 w-4"/>
 Export
 </Button>
 </div>
 </div>

 {/* Filter & Command Center */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm">
 <form className="flex flex-col gap-6">
 <div className="flex flex-col md:flex-row gap-4">
 <div className="flex-1 relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
 <Input
 type="search"
 name="search"
 placeholder="Search by comment or product..."
 className="h-14 pl-11 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300 w-full"
 defaultValue={searchParams.search}
 />
 </div>
 
 <div className="flex flex-wrap items-center gap-3">
 <Select name="rating"defaultValue={searchParams.rating}>
 <SelectTrigger className="w-full sm:w-40 h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus:ring-primary-custom/30 font-bold transition-all duration-300 text-sm">
 <SelectValue placeholder="All Ratings"/>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
 <SelectItem value="all"className="rounded-xl font-bold text-sm">All Ratings</SelectItem>
 <SelectItem value="5"className="rounded-xl font-bold text-yellow-500">5 Stars</SelectItem>
 <SelectItem value="4"className="rounded-xl font-bold">4 Stars</SelectItem>
 <SelectItem value="3"className="rounded-xl font-bold">3 Stars</SelectItem>
 <SelectItem value="2"className="rounded-xl font-bold">2 Stars</SelectItem>
 <SelectItem value="1"className="rounded-xl font-bold">1 Star</SelectItem>
 </SelectContent>
 </Select>

 <Select name="sortBy"defaultValue={searchParams.sortBy ||"createdAt"}>
 <SelectTrigger className="w-full sm:w-36 h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus:ring-primary-custom/30 font-bold transition-all duration-300 text-sm">
 <SelectValue placeholder="Sort By"/>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
 <SelectItem value="createdAt"className="rounded-xl font-bold text-sm">Date</SelectItem>
 <SelectItem value="rating"className="rounded-xl font-bold text-sm">Rating</SelectItem>
 </SelectContent>
 </Select>

 <Select name="sortOrder"defaultValue={searchParams.sortOrder ||"desc"}>
 <SelectTrigger className="w-full sm:w-40 h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus:ring-primary-custom/30 font-bold transition-all duration-300 text-sm">
 <SelectValue placeholder="Sort Order"/>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
 <SelectItem value="desc"className="rounded-xl font-bold text-sm">Descending</SelectItem>
 <SelectItem value="asc"className="rounded-xl font-bold text-sm">Ascending</SelectItem>
 </SelectContent>
 </Select>

 <Button type="submit"className="h-14 px-8 rounded-2xl bg-primary-custom text-white font-medium text-sm shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none">
 <Filter className="mr-2 h-4 w-4"/>
 Apply Filters
 </Button>
 </div>
 </div>
 </form>
 </div>

 <Suspense fallback={<ReviewsTableSkeleton />}>
 <ReviewsTableContainer queryString={queryString} />
 </Suspense>
 </div>
 );
}

async function ReviewsTableContainer({ queryString }: { queryString: string }) {
 const result = await getAllReviews(queryString);

 return (
 <ReviewsTable
 initialData={result?.data || []}
 pagination={result?.pagination}
 />
 );
}
