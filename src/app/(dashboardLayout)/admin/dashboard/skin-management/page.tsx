import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkinConcernTable from "@/components/modules/Admin/SkinType/SkinConcernTable";
import SkinTypeTable from "@/components/modules/Admin/SkinType/SkinTypeTable";

export default function SkinManagementPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2 w-full">
      {/* Premium Header Card */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Skin Management</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            Manage your store's Skin Types and Concerns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/skin-management/add-products">
            <Button className="rounded-2xl h-12 px-8 bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none">
              Add Products to Skin Concern
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col p-8 mb-6">
        <Tabs defaultValue="skin-concerns" className="w-full">
          <TabsList className="mb-8 w-full sm:w-auto inline-flex overflow-x-auto bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl h-14">
            <TabsTrigger value="skin-concerns" className="rounded-xl h-11 px-8 font-semibold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-primary-custom transition-all shadow-sm">Skin Concerns</TabsTrigger>
            <TabsTrigger value="skin-types" className="rounded-xl h-11 px-8 font-semibold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-primary-custom transition-all shadow-sm">Skin Types</TabsTrigger>
          </TabsList>

          <TabsContent value="skin-concerns" className="m-0">
            <SkinConcernTable />
          </TabsContent>

          <TabsContent value="skin-types" className="m-0">
            <SkinTypeTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
