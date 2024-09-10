import axios from 'axios';
import { NextResponse } from 'next/server';
import cookie from 'cookie';
import config from '@/lib/config';

export async function POST(req) {
 
    const { username, password } = await req.json();

    const response = await axios.post(`${config.apiBaseUrl}/login`, {
      log: username,
      pwd: password
    });

    // Extract cookies from the response headers
    const cookies = response.headers['set-cookie'];

    if (cookies) {
      const parsedCookies = cookies.map((cookieStr) => {
        const parsed = cookie.parse(cookieStr);
        return cookie.serialize(Object.keys(parsed)[0], Object.values(parsed)[0], {
          domain: '.expertoftech.com', // Ensure this is set to your root domain
          path: '/',
          httpOnly: true, 
          sameSite: 'None', 
          secure: true, 
        });
      });
      
      

      // Attach the cookies to the response
      const res = NextResponse.json( response.data );

      parsedCookies.forEach((parsedCookie) => {
        res.headers.append('Set-Cookie', parsedCookie);
      });

      return res;
    }

  return  NextResponse.json( response.data );

}
