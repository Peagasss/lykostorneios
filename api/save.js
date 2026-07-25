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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { entity, item } = req.body || {};
  if (!entity || !item) return res.status(400).json({ error: 'Faltam dados para salvar.' });

  try {
    // 1. Silent schema migration / initialization if database is empty (self-bootstraps new Neon DBs)
    const dbUrl = process.env.AZURE_POSTGRES_URL || process.env.NEON_URL || process.env.POSTGRES_URL;
    if (dbUrl) {
      try {
        const checkTable = await sql`SELECT to_regclass('public.site_settings');`;
        if (!checkTable.rows[0] || !checkTable.rows[0].to_regclass) {
          const fs = require('fs');
          const path = require('path');
          const schemaPath = path.join(process.cwd(), 'neon_schema.sql');
          if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await sql.query(schemaSql);
            console.log('[LykosDB] Neon database schema self-bootstrapped successfully from Save API.');
          }
        }
      } catch (schemaErr) {
        console.warn('[Schema Init Warning from Save API]:', schemaErr);
      }

      // 1.1 Silent migration to add sorting and API key columns if they don't exist yet
      await Promise.all([
        sql`ALTER TABLE roster ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;`,
        sql`ALTER TABLE staff ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;`,
        sql`ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS imgbb_api_key TEXT DEFAULT '';`
      ]).catch(err => console.warn('[Migration Warning from Save API]:', err));
    }

    if (entity === 'site_settings') {
      await sql`
        INSERT INTO site_settings (id, team_name, logo_url, header_logo_url, favicon_url, primary_color, show_tournaments_tab, hero_title, hero_subtitle, discord_url, instagram_url, x_url, facebook_url, contact_socials_json, hero_image_url, imgbb_api_key, updated_at)
        VALUES (1, ${item.team_name || 'LYKOS'}, ${item.logo_url || ''}, ${item.header_logo_url || ''}, ${item.favicon_url || ''}, ${item.primary_color || '#4d00b5'}, ${item.show_tournaments_tab || false}, ${item.hero_title || ''}, ${item.hero_subtitle || ''}, ${item.discord_url || ''}, ${item.instagram_url || ''}, ${item.x_url || ''}, ${item.facebook_url || ''}, ${JSON.stringify(item.contact_socials_json || [])}, ${item.hero_image_url || ''}, ${item.imgbb_api_key || ''}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          team_name = EXCLUDED.team_name,
          logo_url = EXCLUDED.logo_url,
          header_logo_url = EXCLUDED.header_logo_url,
          favicon_url = EXCLUDED.favicon_url,
          primary_color = EXCLUDED.primary_color,
          show_tournaments_tab = EXCLUDED.show_tournaments_tab,
          hero_title = EXCLUDED.hero_title,
          hero_subtitle = EXCLUDED.hero_subtitle,
          discord_url = EXCLUDED.discord_url,
          instagram_url = EXCLUDED.instagram_url,
          x_url = EXCLUDED.x_url,
          facebook_url = EXCLUDED.facebook_url,
          contact_socials_json = EXCLUDED.contact_socials_json,
          hero_image_url = EXCLUDED.hero_image_url,
          imgbb_api_key = EXCLUDED.imgbb_api_key,
          updated_at = NOW();
      `;
    } else if (entity === 'about_settings') {
      await sql`
        INSERT INTO about_settings (id, history_text, mission_text, stat_trophies, stat_winrate, stat_community, about_image_url)
        VALUES (1, ${item.history_text || ''}, ${item.mission_text || ''}, ${item.stat_trophies || '14+'}, ${item.stat_winrate || '78%'}, ${item.stat_community || '500K+'}, ${item.about_image_url || ''})
        ON CONFLICT (id) DO UPDATE SET
          history_text = EXCLUDED.history_text,
          mission_text = EXCLUDED.mission_text,
          stat_trophies = EXCLUDED.stat_trophies,
          stat_winrate = EXCLUDED.stat_winrate,
          stat_community = EXCLUDED.stat_community,
          about_image_url = EXCLUDED.about_image_url;
      `;
    } else if (entity === 'roster') {
      await sql`
        INSERT INTO roster (id, name, nickname, game, role, bio, photo_url, mouse, keyboard, headset, microphone, mousepad, monitor, social_x, social_instagram, sort_order, created_at)
        VALUES (${String(item.id)}, ${item.name}, ${item.nickname}, ${item.game}, ${item.role}, ${item.bio || ''}, ${item.photo_url || ''}, ${item.mouse || ''}, ${item.keyboard || ''}, ${item.headset || ''}, ${item.microphone || ''}, ${item.mousepad || ''}, ${item.monitor || ''}, ${item.social_x || ''}, ${item.social_instagram || ''}, ${item.sort_order || 0}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name, nickname = EXCLUDED.nickname, game = EXCLUDED.game, role = EXCLUDED.role,
          bio = EXCLUDED.bio, photo_url = EXCLUDED.photo_url, mouse = EXCLUDED.mouse, keyboard = EXCLUDED.keyboard,
          headset = EXCLUDED.headset, microphone = EXCLUDED.microphone, mousepad = EXCLUDED.mousepad, monitor = EXCLUDED.monitor,
          social_x = EXCLUDED.social_x, social_instagram = EXCLUDED.social_instagram, sort_order = EXCLUDED.sort_order;
      `;
    } else if (entity === 'staff') {
      await sql`
        INSERT INTO staff (id, name, nickname, role, game, photo_url, sort_order, created_at)
        VALUES (${String(item.id)}, ${item.name}, ${item.nickname}, ${item.role}, ${item.game}, ${item.photo_url || ''}, ${item.sort_order || 0}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name, nickname = EXCLUDED.nickname, role = EXCLUDED.role, game = EXCLUDED.game, photo_url = EXCLUDED.photo_url, sort_order = EXCLUDED.sort_order;
      `;
    } else if (entity === 'matches') {
      await sql`
        INSERT INTO matches (id, game, opponent_name, opponent_logo, tournament_name, match_date, format, status, score_lykos, score_opponent, stream_url, notes, maps_json, player_kdas, created_at)
        VALUES (${String(item.id)}, ${item.game}, ${item.opponent_name}, ${item.opponent_logo || ''}, ${item.tournament_name}, ${item.match_date}, ${item.format || 'MD3'}, ${item.status || 'UPCOMING'}, ${item.score_lykos || 0}, ${item.score_opponent || 0}, ${item.stream_url || ''}, ${item.notes || ''}, ${JSON.stringify(item.maps_json || [])}, ${JSON.stringify(item.player_kdas || [])}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          game = EXCLUDED.game, opponent_name = EXCLUDED.opponent_name, opponent_logo = EXCLUDED.opponent_logo,
          tournament_name = EXCLUDED.tournament_name, match_date = EXCLUDED.match_date, format = EXCLUDED.format,
          status = EXCLUDED.status, score_lykos = EXCLUDED.score_lykos, score_opponent = EXCLUDED.score_opponent,
          stream_url = EXCLUDED.stream_url, notes = EXCLUDED.notes, maps_json = EXCLUDED.maps_json, player_kdas = EXCLUDED.player_kdas;
      `;
    } else if (entity === 'trophies') {
      await sql`
        INSERT INTO trophies (id, title, year, game, prize, mvp, image_url, description, created_at)
        VALUES (${String(item.id)}, ${item.title}, ${item.year || ''}, ${item.game || ''}, ${item.prize || ''}, ${item.mvp || ''}, ${item.image_url || ''}, ${item.description || ''}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title, year = EXCLUDED.year, game = EXCLUDED.game, prize = EXCLUDED.prize,
          mvp = EXCLUDED.mvp, image_url = EXCLUDED.image_url, description = EXCLUDED.description;
      `;
    } else if (entity === 'modalities') {
      await sql`
        INSERT INTO modalities (id, name, icon_url, description, created_at)
        VALUES (${String(item.id)}, ${item.name}, ${item.icon_url || ''}, ${item.description || ''}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name, icon_url = EXCLUDED.icon_url, description = EXCLUDED.description;
      `;
    } else if (entity === 'gallery') {
      await sql`
        INSERT INTO gallery (id, title, category, image_url, description, created_at)
        VALUES (${String(item.id)}, ${item.title}, ${item.category || 'Campeonatos'}, ${item.image_url}, ${item.description || ''}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title, category = EXCLUDED.category, image_url = EXCLUDED.image_url, description = EXCLUDED.description;
      `;
    } else if (entity === 'social_feeds') {
      await sql`
        INSERT INTO social_feeds (id, platform, title, embed_url, post_url, created_at)
        VALUES (${String(item.id)}, ${item.platform}, ${item.title}, ${item.embed_url}, ${item.post_url || ''}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          platform = EXCLUDED.platform, title = EXCLUDED.title, embed_url = EXCLUDED.embed_url, post_url = EXCLUDED.post_url;
      `;
    } else if (entity === 'recent_tournaments') {
      await sql`
        INSERT INTO recent_tournaments (id, name, year, placement, prize, game, created_at)
        VALUES (${String(item.id)}, ${item.name}, ${item.year || ''}, ${item.placement || ''}, ${item.prize || ''}, ${item.game || ''}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name, year = EXCLUDED.year, placement = EXCLUDED.placement, prize = EXCLUDED.prize, game = EXCLUDED.game;
      `;
    } else if (entity === 'community_tournaments') {
      await sql`
        INSERT INTO community_tournaments (id, name, game, date, prize_pool, max_teams, registered_teams, description, rules_url, registration_open, created_at)
        VALUES (${String(item.id)}, ${item.name}, ${item.game || ''}, ${item.date || ''}, ${item.prize_pool || ''}, ${item.max_teams || 16}, ${item.registered_teams || 0}, ${item.description || ''}, ${item.rules_url || ''}, ${item.registration_open !== false}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name, game = EXCLUDED.game, date = EXCLUDED.date, prize_pool = EXCLUDED.prize_pool,
          max_teams = EXCLUDED.max_teams, registered_teams = EXCLUDED.registered_teams, description = EXCLUDED.description,
          rules_url = EXCLUDED.rules_url, registration_open = EXCLUDED.registration_open;
      `;
    } else if (entity === 'app_users') {
      await sql`
        INSERT INTO app_users (id, email, "fullName", password, permissions, is_master, created_at)
        VALUES (${String(item.id)}, ${item.email}, ${item.fullName || ''}, ${item.password}, ${JSON.stringify(item.permissions || [])}, ${item.is_master || false}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email, "fullName" = EXCLUDED."fullName", password = EXCLUDED.password, permissions = EXCLUDED.permissions, is_master = EXCLUDED.is_master;
      `;
    } else if (entity === 'login_logs') {
      await sql`
        INSERT INTO login_logs (id, user_email, user_name, timestamp)
        VALUES (${String(item.id)}, ${item.user_email}, ${item.user_name || ''}, ${item.timestamp})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[Save API Error]:', err);
    return res.status(500).json({ error: err.message });
  }
};
