export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
    try {
      const upstream = await fetch(
        'https://sefl-assessment-tools-rspo.wuaze.com/api/auth.php?action=login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
        }
      );
  
      const text = await upstream.text();
      res.status(upstream.status).setHeader('Content-Type', 'application/json');
      try {
        // Jika backend kirim JSON valid
        JSON.parse(text);
        res.send(text);
      } catch {
        // Jika backend tidak kirim JSON (misal error HTML), bungkus agar tetap JSON
        res.json({ error: 'Upstream not JSON', raw: text });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Proxy failed', detail: String(err) });
    }
  }
  