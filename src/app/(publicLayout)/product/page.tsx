import { getAllProducts } from "@/action/product/product.action";
import ProductGrid from "@/components/modules/PublicProduct/ProductGrid";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    categoryId?: string;
    brandId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "12");
  const searchTerm = params.searchTerm || "";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";

  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
    isActive: "true",
    ...(searchTerm && { searchTerm }),
    ...(params.categoryId && { categoryId: params.categoryId }),
    ...(params.brandId && { brandId: params.brandId }),
  }).toString();

  const result = await getAllProducts(queryString);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            RECOMMENDED FOR YOU
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="sm" className="rounded-r-none">
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-l-none border-l"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ProductGrid
        products={result?.data || []}
        currentPage={page}
        totalPages={result?.meta?.totalPages || 1}
        totalItems={result?.meta?.total || 0}
        itemsPerPage={limit}
      />
    </div>
  );
}
