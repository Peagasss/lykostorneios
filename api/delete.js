const { Client } = require('pg');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { entity, id } = req.body || {};
  if (!entity || !id) return res.status(400).json({ error: 'Falta entidade ou ID para excluir.' });

  const connectionString = process.env.AZURE_POSTGRES_URL || process.env.NEON_URL || process.env.POSTGRES_URL;
  if (!connectionString) return res.status(500).json({ error: 'Postgres connection string is not configured.' });

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    async function sql(strings, ...values) {
      let queryText = '';
      for (let i = 0; i < strings.length; i++) {
        queryText += strings[i];
        if (i < values.length) {
          queryText += `$${i + 1}`;
        }
      }
      return client.query(queryText, values);
    }
    sql.query = async (text, params) => client.query(text, params);
    const validTables = [
      'roster', 'staff', 'matches', 'trophies', 'modalities',
      'gallery', 'social_feeds', 'recent_tournaments',
      'community_tournaments', 'app_users'
    ];

    if (!validTables.includes(entity)) {
      return res.status(400).json({ error: 'Tabela inválida para exclusão.' });
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

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[Delete API Error]:', err);
    return res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
};
