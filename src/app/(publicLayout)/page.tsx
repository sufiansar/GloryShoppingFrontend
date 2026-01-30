import { Button } from "@/components/ui/button";
import ProductsPage from "./product/page";
import { Filter, Grid, List } from "lucide-react";
import { fetchAllCategories } from "@/action/categories/categories.action";
import CategoryShowcase from "@/components/modules/CategoryShowcase/CategoryShowcase";

export const dynamic = "force-dynamic";

const PublicPage = async () => {
  // Define the 5 category slugs to display (in order of preference)
  const preferredCategorySlugs = [
    "skin-care",
    "mom-baby",
    "health-beauty",
    "hair-beauty",
    "accessories",
  ];

  try {
    // Fetch all categories
    const allCategoriesResult = await fetchAllCategories("limit=100");
    const allCategories = allCategoriesResult?.data || [];

    console.log("📌 All categories fetched:", allCategories.length);
    console.log(
      "📌 Categories:",
      allCategories.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })),
    );
    let categoriesToShow = preferredCategorySlugs
      .map((slug) => allCategories.find((cat: any) => cat.slug === slug))
      .filter((cat) => cat !== undefined);

    console.log("📌 Categories to show:", categoriesToShow.length);
    console.log(
      "📌 Categories to show:",
      categoriesToShow.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })),
    );

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
        {/* Category Showcases - Display 5 Specific Categories */}
        <div className="container mx-auto px-4 py-12">
          {preferredCategorySlugs.map((slug) => {
            const category = allCategories.find(
              (cat: any) => cat.slug === slug,
            );

            if (category) {
              // Show category with products
              return <CategoryShowcase key={category.id} category={category} />;
            } else {
              // Show placeholder for missing category
              return (
                <div key={slug} className="space-y-6 mb-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
                        {slug
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </h2>
                    </div>
                  </div>
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                    <p className="text-gray-600 text-lg font-medium">
                      No Data Found
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      This category has not been created yet
                    </p>
                  </div>
                  <div className="border-b border-gray-200 mt-8"></div>
                </div>
              );
            }
          })}
        </div>

        {/* Recommended Products Section */}
        <div className=" container mx-auto px-4 py-8 mb-2 flex items-center justify-between">
          <div className="">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              RECOMMENDED FOR YOU
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="sm" className="rounded-r-none">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-l-none border-l"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ProductsPage searchParams={searchParams} />
      </div>
    );
  } catch (error) {
    console.error("Error in PublicPage:", error);
    // Fallback if categories fail to load
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
        <div className=" container mx-auto px-4 py-8 mb-8 flex items-center justify-between">
          <div className="">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              RECOMMENDED FOR YOU
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="sm" className="rounded-r-none">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-l-none border-l"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ProductsPage searchParams={searchParams} />
      </div>
    );
  }
};

export default PublicPage;
