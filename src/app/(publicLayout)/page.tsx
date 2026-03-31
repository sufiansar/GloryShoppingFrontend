import { getSections } from "@/action/section/section.action";
import { fetchAllCategories } from "@/action/categories/categories.action";
import CategoryMarquee from "@/components/modules/category.marqieu";
import CategoryShowcase from "@/components/modules/CategoryShowcase/CategoryShowcase";
import HeroSliderWrapper from "@/components/modules/Sections/HeroSectionSlider";
import { SkincareMarquee } from "@/components/SkincareMarquee";
import { Button } from "@/components/ui/button";
import ProductsPage from "./product/page";
import { Filter, Grid, List } from "lucide-react";
import { Section } from "@/types/section.interface";
import BestProductSlider from "@/components/modules/PublicProduct/NewArrivals";

const PublicPage = async () => {
  // Define the 5 category slugs to display (in order of preference)
  const preferredCategorySlugs = [
    "skin-care",
    "mom-baby",
    "hair-beauty",
    "supplement",
    "accessories",
    "perfume",
  ];

  try {
    const sectionsResponse = await getSections();
    const allSections = sectionsResponse?.data || [];

    // Fetch all categories
    const allCategoriesResult = await fetchAllCategories("limit=100");
    const allCategories = allCategoriesResult?.data || [];

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

    const heroSections = allSections
      .filter(
        (section: Section) =>
          section.type === "HERO" &&
          section.isVisible !== false &&
          section.images &&
          section.images.length > 0,
      )
      .sort((a: Section, b: Section) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Newest first
      });

    const heroSection: Section | undefined = heroSections[0];

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
        {heroSection ? (
          <section className="hidden md:block p-2">
            <div className="container mx-auto">
              <HeroSliderWrapper
                section={heroSection}
                autoPlay={true}
                autoPlayInterval={5000}
                showNavigation={true}
                showDots={true}
                pauseOnHover={true}
                height="calc(100vh - 280px)"
                className="shadow-2xl"
                showText={false}
              />
            </div>
          </section>
        ) : (
          <section className="hidden md:block p-2">
            <div className="container mx-auto h-100 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">No hero slides available</p>
            </div>
          </section>
        )}
        <div className="hidden md:block">
          <SkincareMarquee />
        </div>
        <CategoryMarquee categories={allCategories} />

        {/* Category Showcases - Display 5 Specific Categories */}

        <div className="container mx-auto px-4 py-12">
          <BestProductSlider />
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
