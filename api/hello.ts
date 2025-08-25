import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Simple response without any dependencies
  return res.status(200).json({
    success: true,
    message: 'Hello from SAT RSPO PADI API',
    timestamp: new Date().toISOString(),
    method: req.method,
    environment: {
      nodeVersion: process.version,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseAnon: !!process.env.SUPABASE_ANON_KEY,
      hasSupabaseService: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  })
}