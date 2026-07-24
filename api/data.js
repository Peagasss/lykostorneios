const { sql } = require('@vercel/postgres');
const { createClient } = require('@supabase/supabase-js');

let cache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL_MS = 10000;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = Date.now();
  if (cache.data && (now - cache.timestamp < CACHE_TTL_MS)) {
    return res.status(200).json({ ...cache.data, cached: true });
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

      cache.data = payload;
      cache.timestamp = now;
      return res.status(200).json({ ...payload, cached: false });
    } catch (err) {
      console.warn('[Vercel Postgres] Query warning, trying Supabase fallback:', err.message);
    }
  }

  // 2. Fallback to Supabase
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://kwrrhqommtdqvowrfbcp.supabase.co';
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_XVbHrN_u7L9EneAmLYTvag_3b1tMlLb';
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const safeSelect = async (query, fallback = []) => {
      try {
        const { data, error } = await query;
        return (data && !error) ? data : fallback;
      } catch (e) {
        return fallback;
      }
    };

    const [
      settings, matches, roster, staff, modalities,
      trophies, about, gallery, social, recentTournaments, communityTournaments
    ] = await Promise.all([
      safeSelect(supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(), null),
      safeSelect(supabase.from('matches').select('*')),
      safeSelect(supabase.from('roster').select('*')),
      safeSelect(supabase.from('staff').select('*')),
      safeSelect(supabase.from('modalities').select('*')),
      safeSelect(supabase.from('trophies').select('*')),
      safeSelect(supabase.from('about_settings').select('*').eq('id', 1).maybeSingle(), null),
      safeSelect(supabase.from('gallery').select('*')),
      safeSelect(supabase.from('social_feeds').select('*')),
      safeSelect(supabase.from('recent_tournaments').select('*')),
      safeSelect(supabase.from('community_tournaments').select('*'))
    ]);

    const payload = {
      settings, matches, roster, staff, modalities,
      trophies, about, gallery, social, recentTournaments, communityTournaments,
      provider: 'supabase',
      updatedAt: new Date().toISOString()
    };

    cache.data = payload;
    cache.timestamp = now;
    return res.status(200).json({ ...payload, cached: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
