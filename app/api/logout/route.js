import cookie from 'cookie';

// app/api/logout/route.js

export async function POST(req, res) {

  const headers = {
    'Set-Cookie': cookie.serialize('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 0, // immediately expire the cookie
      sameSite: 'strict',
      path: '/'
    }),
    'Content-Type': 'application/json'
  };

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers
  });
}
