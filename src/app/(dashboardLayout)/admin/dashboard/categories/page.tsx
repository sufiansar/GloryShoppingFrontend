import { CreateCategoryForm } from "@/components/modules/Admin/Categories/CreateCategories";

const page = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Category
        </h1>
        <p className="text-muted-foreground">
          Add a new product category to your store
        </p>
      </div>

      <div className="max-w-2xl">
        <CreateCategoryForm />
      </div>
    </div>
  );
};

export default page;
