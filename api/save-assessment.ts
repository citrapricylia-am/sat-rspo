export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
    try {
      const upstream = await fetch(
        'https://sefl-assessment-tools-rspo.wuaze.com/api/assessment.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
        }
      );
  
      const text = await upstream.text();
      res.status(upstream.status).setHeader('Content-Type', 'application/json');
      try {
        JSON.parse(text);
        res.send(text);
      } catch {
        res.json({ error: 'Upstream not JSON', raw: text });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Proxy failed', detail: String(err) });
    }
  }
  