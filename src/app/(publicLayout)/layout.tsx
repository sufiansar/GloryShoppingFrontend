import { getSections } from "@/action/section/section.action";
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

  const heroSlides: Section[] = allSections
    .filter(
      (section: Section) =>
        section.type === "HERO" && section.images && section.images.length > 0
    )
    .map((section: Section) => ({
      ...section,
      // Ensure we only use the first image from each slide
      images: section.images.slice(0, 1),
    }));

  return (
    <div>
      <SecondaryNavbar />
      <Navbar />

      {heroSlides.length > 0 ? (
        <section className="p-2">
          <div className="container mx-auto">
            <HeroSliderWrapper
              slides={heroSlides}
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
        <section className="p-2">
          <div className="container mx-auto h-100 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">No hero slides available</p>
          </div>
        </section>
      )}

      <SkincareMarquee />
      {children}
      <Footer />
    </div>
  );
}
