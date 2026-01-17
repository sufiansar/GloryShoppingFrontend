import { fetchAllCategories } from "@/action/categories/categories.action";
import CategoryTable from "@/components/modules/Admin/Categories/CategoryTable";
import SearchForm from "@/components/modules/Admin/Categories/SearchForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const searchTerm = params.searchTerm || "";

  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(searchTerm && { searchTerm }),
  }).toString();

  const result = await fetchAllCategories(queryString);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories ({result?.meta?.total || 0} total)
          </p>
        </div>
        <Button asChild>
          <a href="/admin/dashboard/categories">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </a>
        </Button>
      </div>

      <SearchForm
        initialSearchTerm={searchTerm}
        initialPage={page.toString()}
        initialLimit={limit.toString()}
      />

      <CategoryTable
        categories={result?.data || []}
        currentPage={page}
        totalPages={result?.meta?.totalPages || 1}
        totalItems={result?.meta?.total || 0}
        itemsPerPage={limit}
      />
    </div>
  );
}
