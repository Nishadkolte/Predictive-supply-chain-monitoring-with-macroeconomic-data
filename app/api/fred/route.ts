import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const series_id = searchParams.get('series_id');
  const units = searchParams.get('units') || 'lin';

  if (!series_id) {
    return NextResponse.json({ error: 'Missing series_id' }, { status: 400 });
  }

  const key = process.env.FRED_API_KEY || '293746446a82b065a8d8a9b3b45d40a0';

  const url = new URL('https://api.stlouisfed.org/fred/series/observations');
  url.searchParams.set('series_id', series_id);
  url.searchParams.set('api_key', key);
  url.searchParams.set('file_type', 'json');
  url.searchParams.set('sort_order', 'asc');
  url.searchParams.set('limit', '60');
  url.searchParams.set('units', units);
  url.searchParams.set('frequency', 'm');

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`FRED API returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
