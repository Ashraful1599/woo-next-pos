import axios from 'axios';
import { NextResponse } from 'next/server';
import cookie from 'cookie';
import config from '@/lib/config';

// Utility function to create a secure cookie
function createSecureCookie(name, value, isProduction) {
  return cookie.serialize(name, value, {
    path: '/',
    httpOnly: true, // Prevents JavaScript access
    secure: isProduction, // Ensures it's only sent over HTTPS in production
    sameSite: 'Lax', // Adjust as needed (Lax is a good default)
  });
}

// Example usage in your route handler
export async function POST(req) {
  const { username, password } = await req.json();

  try {
    const response = await axios.post(`${config.apiBaseUrl}/login`, {
      log: username,
      pwd: password,
    });

    // Check if cookies are returned in the response
    const cookies = response.headers['set-cookie'];

    if (cookies) {
      const isProduction = process.env.NODE_ENV === 'production';
      
      const parsedCookies = cookies.map((cookieStr) => {
        const parsed = cookie.parse(cookieStr);
        return createSecureCookie(Object.keys(parsed)[0], Object.values(parsed)[0], isProduction);
      });

      // Attach the cookies to the response
      const res = NextResponse.json(response.data);

      parsedCookies.forEach((parsedCookie) => {
        res.headers.append('Set-Cookie', parsedCookie);
      });

      return res;
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.error('Internal Server Error');
  }
}
