import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkinConcernTable from "@/components/modules/Admin/SkinType/SkinConcernTable";
import SkinTypeTable from "@/components/modules/Admin/SkinType/SkinTypeTable";

export default function SkinManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Skin Management</h1>
        <div className="space-x-2">
          <Link href="/skin-management/add-products">
            <Button>Add Products to Skin Concern</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="skin-concerns" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="skin-concerns">Skin Concerns</TabsTrigger>
          <TabsTrigger value="skin-types">Skin Types</TabsTrigger>
        </TabsList>

        <TabsContent value="skin-concerns">
          <SkinConcernTable />
        </TabsContent>

        <TabsContent value="skin-types">
          <SkinTypeTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
