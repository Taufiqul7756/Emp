import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  // if the user is authenticated he can access dashboard page else stay in /auth/login page
  if (!!req.auth && req.nextUrl.pathname.startsWith("/")) {
    // const newUrl = new URL("/dashboard", req.nextUrl.origin);
    // return Response.redirect(newUrl);
  } else if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  return NextResponse.rewrite(new URL(`${path === "/" ? "" : path}`, req.url));
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard/:path*",
  ],
};
