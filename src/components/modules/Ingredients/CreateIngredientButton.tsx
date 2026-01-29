"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateIngredientButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/admin/dashboard/ingredients/create")}>
      <Plus className="mr-2 h-4 w-4" />
      Add Ingredient
    </Button>
  );
}
