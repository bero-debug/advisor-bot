export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  try {
    const r = await fetch(`https://app.sahmk.sa/api/v1/quote/${symbol}/`, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': process.env.VITE_SAHMK_KEY || ''
      }
    });
    if (!r.ok) return res.status(r.status).json({ error: 'API error' });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
