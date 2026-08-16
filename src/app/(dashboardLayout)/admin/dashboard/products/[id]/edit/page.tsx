import { getProductById } from"@/action/product/product.action";
import EditProductForm from"@/components/modules/Admin/Products/EditProductForm";
import { notFound } from"next/navigation";

interface EditProductPageProps {
 params: Promise<{
 id: string;
 }>;
}

export default async function EditProductPage({
 params,
}: EditProductPageProps) {
 const { id } = await params;

 // Fetch product data
 const response = await getProductById(id);
 const product = response?.data;

 if (!product) {
 notFound();
 }

 return (
 <div className="p-6">
 <div className="mb-6">
 <h1 className="text-3xl font-bold">Edit Product</h1>
 <p className="text-muted-foreground">
 Update product details for {product.name}
 </p>
 </div>

 <div className="max-w-4xl">
 <EditProductForm product={product} />
 </div>
 </div>
 );
}
