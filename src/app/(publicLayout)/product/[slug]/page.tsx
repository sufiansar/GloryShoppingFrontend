import {
  getAllProducts,
  getProductById,
  getProductBySlug,
} from "@/action/product/product.action";
import ProductDetailsPage from "@/components/modules/PublicProduct/ProductDetailsPage";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for 30 products
export async function generateStaticParams() {
  try {
    const queryString = new URLSearchParams({
      page: "1",
      limit: "30",
      sortBy: "createdAt",
      sortOrder: "desc",
      isActive: "true",
    }).toString();

    const result = await getAllProducts(queryString);
    const products = result?.data || [];
    console.log(products);

    return products.map((product: any) => ({
      slug: product.slug || product.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    console.log(product.data);
    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    return {
      title: `${product?.data?.name} - Our Store`,
      description:
        product?.data?.shortDesc ||
        product?.data?.description ||
        `${product?.data?.name} available at our store`,
      openGraph: {
        title: product?.data?.name,
        description:
          product?.data?.shortDesc ||
          product?.data?.description ||
          `${product?.data?.name} available at our store`,
        images: product?.data?.thumbleImage
          ? [product?.data?.thumbleImage]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Product Details",
      description: "View product details",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product data using slug
  const product = await getProductBySlug(slug);

  if (!product?.data) {
    notFound();
  }

  // Fetch related products (same category)
  const relatedProductsQuery = new URLSearchParams({
    page: "1",
    limit: "4",
    categoryId: product?.data?.categoryId,
    sortBy: "createdAt",
    sortOrder: "desc",
    isActive: "true",
  }).toString();

  const relatedResult = await getAllProducts(relatedProductsQuery);
  const relatedProducts = (relatedResult?.data || []).filter(
    (p: any) => p.id !== product?.data?.id,
  );

  return (
    <ProductDetailsPage
      product={product?.data}
      relatedProducts={relatedProducts}
    />
  );
}
