// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // abhi kisi route ko block mat karo
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
