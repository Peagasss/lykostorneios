const { Pool } = require('pg');

let pool = null;

async function sql(strings, ...values) {
  if (!pool) {
    const connectionString = process.env.AZURE_POSTGRES_URL || process.env.NEON_URL || process.env.POSTGRES_URL;
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

sql.query = async (text, params) => {
  if (!pool) {
    const connectionString = process.env.AZURE_POSTGRES_URL || process.env.NEON_URL || process.env.POSTGRES_URL;
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool.query(text, params);
};

let cache = {
  data: null,
  timestamp: 0
};
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Database Connection Check (Azure / Postgres)
  const dbUrl = process.env.AZURE_POSTGRES_URL || process.env.NEON_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
      // 1. Silent schema migration / initialization if database is empty
      try {
        const checkTable = await sql`SELECT to_regclass('public.site_settings');`;
        if (!checkTable.rows[0] || !checkTable.rows[0].to_regclass) {
          const fs = require('fs');
          const path = require('path');
          const schemaPath = path.join(process.cwd(), 'schema.sql');
          if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await sql.query(schemaSql);
            console.log('[LykosDB] Database schema self-bootstrapped successfully.');
          }
        }
      } catch (schemaErr) {
        console.warn('[Schema Init Warning]:', schemaErr);
      }

      // 2. Silent migration to add sorting and API key columns if they don't exist yet
      await Promise.all([
        sql`ALTER TABLE roster ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;`,
        sql`ALTER TABLE staff ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;`,
        sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS imgbb_api_key TEXT DEFAULT '';`
      ]).catch(err => console.warn('[Migration Warning]:', err));

      const [
        settingsRes, matchesRes, rosterRes, staffRes,
        modalitiesRes, trophiesRes, aboutRes, galleryRes,
        socialRes, recentRes, communityRes, loginLogsRes
      ] = await Promise.all([
        sql`SELECT * FROM site_settings WHERE id = 1 LIMIT 1;`,
        sql`SELECT * FROM matches;`,
        sql`SELECT * FROM roster ORDER BY sort_order ASC, created_at DESC;`,
        sql`SELECT * FROM staff ORDER BY sort_order ASC, created_at DESC;`,
        sql`SELECT * FROM modalities;`,
        sql`SELECT * FROM trophies;`,
        sql`SELECT * FROM about_settings WHERE id = 1 LIMIT 1;`,
        sql`SELECT * FROM gallery;`,
        sql`SELECT * FROM social_feeds;`,
        sql`SELECT * FROM recent_tournaments;`,
        sql`SELECT * FROM community_tournaments;`,
        sql`SELECT * FROM login_logs ORDER BY timestamp DESC LIMIT 200;`
      ]);

      const payload = {
        settings: settingsRes.rows[0] || null,
        matches: matchesRes.rows || [],
        roster: rosterRes.rows || [],
        staff: staffRes.rows || [],
        modalities: modalitiesRes.rows || [],
        trophies: trophiesRes.rows || [],
        about: aboutRes.rows[0] || null,
        gallery: galleryRes.rows || [],
        social: socialRes.rows || [],
        recentTournaments: recentRes.rows || [],
        communityTournaments: communityRes.rows || [],
        loginLogs: loginLogsRes.rows || [],
        provider: 'azure-postgresql',
        updatedAt: new Date().toISOString()
      };

      return res.status(200).json(payload);
    } catch (err) {
      console.error('[Vercel Postgres Data API Error]:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(500).json({ error: 'Postgres database connection string not configured.' });
};
