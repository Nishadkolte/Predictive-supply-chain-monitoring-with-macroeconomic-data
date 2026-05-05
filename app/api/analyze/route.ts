import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  let body: { prompt?: string; industry?: string; fredSnapshot?: Record<string, unknown>; companyData?: Record<string, unknown> };
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { prompt, industry = 'ALL SECTORS', fredSnapshot, companyData } = body;

  const systemPrompt = `You are a senior supply chain intelligence analyst generating executive briefings for CPOs. 
Be concise, data-driven, and actionable. No bullet points, no markdown, no headers. 
Write in 3 short paragraphs: (1) macro assessment, (2) critical bottleneck + forecast, (3) supplier pivot actions.`;

  const userPrompt = prompt || buildPrompt(industry, fredSnapshot, companyData);

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      throw new Error(`Anthropic ${upstream.status}: ${err}`);
    }

    const data = await upstream.json();
    const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text || '';
    return NextResponse.json({ text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

function buildPrompt(
  industry: string,
  fred?: Record<string, unknown>,
  company?: Record<string, unknown>
): string {
  const macro = fred
    ? `Live FRED macro (${fred.lastDate}): PMI ${fred.pmi} | PPI YoY ${fred.ppi}% | WTI $${fred.wti}/bbl | IP Index ${fred.ip} | Inv/Sales ${fred.isr}x | Mfg Orders YoY ${fred.mfo}% | Composite Stress ${fred.stress}/100`
    : 'FRED data unavailable.';

  const co = company
    ? `\nCompany: ${company.name} (${company.ticker || company.cik}) — SIC ${company.sic} → ${company.industry}\nRevenue: ${company.rev} (YoY: ${company.revGrowth}%) | Gross Margin: ${company.grossMargin}% | Days Inventory: ${company.dioh}d | Cash/Rev: ${company.cashPct}%`
    : '\nNo company selected — provide sector-level analysis.';

  return `Industry: ${industry}\n${macro}${co}\n\nWrite a 3-paragraph executive supply chain intelligence briefing.`;
}
