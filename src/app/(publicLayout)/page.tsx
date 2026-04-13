import { getSections } from "@/action/section/section.action";
import { fetchAllCategories } from "@/action/categories/categories.action";
import CategoryMarquee from "@/components/modules/category.marquee";
import CategoryShowcase from "@/components/modules/CategoryShowcase/CategoryShowcase";
import HeroSliderWrapper from "@/components/modules/Sections/HeroSectionSlider";
import { SkincareMarquee } from "@/components/SkincareMarquee";
import { Button } from "@/components/ui/button";
import ProductsPage from "./product/page";
import { Filter, Grid, List, ChevronRight } from "lucide-react";
import { Section } from "@/types/section.interface";
import BestProductSlider from "@/components/modules/PublicProduct/NewArrivals";
import { navItems } from "@/components/Shared/NavItems/Navitems";
import { getAllProductByCategory } from "@/action/product/product.action";
import { Category } from "@/types/categorys.interface";
import Link from "next/link";
import ProductFilters from "@/components/modules/PublicProduct/ProductFilters";

const MainCategoryGroup = async ({
  mainItem,
  allCategories,
}: {
  mainItem: any;
  allCategories: Category[];
}) => {
  const mainSlug = mainItem.href.split("/").pop();
  const mainCategory = allCategories.find((cat: any) => cat.slug === mainSlug);

  if (!mainCategory) return null;

  const subCategorySlugs =
    mainItem.subItems
      ?.filter((sub: any) => sub.href.includes("/categorys/"))
      .map((sub: any) => sub.href.split("/").pop()) || [];

  const subCategories = allCategories.filter((cat: any) =>
    subCategorySlugs.includes(cat.slug),
  );

  const categoryIds = [mainCategory.id, ...subCategories.map((c) => c.id)];

  try {
    const productResponses = await Promise.all(
      categoryIds.map((id) => getAllProductByCategory("limit=15", id || "")),
    );

    const allProducts = productResponses.flatMap(
      (res) => res?.data?.data || res?.data || [],
    );

    const uniqueProducts = Array.from(
      new Map(allProducts.map((p) => [p.id, p])).values(),
    );

    if (uniqueProducts.length === 0) return null;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6 mb-3 md:mb-8 last:mb-0 w-full overflow-hidden">
        <CategoryShowcase
          category={mainCategory}
          initialProducts={uniqueProducts}
          title={mainCategory.name}
        />
      </div>
    );
  } catch (error) {
    console.error(`Error loading group for ${mainCategory.name}:`, error);
    return null;
  }
};

const PublicPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    categoryId?: string;
    brandId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) => {
  const params = await searchParams;
  const limit = params.limit || "15";

  try {
    const sectionsResponse = await getSections();
    const allSections = sectionsResponse?.data || [];

    const allCategoriesResult = await fetchAllCategories("limit=100");
    const allCategories = allCategoriesResult?.data || [];

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
        return dateB - dateA;
      });

    const heroSection: Section | undefined = heroSections[0];

    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-none flex flex-col md:h-[calc(100vh-64px)] overflow-hidden">
          {heroSection ? (
            <section className="hidden md:block w-full flex-1 min-h-0">
              <HeroSliderWrapper
                section={heroSection}
                autoPlay={true}
                autoPlayInterval={5000}
                showNavigation={true}
                showDots={true}
                pauseOnHover={true}
                height="100%"
                className="shadow-2xl h-full"
                showText={false}
              />
            </section>
          ) : (
            <section className="hidden md:block p-2 flex-1 min-h-0">
              <div className="container mx-auto h-full bg-linear-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No hero slides available</p>
              </div>
            </section>
          )}
          <div className="hidden md:block flex-none">
            <SkincareMarquee />
          </div>
        </div>

        <div className="z-30 bg-white">
          <CategoryMarquee categories={allCategories} />
        </div>

        <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-2 md:py-6 w-full overflow-x-hidden">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-6 mb-3 md:mb-8 w-full overflow-hidden">
            <BestProductSlider />
          </div>
          {navItems
            .filter((item) =>
              [
                "SKINCARE",
                "PERFUME",
                "MOM & BABY",
                "SUPPLEMENT",
                "HAIR AND BEAUTY",
                "ACCESSORIES",
              ].includes(item.title),
            )
            .map((mainItem) => (
              <MainCategoryGroup
                key={mainItem.title}
                mainItem={mainItem}
                allCategories={allCategories}
              />
            ))}
        </div>

        <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-4 md:py-8 mb-2 flex flex-col md:flex-row items-center justify-between gap-4 w-full overflow-hidden">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              RECOMMENDED FOR YOU
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/product">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-pink-500 text-pink-600 font-semibold hover:bg-pink-50"
              >
                See All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <ProductFilters />
          </div>
        </div>
        <ProductsPage searchParams={Promise.resolve({ ...params, limit })} />
      </div>
    );
  } catch (error) {
    console.error("Error in PublicPage:", error);
    return (
      <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <ProductsPage searchParams={Promise.resolve({ limit })} />
      </div>
    );
  }
};

export default PublicPage;
