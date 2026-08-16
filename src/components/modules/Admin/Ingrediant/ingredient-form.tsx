//"use client";

// import React, { useState, useEffect } from"react";
// import { useForm } from"react-hook-form";
// import { zodResolver } from"@hookform/resolvers/zod";
// import * as z from"zod";
// import { Loader2 } from"lucide-react";
// import { Button } from"@/components/ui/button";
// import {
// Form,
// FormControl,
// FormField,
// FormItem,
// FormLabel,
// FormMessage,
// } from"@/components/ui/form";
// import { Input } from"@/components/ui/input";
// import { Separator } from"@/components/ui/separator";

// import { ProductSelector } from"../SkinType/product-selector";
// import { getAllProducts } from"@/action/product/product.action";
// import { toast } from"sonner";
// import {
// createIngreadtAction,
// getIngredientById,
// updateIngredient,
// joinIngredientsToProduct,
// } from"@/action/ingredian/ingrediant.action";

// const formSchema = z.object({
// name: z.string().min(2, {
// message:"Name must be at least 2 characters.",
// }),
// productIds: z.array(z.string()),
// });

// interface IngredientFormProps {
// ingredientId?: string;
// onSuccess?: () => void;
// onCancel?: () => void;
// }

// export function IngredientForm({
// ingredientId,
// onSuccess,
// onCancel,
// }: IngredientFormProps) {
// const [products, setProducts] = useState<any[]>([]);
// const [isLoading, setIsLoading] = useState(false);
// const [isProductsLoading, setIsProductsLoading] = useState(true);
// const isEditing = !!ingredientId;

// const form = useForm<z.infer<typeof formSchema>>({
// resolver: zodResolver(formSchema),
// defaultValues: {
// name:"",
// productIds: [],
// },
// });

// // Fetch products
// useEffect(() => {
// const fetchProducts = async () => {
// try {
// setIsProductsLoading(true);
// const result = await getAllProducts("?limit=100");
// setProducts(result.data || []);
// } catch (error) {
// toast.error("Failed to load products");
// } finally {
// setIsProductsLoading(false);
// }
// };

// fetchProducts();
// }, []);

// // Fetch ingredient data if editing
// useEffect(() => {
// if (ingredientId) {
// const fetchIngredient = async () => {
// try {
// setIsLoading(true);
// const result = (await getIngredientById(ingredientId)) as {
// name: string;
// products: Array<{ id: string }>;
// } | null;
// if (result) {
// form.reset({
// name: result?.name,
// productIds: result.products?.map((p: any) => p.id) || [],
// });
// }
// } catch (error) {
// toast.error("Failed to load ingredient data");
// } finally {
// setIsLoading(false);
// }
// };

// fetchIngredient();
// }
// }, [ingredientId, form]);

// async function onSubmit(values: z.infer<typeof formSchema>) {
// try {
// setIsLoading(true);

// console.log("📝 Form values received:", values);

// // Validate name is not empty
// if (!values.name || values.name.trim() ==="") {
// toast.error("Ingredient name is required");
// setIsLoading(false);
// return;
// }

// // Only send name to backend
// const dataToSend = { name: values.name.trim() };

// console.log("📤 Submitting ingredient:", dataToSend);

// let createdIngredientId = ingredientId;

// if (isEditing) {
// await updateIngredient(ingredientId as string, dataToSend);
// toast.success("Ingredient updated successfully");
// } else {
// const result = (await createIngreadtAction(dataToSend)) as {
// id?: string;
// } | null;
// if (result?.id !== undefined) {
// createdIngredientId = result.id;
// toast.success("Ingredient created successfully");
// } else {
// toast.error("Failed to create ingredient");
// setIsLoading(false);
// return;
// }
// }

// // Associate products with the ingredient
// if (
// values.productIds &&
// values.productIds.length > 0 &&
// createdIngredientId
// ) {
// try {
// console.log(
//"📝 [Form] Starting product association for",
// values.productIds.length,
//"products",
// );
// await joinIngredientsToProduct(
// createdIngredientId,
// values.productIds,
// );
// toast.success("Products associated successfully");
// } catch (error) {
// console.error("❌ [Form] Failed to associate products:", error);
// toast.error("Ingredient created but failed to associate products");
// }
// }

// form.reset();
// onSuccess?.();
// } catch (error) {
// console.error("❌ Submit error:", error);
// toast.error(`Failed to ${isEditing ?"update":"create"} ingredient`);
// } finally {
// setIsLoading(false);
// }
// }

// return (
// <Form {...form}>
// <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
// <FormField
// control={form.control}
// name="name"
// render={({ field }) => (
// <FormItem>
// <FormLabel>Ingredient Name</FormLabel>
// <FormControl>
// <Input
// placeholder="e.g., Vitamin C, Retinol, Hyaluronic Acid"
// {...field}
// />
// </FormControl>
// <FormMessage />
// </FormItem>
// )}
// />

// <Separator />

// <FormField
// control={form.control}
// name="productIds"
// render={({ field }) => (
// <FormItem>
// <FormLabel>Associated Products</FormLabel>
// <FormControl>
// <ProductSelector
// products={products}
// selectedProducts={field.value}
// onSelectionChange={field.onChange}
// isLoading={isProductsLoading}
// disabled={isLoading}
// />
// </FormControl>
// <FormMessage />
// <p className="text-sm text-gray-500">
// Select products that contain this ingredient
// </p>
// </FormItem>
// )}
// />

// <div className="flex justify-end gap-3 pt-4">
// {onCancel && (
// <Button
// type="button"
// variant="outline"
// onClick={onCancel}
// disabled={isLoading}
// >
// Cancel
// </Button>
// )}
// <Button type="submit"disabled={isLoading}>
// {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
// {isEditing ?"Update Ingredient":"Create Ingredient"}
// </Button>
// </div>
// </form>
// </Form>
// );
// }
