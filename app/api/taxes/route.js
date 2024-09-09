import axios from 'axios';
import cookie from 'cookie';
import { NextResponse } from 'next/server';
import config from '@/lib/config';

export async function POST(req) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const { user_id: cashier_id, outlet_id } = cookies;

    const response = await axios.post(
      `${config.apiBaseUrl}/get-taxes`,
      { cashier_id, outlet_id, per_page: -1 },
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', Cookie: req.headers.get('cookie') }
      }
    );
    const data = response.data;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching taxes:', error);
    return NextResponse.json({ message: 'Error fetching taxes' }, { status: 500 });
  }
}
