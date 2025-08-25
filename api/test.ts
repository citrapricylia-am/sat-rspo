import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Test endpoint called')
  
  // Simple test response
  return res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    method: req.method,
    timestamp: new Date().toISOString(),
    env_check: {
      has_supabase_url: !!process.env.SUPABASE_URL,
      has_anon_key: !!process.env.SUPABASE_ANON_KEY,
      has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  })
}