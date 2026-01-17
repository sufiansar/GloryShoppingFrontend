import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { getVariantBySKU } from "@/action/variants/variants.action";
import VariantDetails from "@/components/modules/Admin/ProductVariant/VariantDetails";

interface VariantDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VariantDetailsPage({
  params,
}: VariantDetailsPageProps) {
  const { id } = await params;

  // Fetch variant data
  const variant = await getVariantBySKU(id);

  if (!variant) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin/variants">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Variants
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Variant Details</h1>
          <p className="text-muted-foreground">SKU: {variant.sku}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/variants/${variant.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Variant
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl">
        <VariantDetails variant={variant} />
      </div>
    </div>
  );
}
