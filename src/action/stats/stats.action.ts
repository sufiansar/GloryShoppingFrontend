"use server";

import { makeApiCall } from "../apiClinet";

export const getorderStats = async () => {
  try {
    const result = await makeApiCall<any>("/stats/orders-stats", {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw new Error("Failed to fetch order stats");
  }
};

export const bestProucts = async () => {
  try {
    const result = await makeApiCall<any>("/stats/best-products", {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching best products:", error);
    throw new Error("Failed to fetch best products");
  }
};

export const getAllcencleProducts = async () => {
  try {
    const result = await makeApiCall<any>("/stats/cancelled-products", {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching cancelled products:", error);
    throw new Error("Failed to fetch cancelled products");
  }
};

export const getUserStats = async () => {
  try {
    const result = await makeApiCall<any>("/stats/user-stats", {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user stats");
  }
};

export const getCategoryStats = async () => {
  try {
    const result = await makeApiCall<any>("/stats/category-stats", {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching category stats:", error);
    throw new Error("Failed to fetch category stats");
  }
};

export const perCetegoryStats = async () => {
  try {
    const result = await makeApiCall<any>("/stats/per-category-stats", {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching per category stats:", error);
    throw new Error("Failed to fetch per category stats");
  }
};
