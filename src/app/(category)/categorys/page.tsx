import { fetchAllCategories } from "@/action/categories/categories.action";
import CategoryGrid from "@/components/modules/Categorys/CategoryGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | E-commerce",
  description: "Browse all product categories",
};

export default async function CategoriesPage() {
  const categories = await fetchAllCategories();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover products across all categories. Find exactly what you're
            looking for.
          </p>
        </div>

        <CategoryGrid categories={categories?.data || []} />
      </div>
    </div>
  );
}
