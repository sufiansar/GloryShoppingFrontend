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
    const response = await makeApiCall<ApiResponse>("/notification/user", {
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
export async function markAsRead(notificationId: string) {
  try {
    const response = await makeApiCall<ApiResponse>(
      `/notification/${notificationId}/read`,
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
export async function getGuestNotifications(guestId?: string) {
  try {
    const response = await makeApiCall<ApiResponse>(
      `/notification/guest${guestId ? `?guestId=${guestId}` : ""}`,
      {
        method: "GET",
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
      error: response?.message || "Failed to fetch notifications",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Register webhook
export async function registerWebhook(webhookUrl: string) {
  try {
    const response = await makeApiCall<ApiResponse>(
      "/notification/webhook/register",
      {
        method: "POST",
        body: JSON.stringify({ webhookUrl }),
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
      error: response?.message || "Failed to register webhook",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Get webhook logs
export async function getWebhookLogs() {
  try {
    const response = await makeApiCall<ApiResponse>(
      "/notification/webhook/logs",
      {
        method: "GET",
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
      error: response?.message || "Failed to fetch webhook logs",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// For backward compatibility (maps markAsRead to markNotificationAsRead if needed by old components)
export const markNotificationAsRead = markAsRead;

