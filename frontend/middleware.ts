import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Token kontrolü - localStorage yerine cookie üzerinden
  const token = request.cookies.get('token')?.value
  
  const isAuthPage = 
    request.nextUrl.pathname === '/login' || 
    request.nextUrl.pathname === '/register'
  
  const isHomePage = request.nextUrl.pathname === '/'
  
  // Eğer token yoksa ve korumalı sayfaya erişmeye çalışıyorsa login'e yönlendir
  if (!token && request.nextUrl.pathname.startsWith('/todos')) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }
  
  // Eğer token varsa ve auth sayfalarına erişmeye çalışıyorsa todos'a yönlendir
  if (token && (isAuthPage || isHomePage)) {
    const url = new URL('/todos', request.url)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/todos/:path*',
    '/login',
    '/register',
    '/'
  ],
} 