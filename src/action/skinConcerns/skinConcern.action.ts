"use server";
import { revalidatePath } from "next/cache";
import { makeApiCall } from "../apiClient";

export const createSkinConcern = async (payload: any) => {
  try {
    const result = await makeApiCall<any>("/skin/skin-concerns/", {
      method: "POST",
      body: payload,
    });

    if (result?.data?.id || result?.success) {
      revalidatePath("/admin/dashboard/skin-concerns", "page");
    }

    return result;
  } catch (error) {
    console.error("Error creating skin concern:", error);
    throw error;
  }
};

export const updateSkinConcern = async (id: string, payload: any) => {
  try {
    const result = await makeApiCall<any>(`/skin/skin-concerns/${id}`, {
      method: "PATCH",
      body: payload,
    });

    if (result?.data?.id || result?.success) {
      revalidatePath("/admin/dashboard/skin-concerns", "page");
    }

    return result;
  } catch (error) {
    console.error("Error updating skin concern:", error);
    throw new Error("Failed to update skin concern");
  }
};

export const getAllSkinConcerns = async (queryString: string) => {
  try {
    const searchParams = new URLSearchParams(queryString);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const searchTerm = searchParams.get("searchTerm") || "";
    let builtQueryString = `?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (searchTerm) {
      builtQueryString = `?page=${page}&limit=${limit}&searchTerm=${encodeURIComponent(
        searchTerm,
      )}`;
    } else {
      builtQueryString = `?page=${page}&limit=${limit}`;
    }

    const result = await makeApiCall<any>(`/skin/skin-concerns${builtQueryString}`);
    return result;
  } catch (error) {
    console.error("Failed to fetch skin concerns:", error);
    throw new Error("Failed to fetch skin concerns");
  }
};

export const getSkinConcernByID = async (id: string) => {
  try {
    const result = await makeApiCall(`/skin/skin-concerns/${id}`, {
      method: "GET",
    });
    return result;
  } catch (err) {
    console.error("Failed to fetch skin concern by ID:", err);
    throw new Error("Failed to fetch skin concern by ID");
  }
};

export const deleteSkinConcern = async (id: string) => {
  try {
    const result = await makeApiCall<any>(`/skin/skin-concerns/${id}`, {
      method: "DELETE",
    });

    if (result) {
      revalidatePath("/admin/dashboard/skin-concerns", "page");
    }

    return result;
  } catch (error) {
    console.error("Error deleting skin concern:", error);
    throw new Error("Failed to delete skin concern");
  }
};

export const addToProducts = async (
  skinConcernId: string,
  skinTypeId: string,
  productIds: string[],
) => {
  try {
    const results = [];
    for (const productId of productIds) {
      const payload = {
        productId,
        skinConcernIds: [skinConcernId],
        skinTypeIds: [skinTypeId],
      };
      const res = await makeApiCall<any>(`/skin/addProductSkin`, {
        method: "POST",
        body: payload as any,
      });
      results.push(res);
    }
    return results;
  } catch (error) {
    console.error("Failed to add skin concern to products:", error);
    throw new Error("Failed to add skin concern to products");
  }
};
