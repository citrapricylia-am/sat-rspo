import { supabase, dbOperations } from './lib/db'
import { withMiddleware, isValidEmail } from './lib/middleware'
import type { AuthenticatedRequest } from './lib/middleware'
import type { RegisterRequest, AuthResponse } from './types/database'
import type { VercelResponse } from '@vercel/node'

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    const { email, password, full_name, phone, address, role }: RegisterRequest = req.body
    
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
    
    // Check if user already exists in our profiles table
    const existingProfile = await dbOperations.getUserByEmail(email.toLowerCase())
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      })
    }
    
    // Sign up with Supabase Auth
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
      return res.status(400).json({
        success: false,
        error: 'Registration failed - no user created'
      })
    }
    
    // Create user profile in our database
    try {
      const profile = await dbOperations.createUserProfile(authData.user.id, {
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address.trim(),
        role
      })
      
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
      
      // If profile creation fails, we should ideally clean up the auth user
      // But for now, we'll just return an error
      return res.status(500).json({
        success: false,
        error: 'Registration completed but profile creation failed. Please contact support.'
      })
    }
    
  } catch (error: any) {
    console.error('Registration error:', error)
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    })
  }
}

export default withMiddleware(handler, {
  allowedMethods: ['POST'],
  requiredFields: ['email', 'password', 'full_name', 'phone', 'address', 'role'],
  rateLimit: { maxRequests: 5, windowMs: 300000 } // 5 requests per 5 minutes
})
  