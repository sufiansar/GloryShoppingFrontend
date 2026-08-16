import React from"react";

import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card";

import { getAllIngredients } from"@/action/ingredian/ingrediant.action";

import JoinProductsForm from"@/components/modules/Ingredients/JoinProductsForm";

export default async function JoinProductsPage() {
 // Fetch all ingredients instead of relying on params
 const ingredientsResult = await getAllIngredients("?limit=100");
 const ingredients = ingredientsResult?.data || [];

 return (
 <div className="space-y-6">
 <Card>
 <CardHeader>
 <CardTitle>Join Ingredient to Products</CardTitle>
 </CardHeader>
 <CardContent>
 <JoinProductsForm ingredients={ingredients} />
 </CardContent>
 </Card>
 </div>
 );
}
