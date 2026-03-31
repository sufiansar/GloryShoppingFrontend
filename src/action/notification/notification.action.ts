"use server";

import { makeApiCall } from "../apiClinet";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Get user notifications
export async function getUserNotifications() {
  try {
    const response = await makeApiCall<ApiResponse>("/notifications/user", {
      method: "GET",
    });

    if (response?.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response?.message || "Failed to fetch notifications",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const response = await makeApiCall<ApiResponse>(
      `/notifications/${notificationId}/read`,
      {
        method: "PATCH",
      },
    );

    if (response?.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response?.message || "Failed to mark as read",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Get guest notifications
export async function getGuestNotifications() {
  try {
    const response = await makeApiCall<ApiResponse>("/notifications/guest", {
      method: "GET",
    });

    if (response?.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response?.message || "Failed to fetch notifications",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}
