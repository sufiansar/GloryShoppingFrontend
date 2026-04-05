import Footer from "@/components/modules/Footer/Footer";
import Navbar from "@/components/modules/Navbar/PublicNavbar";
import SecondaryNavbar from "@/components/modules/Navbar/SecondaryNavbar";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-slate-100">
      {/* <SecondaryNavbar /> */}
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
