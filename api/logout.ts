import { supabase } from './lib/db.js'
import { withMiddleware } from './lib/middleware.js'
import type { AuthenticatedRequest } from './lib/middleware.js'
import type { VercelResponse } from '@vercel/node'

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    // Get the access token from the Authorization header
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'No access token provided'
      })
    }
    
    // Set the session for Supabase to know which session to sign out
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '' // We don't need refresh token for logout
    })
    
    if (sessionError) {
      console.warn('Session setting error during logout:', sessionError)
      // Continue with logout even if session setting fails
    }
    
    // Sign out from Supabase
    const { error: signOutError } = await supabase.auth.signOut()
    
    if (signOutError) {
      console.error('Supabase logout error:', signOutError)
      return res.status(500).json({
        success: false,
        error: 'Failed to logout properly'
      })
    }
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
    
  } catch (error: any) {
    console.error('Logout error:', error)
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error during logout'
    })
  }
}

export default withMiddleware(handler, {
  allowedMethods: ['POST'],
  rateLimit: { maxRequests: 20, windowMs: 60000 } // 20 requests per minute
})