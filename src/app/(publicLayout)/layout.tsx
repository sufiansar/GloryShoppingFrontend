import Footer from "@/components/modules/Footer/Footer";
import GloryFeatures from "@/components/modules/Footer/glory-features";
import Navbar from "@/components/modules/Navbar/PublicNavbar";
import SecondaryNavbar from "@/components/modules/Navbar/SecondaryNavbar";
import WhatsAppFloatEnhanced from "@/components/Shared/whatsapp-float";
import { FloatingChatButtonImproved } from "@/components/modules/Chat/FloatingChatButton.improved";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SecondaryNavbar />
      <Navbar />
      <WhatsAppFloatEnhanced />
      <FloatingChatButtonImproved />
      {children}
      <GloryFeatures />
      <Footer />
    </div>
  );
}
