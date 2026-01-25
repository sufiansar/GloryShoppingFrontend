import ProductsPage from "./product/page";

export const dynamic = "force-dynamic";

const PublicPage = () => {
  let searchParams = new Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    categoryId?: string;
    brandId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>((resolve) => {
    resolve({});
  });
  return (
    <div>
      <ProductsPage searchParams={searchParams} />
    </div>
  );
};

export default PublicPage;
