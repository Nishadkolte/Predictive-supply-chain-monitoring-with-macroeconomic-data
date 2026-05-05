import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.FRED_API_KEY || '293746446a82b065a8d8a9b3b45d40a0';
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=NAPM&api_key=${key}&file_type=json&limit=2&sort_order=desc&frequency=m`;
    const res = await fetch(url, { cache: 'no-store' });
    const text = await res.text();
    return NextResponse.json({
      status: res.status,
      envKeySet: !!process.env.FRED_API_KEY,
      keyPrefix: key.slice(0,8)+'...',
      responsePreview: text.slice(0,400),
    });
  } catch(e) {
    return NextResponse.json({ error: String(e) });
  }
}
