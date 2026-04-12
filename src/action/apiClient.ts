import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/helpers/authOptions";

export const makeApiCall = async <T>(
  endpoint: string,
  options: Omit<RequestInit, "body"> & { body?: any } = {},
): Promise<T> => {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    // This happens during static generation when there's no request context

    session = null;
  }

  const headers = new Headers(options.headers);

  // Forward cookies for guest cart sessions
  try {
    const cookieStore = await cookies();
    let cookieHeader = cookieStore.toString();
    
    // If we have a session token, remove stale accessToken/refreshToken from raw cookies
    // to prevent the backend from using old social login cookies.
    if (session?.accessToken && cookieHeader) {
      cookieHeader = cookieHeader
        .split("; ")
        .filter((c) => !c.startsWith("accessToken=") && !c.startsWith("refreshToken="))
        .join("; ");
    }

    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }

    // Extract sessionId from cookies and send in header for cart endpoints
    const sessionIdFromCookie = cookieStore.get("sessionId")?.value;
    if (sessionIdFromCookie) {
      headers.set("x-session-id", sessionIdFromCookie);
    }
  } catch (error) { }

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
  const hasGuestSession = headers.has("x-session-id") || headers.has("Cookie");

  const fetchOptions: any = {
    ...options,
    headers,
    credentials: "include" as const,
  };

  // Add cache/revalidate strategy
  if (options.cache) {
    // If the caller explicitly provided a cache setting (like "no-store"), respect it
    fetchOptions.cache = options.cache;
  } else if (isGetRequest && !isAuthenticatedRequest && !hasGuestSession) {
    fetchOptions.next = { revalidate: 3600 }; // 1 hour revalidation for static generation
  } else if (isAuthenticatedRequest || hasGuestSession) {
    fetchOptions.cache = "no-store"; // No cache for authenticated or session-based requests
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}${endpoint}`,
    fetchOptions,
  );

  // Read body once
  let data: any = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  // Handle sessionId propagation from response to browser cookies
  try {
    // 1. Check if sessionId is in the response data (as seen in user response)
    const sessionIdFromData = data?.sessionId || data?.data?.sessionId;
    
    // 2. Check if sessionId is in Set-Cookie header
    let sessionIdFromHeader = null;
    const setCookie = res.headers.get("Set-Cookie");
    if (setCookie && setCookie.includes("sessionId=")) {
      const match = setCookie.match(/sessionId=([^;]+)/);
      if (match) sessionIdFromHeader = match[1];
    }

    const finalSessionId = sessionIdFromData || sessionIdFromHeader;

    if (finalSessionId) {
      const cookieStore = await cookies();
      cookieStore.set("sessionId", finalSessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
  } catch (error) {
    // This may fail in contexts where cookies cannot be set (e.g. Server Components)
    // but will work in Server Actions where cart modifications usually happen.
  }

  if (!res.ok) {
    console.warn(`[makeApiCall] Error: ${res.status} ${res.statusText}`, data?.message || "");
  }

  // For 204 No Content, return null
  if (res.status === 204) return null as any;
  // Normalize common API pagination shapes so frontend components
  // can rely on consistent fields (page, limit, total, totalPages, pagination)
  try {
    if (!data) return data as T;

    // Helper to build pagination object
    const buildPagination = (meta: any, inferredTotal = 0) => {
      const total = meta?.total ?? inferredTotal ?? 0;
      const limit = meta?.limit ?? meta?.perPage ?? 10;
      const derivedTotalPages = meta?.totalPages ?? meta?.totalPage;
      let totalPages: number;
      if (derivedTotalPages != null) {
        totalPages = derivedTotalPages;
      } else if (limit) {
        totalPages = Math.max(1, Math.ceil(total / limit));
      } else {
        totalPages = 1;
      }
      const page = meta?.page ?? 1;
      return { page, limit, total, totalPages };
    };

    // Case A: nested shape { data: { data: [...], meta: {...} }, ... }
    if (data.data && data.data.data && Array.isArray(data.data.data)) {
      const inner = data.data;
      const meta = inner.meta || data.meta || {};
      const pagination = buildPagination(meta, inner.data.length);

      return {
        ...data,
        data: inner.data,
        meta: meta,
        pagination,
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
      } as T;
    }

    // Case B: top-level shape { data: [...], meta: {...} }
    if (Array.isArray(data.data) && data.meta) {
      const meta = data.meta || {};
      const pagination = buildPagination(meta, data.data.length);

      return {
        ...data,
        meta,
        pagination,
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
      } as T;
    }

    // Case C: response directly returns array in `data` without pagination
    if (Array.isArray(data.data)) {
      const pagination = {
        page: 1,
        limit: data.data.length || 0,
        total: data.data.length || 0,
        totalPages: 1,
      };
      return {
        ...data,
        pagination,
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
      } as T;
    }

    // Case D: if response has `meta` but not `data` as array (some endpoints)
    if (data.meta && !Array.isArray(data.data)) {
      const meta = data.meta || {};
      const pagination = buildPagination(meta, meta.total ?? 0);
      return {
        ...data,
        pagination,
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
      } as T;
    }

    // Default: return original parsed data
    return data as T;
  } catch (err) {
    return data as T;
  }
};
