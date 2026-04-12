"use server";
import { revalidatePath } from "next/cache";
import { makeApiCall } from "../apiClient";
import { toast } from "sonner";

export const createSkinType = async (data: any) => {
  try {
    console.log("🔹 createSkinType received raw data:", data);
    console.log("🔹 data.name:", data.name);
    console.log("🔹 typeof data:", typeof data);

    // If data is a JSON string, parse it
    let parsedData = data;
    if (typeof data === "string") {
      console.log("🔹 Data is a string, parsing JSON...");
      parsedData = JSON.parse(data);
    }

    console.log("🔹 Parsed data:", parsedData);

    // Ensure only name field is sent
    const sanitizedData: any = { name: parsedData.name };

    console.log("🔍 Creating skin type with sanitized data:", sanitizedData);

    if (!sanitizedData.name || sanitizedData.name.trim() === "") {
      throw new Error("Skin type name is required and cannot be empty");
    }

    const result: any = await makeApiCall("/skin/skin-types", {
      method: "POST",
      body: sanitizedData,
    });

    if (result?.id) {
      revalidatePath("/admin/dashboard/skin-types", "page");
    }

    return result;
  } catch (error) {
    console.error("Failed to create skin type:", error);
    throw error;
  }
};

export const updateSkinType = async (id: string, data: any) => {
  try {
    // Handle if data arrives as JSON string
    let parsedData = data;
    if (typeof data === "string") {
      console.log("🔹 Data is a string, parsing JSON...", data);
      parsedData = JSON.parse(data);
    }

    // Ensure only name field is sent
    const sanitizedData: any = { name: parsedData.name };

    console.log("🔍 Updating skin type with data:", sanitizedData);

    if (!sanitizedData.name || sanitizedData.name.trim() === "") {
      throw new Error("Skin type name is required and cannot be empty");
    }

    const res: any = await makeApiCall(`/skin/skin-types/${id}`, {
      method: "PATCH",
      body: sanitizedData,
    });

    if (res?.id) {
      revalidatePath("/admin/dashboard/skin-types", "page");
    }

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

    if (result) {
      revalidatePath("/admin/dashboard/skin-types", "page");
    }

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
