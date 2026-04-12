"use server";

import { makeApiCall } from "../apiClient";

export const getCart = async () => {
  try {
    const result = await makeApiCall<any>("/cart", {
      method: "GET",
      cache: "no-store",
    });

    console.log("[getCart] API Response:", result);
    return result;
  } catch (error) {
    console.error("[getCart] Error fetching cart:", error);
    return { success: false, data: { items: [], totalItems: 0 } };
  }
};

export const getCartCount = async () => {
  try {
    const result = await makeApiCall<any>("/cart/count", {
      method: "GET",
      cache: "no-store",
    });

    return result;
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return { data: { totalItems: 0 } };
  }
};

export const addToCart = async ({
  productId,
  quantity = 1,
}: { productId: string, quantity?: number }) => {
  try {
    const result = await makeApiCall<any>("/cart", {
      method: "POST",
      body: {
        productId,
        quantity,
      },
    });

    return result;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const updateCartItem = async ({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) => {
  try {
    const result = await makeApiCall<any>("/cart", {
      method: "PATCH",
      body: {
        productId,
        quantity,
      },
    });

    return result;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (productId: string) => {
  try {
    const result = await makeApiCall<any>(`/cart/${productId}`, {
      method: "DELETE",
    });

    return result;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};
