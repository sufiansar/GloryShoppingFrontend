"use server";

import { CheckoutInput, OrderResponse } from "@/types/checkout.interface";
import { makeApiCall } from "../apiClinet";

const ORDER_BASE = "/order";

export const createOrder = async (payload: CheckoutInput) => {
  try {
    const result = await makeApiCall<OrderResponse>(ORDER_BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getAllOrders = async (queryString: string) => {
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
    const result = await makeApiCall<any>(`${ORDER_BASE}?${builtQueryString}`, {
      method: "GET",
    });

    // Normalize response shape to { data: IOrder[], pagination: {...} }
    // Some backend responses wrap payload in `data.data` and `data.meta`.
    if (!result) return result;

    // If the API already returned the normalized shape, return as-is
    if (Array.isArray(result.data)) {
      return {
        data: result.data,
        pagination: result.pagination ||
          result.meta || {
            page: 1,
            limit: 10,
            total: result.data.length || 0,
            totalPages: 1,
          },
      } as any;
    }

    // Handle nested shape: { data: { data: [...], meta: {...} }, ... }
    if (result.data && Array.isArray(result.data.data)) {
      const items = result.data.data;
      const meta = result.data.meta || result.meta || {};
      return {
        data: items,
        pagination: {
          page: meta.page || 1,
          limit: meta.limit || 10,
          total: meta.total || 0,
          totalPages: meta.totalPages || meta.totalPage || 0,
        },
      } as any;
    }

    // Fallback: return original result
    return result;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  try {
    return await makeApiCall<OrderResponse>(`${ORDER_BASE}/${id}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching order by id:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    return await makeApiCall<OrderResponse>(`${ORDER_BASE}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const cancelOrder = async (id: string) => {
  try {
    return await makeApiCall<OrderResponse>(`${ORDER_BASE}/cancel/${id}`, {
      method: "PATCH",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};
