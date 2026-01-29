import React from "react";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getIngredientById } from "@/action/ingredian/ingrediant.action";

import JoinProductsForm from "@/components/modules/Ingredients/JoinProductsForm";

interface JoinProductsPageProps {
  params: {
    id: string;
  };
}

export default async function JoinProductsPage({
  params,
}: JoinProductsPageProps) {
  const ingredient = await getIngredientById(params.id);

  if (!ingredient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Join "{ingredient.name}" to Products</CardTitle>
        </CardHeader>
        <CardContent>
          <JoinProductsForm
            ingredientId={ingredient.id}
            ingredientName={ingredient.name}
            existingProductIds={
              ingredient.products?.map((p: any) => p.productId) ?? []
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
