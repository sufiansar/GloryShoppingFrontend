import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Package } from "lucide-react";
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

  const response = await getProductById(id);
  const product = response?.data;

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
            <Link href="/admin/dashboard/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Package className="h-6 w-6 text-primary-custom" />
            Product Details
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
            SKU: <span className="text-primary-custom">{product.slug || "N/A"}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="rounded-2xl h-12 px-8 bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all active:scale-95 border-none">
            <Link href={`/admin/dashboard/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="w-full">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
