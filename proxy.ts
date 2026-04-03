// import { cookies } from "next/headers";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Specify protected and public routes
const protectedRoutes = ['/feed', '/']
const publicRoutes = ['/login', '/registration']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const sessionToken = (await cookies()).get('session_token')?.value

  if (path === '/') {
    return NextResponse.redirect(new URL('/feed', req.nextUrl))
  }

  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (
    isPublicRoute &&
    sessionToken
  ) {
    return NextResponse.redirect(new URL('/feed', req.nextUrl))
  }

  return NextResponse.next()
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}