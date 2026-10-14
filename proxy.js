import { NextResponse } from "next/server";

// Optimistic auth guard. Verifikasi JWT tetap di backend (verifyToken)
// pada setiap request /api/* — proxy ini hanya redirect cepat berbasis cookie.
export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/daftar") {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  if (pathname.startsWith("/menu")) {
    return NextResponse.redirect(new URL("/studio", request.url));
  }

  const isProtected =
    pathname.startsWith("/studio") || pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/admin/:path*", "/login", "/register", "/daftar", "/menu/:path*"],
};
