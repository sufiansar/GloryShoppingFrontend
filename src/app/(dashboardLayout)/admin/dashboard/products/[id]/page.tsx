import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { getProductById } from "@/action/product/product.action";
import ProductDetails from "@/components/modules/Admin/Products/ProductDetails";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
          <p className="text-muted-foreground">SKU: {product.slug || "N/A"}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/products/${product.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
