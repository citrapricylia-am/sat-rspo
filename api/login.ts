import { supabase, dbOperations } from './lib/db.js'
import { withMiddleware, isValidEmail } from './lib/middleware.js'
import type { AuthenticatedRequest } from './lib/middleware.js'
import type { LoginRequest, AuthResponse } from './types/database.js'
import type { VercelResponse } from '@vercel/node'

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    const { email, password }: LoginRequest = req.body
    
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      })
    }
    
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password
    })
    
    if (authError) {
      console.error('Supabase auth error:', authError)
      
      // Handle specific Supabase errors
      if (authError.message.includes('Invalid login credentials')) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        })
      }
      
      if (authError.message.includes('Email not confirmed')) {
        return res.status(401).json({
          success: false,
          error: 'Please verify your email address before signing in'
        })
      }
      
      return res.status(401).json({
        success: false,
        error: authError.message || 'Authentication failed'
      })
    }
    
    if (!authData.user || !authData.session) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed'
      })
    }
    
    // Get user profile
    let profile = null
    try {
      profile = await dbOperations.getUserProfile(authData.user.id)
      
      if (!profile) {
        // Profile doesn't exist, this shouldn't happen but let's handle it
        console.warn(`User ${authData.user.id} authenticated but no profile found`)
        return res.status(404).json({
          success: false,
          error: 'User profile not found. Please contact support.'
        })
      }
    } catch (profileError) {
      console.error('Error fetching user profile:', profileError)
      return res.status(500).json({
        success: false,
        error: 'Error retrieving user profile'
      })
    }
    
    // Record login in history
    try {
      await dbOperations.createLoginHistory({
        user_id: authData.user.id,
        login_timestamp: new Date().toISOString(),
        ip_address: (req.headers['x-forwarded-for'] as string) || req.connection?.remoteAddress,
        user_agent: req.headers['user-agent'],
        success: true
      })
    } catch (historyError) {
      console.warn('Failed to record login history:', historyError)
      // Don't fail the login for this
    }
    
    // Prepare successful response
    const response: AuthResponse = {
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        profile
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at || 0
      }
    }
    
    return res.status(200).json(response)
    
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Record failed login attempt if we have user email
    try {
      const email = req.body?.email
      if (email) {
        // Try to find user profile to get user_id
        const profile = await dbOperations.getUserByEmail(email.toLowerCase())
        if (profile) {
          await dbOperations.createLoginHistory({
            user_id: profile.user_id,
            login_timestamp: new Date().toISOString(),
            ip_address: (req.headers['x-forwarded-for'] as string) || req.connection?.remoteAddress,
            user_agent: req.headers['user-agent'],
            success: false
          })
        }
      }
    } catch (historyError) {
      console.warn('Failed to record failed login history:', historyError)
    }
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error during authentication'
    })
  }
}

export default withMiddleware(handler, {
  allowedMethods: ['POST'],
  requiredFields: ['email', 'password'],
  rateLimit: { maxRequests: 10, windowMs: 900000 } // 10 requests per 15 minutes
})
  