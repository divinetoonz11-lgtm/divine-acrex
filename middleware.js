// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/*
FINAL ULTRA STRICT MIDDLEWARE
----------------------------
✔ Admin dashboard → ONLY 2 fixed emails
✔ Sub-admin → separate, limited
✔ User / Dealer / Sub-admin → admin NEVER
✔ DM / copied admin link useless
*/

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  /* =========================
     1️⃣ PUBLIC ROUTES
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
     2️⃣ TOKEN REQUIRED
  ========================= */
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !token.email || !token.role) {
    return NextResponse.redirect(new URL("/admin_login", req.url));
  }

  /* =================================================
     🚫 GLOBAL ADMIN EMAIL LOCK
     -------------------------------------------------
     Admin email hai but role ≠ admin
     → koi bhi dashboard allow nahi
  ================================================= */
  if (
    ADMIN_EMAILS.includes(token.email) &&
    token.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/wrong-access", req.url));
  }

  /* =========================
     3️⃣ ADMIN DASHBOARD (HARDEST LOCK)
  ========================= */
  if (pathname.startsWith("/admin")) {
    if (
      token.role !== "admin" ||
      !ADMIN_EMAILS.includes(token.email)
    ) {
      return NextResponse.redirect(new URL("/wrong-access", req.url));
    }
    return NextResponse.next();
  }

  /* =========================
     4️⃣ SUB-ADMIN DASHBOARD
  ========================= */
  if (pathname.startsWith("/sub-admin")) {
    if (token.role !== "sub-admin") {
      return NextResponse.redirect(new URL("/wrong-access", req.url));
    }
    return NextResponse.next();
  }

  /* =========================
     5️⃣ DEALER DASHBOARD
  ========================= */
  if (pathname.startsWith("/dealer")) {
    if (token.role !== "dealer") {
      return NextResponse.redirect(new URL("/wrong-access", req.url));
    }
    return NextResponse.next();
  }

  /* =========================
     6️⃣ USER DASHBOARD
  ========================= */
  if (pathname.startsWith("/user")) {
    if (token.role !== "user") {
      return NextResponse.redirect(new URL("/wrong-access", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/sub-admin/:path*",
    "/dealer/:path*",
    "/user/:path*",
  ],
};
