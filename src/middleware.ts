import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // Auth gerektiren sayfalar
  const protectedPaths = [
    '/dashboard',
    '/security',
    '/events',
    '/profile'
  ]

  // Eğer korumalı bir sayfaya erişilmeye çalışılıyorsa
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!accessToken) {
      // Token yoksa login sayfasına yönlendir
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Login sayfasına erişim kontrolü
  if (pathname.startsWith('/auth/login')) {
    if (accessToken) {
      // Token varsa dashboard'a yönlendir
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/security/:path*',
    '/events/:path*',
    '/profile/:path*',
    '/auth/login'
  ]
} 