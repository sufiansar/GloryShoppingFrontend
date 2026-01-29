import { getAllIngredients } from "@/action/ingredian/ingrediant.action";
import CreateIngredientButton from "@/components/modules/Ingredients/CreateIngredientButton";
import IngredientTable from "@/components/modules/Ingredients/IngredientTable";
import React from "react";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function IngredientsPage({ searchParams }: PageProps) {
  const { page = "1", search = "" } = searchParams;
  const query = new URLSearchParams({
    page,
    limit: "10",
    search,
  }).toString();

  const ingredients = await getAllIngredients(query);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingredients</h1>
          <p className="text-muted-foreground">
            Manage your product ingredients
          </p>
        </div>
        <CreateIngredientButton />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <IngredientTable
          ingredients={ingredients?.data || []}
          pagination={ingredients?.pagination || {}}
          currentSearch={search}
        />
      </div>
    </div>
  );
}
