import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAllProducts } from "@/action/product/product.action";
import ProductsTable from "@/components/modules/Admin/Products/ProductsTable";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
    brandId?: string;
    categoryId?: string;
    isActive?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const searchTerm = params.searchTerm || "";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";

  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
    ...(searchTerm && { searchTerm }),
    ...(params.brandId && { brandId: params.brandId }),
    ...(params.categoryId && { categoryId: params.categoryId }),
    ...(params.isActive && { isActive: params.isActive }),
  }).toString();

  const result = await getAllProducts(queryString);
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2">
      {/* Premium Header Card */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Products
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            Manage your products ({result?.meta?.total || 0} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="rounded-2xl h-12 px-8 bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none">
            <Link href="/admin/dashboard/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Link>
          </Button>
        </div>
      </div>

      <ProductsTable
        products={result?.data || []}
        currentPage={page}
        totalPages={result?.meta?.totalPages || 1}
        totalItems={result?.meta?.total || 0}
        itemsPerPage={limit}
        searchTerm={searchTerm}
        brandId={params.brandId}
        categoryId={params.categoryId}
        isActive={params.isActive}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </div>
  );
}
