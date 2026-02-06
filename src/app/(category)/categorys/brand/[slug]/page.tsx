import { notFound } from "next/navigation";
import { getBrandBySlugWithProducts } from "@/action/brand/brand.action";
import ProductCard from "@/components/modules/PublicProduct/ProductCard";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// Generate static params for all known brands
export async function generateStaticParams() {
  // These are our predefined brand slugs from the navigation
  const brands = [
    "abib",
    "acwell",
    "anua",
    "aplb",
    "aromatica",
    "axis-y",
    "banila-co",
    "beauty-of-joseon",
    "benton",
    "bonajour",
    "cos-de-baha",
    "torriden",
    "haruharu-wonder",
    "nineless",
    "apieu",
    "nacific",
    "medicube",
    "cosrx",
    "etude-house",
    "heimish",
    "innisfree",
    "isntree",
    "illyoon",
    "iunik",
    "jumiso",
    "pyunkang-yul",
    "goodal",
    "dear-klairs",
    "b-lab",
    "skin-miso",
    "dr-ceuracle",
    "japanese-cosmetics",
    "vt",
    "laneige",
    "missha",
    "mielle",
    "neutrogena",
    "numbuzin",
    "panoxyl",
    "paulas-choice",
    "purito",
    "round-lab",
    "karine",
    "be-the-skin",
    "bioderma",
    "mary-and-may",
    "the-derma-co",
    "simple",
    "dr-forhair",
    "some-by-mi",
    "skin1004",
    "tiam",
    "tocobo",
    "3w-clinic",
    "the-face-shop",
    "the-inkey-list",
    "the-ordinary",
    "cera-ve",
    "garnier",
    "i-am-from",
    "belief",
    "mixsoon",
    "tirtir",
    "dr-althea",
  ];

  return brands.map((slug) => ({
    slug,
  }));
}

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const limit = 12;

  // Fetch brand with products using the new API
  const queryString = `page=${currentPage}&limit=${limit}`;

  console.log("🔍 Fetching brand with slug:", slug);
  console.log("📊 Query string:", queryString);

  const brandData = await getBrandBySlugWithProducts(queryString, slug);

  console.log("✅ Brand data received:", JSON.stringify(brandData, null, 2));

  // Extract brand info and products from nested structure
  const brand = brandData?.data?.data;
  const products = brand?.products || [];
  const meta = brandData?.data?.meta || {};
  const totalProducts = meta.total || 0;

  console.log("🏷️ Brand:", brand);
  console.log("📦 Products count:", products.length);
  console.log("📈 Total products:", totalProducts);

  // Fallback empty state
  if (!brand || products.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-12">
          {/* Brand Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {brand?.name || slug}
            </h1>
            <div className="h-1 w-24 bg-linear-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>

          {/* Empty State */}
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-100 to-pink-100 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-600 mb-8">
              We don't have any products from {brand?.name || slug} at the
              moment.
            </p>
            <Link href="/">
              <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Brand Header with Logo */}
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Brand Logo */}
          {brand.logoUrl && (
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg bg-white p-2">
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Brand Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {brand.name}
            </h1>
            <div className="h-1 w-24 bg-linear-to-r from-purple-600 to-pink-600 rounded-full mb-4"></div>
            {brand.country && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Country:</span> {brand.country}
              </p>
            )}
            <p className="text-gray-600">{totalProducts} products available</p>
          </div>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<ProductsGridSkeleton />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {currentPage > 1 && (
                  <Link
                    href={`/categorys/brand/${slug}?page=${currentPage - 1}`}
                  >
                    <Button
                      variant="outline"
                      className="border-purple-200 hover:bg-purple-50"
                    >
                      Previous
                    </Button>
                  </Link>
                )}

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    // Show only nearby pages on mobile
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - currentPage) <= 1
                    ) {
                      return (
                        <Link
                          key={pageNum}
                          href={`/categorys/brand/${slug}?page=${pageNum}`}
                        >
                          <Button
                            variant={
                              pageNum === currentPage ? "default" : "outline"
                            }
                            className={
                              pageNum === currentPage
                                ? "bg-linear-to-r from-purple-600 to-pink-600"
                                : "border-purple-200 hover:bg-purple-50"
                            }
                          >
                            {pageNum}
                          </Button>
                        </Link>
                      );
                    }

                    // Show ellipsis
                    if (
                      (pageNum === 2 && currentPage > 3) ||
                      (pageNum === totalPages - 1 &&
                        currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    return null;
                  },
                )}

                {currentPage < totalPages && (
                  <Link
                    href={`/categorys/brand/${slug}?page=${currentPage + 1}`}
                  >
                    <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-lg">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

// Skeleton loader for products grid
function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-linear-to-r from-purple-200 to-pink-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}
