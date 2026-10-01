import { NextResponse } from "next/server";

// Optimistic auth guard (sesuai docs authentication Next.js).
// Verifikasi JWT yang sebenarnya tetap di backend (verifyToken) pada
// setiap request /api/* — proxy ini hanya redirect cepat berbasis cookie.
export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/menu");
  const isAuthPage = pathname === "/login" || pathname === "/daftar";

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/menu/streamer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/menu/:path*", "/login", "/daftar"],
};
