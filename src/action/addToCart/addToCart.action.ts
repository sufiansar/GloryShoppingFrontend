const API_BASE = process.env.NEXT_PUBLIC_BASE_API;

type AddToCartPayload = {
  productId: string;
  quantity?: number;
};

export const fetchWithSession = async <T>(
  path: string,
  init: RequestInit = {},
) => {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch (error) {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      data?.message || `Request failed with status ${res.status}`,
    );
  }

  return data as T;
};

export const getCart = async () => {
  try {
    const result = await fetchWithSession<any>("/cart", {
      method: "GET",
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
    const result = await fetchWithSession<any>("/cart/count", {
      method: "GET",
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
}: AddToCartPayload) => {
  try {
    const result = await fetchWithSession<any>("/cart", {
      method: "POST",
      body: JSON.stringify({
        productId,
        quantity,
      }),
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
    const result = await fetchWithSession<any>("/cart", {
      method: "PATCH",
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    return result;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (productId: string) => {
  try {
    const result = await fetchWithSession<any>(`/cart/${productId}`, {
      method: "DELETE",
    });

    return result;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};
