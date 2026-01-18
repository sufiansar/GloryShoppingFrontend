import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllVariants } from "@/action/variants/variants.action";
import VariantsTable from "@/components/modules/Admin/ProductVariant/VariantsTable";

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

  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const searchTerm = params.searchTerm || "";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Product Variants
          </h1>
          <p className="text-muted-foreground">
            Manage product variants ({result?.meta?.total || 0} total)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/variants/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Variant
          </Link>
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search variants by SKU, size..."
            defaultValue={searchTerm}
            className="pl-10"
            readOnly
          />
        </div>
        <Select defaultValue={params.productId || "all"}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All products</SelectItem>
            {/* You would populate this from your products API */}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Variants Table */}
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
  );
}
