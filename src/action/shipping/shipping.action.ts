"use server";

import { makeApiCall } from "../apiClient";

export const getShippingConfigs = async () => {
  try {
    const result = await makeApiCall<any>("/shipping", {
      method: "GET",
      cache: "no-store",
    });
    return result;
  } catch (error) {
    console.error("Error fetching shipping configs:", error);
    return { success: false, data: [] };
  }
};

export const updateShippingConfig = async (id: string, data: any) => {
  try {
    const result = await makeApiCall<any>(`/shipping/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return result;
  } catch (error) {
    console.error("Error updating shipping config:", error);
    return { success: false, message: "Failed to update shipping configuration" };
  }
};
