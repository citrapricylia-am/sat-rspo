import { supabase } from './supabase-config.ts'

/**
 * Register a new user with email, password, and name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} nama - User's full name
 * @param {string} role - User role (petani or manajer)
 * @returns {Object} Registration result
 */
export const registerUser = async (email, password, nama, role = 'petani') => {
  try {
    console.log('🔄 Starting user registration...')
    console.log('📧 Email:', email)
    console.log('👤 Name:', nama)
    console.log('🎭 Role:', role)

    // Validate role (only allow petani or manajer)
    if (!['petani', 'manajer'].includes(role)) {
      throw new Error('Invalid role. Only "petani" and "manajer" are allowed.')
    }

    // Step 1: Create user account with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nama,
          role: role
        }
      }
    })

    if (authError) {
      console.error('❌ Auth registration error:', authError.message)
      return {
        success: false,
        error: authError.message,
        data: null
      }
    }

    console.log('✅ User auth created:', authData.user?.id)

    // Step 2: Create profile record in profiles table
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: email,
            full_name: nama,
            role: role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()

      if (profileError) {
        console.error('❌ Profile creation error:', profileError.message)
        
        // If profile creation fails, we should clean up the auth user
        // Note: This might require admin privileges in production
        return {
          success: false,
          error: `User created but profile failed: ${profileError.message}`,
          data: authData
        }
      }

      console.log('✅ User profile created:', profileData)

      return {
        success: true,
        error: null,
        data: {
          user: authData.user,
          profile: profileData[0],
          session: authData.session
        }
      }
    }

    return {
      success: false,
      error: 'User creation failed - no user data returned',
      data: null
    }

  } catch (error) {
    console.error('❌ Registration error:', error.message)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Login result
 */
export const loginUser = async (email, password) => {
  try {
    console.log('🔄 Starting user login...')
    console.log('📧 Email:', email)

    // Step 1: Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      console.error('❌ Login authentication error:', authError.message)
      return {
        success: false,
        error: authError.message,
        data: null
      }
    }

    console.log('✅ User authenticated:', authData.user?.id)

    // Step 2: Get user profile from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('❌ Profile fetch error:', profileError.message)
      return {
        success: false,
        error: `Authentication successful but profile not found: ${profileError.message}`,
        data: authData
      }
    }

    console.log('✅ User profile loaded:', profileData)

    // Step 3: Log the login activity (optional)
    const { error: loginLogError } = await supabase
      .from('login_history')
      .insert([
        {
          user_id: authData.user.id,
          login_time: new Date().toISOString(),
          ip_address: 'unknown', // You can get this from request if available
          user_agent: 'unknown'  // You can get this from request if available
        }
      ])

    if (loginLogError) {
      console.warn('⚠️ Login history logging failed:', loginLogError.message)
      // Don't fail the login for this
    }

    return {
      success: true,
      error: null,
      data: {
        user: authData.user,
        profile: profileData,
        session: authData.session
      }
    }

  } catch (error) {
    console.error('❌ Login error:', error.message)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

/**
 * Logout current user
 * @returns {Object} Logout result
 */
export const logoutUser = async () => {
  try {
    console.log('🔄 Logging out user...')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Logout error:', error.message)
      return {
        success: false,
        error: error.message
      }
    }

    console.log('✅ User logged out successfully')
    return {
      success: true,
      error: null
    }

  } catch (error) {
    console.error('❌ Logout error:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Get current user session
 * @returns {Object} Current session data
 */
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Get session error:', error.message)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    if (!session) {
      return {
        success: false,
        error: 'No active session',
        data: null
      }
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('❌ Profile fetch error:', profileError.message)
      return {
        success: true,
        error: null,
        data: {
          user: session.user,
          profile: null,
          session: session
        }
      }
    }

    return {
      success: true,
      error: null,
      data: {
        user: session.user,
        profile: profileData,
        session: session
      }
    }

  } catch (error) {
    console.error('❌ Get current user error:', error.message)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
}