import { NextResponse } from "next/server";

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  "/booking",
  "/dashboard",
  "/notifications",
  "/settings",
];

export function middleware(request) {
  const session = request.cookies.get("bulky-session");
  const userType = request.cookies.get("bulky-user-type")?.value;
  const { pathname } = request.nextUrl;

  // Check if current path is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect non-client users to mobile app install page
  if (userType && userType !== "client") {
    // Allow access to: mobile-app-install, auth, homepage, settings
    const allowedPaths = ["/mobile-app-install", "/auth", "/", "/settings"];
    const isAllowed = allowedPaths.some((path) =>
      path === "/" ? pathname === "/" : pathname.startsWith(path),
    );
    if (!isAllowed) {
      const url = new URL("/mobile-app-install", request.url);
      return NextResponse.redirect(url);
    }
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute) {
    if (!session) {
      const url = new URL("/auth", request.url);
      url.searchParams.set("goTo", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged in users away from auth pages
  if (pathname.startsWith("/auth")) {
    if (session && !request.nextUrl.searchParams.has("goTo")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Match all protected routes and auth routes
export const config = {
  matcher: [
    "/",
    "/booking/:path*",
    "/dashboard/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/auth/:path*",
    "/mobile-app-install",
  ],
};
