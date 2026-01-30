"use server";
import { revalidatePath } from "next/cache";
import { makeApiCall } from "../apiClinet";
import { redirect } from "next/navigation";

export const createProduct = async (formData: FormData) => {
  try {
    console.log("📤 Creating product with FormData");
    const result = await makeApiCall<any>("/product", {
      method: "POST",
      body: formData,
    });
    revalidatePath("/", "layout");
    console.log("product", result);
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};

export const updateProduct = async (id: string, formData: FormData) => {
  const productInfo = Object.fromEntries(formData.entries());

  const modify = {
    ...productInfo,
    thumbleImage: productInfo.thumbleImage
      ? JSON.parse(productInfo.thumbleImage as string)
      : [],
  };

  console.log("Updating product:", id, modify);

  try {
    const result = await makeApiCall<any>(`/product/${id}`, {
      method: "PATCH",
      body: JSON.stringify(modify),
    });

    if (result?.id) {
      revalidatePath("/products", "page");
      revalidatePath("/", "layout");
      redirect("/products");
    }

    return result;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};
export const getAllProducts = async (queryString: string) => {
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

    const result = await makeApiCall<any>(`/product?${builtQueryString}`, {
      method: "GET",
    });
    console.log(result, "Server Result");

    return result;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const result = await makeApiCall<any>(`/product/slug/${slug}`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw new Error("Failed to fetch product by slug");
  }
};

export const getProductByBrand = async (brandId: string) => {
  try {
    const result = await makeApiCall<any>(`/product/brand/${brandId}`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    throw new Error("Failed to fetch products by brand");
  }
};

export const getProductBySkintype = async (
  queryString: string,
  skintypeId: string,
) => {
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

    const result = await makeApiCall<any>(
      `/product/skintype/${skintypeId}${builtQueryString}`,
      {
        method: "GET",
      },
    );

    return result;
  } catch (error) {
    console.error("Error fetching products by skintype:", error);
    throw new Error("Failed to fetch products by skintype");
  }
};

export const getProductBySkinConcern = async (
  query: string,
  skinConcernId: string,
) => {
  try {
    const searchParams = new URLSearchParams(query);
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

    const result = await makeApiCall<any>(
      `/product/skinconcern/${skinConcernId}${builtQueryString}`,
      {
        method: "GET",
      },
    );

    return result;
  } catch (error) {
    console.error("Error fetching products by skin concern:", error);
    throw new Error("Failed to fetch products by skin concern");
  }
};

export const getProductById = async (id: string) => {
  try {
    const result = await makeApiCall<any>(`/product/${id}`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product by ID");
  }
};

export const getAllProductByCategory = async (
  queryString: string,
  categoryId: string,
) => {
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

    const result = await makeApiCall<any>(
      `/product/category/${categoryId}?${builtQueryString}`,
      {
        method: "GET",
        next: { revalidate: 60 },
      },
    );

    return result;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Failed to fetch products by category");
  }
};

export const deleteProduct = async (id: string) => {
  console.log("Deleting product:", id);

  try {
    const result = await makeApiCall<any>(`/product/${id}`, {
      method: "DELETE",
    });
    const isSuccess =
      result?.success === true ||
      result?.statusCode === 200 ||
      Boolean(result?.id);

    if (isSuccess) {
      revalidatePath("/admin/dashboard/products", "page");
      return { success: true };
    }

    return {
      success: false,
      message: result?.message || "Failed to delete product",
      result,
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};
