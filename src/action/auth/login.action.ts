import { FieldValues } from "react-hook-form";

export const login = async (data: FieldValues) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(res);
  if (!res.ok) {
    throw new Error(`Failed to login: ${res.statusText}`);
  }

  return await res.json();
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
