import { FieldValues } from "react-hook-form";
import { getSession } from "next-auth/react";

export const login = async (data: FieldValues) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export const logout = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to logout: ${res.statusText}`);
  }

  return await res.json();
};
export const getCurrentUser = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch current user: ${res.statusText}`);
  }

  // console.log("res", res);
  return await res.json();
};

export const changePassword = async (data: FieldValues) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Not authenticated. Please login first.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_API;
  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  console.log("Sending change password request with data:", data);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };

  const requestBody = JSON.stringify(data);
  console.log("Request body:", requestBody);

  const res = await fetch(`${baseUrl}/auth/change-password`, {
    method: "PATCH",
    headers,
    credentials: "include",
    body: requestBody,
  });

  console.log("Response status:", res.status, res.statusText);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.log("Error response:", errorData);
    throw new Error(
      errorData?.message || `Failed to change password: ${res.statusText}`,
    );
  }

  return await res.json();
};
export const forgotPassword = async (data: FieldValues) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to send forgot password email: ${res.statusText}`);
  }

  return await res.json();
};

export const resetPassword = async (data: FieldValues) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to reset password: ${res.statusText}`);
  }

  return await res.json();
};
