import axios from 'axios';
import { NextResponse } from 'next/server';
import cookie from 'cookie';
import config from '@/lib/config';

// Utility function to create a secure cookie
function createSecureCookie(name, value, isProduction) {
  return cookie.serialize(name, value, {
    path: '/',
    httpOnly: true, // For security: prevents JavaScript access to the cookie
    secure: true, // Only send over HTTPS in production
    sameSite: 'Lax', // Use 'None' for cross-origin requests, 'Lax' for same-origin
  });
}

// Example usage in your route handler
export async function POST(req) {
  const { username, password } = await req.json();

  try {
    // Send login request to your WordPress backend
    const response = await axios.post(`${config.apiBaseUrl}/login`, {
      log: username,
      pwd: password,
    }, {
      withCredentials: true, // Ensure cookies are sent with the request
    });

    // Check if cookies are returned in the response
    const cookies = response.headers['set-cookie'];

    if (cookies) {
      const isProduction = process.env.NODE_ENV === 'production';
      
      const parsedCookies = cookies.map((cookieStr) => {
        const parsed = cookie.parse(cookieStr);
        // Create a secure cookie for each returned cookie
        return createSecureCookie(Object.keys(parsed)[0], Object.values(parsed)[0], isProduction);
      });

      // Prepare response object
      const res = NextResponse.json(response.data);

      // Attach each cookie to the response headers
      parsedCookies.forEach((parsedCookie) => {
        res.headers.append('Set-Cookie', parsedCookie);
      });

      return res;
    }

    // Return the response if no cookies are sent
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.error('Internal Server Error');
  }
}
