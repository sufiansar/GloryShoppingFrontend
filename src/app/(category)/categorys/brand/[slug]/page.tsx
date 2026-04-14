import { getBrandBySlugWithProducts, getAllBrand } from "@/action/brand/brand.action";
import BrandPageClient from "@/components/modules/Brand/BrandPageClient";

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
  const limit = 20;

  // Fetch all brands for the sidebar
  const brandsData = await getAllBrand("page=1&limit=100");
  const brands = brandsData?.data || [];

  // Fetch brand with products using the new API
  const queryString = `page=${currentPage}&limit=${limit}`;

  console.log("🔍 Fetching brand with slug:", slug);
  const brandData = await getBrandBySlugWithProducts(queryString, slug);

  // Extract brand info and products from nested structure
  const brand = brandData?.data?.data || brandData?.data || brandData;
  const products = brand?.products || brandData?.data?.products || [];

  return (
    <BrandPageClient
      brands={brands}
      initialProducts={products}
      initialBrandSlug={slug}
    />
  );
}

