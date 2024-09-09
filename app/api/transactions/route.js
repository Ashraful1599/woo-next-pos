import axios from 'axios';
import cookie from 'cookie';
import { NextResponse } from 'next/server';
import config from '@/lib/config';

export async function POST(req) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const { user_id: cashier_id, outlet_id } = cookies;
    const body = await req.json();

    const response = await axios.post(
      `${config.apiBaseUrl}/get-transactions`,
      { cashier_id, date: body.date, outlet_id },
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', Cookie: req.headers.get('cookie') }
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Error fetching transactions' }, { status: 500 });
  }
}
