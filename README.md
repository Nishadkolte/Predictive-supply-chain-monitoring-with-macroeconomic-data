# Meridian — Supply Chain Intelligence Platform

Real-time global supply chain risk monitoring powered by:
- **FRED API** (St. Louis Fed) — 6 live macroeconomic indicators
- **SEC EDGAR XBRL API** — Company financials from 10-K filings
- **Anthropic Claude** — AI-generated executive intelligence briefings

---

## Project Structure

```
meridian/
├── app/
│   ├── api/
│   │   ├── fred/route.ts        ← FRED proxy (hides API key server-side)
│   │   └── analyze/route.ts     ← Anthropic AI report endpoint
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── constants.ts             ← Industry data, benchmarks, FRED series
├── .env.local.example           ← Copy → .env.local, fill in keys
├── vercel.json
└── package.json
```

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/meridian-supply-chain.git
cd meridian-supply-chain

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and fill in your API keys

# 4. Run locally
npm run dev
# → http://localhost:3000
```

---

## API Keys — Where to Get Them

### 1. Anthropic API Key
- Go to: https://console.anthropic.com/settings/keys
- Click **Create Key**
- Copy the key starting with `sk-ant-...`
- Add to `.env.local` as `ANTHROPIC_API_KEY`

### 2. FRED API Key (St. Louis Federal Reserve)
- Go to: https://fred.stlouisfed.org/docs/api/api_key.html
- Click **Request API Key** (free, instant)
- Add to `.env.local` as `FRED_API_KEY`

### 3. SEC EDGAR
- **No key required** — public API at `data.sec.gov`
- EDGAR calls are made directly from the browser (no proxy needed)

---

## Deploy to Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — Meridian Supply Chain Intelligence"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/meridian-supply-chain.git
git push -u origin main
```

### Step 2 — Import to Vercel
1. Go to **https://vercel.com/new**
2. Click **Import Git Repository**
3. Select your `meridian-supply-chain` repo
4. Framework will auto-detect as **Next.js**

### Step 3 — Add Environment Variables
In the Vercel import screen, expand **Environment Variables** and add:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-your-key-here` |
| `FRED_API_KEY` | `your-fred-key-here` |

> SEC EDGAR needs no key — skip it.

### Step 4 — Deploy
Click **Deploy**. Vercel builds and deploys in ~60 seconds.
Your live URL will be: `https://meridian-supply-chain.vercel.app`

---

## Adding Keys to an Existing Vercel Project

If you've already deployed and need to add/update keys:

```bash
# Via Vercel CLI (recommended)
npm i -g vercel
vercel login
vercel env add ANTHROPIC_API_KEY production
vercel env add FRED_API_KEY production

# Then redeploy to pick up the new vars
vercel --prod
```

Or via the **Vercel Dashboard**:
1. Open your project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Set Name, Value, and check **Production** + **Preview** + **Development**
4. Click **Save** → go to **Deployments** → **Redeploy**

---

## API Endpoints (once deployed)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/fred?series_id=NAPM&units=lin` | GET | FRED data proxy (server-side key) |
| `/api/analyze` | POST | Claude AI report generation |

### Example: Generate a report
```bash
curl -X POST https://your-app.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "AUTOMOTIVE",
    "fredSnapshot": {
      "pmi": "49.1",
      "ppi": "3.8",
      "wti": "82.4",
      "ip": "102.3",
      "isr": "1.41",
      "mfo": "-2.1",
      "stress": "58.2",
      "lastDate": "2025-04-01"
    }
  }'
```

---

## Security Notes

- ✅ `ANTHROPIC_API_KEY` and `FRED_API_KEY` are **never exposed to the browser** — all calls go through Next.js API routes
- ✅ SEC EDGAR is a public API — no key to protect
- ✅ `.env.local` is in `.gitignore` — keys never committed to git
- ⚠️ Never paste real API keys into client-side JavaScript
