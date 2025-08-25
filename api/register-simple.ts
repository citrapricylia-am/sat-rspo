import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  console.log('Register endpoint called:', req.method)
  
  try {
    // Check environment variables
    const envCheck = {
      hasUrl: !!process.env.SUPABASE_URL,
      hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
    
    console.log('Environment check:', envCheck)
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
        details: 'Missing Supabase environment variables',
        envCheck
      })
    }

    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed',
        allowedMethods: ['POST']
      })
    }

    const { email, password, full_name, phone, address, role } = req.body || {}
    
    console.log('Registration data received:', {
      email: email ? 'provided' : 'missing',
      password: password ? 'provided' : 'missing',
      full_name: full_name ? 'provided' : 'missing',
      role
    })

    // Basic validation
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['email', 'password', 'full_name', 'phone', 'address', 'role']
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

    // Dynamic import of Supabase to avoid module loading issues
    try {
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      )
      
      console.log('Supabase client created successfully')

      // Try to register user
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

      console.log('User registered successfully:', authData.user.id)

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          id: authData.user.id,
          email: authData.user.email
        }
      })

    } catch (importError: any) {
      console.error('Failed to import or use Supabase:', importError)
      return res.status(500).json({
        success: false,
        error: 'Database connection failed',
        details: importError.message
      })
    }

  } catch (error: any) {
    console.error('Registration error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}