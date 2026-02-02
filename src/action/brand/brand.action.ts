"use server";
import { revalidatePath } from "next/cache";
import { makeApiCall } from "../apiClinet";
import {
  getBrandInfoFromSlug,
  getBrandNameFromSlug,
} from "@/components/utility/brand-slug-mapping";

export const createBrand = async (formdata: FormData) => {
  try {
    const result = await makeApiCall<any>("/brand", {
      method: "POST",
      body: formdata,
    });

    if (result?.id) {
      revalidatePath("/brand", "page");
      revalidatePath("/", "layout");
      // redirect("/brands");
    }

    return result;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

export const updateBrand = async (id: string, formdata: FormData) => {
  try {
    const modifyData = Object.fromEntries(formdata.entries());

    const modify = {
      ...modifyData,
      logoUrl: modifyData.logoUrl
        ? JSON.parse(modifyData.logoUrl as string)
        : "",
    };
    const result = await makeApiCall<any>(`/brand/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modify),
    });

    if (result?.id) {
      revalidatePath("/brand", "page");
      revalidatePath("/", "layout");
      // redirect("/brands");
    }

    return result;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
};

export const getAllBrand = async (queryString: string) => {
  try {
    const searchParams = new URLSearchParams(queryString);
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
    const result = await makeApiCall<any>(`/brand?${builtQueryString}`, {
      method: "GET",
    });
    return result;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error("Failed to fetch brands");
  }
};

// Get brand information by slug (frontend only)
export const getBrandBySlug = async (slug: string) => {
  try {
    // First, get the brand info from our mapping
    const brandInfo = getBrandInfoFromSlug(slug);

    if (!brandInfo) {
      return {
        id: null,
        name: getBrandNameFromSlug(slug),
        slug: slug,
      };
    }

    if (!brandInfo.id) {
      const allBrands = await getAllBrand("");
      const matchingBrand = allBrands.find(
        (b: any) => b.name.toLowerCase() === brandInfo.name.toLowerCase(),
      );

      if (matchingBrand) {
        brandInfo.id = matchingBrand.id;
        brandInfo.logo = matchingBrand.logo;
      }
    }

    return {
      id: brandInfo.id,
      name: brandInfo.name,
      slug: slug,
      logo: brandInfo.logo,
    };
  } catch (error) {
    console.error("Error getting brand by slug:", error);
    return {
      id: null,
      name: getBrandNameFromSlug(slug),
      slug: slug,
    };
  }
};

export const getBrandById = async (id: string) => {
  const result = await makeApiCall<any>(`/brand/${id}`, {
    method: "GET",
  });
  return result;
};

export const deleteBrand = async (id: string) => {
  const result = await makeApiCall<any>(`/brand/${id}`, {
    method: "DELETE",
  });

  if (result) {
    revalidatePath("/brand", "page");
    revalidatePath("/", "layout");
  }

  return result;
};
