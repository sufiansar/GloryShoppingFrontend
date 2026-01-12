export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

// exact : ["/my-profile", "settings"]
//   patterns: [/^\/dashboard/, /^\/patient/], // Routes starting with /dashboard/* /patient/*
export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

export const authRoutes = ["/login", "/register", "/forgot-password"];

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/profile", "/settings"],
  patterns: [/^\/profile\//, /^\/settings\//], // Common routes for all authenticated users
};

export const superAdminProtectedRoutes: RouteConfig = {
  patterns: [/^\/admin\/dashboard/, /^\/admin\/reports/, /^\/admin\/settings/], // SUPER_ADMIN only routes
  exact: [],
};

export const adminProtectedRoutes: RouteConfig = {
  patterns: [
    /^\/admin\/users/,
    /^\/admin\/travel-plans/,
    /^\/admin\/analytics/,
  ], // ADMIN routes
  exact: [],
};

export const userProtectedRoutes: RouteConfig = {
  exact: ["/dashboard", "/travel-plans"],
  patterns: [/^\/dashboard\//, /^\/travel-plans\//], // User travel routes
};

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
};

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
  // if pathname === /dashboard/my-appointments => matches /^\/dashboard/ => true
};

export const getRouteOwner = (
  pathname: string
): "SUPER_ADMIN" | "ADMIN" | "USER" | "COMMON" | null => {
  if (isRouteMatches(pathname, superAdminProtectedRoutes)) {
    return "SUPER_ADMIN";
  }
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  if (isRouteMatches(pathname, userProtectedRoutes)) {
    return "USER";
  }
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === "SUPER_ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "ADMIN") {
    return "/admin/users";
  }
  if (role === "USER") {
    return "/dashboard";
  }
  return "/";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  if (routeOwner === role) {
    return true;
  }

  return false;
};
