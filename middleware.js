// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/*
FINAL & CORRECT MIDDLEWARE
✔ /dealer/register is FULLY PUBLIC
✔ No admin_login redirect on dealer form (mobile + desktop)
✔ Admin protected
✔ Dealer dashboard protected
✔ User dashboard protected
*/

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  /* =========================
     1️⃣ PUBLIC ROUTES (NO AUTH AT ALL)
  ========================= */
  if (
    pathname === "/" ||
    pathname === "/dealer/register" ||     // ✅ VERY IMPORTANT
    pathname.startsWith("/admin_login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy")
  ) {
    return NextResponse.next();
  }

  /* =========================
     2️⃣ GET TOKEN (ONLY FOR PROTECTED ROUTES)
  ========================= */
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  /* =========================
     3️⃣ NOT LOGGED IN → SEND TO LOGIN
  ========================= */
  if (!token) {
    return NextResponse.redirect(new URL("/admin_login", req.url));
  }

  /* =========================
     4️⃣ ADMIN AREA (ROLE + EMAIL)
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
     5️⃣ DEALER DASHBOARD (ONLY DEALER)
  ========================= */
  if (pathname.startsWith("/dealer") && pathname !== "/dealer/register") {
    if (token.role !== "dealer") {
      return NextResponse.redirect(new URL("/wrong-access", req.url));
    }
  }

  /* =========================
     6️⃣ USER DASHBOARD (ONLY USER)
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
