import CreateVariantForm from "@/components/modules/Admin/ProductVariant/VariantForm";

export default function CreateVariantPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Create Product Variant
        </h1>
        <p className="text-muted-foreground">Add a new variant to a product</p>
      </div>

      <div className="max-w-2xl">
        <CreateVariantForm />
      </div>
    </div>
  );
}
