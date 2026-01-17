import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";

export const makeApiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const session = await getServerSession(authOptions);

  const headers = new Headers(options.headers);

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  } else {
    console.warn("❌ No accessToken found in session");
  }

  // Don't set Content-Type for FormData - let the browser handle it
  const isFormData = options.body instanceof FormData;

  if (
    !headers.has("Content-Type") &&
    !isFormData &&
    options.method &&
    options.method !== "GET"
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (options.body && typeof options.body === "object" && !isFormData) {
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  // Read body once
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    console.log(data?.message || `Request failed with status ${res.status}`);
    // throw new Error(

    // );
  }

  // For 204 No Content, return null
  if (res.status === 204) return null as any;

  return data as T;
};
