"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { makeApiCall } from "../apiClinet";

export const createIngreadtAction = async (data: any) => {
  try {
    const result = await makeApiCall<any>("/ingredient", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (result?.id) {
      revalidatePath("/admin/dashboard/ingredients", "page");
      redirect("/admin/dashboard/ingredients");
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result?.id) {
      revalidatePath("/admin/dashboard/ingredients", "page");
      redirect("/admin/dashboard/ingredients");
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

    if (result?.id) {
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
  productId: string,
  ingredientIds: string[],
) => {
  try {
    const result = await makeApiCall<any>(`/product/${productId}/ingredients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredientIds }),
    });

    if (result?.id) {
      revalidatePath(`/product/${productId}`, "page");
      return result;
    }

    throw new Error("Failed to join ingredients to product");
  } catch (error) {
    console.error("Error joining ingredients to product:", error);
    throw new Error("Failed to join ingredients to product");
  }
};
