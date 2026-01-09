import Footer from "@/components/modules/Footer/Footer";
import { HeroSlider } from "@/components/modules/Hero/HeroSidebar/HeroSlider";
import Navbar from "@/components/modules/Navbar/PublicNavbar";
import SecondaryNavbar from "@/components/modules/Navbar/SecondaryNavbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SecondaryNavbar />
      <Navbar />
      <HeroSlider sections={[]} autoPlay={true} delay={5000} />
      {children};
      <Footer />
    </div>
  );
}
