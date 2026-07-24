const { createClient } = require('@supabase/supabase-js');

// Server-side cache in memory
let cache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL_MS = 10000; // 10 seconds cache

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://kwrrhqommtdqvowrfbcp.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_XVbHrN_u7L9EneAmLYTvag_3b1tMlLb';

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const now = Date.now();
  if (cache.data && (now - cache.timestamp < CACHE_TTL_MS)) {
    return res.status(200).json({ ...cache.data, cached: true });
  }

  try {
    const safeSelect = async (query, fallback = []) => {
      try {
        const { data, error } = await query;
        return (data && !error) ? data : fallback;
      } catch (e) {
        return fallback;
      }
    };

    const [
      settings,
      matches,
      roster,
      staff,
      modalities,
      trophies,
      about,
      gallery,
      social,
      recentTournaments,
      communityTournaments
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
      settings,
      matches,
      roster,
      staff,
      modalities,
      trophies,
      about,
      gallery,
      social,
      recentTournaments,
      communityTournaments,
      updatedAt: new Date().toISOString()
    };

    cache.data = payload;
    cache.timestamp = now;

    res.status(200).json({ ...payload, cached: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
