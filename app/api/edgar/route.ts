import { NextRequest, NextResponse } from 'next/server';

const HEADERS = {
  'User-Agent': 'MeridianPlatform admin@meridian.app',
  'Accept': 'application/json',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const cik  = searchParams.get('cik');

  let url: string;

  if (!type) {
    // Company tickers list — cached 24h
    url = 'https://www.sec.gov/files/company_tickers.json';
  } else if (type === 'sub' && cik) {
    // Company submissions (name, SIC, ticker)
    url = `https://data.sec.gov/submissions/CIK${cik}.json`;
  } else if (type === 'facts' && cik) {
    // Company XBRL financial facts
    url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`;
  } else {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: HEADERS,
      next: { revalidate: type ? 3600 : 86400 },
    });
    if (!res.ok) throw new Error(`EDGAR returned ${res.status} for ${url}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
