import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  // Allow public routes without authentication
  if (request.nextUrl.pathname.startsWith("/public/")) {
    return NextResponse.next()
  }

  // Create a Supabase client configured to use cookies
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  // For all other routes, check for authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

