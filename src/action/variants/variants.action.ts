"use server";
import { revalidatePath } from "next/cache";
import { makeApiCall } from "../apiClinet";
import { redirect } from "next/navigation";

export const createProductVariant = async (formData: FormData) => {
  try {
    const result = await makeApiCall<any>("/variant", {
      method: "POST",
      body: formData,
    });

    if (result?.id) {
      revalidatePath("/variants", "page");
      //   redirect("/variants");
    }

    return result;
  } catch (error) {}
};

export const updateProductVariant = async (id: string, formData: FormData) => {
  const variantInfo = Object.fromEntries(formData.entries());

  const modify = {
    ...variantInfo,
    images: variantInfo.images ? JSON.parse(variantInfo.images as string) : [],
  };

  console.log("Updating variant:", id, modify);

  try {
    const result = await makeApiCall<any>(`/variant/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modify),
    });

    if (result?.id) {
      revalidatePath("/variants", "page");
      //   redirect("/variants");
    }

    return result;
  } catch (error) {
    console.error("Error updating variant:", error);
    throw new Error("Failed to update variant");
  }
};

export const getAllVariants = async (queryString: string) => {
  try {
    const searchParams = new URLSearchParams(queryString);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const searchTerm = searchParams.get("searchTerm") || "";
    let builtQueryString = `?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (searchTerm) {
      builtQueryString = `page=${page}&limit=${limit}&searchTerm=${encodeURIComponent(
        searchTerm,
      )}`;
    } else {
      builtQueryString = `page=${page}&limit=${limit}`;
    }

    const result = await makeApiCall<any>(`/variant?${builtQueryString}`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching variants:", error);
    throw new Error("Failed to fetch variants");
  }
};

export const getVariantBySKU = async (sku: string) => {
  try {
    const result = await makeApiCall<any>(`/variant/${sku}`, {
      method: "GET",
    });
    if (result?.success) {
      revalidatePath("/variants", "page");
    }
    return result;
  } catch (error) {
    console.log("Error", error);
  }
};

export const deleteVariant = async (id: string) => {
  console.log("Deleting variant:", id);

  try {
    const result = await makeApiCall<any>(`/variant/${id}`, {
      method: "DELETE",
    });

    if (result?.success) {
      revalidatePath("/variants", "page");
      return { success: true };
    }

    return result;
  } catch (error) {
    console.error("Error deleting variant:", error);
    throw new Error("Failed to delete variant");
  }
};
