"use server";
import { revalidatePath } from "next/cache";
import { makeApiCall } from "../apiClient";
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
  try {
    // Get the entries
    const entries = Object.fromEntries(formData.entries());

    // Build the variant data with proper types
    const variantData: {
      size: string;
      stock: number;
      lowStockThreshold: number;
      images?: any[];
    } = {
      size: entries.size as string,
      stock: parseInt(entries.stock as string),
      lowStockThreshold: parseInt(entries.lowStockThreshold as string),
    };

    // Check if there are image files to upload
    const imageEntries = formData.getAll("images");
    const hasFiles = imageEntries.some((entry) => entry instanceof File);

    // Get existing images to preserve
    const existingImagesStr = entries.existingImages as string;
    const existingImages = existingImagesStr
      ? JSON.parse(existingImagesStr)
      : [];

    console.log("Updating variant:", id, {
      variantData,
      hasFiles,
      existingImages,
    });

    // If there are files, use FormData for multipart upload
    if (hasFiles) {
      const uploadFormData = new FormData();
      // Append fields as strings (FormData converts everything to strings anyway)
      uploadFormData.append("size", variantData.size);
      uploadFormData.append("stock", variantData.stock.toString());
      uploadFormData.append(
        "lowStockThreshold",
        variantData.lowStockThreshold.toString(),
      );

      // Append only new image files
      imageEntries.forEach((file) => {
        if (file instanceof File) {
          uploadFormData.append("images", file);
        }
      });

      // Append existing images to preserve
      if (existingImages.length > 0) {
        uploadFormData.append("existingImages", JSON.stringify(existingImages));
      }

      const result = await makeApiCall<any>(`/variant/${id}`, {
        method: "PATCH",
        body: uploadFormData,
      });

      if (result?.id || result?.success) {
        revalidatePath("/variants", "page");
        revalidatePath("/admin/dashboard/variants", "page");
      }

      return result;
    } else {
      // If no new files, just update with existing images
      variantData.images = existingImages;

      const result = await makeApiCall<any>(`/variant/${id}`, {
        method: "PATCH",
        body: JSON.stringify(variantData),
      });

      if (result?.id || result?.success) {
        revalidatePath("/variants", "page");
        revalidatePath("/admin/dashboard/variants", "page");
      }

      return result;
    }
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

export const getVariantByID = async (id: string) => {
  try {
    const result = await makeApiCall<any>(`/variant/${id}`, {
      method: "GET",
    });
    // if (result?.success) {
    //   revalidatePath("/admin/dashboard/variants", "page");
    // }
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
