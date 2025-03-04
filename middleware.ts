import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if the path is our design system page and we're in production
  if (pathname.startsWith("/design") && process.env.NODE_ENV === "production") {
    // Redirect to 404 or homepage
    return NextResponse.redirect(new URL("/404", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on design/* paths
  matcher: ["/design/:path*"],
};
