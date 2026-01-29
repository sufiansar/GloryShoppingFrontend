import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import IngredientForm from "@/components/modules/Ingredients/IngredientForm";

export default function CreateIngredientPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Ingredient</CardTitle>
        </CardHeader>
        <CardContent>
          <IngredientForm />
        </CardContent>
      </Card>
    </div>
  );
}
