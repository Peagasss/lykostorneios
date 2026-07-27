const { Pool } = require('pg');

let pool = null;

async function sql(strings, ...values) {
  if (!pool) {
    const connectionString = process.env.AZURE_POSTGRES_URL || process.env.NEON_URL || process.env.POSTGRES_URL;
    if (!connectionString) throw new Error('Postgres connection string is not configured.');
    pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }

  let queryText = '';
  for (let i = 0; i < strings.length; i++) {
    queryText += strings[i];
    if (i < values.length) queryText += `$${i + 1}`;
  }
  return pool.query(queryText, values);
}

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: HEADERS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };

  const { email, password } = JSON.parse(event.body || '{}');
  if (!email || !password) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'E-mail e senha são obrigatórios.' }) };
  }

  const normEmail = email.toLowerCase().trim();
  const normPass = password.trim();

  // Master Admin Fallback
  if (normEmail === 'admin@lykos-esports.com' && normPass === 'admin123') {
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({
        user: {
          id: 'master-admin',
          email: 'admin@lykos-esports.com',
          fullName: 'Administrador Master',
          role: 'admin',
          is_master: true,
          permissions: ['all'],
        },
      }),
    };
  }

  // Azure / Neon / Postgres
  if (process.env.AZURE_POSTGRES_URL || process.env.POSTGRES_URL || process.env.NEON_URL) {
    try {
      const result = await sql`SELECT * FROM app_users WHERE LOWER(email) = ${normEmail} LIMIT 1;`;
      const user = result.rows[0];
      if (user && user.password === normPass) {
        const { password: _, ...userWithoutPassword } = user;
        return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ user: userWithoutPassword, provider: 'azure-postgres' }) };
      }
      return { statusCode: 401, headers: HEADERS, body: JSON.stringify({ error: 'E-mail ou senha incorretos.' }) };
    } catch (e) {
      console.error('[Netlify Login Function Error]:', e);
      return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 401, headers: HEADERS, body: JSON.stringify({ error: 'E-mail ou senha incorretos.' }) };
};
