import { supabase } from '../../lib/supabase-config';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { full_name, email, password, phone, address, role } = req.body;

  // 1. Sign up user di Supabase Auth
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  });

  if (signUpError) return res.status(400).json({ error: signUpError.message });
  if (!user) return res.status(400).json({ error: 'Failed to create user' });

  // 2. Insert ke profiles
  const { data, error: profileError } = await supabase
    .from('profiles')
    .insert({
      user_id: user.id,
      full_name,
      email,
      phone,
      address,
      role
    })
    .select()
    .single();

  if (profileError) return res.status(400).json({ error: profileError.message });

  res.status(201).json({ success: true, user: data });
}
