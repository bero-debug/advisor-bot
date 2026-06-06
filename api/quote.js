export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const symbol = url.searchParams.get('symbol');
  
  if (!symbol) {
    return new Response(JSON.stringify({ error: 'symbol required' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  try {
    const r = await fetch(`https://app.sahmk.sa/api/v1/quote/${symbol}/`, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': process.env.VITE_SAHMK_KEY || ''
      }
    });
    
    const data = await r.json();
    return new Response(JSON.stringify(data), {
      status: r.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
