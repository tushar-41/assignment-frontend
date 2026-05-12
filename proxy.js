import { NextResponse } from "next/server";

const PROTECTED = ["/"];
const AUTH_ONLY = ["/signin", "/signup"];

export function proxy(request) {
  const token = request.cookies.get("jwt")?.value;
  const { pathname } = request.nextUrl;

  if (PROTECTED.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (AUTH_ONLY.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/signup"],
};
