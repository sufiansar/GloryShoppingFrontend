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

    session = null;
  }

  const headers = new Headers(options.headers);

  // Forward cookies for guest cart sessions
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }

    // Extract sessionId from cookies and send in header for cart endpoints
    const sessionIdFromCookie = cookieStore.get("sessionId")?.value;
    if (sessionIdFromCookie) {
      headers.set("x-session-id", sessionIdFromCookie);
    } else {
    }
  } catch (error) {}

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
