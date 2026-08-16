"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { makeApiCall } from "../apiClient";

export const createIngreadtAction = async (data: any) => {
  try {
    const result = await makeApiCall<any>("/ingredient", {
      method: "POST",
      body: data as any,
    });

    if (result?.data?.id || result?.success) {
      revalidatePath("/admin/dashboard/ingredients", "page");
    }

    return result;
  } catch (error) {
    console.error("Error creating ingredient:", error);
    throw new Error("Failed to create ingredient");
  }
};

export const updateIngredient = async (id: string, data: any) => {
  try {
    const result = await makeApiCall<any>(`/ingredient/${id}`, {
      method: "PATCH",
      body: data as any,
    });

    if (result?.data?.id || result?.success) {
      revalidatePath("/admin/dashboard/ingredients", "page");
    }

    return result;
  } catch (error) {
    console.error("Error updating ingredient:", error);
    throw new Error("Failed to update ingredient");
  }
};

export const getAllIngredients = async (query: string) => {
  try {
    const result = await makeApiCall<any>(`/ingredient?${query}`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw new Error("Failed to fetch ingredients");
  }
};

export const deleteIngredient = async (id: string) => {
  try {
    const result = await makeApiCall<any>(`/ingredient/${id}`, {
      method: "DELETE",
    });

    if (result?.data?.id || result?.success) {
      revalidatePath("/admin/dashboard/ingredients", "page");
    }

    return result;
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    throw new Error("Failed to delete ingredient");
  }
};

export const getIngredientById = async (id: string) => {
  try {
    return await makeApiCall<any>(`/ingredient/${id}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching ingredient by ID:", error);
    throw new Error("Failed to fetch ingredient");
  }
};

export const joinIngredientsToProduct = async (
  ingredientIds: string | string[],
  productId: string,
) => {
  try {
    // Convert to array if string
    const ids = Array.isArray(ingredientIds) ? ingredientIds : [ingredientIds];

    console.log("📝 [joinIngredientsToProduct] Raw params:", {
      ingredientIds,
      productId,
    });

    // Filter out null/undefined values
    const validIngredientIds = ids.filter(
      (id): id is string => id !== null && id !== undefined && id.trim() !== "",
    );

    console.log("📝 [joinIngredientsToProduct] After filter:", {
      validIngredientIds,
    });

    if (!productId || productId.trim() === "") {
      throw new Error("Product ID is required");
    }

    if (!validIngredientIds.length) {
      console.error("❌ No valid ingredient IDs after filtering:", ids);
      throw new Error("At least one ingredient ID is required");
    }

    const payload = {
      ingredientIds: validIngredientIds,
      productId,
    };

    console.log("📤 [joinIngredientsToProduct] Payload:", payload);

    const res = await makeApiCall<any>(`/ingredient/join`, {
      method: "POST",
      body: payload as any,
    });

    console.log("✅ [joinIngredientsToProduct] Response:", res);
    return res;
  } catch (error) {
    console.error("Error joining ingredients to product:", error);
    throw new Error("Failed to join ingredients to product");
  }
};
