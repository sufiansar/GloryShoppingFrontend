import React from "react";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIngredientById } from "@/action/ingredian/ingrediant.action";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import IngredientForm from "@/components/modules/Ingredients/IngredientForm";

interface EditIngredientPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditIngredientPage({
  params,
}: EditIngredientPageProps) {
  const { id } = await params;
  const ingredient = await getIngredientById(id);

  if (!ingredient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Ingredient</CardTitle>
        </CardHeader>
        <CardContent>
          <IngredientForm
            initialData={{
              id: ingredient.id,
              name: ingredient.name,
              description: ingredient.description,
              benefits: ingredient.benefits,
              sideEffects: ingredient.sideEffects,
              usage: ingredient.usage,
              precautions: ingredient.precautions,
              safetyLevel: ingredient.safetyLevel,
            }}
            isEdit
          />
        </CardContent>
      </Card>
    </div>
  );
}
