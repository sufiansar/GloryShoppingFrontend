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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your products ({result?.meta?.total || 0} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Link>
        </Button>
      </div>

      {/* Simple Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            defaultValue={searchTerm}
            className="pl-10"
            readOnly
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
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
