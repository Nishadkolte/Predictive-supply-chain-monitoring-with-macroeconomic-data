export const SERIES_DEF = [
  { id: 'NAPM',        label: 'ISM Mfg PMI',        units: 'lin',  fmt: (v: number) => v.toFixed(1),                           status: (v: number) => v < 48 ? 'rd' : v < 52 ? 'am' : 'gn', note: '<50 = contraction'   },
  { id: 'PPIACO',      label: 'PPI YoY %',           units: 'pc1',  fmt: (v: number) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%', status: (v: number) => v > 6  ? 'rd' : v > 3  ? 'am' : 'gn', note: '>3% = cost pressure' },
  { id: 'DCOILWTICO',  label: 'WTI Crude $/bbl',     units: 'lin',  fmt: (v: number) => '$' + v.toFixed(1),                    status: (v: number) => v > 100? 'rd' : v > 75 ? 'am' : 'gn', note: 'energy/freight proxy'},
  { id: 'INDPRO',      label: 'Indust. Production',  units: 'lin',  fmt: (v: number) => v.toFixed(1),                           status: (v: number) => v < 100? 'rd' : v < 103? 'am' : 'gn', note: 'index (2017=100)'   },
  { id: 'ISRATIO',     label: 'Inv/Sales Ratio',     units: 'lin',  fmt: (v: number) => v.toFixed(2) + 'x',                    status: (v: number) => v > 1.6|| v < 1.1 ? 'rd' : v > 1.5 || v < 1.2 ? 'am' : 'gn', note: 'normal 1.25–1.45x' },
  { id: 'AMTMNO',      label: 'Mfg Orders YoY',      units: 'pc1',  fmt: (v: number) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%', status: (v: number) => v < -5 ? 'rd' : v < 0  ? 'am' : 'gn', note: 'demand proxy'       },
];

export interface Alert  { s: 'rd'|'am'|'gn'; code: string; text: string; eta: string }
export interface Rec    { n: string; action: string; tl: string; i: string }
export interface ETA    { d: string; n: string; a: string }

export interface Industry {
  color: string;
  mod: number;
  note: string;
  sic: [number, number][];
  eta: ETA;
  alerts: Alert[];
  recs: Rec[];
}

export const INDUSTRIES: Record<string, Industry> = {
  'ALL SECTORS': {
    color: '#4a9ef8', mod: 1.0, note: 'Composite across all sectors', sic: [],
    eta: { d: '—', n: 'computing from live data', a: '' },
    alerts: [
      { s: 'rd', code: 'CRIT', text: 'Taiwan semi lead times +40% — impacts US electronics in 6–8 wk', eta: '≈11d' },
      { s: 'am', code: 'WARN', text: 'Panama Canal water levels −1.4m YTD — Q3 Atlantic diversion likely', eta: '≈34d' },
      { s: 'am', code: 'WARN', text: 'China Mfg PMI sub-50 for 2nd consecutive month (49.1)', eta: 'ongoing' },
      { s: 'gn', code: 'INFO', text: 'EU port congestion index down 18% MoM — improving', eta: 'stable' },
    ],
    recs: [
      { n: '01', action: 'Activate SK semi suppliers (Samsung, SK Hynix) + TSMC Arizona backup', tl: '3 wk', i: '+$2.1M hedge' },
      { n: '02', action: 'Pre-book Q3 freight via Atlantic route — +2d transit, ~40% rate savings', tl: '1 wk', i: '$440K saved' },
      { n: '03', action: 'Build 6-week electronics buffer inventory before BDI threshold breach', tl: '5 wk', i: 'volatility shield' },
    ],
  },
  'AUTOMOTIVE': {
    color: '#e8a428', mod: 1.18, note: 'Key inputs: steel, semiconductors, rubber', sic: [[3711, 3799]],
    eta: { d: '8d', n: 'Steel futures crossing $900/t', a: '→ OEM production at risk' },
    alerts: [
      { s: 'rd', code: 'CRIT', text: 'EV battery lithium spot price +28% MoM — OEM margins at risk', eta: '≈8d' },
      { s: 'rd', code: 'CRIT', text: 'MLCC chip shortages resurfacing — Tier-1 buffer stocks at 3-week low', eta: '≈14d' },
      { s: 'am', code: 'WARN', text: 'Mexico border crossing delays up 35% — JIT supply lines stressed', eta: 'ongoing' },
      { s: 'gn', code: 'INFO', text: 'Hot-rolled steel coil prices stabilizing after Q1 spike', eta: 'improving' },
    ],
    recs: [
      { n: '01', action: 'Dual-source MLCC chips: Murata (JP) + Yageo (TW) at 60/40 split', tl: '2 wk', i: 'production continuity' },
      { n: '02', action: 'Lock in lithium carbonate forward contracts for Q3–Q4 at current rates', tl: '1 wk', i: '$3.4M cost hedge' },
      { n: '03', action: 'Activate nearshore supplier in Monterrey to bypass border delays', tl: '4 wk', i: '−3d lead time' },
    ],
  },
  'PHARMA': {
    color: '#0fb97a', mod: 0.88, note: 'Key inputs: APIs, cold-chain logistics, vials', sic: [[2830, 2836], [2860, 2869]],
    eta: { d: '22d', n: 'API import quota at 87% utilization', a: '→ reorder before threshold' },
    alerts: [
      { s: 'am', code: 'WARN', text: 'Indian API export restrictions under review — generic drug supply at risk', eta: '≈22d' },
      { s: 'am', code: 'WARN', text: 'Cold-chain reefer container spot rates +19% QoQ on Pacific lanes', eta: 'ongoing' },
      { s: 'gn', code: 'INFO', text: 'Borosilicate glass vial supply normalized after 2-year shortage', eta: 'stable' },
      { s: 'gn', code: 'INFO', text: 'FDA import alert processing time down 11% — backlog clearing', eta: 'improving' },
    ],
    recs: [
      { n: '01', action: 'Diversify API sourcing: India 50% → India 35% / China 25% / EU 40%', tl: '6 wk', i: 'regulatory resilience' },
      { n: '02', action: 'Pre-position 90-day API buffer at bonded 3PL warehouses in NJ, TX', tl: '3 wk', i: 'quota risk hedge' },
      { n: '03', action: 'Qualify secondary cold-chain carrier (Cryoport) for Pacific routes', tl: '4 wk', i: 'rate + reliability' },
    ],
  },
  'CONSUMER ELECTRONICS': {
    color: '#9b72f5', mod: 1.28, note: 'Key inputs: semiconductors, rare earths, displays', sic: [[3670, 3699], [3570, 3579]],
    eta: { d: '11d', n: 'DRAM spot −14% signals demand shock', a: '→ review Q3 procurement' },
    alerts: [
      { s: 'rd', code: 'CRIT', text: 'TSMC advanced node lead times extending to 26 weeks (+8 vs. avg)', eta: '≈11d' },
      { s: 'am', code: 'WARN', text: 'China rare earth export controls tightened — magnet supply impacted', eta: '≈28d' },
      { s: 'am', code: 'WARN', text: 'Vietnam factory utilization at 94% — overflow capacity limited', eta: 'ongoing' },
      { s: 'gn', code: 'INFO', text: 'OLED panel oversupply emerging — display costs down 9% QoQ', eta: 'favorable' },
    ],
    recs: [
      { n: '01', action: 'Engage Samsung Foundry + GlobalFoundries for 7–14nm overflow capacity', tl: '2 wk', i: 'lead time hedge' },
      { n: '02', action: 'Dual-source rare earth magnets via US (MP Materials) + Japan (TDK)', tl: '5 wk', i: 'geopolitical risk' },
      { n: '03', action: 'Qualify Malaysia & Thailand contract factories as Vietnam overflow', tl: '6 wk', i: 'capacity buffer' },
    ],
  },
  'FOOD & AGRI': {
    color: '#e8605a', mod: 0.92, note: 'Key inputs: grains, fertilizers, refrigerated freight', sic: [[2000, 2099]],
    eta: { d: '17d', n: 'Wheat futures crossing $6.50/bu', a: '→ hedge procurement window' },
    alerts: [
      { s: 'am', code: 'WARN', text: 'Black Sea grain corridor at risk — wheat futures +12% in 2 weeks', eta: '≈17d' },
      { s: 'am', code: 'WARN', text: 'Potash fertilizer supply tight — planting season demand surge imminent', eta: '≈30d' },
      { s: 'gn', code: 'INFO', text: 'Brazil soybean harvest above forecast — South American supply ample', eta: 'favorable' },
      { s: 'gn', code: 'INFO', text: 'Reefer container availability improving on Trans-Pacific routes', eta: 'stable' },
    ],
    recs: [
      { n: '01', action: 'Lock in wheat forward contracts at current prices before futures spike', tl: '1 wk', i: '$1.8M cost cap' },
      { n: '02', action: 'Shift 30% of Black Sea grain sourcing to Argentina + Australia', tl: '4 wk', i: 'geopolitical hedge' },
      { n: '03', action: 'Pre-purchase potash at current rates ahead of Q2 planting demand', tl: '2 wk', i: 'season continuity' },
    ],
  },
  'AEROSPACE': {
    color: '#4af0d8', mod: 1.10, note: 'Key inputs: titanium, composites, precision castings', sic: [[3720, 3728]],
    eta: { d: '28d', n: 'Titanium allocation at 91% of quota', a: '→ reserve Q3 now' },
    alerts: [
      { s: 'am', code: 'WARN', text: 'Russian titanium sponge sanctions tightening — alternative qualification needed', eta: '≈28d' },
      { s: 'am', code: 'WARN', text: 'Precision casting lead times at 52 weeks — OEM program delays at risk', eta: 'ongoing' },
      { s: 'gn', code: 'INFO', text: 'Carbon fiber prepreg supply recovering post-Toray force majeure', eta: 'improving' },
      { s: 'gn', code: 'INFO', text: 'FAA MRO approvals clearing — repair turnaround times down 15%', eta: 'stable' },
    ],
    recs: [
      { n: '01', action: 'Qualify VSMPO-AVISMA alternative: ATI (US) + TIMET (EU) at 50/50', tl: '6 wk', i: 'sanctions resilience' },
      { n: '02', action: 'Place long-lead precision casting POs now for Q4 programs', tl: '2 wk', i: 'program protection' },
      { n: '03', action: 'Reserve Toray + Hexcel carbon fiber allocation via annual agreements', tl: '3 wk', i: 'composite continuity' },
    ],
  },
};

export const BENCHMARKS: Record<string, { revGrowth: number; grossMargin: number; invTurns: number; dioh: number; cashPct: number }> = {
  'ALL SECTORS':          { revGrowth: 5.8,  grossMargin: 32.5, invTurns: 9.2,  dioh: 40,  cashPct: 8.5  },
  'AUTOMOTIVE':           { revGrowth: 8.1,  grossMargin: 15.2, invTurns: 8.3,  dioh: 44,  cashPct: 6.1  },
  'PHARMA':               { revGrowth: 6.5,  grossMargin: 65.3, invTurns: 3.2,  dioh: 114, cashPct: 15.0 },
  'CONSUMER ELECTRONICS': { revGrowth: 5.8,  grossMargin: 38.1, invTurns: 18.5, dioh: 20,  cashPct: 11.8 },
  'FOOD & AGRI':          { revGrowth: 4.2,  grossMargin: 24.8, invTurns: 10.1, dioh: 36,  cashPct: 4.2  },
  'AEROSPACE':            { revGrowth: 7.3,  grossMargin: 19.6, invTurns: 4.2,  dioh: 87,  cashPct: 7.8  },
};
