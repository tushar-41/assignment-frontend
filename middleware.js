import { NextResponse } from "next/server";

const PROTECTED = ["/"];
const AUTH_ONLY = ["/signin", "/signup"];

export function middleware(request) {
  const token = request.cookies.get("jwt")?.value;
  const { pathname } = request.nextUrl;

  // Redirect logged-out users away from protected routes
  if (PROTECTED.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Redirect logged-in users away from auth pages
  if (AUTH_ONLY.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/signup"],
};
