import SectionManagement from "@/components/modules/Admin/Section/SectionManagement";
import { getSections } from "@/action/section/section.action";

export default async function SectionsPage() {
  // Fetch sections on the server using your server action
  const sectionsResponse = await getSections();
  const initialSections = sectionsResponse?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2 w-full">
      {/* Pass server-fetched sections to the client component to avoid client-side server action calls */}
      <SectionManagement initialSections={initialSections} />
    </div>
  );
}
