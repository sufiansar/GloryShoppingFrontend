// app/admin/brands/page.tsx
import { getAllBrand } from "@/action/brand/brand.action";
import BrandDialog from "@/components/modules/Admin/Brands/BrandDialog";
import BrandsTable from "@/components/modules/Admin/Brands/BrandsTable";
import SearchForm from "@/components/modules/Admin/Brands/SearchForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BrandsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
  }>;
}

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const searchTerm = params.searchTerm || "";

  // Build query string
  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(searchTerm && { searchTerm }),
  }).toString();

  // Fetch brands
  const result = await getAllBrand(queryString);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">
            Manage your product brands ({result?.meta?.total || 0} total)
          </p>
        </div>
        <BrandDialog
          mode="create"
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          }
        />
      </div>

      <SearchForm
        initialSearchTerm={searchTerm}
        initialPage={page.toString()}
        initialLimit={limit.toString()}
      />

      <BrandsTable
        brands={result?.data || []}
        currentPage={page}
        totalPages={result?.meta?.totalPages || 1}
        totalItems={result?.meta?.total || 0}
        itemsPerPage={limit}
      />
    </div>
  );
}
