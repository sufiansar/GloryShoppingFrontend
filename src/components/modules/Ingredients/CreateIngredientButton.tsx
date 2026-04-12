"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateIngredientButton() {
  const router = useRouter();

  return (
    <Button 
      className="rounded-2xl h-12 px-8 bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none"
      onClick={() => router.push("/admin/dashboard/ingredients/create")}
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Ingredient
    </Button>
  );
}
