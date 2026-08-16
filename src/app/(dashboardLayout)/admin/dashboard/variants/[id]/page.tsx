import { notFound } from"next/navigation";
import { Button } from"@/components/ui/button";
import { ArrowLeft, Edit } from"lucide-react";
import Link from"next/link";

import VariantDetails from"@/components/modules/Admin/ProductVariant/VariantDetails";
import { getVariantByID } from"@/action/variants/variants.action";

interface VariantDetailsPageProps {
 params: Promise<{
 id: string;
 }>;
}

export default async function VariantDetailsPage({
 params,
}: VariantDetailsPageProps) {
 const { id } = await params;

 const variant = await getVariantByID(id);
 console.log(variant);

 if (!variant) {
 notFound();
 }

 return (
 <div className="p-6">
 <div className="mb-6 flex items-center justify-between">
 <div>
 <Button variant="ghost"size="sm"asChild className="mb-2">
 <Link href="/admin/dashboard/variants">
 <ArrowLeft className="mr-2 h-4 w-4"/>
 Back to Variants
 </Link>
 </Button>
 <h1 className="text-3xl font-bold">Variant Details</h1>
 <p className="text-muted-foreground">SKU: {variant?.data?.sku}</p>
 </div>
 <Button asChild>
 <Link href={`/admin/dashboard/variants/${variant?.data?.id}/edit`}>
 <Edit className="mr-2 h-4 w-4"/>
 Edit Variant
 </Link>
 </Button>
 </div>

 <div className="max-w-4xl">
 <VariantDetails variant={variant?.data} />
 </div>
 </div>
 );
}
