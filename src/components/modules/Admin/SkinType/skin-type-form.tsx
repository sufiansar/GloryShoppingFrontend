"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { ProductSelector } from "./product-selector";
import { getAllProducts } from "@/action/product/product.action";
import { toast } from "sonner";
import {
  createSkinType,
  getSkinTypeByID,
  updateSkinType,
} from "@/action/skinType/skin.action";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  productIds: z.array(z.string()),
});

interface SkinTypeFormProps {
  skinTypeId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SkinTypeForm({
  skinTypeId,
  onSuccess,
  onCancel,
}: SkinTypeFormProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const isEditing = !!skinTypeId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      productIds: [],
    },
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        const result = await getAllProducts("?limit=100");
        setProducts(result.data || []);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch skin type data if editing
  useEffect(() => {
    if (skinTypeId) {
      const fetchSkinType = async () => {
        try {
          setIsLoading(true);
          const result = (await getSkinTypeByID(skinTypeId)) as {
            name: string;
            products: Array<{ id: string }>;
          } | null;
          if (result) {
            form.reset({
              name: result?.name,
              productIds: result.products?.map((p: any) => p.id) || [],
            });
          }
        } catch (error) {
          toast.error("Failed to load skin type data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSkinType();
    }
  }, [skinTypeId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      if (isEditing) {
        await updateSkinType(skinTypeId as string, values as any);
        toast.success("Skin type updated successfully");
      } else {
        const result = (await createSkinType(values as any)) as { id?: string } | null;
        if (result?.id !== undefined) {
          form.reset();
          toast.success("Skin type created successfully");
        } else {
          toast.error("Failed to create skin type");
        }
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} skin type`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skin Type Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Oily, Dry, Combination" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="productIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Associated Products</FormLabel>
              <FormControl>
                <ProductSelector
                  products={products}
                  selectedProducts={field.value}
                  onSelectionChange={field.onChange}
                  isLoading={isProductsLoading}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-gray-500">
                Select products that are suitable for this skin type
              </p>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Skin Type" : "Create Skin Type"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
