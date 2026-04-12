import React from "react";
import AdminOrdersDashboard from "@/components/modules/Admin/Orders/AdminOrdersDashboard";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

const AdminOrdersPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2">
      {/* Premium Header Card */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Orders Management
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            Manage and monitor customer orders, update statuses, and handle cancellations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-2xl h-12 px-6 border-white/40 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline"
            className="rounded-2xl h-12 px-6 border-white/40 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <AdminOrdersDashboard />
    </div>
  );
};

export default AdminOrdersPage;
