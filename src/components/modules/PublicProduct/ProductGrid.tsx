"use client";

import Pagination from "@/components/Shared/Pagination";
import { Product } from "@/types/product.interface";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function ProductGrid({
  products,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "grid";

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">😔</div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          view === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8 transition-all duration-300"
            : "flex flex-col gap-4 mb-8 transition-all duration-300"
        }
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={
              view === "list" ? "border rounded-xl p-4 flex gap-6 bg-white" : ""
            }
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemsPerPageOptions={[12, 24, 48, 96]}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          className="mt-8"
        />
      )}
    </>
  );
}
