// middleware.js
import { NextResponse } from 'next/server';
import cookie from 'cookie';

export function middleware(req) {

  //// console.log('Request Headers:', req.headers);

  // Retrieve and log raw cookies
  const rawCookies = req.headers.get('cookie') || '';
  //// console.log('Raw Cookies:', rawCookies);

  // Parse the cookies using the `cookie` package
  const cookies = cookie.parse(rawCookies);
 // // console.log('Parsed cookies:', cookies);
 const outlet_id = cookies.outlet_id;

 //// console.log(outlet_id);

  const authCookieName = Object.keys(cookies).find((name) =>
    name.startsWith('wordpress_logged_in_')
  );

  const url = req.nextUrl.clone();


  if (!authCookieName && !outlet_id && url.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (authCookieName && outlet_id && url.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|favicon.svg).*)"],
};
