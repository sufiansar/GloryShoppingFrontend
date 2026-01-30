import SectionManagement from "@/components/modules/Admin/Section/SectionManagement";
import { getSections } from "@/action/section/section.action";

export default async function SectionsPage() {
  // Fetch sections on the server using your server action
  const sectionsResponse = await getSections();
  const initialSections = sectionsResponse?.data || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Pass server-fetched sections to the client component to avoid client-side server action calls */}
      <SectionManagement initialSections={initialSections} />
    </div>
  );
}
