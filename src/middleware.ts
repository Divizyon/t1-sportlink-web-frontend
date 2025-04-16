import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Giriş durumunu al
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  
  // Kullanıcının gitmek istediği yol
  const { pathname } = request.nextUrl
  
  // Auth ile ilgili yollar (login, register vb.)
  const isAuthRoute = pathname.startsWith('/auth/')
  
  // Özel yollar
  const isSpecialRoute = pathname.includes('_next') || 
                        pathname.includes('favicon.ico') ||
                        pathname.includes('/api/')
  
  // Ana sayfa kontrolü
  if (pathname === '/' && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // Ana sayfa kontrolü - giriş yapmış kullanıcı
  if (pathname === '/' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Giriş yapmamış kullanıcılar için koruma
  if (!isLoggedIn && !isAuthRoute && !isSpecialRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // Giriş yapmış kullanıcılar auth sayfalarına erişmeye çalışırsa
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Middleware hangi yollarda çalışacak
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)']
} 