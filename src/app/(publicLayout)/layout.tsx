import { getSections } from "@/action/section/section.action";
import { fetchAllCategories } from "@/action/categories/categories.action";
import CategoryMarquee from "@/components/modules/category.marqieu";
import Footer from "@/components/modules/Footer/Footer";
import Navbar from "@/components/modules/Navbar/PublicNavbar";
import SecondaryNavbar from "@/components/modules/Navbar/SecondaryNavbar";
import HeroSliderWrapper from "@/components/modules/Sections/HeroSectionSlider";
import { SkincareMarquee } from "@/components/SkincareMarquee";
import { Section } from "@/types/section.interface";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sectionsResponse = await getSections();
  const allSections = sectionsResponse?.data || [];

  const categoriesResponse = await fetchAllCategories();
  console.log("Full categoriesResponse:", categoriesResponse);

  let categories = [];
  try {
    if (categoriesResponse?.data && Array.isArray(categoriesResponse.data)) {
      categories = categoriesResponse.data;
    } else if (Array.isArray(categoriesResponse)) {
      categories = categoriesResponse;
    }
  } catch (err) {
    console.error("Error parsing categories:", err);
  }

  console.log("Extracted categories:", categories.length, categories);

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

  console.log(
    "🎯 Hero section found:",
    heroSection
      ? {
          title: heroSection.title,
          type: heroSection.type,
          createdAt: heroSection.createdAt,
          imagesCount: heroSection.images?.length,
        }
      : "No hero section",
  );

  const isProductDetailsPage = false;

  return (
    <div>
      <SecondaryNavbar />
      <Navbar />

      {!isProductDetailsPage && (
        <>
          {heroSection ? (
            <section className="hidden md:block p-2">
              <div className="container mx-auto">
                <HeroSliderWrapper
                  section={heroSection}
                  autoPlay={true}
                  autoPlayInterval={6000}
                  showNavigation={true}
                  showDots={true}
                  pauseOnHover={true}
                  height="400px"
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
          <CategoryMarquee categories={categories} />
        </>
      )}

      {children}
      <Footer />
    </div>
  );
}
