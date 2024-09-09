import { NextResponse } from 'next/server';
import cookie from 'cookie';


export async function POST(req) {
  try {
    const rawCookies = req.headers.get('cookie') || '';
    const cookies = cookie.parse(rawCookies);
    
    const authCookieName = Object.keys(cookies).find((name) =>
      name.startsWith('wordpress_logged_in_')
    );
    const secureCookieName = Object.keys(cookies).find((name) =>
      name.startsWith('wordpress_sec_')
    );
       // Additionally clear `wordpress_sec_` cookie if present
       const wpCookieName = Object.keys(cookies).find((name) =>
        name.startsWith('wordpress_')
      );

    const res = NextResponse.json({ message: 'Logged out successfully' });



   // const cookiesToRemove = [authCookieName,secureCookieName,wpCookieName,'user_id', 'user_name', 'user_login', 'user_email', 'outlet_id', 'outlet_name', 'outlet_address1', 'outlet_address2', 'outlet_city', 'outlet_country', 'outlet_email', 'outlet_phone', 'outlet_postcode', 'outlet_state'];
    const cookiesToRemove = [authCookieName,secureCookieName,wpCookieName,'user_id', 'user_name', 'user_login', 'user_email', 'outlet_id', 'outlet_name', 'open_cash'];

    // Clear each cookie
    cookiesToRemove.forEach(cookieName => {
      res.headers.append('Set-Cookie', cookie.serialize(cookieName, '', {
        path: '/',
        expires: new Date(0),
      }));
    });




    return res;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}
