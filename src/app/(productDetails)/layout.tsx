import Footer from "@/components/modules/Footer/Footer";
import Navbar from "@/components/modules/Navbar/PublicNavbar";
import SecondaryNavbar from "@/components/modules/Navbar/SecondaryNavbar";

export default function ProductDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* <SecondaryNavbar /> */}
      <Navbar />

      {children}
      <Footer />
    </div>
  );
}
