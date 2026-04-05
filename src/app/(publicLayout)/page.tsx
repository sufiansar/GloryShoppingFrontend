import { getSections } from "@/action/section/section.action";
import { fetchAllCategories } from "@/action/categories/categories.action";
import CategoryMarquee from "@/components/modules/category.marqieu";
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
      categoryIds.map((id) => getAllProductByCategory("limit=12", id || "")),
    );

    const allProducts = productResponses.flatMap(
      (res) => res?.data?.data || res?.data || [],
    );

    const uniqueProducts = Array.from(
      new Map(allProducts.map((p) => [p.id, p])).values(),
    );

    if (uniqueProducts.length === 0) return null;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-12 md:mb-20 last:mb-0 scale-up">
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
  const limit = params.limit || "12";

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
      <div>
        {heroSection ? (
          <section className="hidden md:block w-full">
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

        <div className="container mx-auto px-4 py-12">
          <BestProductSlider />
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

        <div className="container mx-auto px-4 py-8 mb-2 flex flex-col md:flex-row items-center justify-between gap-4">
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
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <ProductsPage searchParams={Promise.resolve({ limit })} />
      </div>
    );
  }
};

export default PublicPage;
