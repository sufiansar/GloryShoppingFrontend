import { getAllIngredients } from"@/action/ingredian/ingrediant.action";
import CreateIngredientButton from"@/components/modules/Ingredients/CreateIngredientButton";
import IngredientTable from"@/components/modules/Ingredients/IngredientTable";
import React from"react";

interface PageProps {
 searchParams: {
 page?: string;
 search?: string;
 };
}

export default async function IngredientsPage({ searchParams }: PageProps) {
 const { page ="1", search =""} = searchParams;
 const query = new URLSearchParams({
 page,
 limit:"10",
 search,
 }).toString();

 const ingredients = await getAllIngredients(query);

 return (
 <div className="space-y-8 animate-in fade-in duration-700 pb-10 pt-4 px-2 w-full">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h1 className="text-2xl font-medium text-slate-900 dark:text-white">Ingredients</h1>
 <p className="text-sm font-medium text-slate-400 mt-1">
 Manage your product ingredients
 </p>
 </div>
 <CreateIngredientButton />
 </div>

 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm overflow-hidden flex flex-col p-6 lg:p-8">
 <IngredientTable
 ingredients={ingredients?.data || []}
 pagination={ingredients?.pagination || {}}
 currentSearch={search}
 />
 </div>
 </div>
 );
}
