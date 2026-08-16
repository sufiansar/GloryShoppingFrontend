import React from"react";
import { notFound } from"next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card";
import { Badge } from"@/components/ui/badge";
import { Button } from"@/components/ui/button";

import { Edit, ArrowLeft, LinkIcon } from"lucide-react";
import Link from"next/link";
import { getIngredientById } from"@/action/ingredian/ingrediant.action";
import { BreadcrumbSeparator } from"@/components/ui/breadcrumb";

interface ViewIngredientPageProps {
 params: Promise<{
 id: string;
 }>;
}

export default async function ViewIngredientPage({
 params,
}: ViewIngredientPageProps) {
 const { id } = await params;
 const ingredient = await getIngredientById(id);

 if (!ingredient) {
 notFound();
 }

 const getSafetyLevelColor = (level: string) => {
 switch (level) {
 case"SAFE":
 return"bg-green-100 text-green-800";
 case"MODERATE":
 return"bg-yellow-100 text-yellow-800";
 case"RESTRICTED":
 return"bg-orange-100 text-orange-800";
 default:
 return"bg-gray-100 text-gray-800";
 }
 };

 return (
 <div className="space-y-6">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center justify-between">
 <span>{ingredient.name}</span>
 <div className="flex gap-2">
 <Badge
 variant="secondary"
 className={getSafetyLevelColor(ingredient.safetyLevel)}
 >
 {ingredient.safetyLevel}
 </Badge>
 <Badge variant={ingredient.isActive ?"default":"secondary"}>
 {ingredient.isActive ?"Active":"Inactive"}
 </Badge>
 </div>
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-6">
 {ingredient.description && (
 <div>
 <h3 className="mb-2 font-semibold">Description</h3>
 <p className="text-muted-foreground">{ingredient.description}</p>
 </div>
 )}

 <div className="grid gap-6 md:grid-cols-2">
 {ingredient.benefits && (
 <div>
 <h3 className="mb-2 font-semibold">Benefits</h3>
 <p className="text-muted-foreground whitespace-pre-line">
 {ingredient.benefits}
 </p>
 </div>
 )}

 {ingredient.sideEffects && (
 <div>
 <h3 className="mb-2 font-semibold">Side Effects</h3>
 <p className="text-muted-foreground whitespace-pre-line">
 {ingredient.sideEffects}
 </p>
 </div>
 )}

 {ingredient.usage && (
 <div>
 <h3 className="mb-2 font-semibold">Usage Instructions</h3>
 <p className="text-muted-foreground whitespace-pre-line">
 {ingredient.usage}
 </p>
 </div>
 )}

 {ingredient.precautions && (
 <div>
 <h3 className="mb-2 font-semibold">Precautions</h3>
 <p className="text-muted-foreground whitespace-pre-line">
 {ingredient.precautions}
 </p>
 </div>
 )}
 </div>

 {ingredient.products && ingredient.products.length > 0 && (
 <div>
 <h3 className="mb-2 font-semibold">Used in Products</h3>
 <div className="flex flex-wrap gap-2">
 {ingredient?.products?.map((productIngredient: any) => (
 <Badge key={productIngredient.product?.id} variant="outline">
 {productIngredient.product?.name}
 </Badge>
 ))}
 </div>
 </div>
 )}

 <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
 {ingredient.createdAt && (
 <span>
 Created: {new Date(ingredient.createdAt).toLocaleDateString()}
 </span>
 )}
 {ingredient.updatedAt &&
 ingredient.updatedAt !== ingredient.createdAt && (
 <span>
 Updated: {new Date(ingredient.updatedAt).toLocaleDateString()}
 </span>
 )}
 </div>

 <div className="pt-6">
 <Link href="/admin/dashboard/ingredients">
 <Button variant="outline">
 <ArrowLeft className="mr-2 h-4 w-4"/>
 Back to Ingredients
 </Button>
 </Link>
 </div>
 </CardContent>
 </Card>
 </div>
 );
}
