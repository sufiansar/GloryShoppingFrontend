"use server";

import { makeApiCall } from "../apiClinet";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Start a new chat as guest
export async function startChatAsGuest(guestInfo?: {
  email?: string;
  name?: string;
  guestId?: string;
}) {
  try {
    // Generate a guestId if not provided
    const guestId =
      guestInfo?.guestId ||
      `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const response = await makeApiCall<ApiResponse>("/chat/start-guest", {
      method: "POST",
      body: JSON.stringify({
        guestId: guestId,
        email: guestInfo?.email || null,
        name: guestInfo?.name || "Guest User",
      }),
    });

    if (response?.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response?.message || "Failed to start chat",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Start a new chat as user
export async function startChatAsUser(data: {
  subject: string;
  initialMessage: string;
}) {
  try {
    const response = await makeApiCall<ApiResponse>("/chat/start-user", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response?.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response?.message || "Failed to start chat",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Send message as guest - guestId from localStorage
export async function sendMessageAsGuest(
  chatId: string,
  content: string,
  guestId: string,
) {
  try {
    const response = await makeApiCall<ApiResponse>(
      `/chat/${chatId}/send-guest`,
      {
        method: "POST",
        body: JSON.stringify({
          guestId,
          content,
        }),
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
      error: response?.message || "Failed to send message",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Send message as user
export async function sendMessageAsUser(chatId: string, content: string) {
  try {
    const response = await makeApiCall<ApiResponse>(
      `/chat/${chatId}/send-user`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
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
      error: response?.message || "Failed to send message",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Get chat messages as guest
export async function getChatMessagesAsGuest(chatId: string, guestId: string) {
  try {
    const response = await makeApiCall<ApiResponse>(
      `/chat/${chatId}/messages-guest?guestId=${guestId}`,
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
      error: response?.message || "Failed to fetch messages",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Get chat messages as user
export async function getChatMessagesAsUser(chatId: string) {
  try {
    const response = await makeApiCall<ApiResponse>(
      `/chat/${chatId}/messages-user`,
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
      error: response?.message || "Failed to fetch messages",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Get all chats for admin
export async function getAllChatsForAdmin(page = 1, limit = 10) {
  try {
    const response = await makeApiCall<ApiResponse>(
      `/chat/admin/all-chats?page=${page}&limit=${limit}`,
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
      error: response?.message || "Failed to fetch chats",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Get full chat conversation for admin
export async function getFullChatConversation(chatId: string) {
  try {
    const response = await makeApiCall<ApiResponse>(`/chat/admin/${chatId}`, {
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
      error: response?.message || "Failed to fetch conversation",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Send message as admin
export async function sendMessageAsAdmin(chatId: string, content: string) {
  try {
    const response = await makeApiCall<ApiResponse>(
      `/chat/${chatId}/send-admin`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
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
      error: response?.message || "Failed to send message",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}

// Close chat
export async function closeChat(chatId: string, resolution?: string) {
  try {
    const response = await makeApiCall<ApiResponse>(`/chat/${chatId}/close`, {
      method: "PATCH",
      body: JSON.stringify({ resolution }),
    });

    if (response?.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response?.message || "Failed to close chat",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
}
