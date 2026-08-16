import { fetchAllCategories } from"@/action/categories/categories.action";
import CategoryTable from"@/components/modules/Admin/Categories/CategoryTable";
import SearchForm from"@/components/modules/Admin/Categories/SearchForm";
import { Button } from"@/components/ui/button";
import { Plus } from"lucide-react";

interface CategoriesPageProps {
 searchParams: Promise<{
 page?: string;
 limit?: string;
 searchTerm?: string;
 }>;
}

export default async function CategoriesPage({
 searchParams,
}: CategoriesPageProps) {
 const params = await searchParams;

 const page = parseInt(params.page ||"1");
 const limit = parseInt(params.limit ||"10");
 const searchTerm = params.searchTerm ||"";

 const queryString = new URLSearchParams({
 page: page.toString(),
 limit: limit.toString(),
 ...(searchTerm && { searchTerm }),
 }).toString();

 const result = await fetchAllCategories(queryString);

 return (
 <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2">
 {/* Premium Header Card */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h1 className="text-2xl font-medium text-slate-900 dark:text-white">
 Categories
 </h1>
 <p className="text-sm font-medium text-slate-400 mt-2">
 Manage your product categories ({result?.meta?.total || 0} total)
 </p>
 </div>
 <div className="flex items-center gap-3">
 <Button asChild className="rounded-2xl h-12 px-8 bg-primary-custom text-white font-medium text-sm shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none">
 <a href="/admin/dashboard/categories">
 <Plus className="mr-2 h-4 w-4"/>
 Add Category
 </a>
 </Button>
 </div>
 </div>

 {/* Main Container */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col items-stretch p-0"> 
 {/* Filter Toolbar */}
 <div className="border-b border-white/40 dark:border-slate-800/50 p-6 bg-white/20 dark:bg-slate-800/20">
 <SearchForm
 initialSearchTerm={searchTerm}
 initialPage={page.toString()}
 initialLimit={limit.toString()}
 />
 </div>
 
 <div className="p-6">
 <CategoryTable
 categories={result?.data || []}
 currentPage={page}
 totalPages={result?.meta?.totalPages && result.meta.totalPages > 1 ? result.meta.totalPages : Math.ceil((result?.meta?.total || 0) / limit)}
 totalItems={result?.meta?.total || 0}
 itemsPerPage={limit}
 />
 </div>
 </div>
 </div>
 );
}
