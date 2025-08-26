/**
 * POST /api/auth/register
 * Clean minimal registration endpoint with Supabase Auth + profiles table
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, type ApiResponse, type Profile } from '../../lib/supabase-config';

interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role?: 'petani' | 'manajer';
  phone?: string;
  address?: string;
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
    const { full_name, email, password, role = 'petani', phone, address }: RegisterRequest = req.body;

    // Basic validation
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: full_name, email, password'
      });
    }

    // Validate role
    if (role !== 'petani' && role !== 'manajer') {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be "petani" or "manajer"'
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
      options: {
        data: {
          full_name: full_name.trim(),
          role: role
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({
        success: false,
        error: authError.message
      });
    }

    if (!authData.user) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create user account'
      });
    }

    // Create profile record
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: full_name.trim(),
        email: email.toLowerCase(),
        role: role,
        phone: phone?.trim() || null,
        address: address?.trim() || null
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create user profile'
      });
    }

    // Return success with user data and session
    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          created_at: authData.user.created_at
        },
        session: authData.session,
        profile: profile
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}