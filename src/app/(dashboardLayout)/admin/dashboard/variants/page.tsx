import Link from"next/link";
import { Button } from"@/components/ui/button";
import { Plus, Search, Filter } from"lucide-react";
import { Input } from"@/components/ui/input";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";
import { getAllVariants } from"@/action/variants/variants.action";
import VariantsTable from"@/components/modules/Admin/ProductVariant/VariantsTable";

interface VariantsPageProps {
 searchParams: Promise<{
 page?: string;
 limit?: string;
 searchTerm?: string;
 productId?: string;
 sortBy?: string;
 sortOrder?: string;
 }>;
}

export default async function VariantsPage({
 searchParams,
}: VariantsPageProps) {
 const params = await searchParams;

 const page = parseInt(params.page ||"1");
 const limit = parseInt(params.limit ||"10");
 const searchTerm = params.searchTerm ||"";
 const sortBy = params.sortBy ||"createdAt";
 const sortOrder = params.sortOrder ||"desc";

 // Build query string
 const queryString = new URLSearchParams({
 page: page.toString(),
 limit: limit.toString(),
 sortBy,
 sortOrder,
 ...(searchTerm && { searchTerm }),
 ...(params.productId && { productId: params.productId }),
 }).toString();

 // Fetch variants
 const result = await getAllVariants(queryString);

 return (
 <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-2xl font-medium text-slate-900 dark:text-white">
 Product Variants
 </h1>
 <p className="text-sm font-medium text-slate-400 mt-1">
 Manage product variants ({result?.meta?.total || 0} total)
 </p>
 </div>
 <div className="flex items-center gap-3">
 <Button asChild className="rounded-2xl h-12 px-8 bg-primary-custom text-white font-medium text-sm shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none">
 <Link href="/admin/dashboard/variants/create">
 <Plus className="mr-2 h-4 w-4"/>
 Create Variant
 </Link>
 </Button>
 </div>
 </div>

 {/* Main Container */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col items-stretch p-0"> 
 
 {/* Filter Toolbar (Top Edge of Container) */}
 <div className="border-b border-white/40 dark:border-slate-800/50 p-6 flex items-center gap-4 bg-white/20 dark:bg-slate-800/20">
 <div className="relative flex-1 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
 <Input
 placeholder="Search variants by SKU, size..."
 defaultValue={searchTerm}
 className="h-14 pl-11 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
 readOnly
 />
 </div>
 <Select defaultValue={params.productId ||"all"}>
 <SelectTrigger className="w-56 h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus:ring-primary-custom/30 font-bold transition-all duration-300 text-sm">
 <SelectValue placeholder="Filter by product"/>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
 <SelectItem value="all"className="rounded-xl font-bold text-sm text-slate-500">All products</SelectItem>
 {/* You would populate this from your products API */}
 </SelectContent>
 </Select>
 <Button variant="outline"className="rounded-2xl h-14 px-6 border-white/40 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all shadow-sm">
 <Filter className="mr-2 h-4 w-4"/>
 Filters
 </Button>
 </div>

 {/* Variants Table Content */}
 <div className="p-6">
 <VariantsTable
 variants={result?.data || []}
 currentPage={page}
 totalPages={result?.meta?.totalPages || 1}
 totalItems={result?.meta?.total || 0}
 itemsPerPage={limit}
 searchTerm={searchTerm}
 productId={params.productId}
 sortBy={sortBy}
 sortOrder={sortOrder}
 />
 </div>
 </div>
 </div>
 );
}
