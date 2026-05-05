import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seriesId = searchParams.get('series_id');
  const units    = searchParams.get('units') || 'lin';

  if (!seriesId) {
    return NextResponse.json({ error: 'Missing series_id' }, { status: 400 });
  }

  const FRED_KEY = process.env.FRED_API_KEY;
  if (!FRED_KEY) {
    return NextResponse.json({ error: 'FRED_API_KEY not configured' }, { status: 500 });
  }

  const params = new URLSearchParams({
    series_id:  seriesId,
    api_key:    FRED_KEY,
    file_type:  'json',
    sort_order: 'asc',
    limit:      '60',
    units,
    frequency:  'm',
  });

  try {
    const upstream = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?${params}`,
      { next: { revalidate: 3600 } } // cache 1 hour
    );
    if (!upstream.ok) throw new Error(`FRED ${upstream.status}`);
    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
