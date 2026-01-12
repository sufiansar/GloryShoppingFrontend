import Footer from "@/components/modules/Footer/Footer";

import Navbar from "@/components/modules/Navbar/PublicNavbar";
import SecondaryNavbar from "@/components/modules/Navbar/SecondaryNavbar";
import { SkincareMarquee } from "@/components/SkincareMarquee";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SecondaryNavbar />
      <Navbar />
      {/* <HeroSlider sections={[]} autoPlay={true} delay={5000} /> */}
      <SkincareMarquee />
      {children};
      <Footer />
    </div>
  );
}
