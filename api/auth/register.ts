import { supabase } from '../../lib/supabase-config';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { full_name, email, password, phone, address, role } = req.body;

  // Validate required fields
  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ 
      error: 'Missing required fields: full_name, email, password, role' 
    });
  }

  // 1. Sign up user in Supabase Auth with metadata
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        phone,
        address,
        role
      }
    }
  });

  if (signUpError) return res.status(400).json({ error: signUpError.message });
  if (!user) return res.status(400).json({ error: 'Failed to create user' });

  // Note: Profile creation is now handled automatically by database trigger
  // The trigger will use the metadata passed above to create the profile

  res.status(201).json({ 
    success: true, 
    user: {
      id: user.id,
      email: user.email,
      full_name,
      phone,
      address,
      role
    }
  });
}
