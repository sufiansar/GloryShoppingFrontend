import CreateProductForm from"@/components/modules/Admin/Products/CreateProductForm";

export default function CreateProductPage() {
 return (
 <div className="p-6">
 <div className="mb-6">
 <h1 className="text-3xl font-bold">Create Product</h1>
 <p className="text-muted-foreground">Add a new product to your store</p>
 </div>

 <div className="max-w-4xl">
 <CreateProductForm />
 </div>
 </div>
 );
}
