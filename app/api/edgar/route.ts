import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const r = await fetch('https://www.sec.gov/files/company_tickers.json', {
      headers: { 'User-Agent': 'MeridianSCPlatform contact@meridian.app' },
      next: { revalidate: 86400 }, // cache 24 hours
    });
    if (!r.ok) throw new Error('EDGAR ' + r.status);
    const data = await r.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
