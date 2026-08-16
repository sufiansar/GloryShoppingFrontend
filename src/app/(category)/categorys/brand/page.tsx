export const dynamic = "force-dynamic";

import { getAllBrand } from "@/action/brand/brand.action";
import { getAllProducts } from "@/action/product/product.action";
import BrandPageClient from "@/components/modules/Brand/BrandPageClient";

export default async function BrandsPage() {
  // Fetch all brands with pagination
  const brandsData = await getAllBrand("page=1&limit=100");
  const brands = brandsData?.data || [];

  // Fetch default products (all brands)
  const productsData = await getAllProducts("page=1&limit=24&sortBy=createdAt&sortOrder=desc");
  const initialProducts = productsData?.data || [];

  return <BrandPageClient brands={brands} initialProducts={initialProducts} />;
}
