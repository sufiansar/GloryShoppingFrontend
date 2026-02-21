"use server";

import { revalidatePath } from "next/cache";
import { makeApiCall } from "../apiClinet";
import { RoleChangeRequest } from "@/types/User.interface";
import { UserRole } from "@/lib/navItems.confiq";

export const getMyProfile = async () => {
  return makeApiCall("/user/my-profile", {
    method: "GET",
  });
};

export const registerUser = async (data: any) => {
  const result = await makeApiCall("/user/create-user", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/", "layout");
  return result;
};

export const getAllUsers = async (queryString: string) => {
  try {
    const searchParams = new URLSearchParams(queryString);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const searchTerm = searchParams.get("searchTerm") || "";
    let builtQueryString = `?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (searchTerm) {
      builtQueryString += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }

    const result = await makeApiCall<any>(`/user${builtQueryString}`, {
      method: "GET",
    });

    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUserProfile = async (data: any) => {
  const result = await makeApiCall("/user/update-profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidatePath("/", "layout");
  return result;
};

export const getuserById = async (id: any) => {
  return makeApiCall(`/user/${id}`, {
    method: "GET",
  });
};

export const userRoleChangeRequest = async (
  userId: string,
  role: UserRole,
  reason?: string,
) => {
  const result = await makeApiCall("/user/role-update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      role,
      reason,
    }),
  });

  revalidatePath("/", "layout");
  return result;
};

export const deleteUserAccount = async (id: any) => {
  const result = await makeApiCall(`/user/${id}`, {
    method: "DELETE",
  });
  revalidatePath("/", "layout");
  return result;
};
