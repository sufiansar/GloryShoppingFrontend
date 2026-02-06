import { getAllBrand } from "@/action/brand/brand.action";
import BrandPageClient from "@/components/modules/Brand/BrandPageClient";

export default async function BrandsPage() {
  // Fetch all brands with pagination
  const brandsData = await getAllBrand("page=1&limit=100");
  const brands = brandsData?.data || [];

  return <BrandPageClient brands={brands} />;
}
