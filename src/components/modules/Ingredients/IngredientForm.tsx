"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IIngredient } from "@/types/ingrediant.interface";
import {
  createIngreadtAction,
  updateIngredient,
} from "@/action/ingredian/ingrediant.action";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  benefits: z.string().optional(),
  sideEffects: z.string().optional(),
  usage: z.string().optional(),
  precautions: z.string().optional(),
  isActive: z.boolean(),
  safetyLevel: z.enum(["SAFE", "MODERATE", "RESTRICTED"]),
});

type FormValues = z.infer<typeof formSchema>;

interface IngredientFormProps {
  initialData?: IIngredient;
  isEdit?: boolean;
}

export default function IngredientForm({
  initialData,
  isEdit = false,
}: IngredientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      benefits: "",
      sideEffects: "",
      usage: "",
      precautions: "",
      isActive: true,
      safetyLevel: "SAFE",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData?.id) {
        await updateIngredient(initialData.id, data);
        toast.success("Ingredient updated successfully");
        router.push("/admin/dashboard/ingredients");
      } else {
        const result = await createIngreadtAction(data);
        toast.success("Ingredient created successfully");
        form.reset();
        router.push(`/admin/dashboard/ingredients/join`);
      }
    } catch (error) {
      toast.error("Failed to save ingredient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ingredient name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Safety Level *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select safety level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SAFE">Safe</SelectItem>
                    <SelectItem value="MODERATE">Moderate</SelectItem>
                    <SelectItem value="CAUTION">Caution</SelectItem>
                    <SelectItem value="UNSAFE">Unsafe</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Deactivated ingredients won't appear in product selections
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter ingredient description"
                  className="min-h-25"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter benefits"
                    className="min-h-25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sideEffects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Side Effects</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter side effects"
                    className="min-h-25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter usage instructions"
                    className="min-h-25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precautions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precautions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter precautions"
                    className="min-h-25"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? "Update Ingredient" : "Create Ingredient"}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
