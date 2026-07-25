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
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: HEADERS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };

  const { entity, id } = JSON.parse(event.body || '{}');
  if (!entity || !id) return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Falta entidade ou ID para excluir.' }) };

  try {
    const validTables = [
      'roster', 'staff', 'matches', 'trophies', 'modalities',
      'gallery', 'social_feeds', 'recent_tournaments',
      'community_tournaments', 'app_users',
    ];

    if (!validTables.includes(entity)) {
      return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Tabela inválida para exclusão.' }) };
    }

    if (entity === 'roster') await sql`DELETE FROM roster WHERE id = ${String(id)};`;
    else if (entity === 'staff') await sql`DELETE FROM staff WHERE id = ${String(id)};`;
    else if (entity === 'matches') await sql`DELETE FROM matches WHERE id = ${String(id)};`;
    else if (entity === 'trophies') await sql`DELETE FROM trophies WHERE id = ${String(id)};`;
    else if (entity === 'modalities') await sql`DELETE FROM modalities WHERE id = ${String(id)};`;
    else if (entity === 'gallery') await sql`DELETE FROM gallery WHERE id = ${String(id)};`;
    else if (entity === 'social_feeds') await sql`DELETE FROM social_feeds WHERE id = ${String(id)};`;
    else if (entity === 'recent_tournaments') await sql`DELETE FROM recent_tournaments WHERE id = ${String(id)};`;
    else if (entity === 'community_tournaments') await sql`DELETE FROM community_tournaments WHERE id = ${String(id)};`;
    else if (entity === 'app_users') await sql`DELETE FROM app_users WHERE id = ${String(id)};`;

    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('[Netlify Delete Function Error]:', err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};
