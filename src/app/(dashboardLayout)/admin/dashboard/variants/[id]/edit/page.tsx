import { getVariantByID } from"@/action/variants/variants.action";
import EditVariantForm from"@/components/modules/Admin/ProductVariant/EditVariantForm";
import { notFound } from"next/navigation";

interface EditVariantPageProps {
 params: Promise<{
 id: string;
 }>;
}

export default async function EditVariantPage({
 params,
}: EditVariantPageProps) {
 const { id } = await params;

 const variant = await getVariantByID(id);

 if (!variant) {
 notFound();
 }

 return (
 <div className="p-6">
 <div className="mb-6">
 <h1 className="text-3xl font-bold">Edit Variant</h1>
 <p className="text-muted-foreground">
 Update variant details for {variant?.data?.sku}
 </p>
 </div>

 <div className="max-w-2xl">
 <EditVariantForm variant={variant?.data} />
 </div>
 </div>
 );
}
