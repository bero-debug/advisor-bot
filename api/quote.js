export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const symbol = url.searchParams.get('symbol');
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  
  if (!symbol) return new Response(JSON.stringify({ error: 'symbol required' }), { status: 400, headers });

  try {
    // Yahoo Finance uses symbol.SR format for Saudi stocks
    const ticker = symbol + '.SR';
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${ticker}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketVolume`,
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }
    );
    
    const data = await r.json();
    const q = data?.quoteResponse?.result?.[0];
    
    if (!q || !q.regularMarketPrice) {
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers });
    }
    
    return new Response(JSON.stringify({
      symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      change_percent: q.regularMarketChangePercent,
      volume: q.regularMarketVolume || 0
    }), { status: 200, headers });
    
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
