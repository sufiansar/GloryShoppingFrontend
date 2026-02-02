"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { makeApiCall } from "../apiClinet";

export const createSection = async (data: FormData) => {
  try {
    console.log("📤 Creating section with FormData");

    const result = await makeApiCall<any>("/section", {
      method: "POST",
      body: data,
    });
    console.log("section", result);
    if (result?.id) {
      revalidatePath("/sections", "page");
      revalidatePath("/", "layout");
      redirect("/sections");
    }

    return result;
  } catch (error) {
    console.error("Error creating section:", error);
    throw error;
  }
};

export const updateSection = async (id: string, data: FormData) => {
  const sectionInfo = Object.fromEntries(data.entries());

  const modify = {
    ...sectionInfo,
    images: sectionInfo.images ? JSON.parse(sectionInfo.images as string) : [],
    isVisible:
      sectionInfo.isVisible === "true" || sectionInfo.isVisible === "on",
  };

  console.log("Updating section:", id, modify);

  try {
    const result = await makeApiCall<any>(`/section/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modify),
    });

    if (result?.id) {
      revalidatePath("/sections", "page");
      revalidatePath("/", "layout");
      redirect("/sections");
    }

    return result;
  } catch (error) {
    console.error("Error updating section:", error);
    throw new Error("Failed to update section");
  }
};

export const deleteSection = async (id: string) => {
  console.log("Deleting section:", id);

  try {
    const result = await makeApiCall<any>(`/section/${id}`, {
      method: "DELETE",
    });

    if (result?.success) {
      revalidatePath("/sections", "page");
      revalidatePath("/", "layout");
      return { success: true };
    }

    return result;
  } catch (error) {
    console.error("Error deleting section:", error);
    throw new Error("Failed to delete section");
  }
};
export const getSections = async () => {
  try {
    return await makeApiCall<any>("/section", {
      method: "GET",
      next: { revalidate: false, tags: ["sections"] }, // ISR - only revalidate on-demand
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return { data: [] };
  }
};

export const getSectionById = async (id: string) => {
  try {
    return await makeApiCall<any>(`/section/${id}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error) {
    console.error("Error fetching section:", error);
    return null;
  }
};
