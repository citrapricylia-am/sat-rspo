import { supabase, dbOperations } from './lib/db'
import { withMiddleware, isValidEmail } from './lib/middleware'
import type { AuthenticatedRequest } from './lib/middleware'
import type { RegisterRequest, AuthResponse } from './types/database'
import type { VercelResponse } from '@vercel/node'

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  console.log('Registration attempt started')
  
  try {
    // Check if environment variables are available
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables')
      return res.status(500).json({
        success: false,
        error: 'Server configuration error - missing environment variables'
      })
    }

    const { email, password, full_name, phone, address, role }: RegisterRequest = req.body
    
    console.log('Registration data received:', {
      email: email ? 'provided' : 'missing',
      password: password ? 'provided' : 'missing',
      full_name: full_name ? 'provided' : 'missing',
      role
    })
    
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      })
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      })
    }
    
    // Validate role
    const validRoles = ['petani', 'manajer']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Allowed roles: ${validRoles.join(', ')}`
      })
    }

    console.log('Validation passed, checking existing user...')
    
    // Check if user already exists in our profiles table
    try {
      const existingProfile = await dbOperations.getUserByEmail(email.toLowerCase())
      if (existingProfile) {
        return res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        })
      }
    } catch (profileCheckError: any) {
      console.warn('Error checking existing profile (table might not exist):', profileCheckError.message)
      // Continue with registration - table might not exist yet
    }

    console.log('Creating user with Supabase Auth...')
    
    // Sign up with Supabase Auth
    console.log('Attempting Supabase Auth signup...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          full_name,
          phone,
          role
        }
      }
    })
    
    if (authError) {
      console.error('Supabase auth error:', authError)
      
      // Handle specific Supabase errors
      if (authError.message.includes('already registered')) {
        return res.status(409).json({
          success: false,
          error: 'Email already registered'
        })
      }
      
      return res.status(400).json({
        success: false,
        error: authError.message || 'Registration failed'
      })
    }
    
    if (!authData.user) {
      console.error('No user returned from Supabase auth')
      return res.status(400).json({
        success: false,
        error: 'Registration failed - no user created'
      })
    }

    console.log('Supabase Auth user created:', authData.user.id)
    
    // Create user profile in our database
    console.log('Creating user profile...')
    try {
      const profile = await dbOperations.createUserProfile(authData.user.id, {
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address.trim(),
        role
      })
      
      console.log('User profile created successfully')
      
      // Prepare response
      const response: AuthResponse = {
        success: true,
        message: authData.user.email_confirmed_at 
          ? 'Registration successful' 
          : 'Registration successful. Please check your email to verify your account.',
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          profile
        }
      }
      
      // Include session if user is automatically signed in
      if (authData.session) {
        response.session = {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at || 0
        }
      }
      
      return res.status(201).json(response)
      
    } catch (profileError: any) {
      console.error('Profile creation error:', profileError)
      
      // Return a simplified success response even if profile creation fails
      // This prevents the user from being stuck in a bad state
      return res.status(201).json({
        success: true,
        message: 'Registration successful, but profile creation had issues. Please contact support if you experience problems.',
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          profile: null
        }
      })
    }
    
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Return detailed error information for debugging
    return res.status(500).json({
      success: false,
      error: 'Internal server error during registration',
      details: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}

export default withMiddleware(handler, {
  allowedMethods: ['POST'],
  requiredFields: ['email', 'password', 'full_name', 'phone', 'address', 'role'],
  rateLimit: { maxRequests: 5, windowMs: 300000 } // 5 requests per 5 minutes
})
  