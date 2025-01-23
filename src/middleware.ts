import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow public routes without authentication
  if (request.nextUrl.pathname.startsWith("/public/")) {
    return NextResponse.next()
  }

  // For all other routes, check for authentication
  const authCookie = request.cookies.get("next-auth.session-token")

  if (!authCookie) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

