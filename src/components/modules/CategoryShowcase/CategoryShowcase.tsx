import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/categorys.interface";
import { Product } from "@/types/product.interface";
import { getAllProductByCategory } from "@/action/product/product.action";
import ProductCard from "../PublicProduct/ProductCard";

interface CategoryShowcaseProps {
  category: Category;
}

export default async function CategoryShowcase({
  category,
}: CategoryShowcaseProps) {
  try {
    // Fetch 4 products for this category using category ID
    console.log(
      `🔍 Fetching products for category: ${category.name} (ID: ${category.id})`,
    );
    const result = await getAllProductByCategory("limit=4", category.id || "");
    console.log(`📊 API Response:`, result);
    // Handle nested data structure: result.data.data contains the products array
    const products: Product[] = result?.data?.data || result?.data || [];

    console.log(
      `📦 Category "${category.name}" (ID: ${category.id}): ${products.length} products found`,
    );

    return (
      <div className="space-y-6 mb-12">
        {/* Category Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                {category.description}
              </p>
            )}
          </div>
          <Link href={`/categorys/${category.slug}`}>
            <Button
              variant="outline"
              className="gap-2 hover:bg-pink-600 hover:text-white transition-colors"
            >
              See More
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid or Empty State */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No products available in this category yet
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-b border-gray-200 mt-8"></div>
      </div>
    );
  } catch (error) {
    console.error(`Error in CategoryShowcase for ${category.name}:`, error);
    // Still show the category header even if there's an error
    return (
      <div className="space-y-6 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                {category.description}
              </p>
            )}
          </div>
          <Link href={`/categorys/${category.slug}`}>
            <Button
              variant="outline"
              className="gap-2 hover:bg-pink-600 hover:text-white transition-colors"
            >
              See More
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600">Error loading products</p>
        </div>
        <div className="border-b border-gray-200 mt-8"></div>
      </div>
    );
  }
}
