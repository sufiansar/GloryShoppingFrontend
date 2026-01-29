"use server";
import { makeApiCall } from "../apiClinet";

export const createSkinType = async (data: string) => {
  try {
    const result = await makeApiCall("/skin/skin-types", {
      method: "POST",
      body: data,
    });
    return result;
  } catch (error) {
    console.error("Failed to create skin type:", error);
    throw new Error("Failed to create skin type");
  }
};

export const updateSkinType = async (id: string, data: any) => {
  try {
    const res = await makeApiCall(`/skin/skin-types/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.error("Failed to update skin type:", error);
    throw new Error("Failed to update skin type");
  }
};

export const getAllSkinType = async (queryString: string) => {
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

    const result = await makeApiCall(`/skin/skin-types${builtQueryString}`);
    return result;
  } catch (error) {
    console.error("Failed to fetch skin types:", error);
    throw new Error("Failed to fetch skin types");
  }
};

export const getSkinTypeByID = async (id: string) => {
  try {
    const result = await makeApiCall(`/skin/skin-types/${id}`, {
      method: "GET",
    });
    return result;
  } catch (err) {
    console.error("Failed to get skin type:", err);
    throw new Error("Failed to get skin type");
  }
};

export const deleteSkinTypeByID = async (id: string) => {
  try {
    const result = await makeApiCall(`/skin/skin-types/${id}`, {
      method: "DELETE",
    });
    return result;
  } catch (err) {
    console.error("Failed to delete skin type:", err);
    throw new Error("Failed to delete skin type");
  }
};

export const joinSkinTypesToProducts = async () => {
  try {
    const result = await makeApiCall(`/skin/join-skintypes-to-products`, {
      method: "POST",
    });
    return result;
  } catch (err) {
    console.error("Failed to join skin types to products:", err);
    throw new Error("Failed to join skin types to products");
  }
};
