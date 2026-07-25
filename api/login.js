const { Pool } = require('pg');

let pool = null;

async function sql(strings, ...values) {
  if (!pool) {
    const connectionString = process.env.AZURE_POSTGRES_URL || process.env.NEON_URL || process.env.POSTGRES_URL;
    if (!connectionString) throw new Error("Postgres connection string is not configured.");
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }

  let queryText = '';
  for (let i = 0; i < strings.length; i++) {
    queryText += strings[i];
    if (i < values.length) {
      queryText += `$${i + 1}`;
    }
  }

  return pool.query(queryText, values);
}

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

  // Vercel / Azure Postgres
  if (process.env.AZURE_POSTGRES_URL || process.env.POSTGRES_URL || process.env.NEON_URL) {
    try {
      const result = await sql`SELECT * FROM app_users WHERE LOWER(email) = ${normEmail} LIMIT 1;`;
      const user = result.rows[0];
      if (user && user.password === normPass) {
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ user: userWithoutPassword, provider: 'azure-postgres' });
      }
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    } catch (e) {
      console.error('[Vercel Postgres Login Error]:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
};
