// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/*
FINAL PRODUCTION MIDDLEWARE
✔ /dealer/register FULLY PUBLIC
✔ Admin fully protected (role + email)
✔ Dealer dashboard protected
✔ User dashboard protected
✔ Direct admin URL typing blocked safely
*/

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  /* =========================
     1️⃣ PUBLIC ROUTES (NO AUTH)
  ========================= */
  if (
    pathname === "/" ||
    pathname === "/dealer/register" ||
    pathname.startsWith("/admin_login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname === "/wrong-access"
  ) {
    return NextResponse.next();
  }

  /* =========================
     2️⃣ TOKEN CHECK
  ========================= */
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  /* =========================
     3️⃣ NOT LOGGED IN → LOGIN
  ========================= */
  if (!token) {
    return NextResponse.redirect(new URL("/admin_login", req.url));
  }

  /* =========================
     4️⃣ ADMIN AREA (STRICT)
  ========================= */
  if (pathname.startsWith("/admin")) {
    if (
      token.role !== "admin" ||
      !ADMIN_EMAILS.includes(token.email)
    ) {
      return NextResponse.redirect(new URL("/wrong-access", req.url));
    }
  }

  /* =========================
     5️⃣ DEALER DASHBOARD
  ========================= */
  if (pathname.startsWith("/dealer") && pathname !== "/dealer/register") {
    if (token.role !== "dealer") {
      return NextResponse.redirect(new URL("/wrong-access", req.url));
    }
  }

  /* =========================
     6️⃣ USER DASHBOARD
  ========================= */
  if (pathname.startsWith("/user")) {
    if (token.role !== "user") {
      return NextResponse.redirect(new URL("/wrong-access", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dealer/:path*", "/user/:path*"],
};
