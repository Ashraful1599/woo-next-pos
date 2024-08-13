// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get('authToken');
  console.log(token);

  if (!token && url.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && url.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};
