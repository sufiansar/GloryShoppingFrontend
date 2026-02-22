"use server";
import { revalidatePath } from "next/cache";
import { makeApiCall } from "../apiClinet";

export const createReview = async (data: any) => {
  try {
    const result = await makeApiCall<any>("/review", {
      method: "POST",
      body: data as any,
    });

    const createdReview = result?.data ?? result;

    if (createdReview?.id) {
      revalidatePath("/admin/dashboard/reviews", "page");
    }

    return createdReview;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Failed to create review");
  }
};

export const getReviewsByProduct = async (productId: string) => {
  try {
    const result = await makeApiCall<any>(
      `/review?productId=${encodeURIComponent(productId)}`,
      {
        method: "GET",
      },
    );
    const reviews = (result?.data ?? result ?? []) as Array<any>;
    return reviews.filter((review) => review?.productId === productId);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
};

export const updateReview = async (id: string, data: any) => {
  try {
    const result = await makeApiCall<any>(`/review/${id}`, {
      method: "PATCH",
      body: data as any,
    });

    if (result?.id) {
      revalidatePath("/admin/dashboard/reviews", "page");
    }

    return result;
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error("Failed to update review");
  }
};

export const deleteReview = async (id: string) => {
  try {
    const result = await makeApiCall<any>(`/review/${id}`, {
      method: "DELETE",
    });

    if (result?.id) {
      revalidatePath("/admin/dashboard/reviews", "page");
    }

    return result;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
};

export const getAllReviews = async (queryString: string) => {
  try {
    const searchParams = new URLSearchParams(queryString);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    let builtQueryString = `?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

    const result = await makeApiCall<any>(`/review${builtQueryString}`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
};

export const getReviewById = async (id: string) => {
  try {
    const result = await makeApiCall<any>(`/review/${id}`, {
      method: "GET",
    });
    return result?.data ?? result;
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    throw new Error("Failed to fetch review by ID");
  }
};
