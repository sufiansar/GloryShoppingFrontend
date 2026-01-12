"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const createSection = async (data: FormData) => {
  const sectionInfo = Object.fromEntries(data.entries());

  const modify = {
    ...sectionInfo,
    type: sectionInfo.type as string,
    images: sectionInfo.images ? JSON.parse(sectionInfo.images as string) : [],
    isVisible:
      sectionInfo.isVisible === "true" || sectionInfo.isVisible === "on",
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/section`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modify),
    });

    const result = await res.json();

    if (result?.id) {
      revalidateTag("SECTION", "create-section"); // refresh cached section list
      redirect("/sections"); // go back to list
    }

    return result;
  } catch (error) {
    console.error("Error creating section:", error);
    throw new Error("Failed to create section");
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/section/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modify),
      }
    );

    const result = await res.json();

    if (result?.id) {
      revalidateTag("SECTION", "update-section");
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/section/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await res.json();

    if (result.success) {
      revalidateTag("SECTION", "delete-section");
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/section`, {
      next: { tags: ["SECTION"] },
    });

    return res.json();
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
};
export const getSectionById = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/section/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error fetching section:", error);
    return null;
  }
};
