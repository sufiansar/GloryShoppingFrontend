import { getAllProducts } from "@/action/product/product.action";
import ProductGrid from "@/components/modules/PublicProduct/ProductGrid";

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
  // console.log(result.meta, "Result");

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGrid
        products={result?.data || []}
        currentPage={page}
        totalPages={result?.totalPages || result?.meta?.totalPages || 1}
        totalItems={result?.total || result?.meta?.total || 0}
        itemsPerPage={limit}
      />
    </div>
  );
}
