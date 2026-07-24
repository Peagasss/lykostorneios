const { sql } = require('@vercel/postgres');
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const normEmail = email.toLowerCase().trim();
  const normPass = password.trim();

  // Master Admin Fallback
  if (normEmail === 'admin@lykos-esports.com' && normPass === 'admin123') {
    return res.status(200).json({
      user: {
        id: 'master-admin',
        email: 'admin@lykos-esports.com',
        fullName: 'Administrador Master',
        role: 'admin',
        is_master: true,
        permissions: ['all']
      }
    });
  }

  // 1. Try Vercel / Neon Postgres first
  if (process.env.POSTGRES_URL) {
    try {
      const result = await sql`SELECT * FROM app_users WHERE LOWER(email) = ${normEmail} LIMIT 1;`;
      const user = result.rows[0];
      if (user && user.password === normPass) {
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ user: userWithoutPassword, provider: 'neon-postgres' });
      }
    } catch (e) {
      console.warn('[Vercel Postgres] Login query fallback:', e.message);
    }
  }

  // 2. Fallback Supabase
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://kwrrhqommtdqvowrfbcp.supabase.co';
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_XVbHrN_u7L9EneAmLYTvag_3b1tMlLb';
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: user, error } = await supabase
      .from('app_users')
      .select('*')
      .ilike('email', normEmail)
      .maybeSingle();

    if (error || !user || user.password !== normPass) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword, provider: 'supabase' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
