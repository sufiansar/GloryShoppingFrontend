import { Suspense } from "react";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllProductByCategoryBySlug,
  fetchAllCategories,
} from "@/action/categories/categories.action";
import CategoryProductsContent from "@/components/modules/Categorys/CategoryProductsContent";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  props: CategoryPageProps,
): Promise<Metadata> {
  const { slug } = await props.params;

  try {
    const result = await getAllProductByCategoryBySlug(slug);

    const products = result?.data || [];
    const category =
      Array.isArray(products) && products.length > 0
        ? products[0]?.category
        : null;

    return {
      title: category?.name ? `${category.name} | Products` : "Category",
      description: category?.description || `Browse ${category?.name} products`,
    };
  } catch (error) {
    return {
      title: "Category | E-commerce",
      description: "Browse products by category",
    };
  }
}

export default async function CategoryPage(props: CategoryPageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  try {
    const result = await getAllProductByCategoryBySlug(slug);
    // Extract category from first product in the data array
    const products = result?.data || [];
    const category =
      Array.isArray(products) && products.length > 0
        ? products[0]?.category
        : null;

    if (!category) {
      notFound();
    }

    // Fetch all categories to show in the filter sidebar
    const categoriesResult = await fetchAllCategories();
    const allCategories =
      categoriesResult?.data?.data || categoriesResult?.data || [];

    return (
      <Suspense fallback={<CategoryLoadingSkeleton />}>
        <CategoryProductsContent
          category={category}
          searchParams={searchParams}
          categories={allCategories}
        />
      </Suspense>
    );
  } catch (error) {
    notFound();
  }
}

function CategoryLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="lg:col-span-3">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
