import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  /* ================= PUBLIC ROUTES ================= */

  // ❌ /login page exist nahi karta
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ PUBLIC PAGES (NO AUTH)
  if (
    pathname === "/" ||
    pathname === "/admin/login" ||          // ✅ FIX
    pathname.startsWith("/dealer/register") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  /* ================= TOKEN CHECK ================= */
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ❌ Not logged in → home
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  /* ================= ROLE PROTECTION ================= */

  // 👤 User
  if (pathname.startsWith("/user") && token.role !== "user") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🧑‍💼 Dealer
  if (pathname.startsWith("/dealer") && token.role !== "dealer") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔑 Admin (login excluded above)
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/dealer/:path*",
    "/admin/:path*",
    "/login",
  ],
};
