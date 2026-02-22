import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "./lib/navItems.confiq";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
} from "./lib/auth-utils";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || "default_secret",
  });

  console.log("Token:", token);
  let userRole: UserRole | null = null;
  if (token) {
    userRole = (token.role as UserRole) || null;
  }

  const routerOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Rule 1: User is logged in and trying to access auth route. Redirect to default dashboard
  if (token && isAuth) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
    );
  }

  // Rule 2: User is trying to access open public route
  if (routerOwner === null) {
    return NextResponse.next();
  }

  // Rule 3: No token and trying to access protected route
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (routerOwner === "COMMON") {
    return NextResponse.next();
  }

  if (routerOwner === "SUPER_ADMIN") {
    // Both SUPER_ADMIN and ADMIN can access SUPER_ADMIN routes (like /admin/dashboard)
    if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }
  } else if (routerOwner === "ADMIN") {
    // Only ADMIN and SUPER_ADMIN can access ADMIN routes
    if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }
  } else if (routerOwner === "USER") {
    // Only USER can access USER routes
    if (userRole !== "USER") {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
