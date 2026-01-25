import {
  getAllProducts,
  getProductBySlug,
} from "@/action/product/product.action";
import ProductDetailsPage from "@/components/modules/PublicProduct/ProductDetailsPage";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const result = await getAllProducts("");
    const products = result?.data || [];

    return products.slice(0, 30).map((product: any) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product?.data) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.data.name,
    description: product.data.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product?.data) {
    notFound();
  }

  // Fetch related products (same category)
  let relatedProducts = [];
  try {
    const categoryId = product.data.categoryId;
    if (categoryId) {
      const relatedResult = await getAllProducts(
        new URLSearchParams({
          categoryId,
          limit: "6",
          isActive: "true",
        }).toString(),
      );
      relatedProducts =
        relatedResult?.data
          ?.filter((p: any) => p.id !== product.data.id)
          .slice(0, 4) || [];
    }
  } catch (error) {
    console.error("Error fetching related products:", error);
  }

  return (
    <ProductDetailsPage
      product={product.data}
      relatedProducts={relatedProducts}
    />
  );
}
