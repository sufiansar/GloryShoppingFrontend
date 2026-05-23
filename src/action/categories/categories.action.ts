"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { makeApiCall } from "../apiClient";

export const createCategoriesAction = async (categoryData: FormData) => {
  try {
    // Backend expects: form-data with 'data' (JSON string) + 'images' (files)
    const name = categoryData.get("name") as string;
    const description = categoryData.get("description") as string | null;

    const payload = new FormData();
    payload.append("data", JSON.stringify({ name, description: description || "" }));

    // Attach all image files
    const imageEntries = categoryData.getAll("images");
    imageEntries.forEach((img) => {
      if (img instanceof File && img.size > 0) {
        payload.append("images", img);
      }
    });

    const result = await makeApiCall<any>("/categories", {
      method: "POST",
      body: payload,
    });

    if (result?.success || result?.data?.id) {
      revalidatePath("/categorys", "page");
      revalidatePath("/", "layout");
      redirect("/admin/dashboard/categories-management");
    }

    return result;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategoriesAction = async (
  id: string,
  categoryData: FormData,
) => {
  try {
    // Backend expects: form-data with 'data' (JSON string) + optional 'images' (files)
    const name = categoryData.get("name") as string;
    const description = categoryData.get("description") as string | null;

    const payload = new FormData();
    payload.append("data", JSON.stringify({ name, description: description || "" }));

    // Attach any new image files
    const imageEntries = categoryData.getAll("images");
    imageEntries.forEach((img) => {
      if (img instanceof File && img.size > 0) {
        payload.append("images", img);
      }
    });

    console.log("Updating category:", id, { name, description });

    const result = await makeApiCall<any>(`/categories/${id}`, {
      method: "PATCH",
      body: payload,
    });

    if (result?.success || result?.data?.id) {
      revalidatePath("/categorys", "page");
      revalidatePath("/", "layout");
    }

    return result;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

export const deleteCategoriesAction = async (id: string) => {
  console.log("Deleting category:", id);

  try {
    const result = await makeApiCall<any>(`/category/${id}`, {
      method: "DELETE",
    });

    if (result?.success || result?.data?.id) {
      revalidatePath("/categorys", "page");
      revalidatePath("/", "layout");
      // redirect("/admin/dashboard/categories-management");
    }

    return result;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};

export const fetchAllCategories = async (queryString?: string) => {
  try {
    const searchParams = new URLSearchParams(queryString || "");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const searchTerm = searchParams.get("searchTerm") || "";

    let builtQueryString = "";
    if (searchTerm) {
      builtQueryString = `page=${page}&limit=${limit}&searchTerm=${encodeURIComponent(
        searchTerm,
      )}`;
    } else {
      builtQueryString = `page=${page}&limit=${limit}`;
    }
    const result = await makeApiCall<any>(`/category?${builtQueryString}`, {
      method: "GET",
      next: { revalidate: 60 },
    });

    console.log("[fetchAllCategories] API Result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [], message: "Failed to fetch categories" };
  }
};

export const getAllProductByCategoryBySlug = async (
  slug: string,
  queryString?: string,
) => {
  try {
    const searchParams = new URLSearchParams(queryString || "");
    if (!searchParams.get("page")) searchParams.set("page", "1");
    if (!searchParams.get("limit")) searchParams.set("limit", "10");
    const builtQueryString = searchParams.toString();
    const result = await makeApiCall<any>(
      `/category/slug/${slug}/products?${builtQueryString}`,
      {
        method: "GET",
      },
    );

    // Return full response so component can access { success, data, ... }
    return result;
  } catch (error) {
    console.error("Error fetching products by category slug:", error);
    throw new Error("Failed to fetch products");
  }
};

export const getCategoryBySlug = async (slug: string) => {
  try {
    const result = await makeApiCall<any>(`/category/slug/${slug}`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    throw new Error("Failed to fetch category");
  }
};

export const getProductByCategory = async (
  categoryId: string,
  queryString?: string,
) => {
  try {
    const searchParams = new URLSearchParams(queryString || "");
    if (!searchParams.get("page")) searchParams.set("page", "1");
    if (!searchParams.get("limit")) searchParams.set("limit", "10");
    const builtQueryString = searchParams.toString();
    const result = await makeApiCall<any>(
      `/category/${categoryId}/products?${builtQueryString}`,
      {
        method: "GET",
      },
    );

    return result;
  } catch (error) {
    console.error("Error fetching products by category ID:", error);
    throw new Error("Failed to fetch products");
  }
};
export const fetchCategoryById = async (id: string) => {
  try {
    const result = await makeApiCall<any>(`/category/${id}`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw new Error("Failed to fetch category");
  }
};
