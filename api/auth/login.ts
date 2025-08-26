/**
 * POST /api/auth/login
 * Clean minimal login endpoint using supabase.auth.signInWithPassword
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, type ApiResponse } from '../../lib/supabase-config';

interface LoginRequest {
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { email, password }: LoginRequest = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, password'
      });
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password
    });

    if (authError || !authData.user || !authData.session) {
      console.error('Login error:', authError?.message || 'No user/session');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }

    // Return success with user data and session
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          last_sign_in_at: authData.user.last_sign_in_at,
          created_at: authData.user.created_at
        },
        session: authData.session,
        profile: profile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}