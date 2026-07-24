const { sql } = require('@vercel/postgres');
const { createClient } = require('@supabase/supabase-js');

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

  // 1. Try Vercel / Neon Postgres first (ultra fast < 20ms)
  if (process.env.POSTGRES_URL) {
    try {
      const [
        settingsRes, matchesRes, rosterRes, staffRes,
        modalitiesRes, trophiesRes, aboutRes, galleryRes,
        socialRes, recentRes, communityRes
      ] = await Promise.all([
        sql`SELECT * FROM site_settings WHERE id = 1 LIMIT 1;`,
        sql`SELECT * FROM matches;`,
        sql`SELECT * FROM roster;`,
        sql`SELECT * FROM staff;`,
        sql`SELECT * FROM modalities;`,
        sql`SELECT * FROM trophies;`,
        sql`SELECT * FROM about_settings WHERE id = 1 LIMIT 1;`,
        sql`SELECT * FROM gallery;`,
        sql`SELECT * FROM social_feeds;`,
        sql`SELECT * FROM recent_tournaments;`,
        sql`SELECT * FROM community_tournaments;`
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
        provider: 'neon-postgres',
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
