import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/helpers/authOptions";

export const makeApiCall = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    // This happens during static generation when there's no request context
    console.warn(
      "⚠️ No request context available (likely during static generation)",
    );
    session = null;
  }

  const headers = new Headers(options.headers);

  // Forward cookies for guest cart sessions
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
      console.log(
        "[makeApiCall] Cookie header set:",
        cookieHeader.substring(0, 100),
      );
    }

    // Extract sessionId from cookies and send in header for cart endpoints
    const sessionIdFromCookie = cookieStore.get("sessionId")?.value;
    if (sessionIdFromCookie) {
      headers.set("x-session-id", sessionIdFromCookie);
      console.log(
        "[makeApiCall] ✅ Sending sessionId in x-session-id header:",
        sessionIdFromCookie,
      );
    } else {
      console.log("[makeApiCall] ⚠️  No sessionId found in cookies");
    }
  } catch (error) {
    // cookies() may throw outside request context; ignore
    console.log(
      "[makeApiCall] Cookie read failed (likely during static generation):",
      error,
    );
  }

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  } else {
    console.warn("❌ No accessToken found in session");
  }

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

  // Use revalidate for GET requests during static generation, no-store for authenticated requests
  const isGetRequest = options.method === "GET" || !options.method;
  const isAuthenticatedRequest = session?.accessToken;

  const fetchOptions: any = {
    ...options,
    headers,
    credentials: "include" as const,
  };

  // Add cache/revalidate strategy
  if (isGetRequest && !isAuthenticatedRequest) {
    fetchOptions.next = { revalidate: 3600 }; // 1 hour revalidation for static generation
  } else if (isAuthenticatedRequest) {
    fetchOptions.cache = "no-store"; // No cache for authenticated requests
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}${endpoint}`,
    fetchOptions,
  );

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
