// middleware.js
import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST(req) {

  //// console.log('Request Headers:', req.headers);

  // Retrieve and log raw cookies
  const rawCookies = req.headers.get('cookie') || '';
  //// console.log('Raw Cookies:', rawCookies);

  // Parse the cookies using the `cookie` package
  const cookies = cookie.parse(rawCookies);


 //// console.log(outlet_id);

  const authCookieName = Object.keys(cookies).find((name) =>
    name.startsWith('wordpress_logged_in_')
  );

  const cookieValue = cookies[authCookieName];
  
  const authCookie = {
    authCookieName: authCookieName,
    authCookieValue: cookieValue,
  }

 return NextResponse.json( {authCookie: authCookie} );


}


