import { CheckoutInput, OrderResponse } from "@/types/checkout.interface";
import { fetchWithSession } from "../addToCart/addToCart.action";

const ORDER_BASE = "/order";

export const createOrder = async (payload: CheckoutInput) => {
  try {
    const result = await fetchWithSession<OrderResponse>(ORDER_BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    return await fetchWithSession<{ data: OrderResponse["data"][] }>(
      `${ORDER_BASE}`,
      { method: "GET" },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  try {
    return await fetchWithSession<OrderResponse>(`${ORDER_BASE}/${id}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching order by id:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    return await fetchWithSession<OrderResponse>(`${ORDER_BASE}/${id}/status`, {
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
    return await fetchWithSession<OrderResponse>(`${ORDER_BASE}/${id}/cancel`, {
      method: "PATCH",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};
