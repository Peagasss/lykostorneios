-- ============================================================================
-- LYKOS E-SPORTS - AZURE / VERCEL POSTGRES ALL-IN-ONE SCRIPT
-- Enclosed in a single transaction block (DO $$ ... $$;)
-- ============================================================================

-- 1. SITE SETTINGS
  CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    team_name TEXT DEFAULT 'LYKOS',
    logo_url TEXT DEFAULT 'assets/logo.png',
    header_logo_url TEXT DEFAULT 'assets/logo.png',
    favicon_url TEXT DEFAULT 'assets/favicon.png',
    primary_color TEXT DEFAULT '#4d00b5',
    show_tournaments_tab BOOLEAN DEFAULT false,
    hero_title TEXT DEFAULT 'SANGUE.GARRA.GLÓRIA.',
    hero_subtitle TEXT DEFAULT 'A organização oficial de e-sports de alta performance.',
    discord_url TEXT DEFAULT 'https://discord.gg/lykosesports',
    instagram_url TEXT DEFAULT 'https://instagram.com/lykosesports',
    x_url TEXT DEFAULT 'https://x.com/lykosesports',
    facebook_url TEXT DEFAULT 'https://facebook.com/lykosesports',
    contact_socials_json JSONB DEFAULT '[]'::jsonb,
    hero_image_url TEXT DEFAULT '',
    imgbb_api_key TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
  );

  INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

  -- 2. MODALITIES
  CREATE TABLE IF NOT EXISTS modalities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 3. ROSTER
  CREATE TABLE IF NOT EXISTS roster (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    game TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    mouse TEXT DEFAULT '',
    keyboard TEXT DEFAULT '',
    headset TEXT DEFAULT '',
    microphone TEXT DEFAULT '',
    mousepad TEXT DEFAULT '',
    monitor TEXT DEFAULT '',
    social_x TEXT DEFAULT '',
    social_instagram TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 4. STAFF
  CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    role TEXT NOT NULL,
    game TEXT NOT NULL,
    photo_url TEXT DEFAULT '',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 5. MATCHES
  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    game TEXT NOT NULL,
    opponent_name TEXT NOT NULL,
    opponent_logo TEXT DEFAULT '',
    tournament_name TEXT NOT NULL,
    match_date TEXT NOT NULL,
    format TEXT DEFAULT 'MD3',
    status TEXT DEFAULT 'UPCOMING',
    score_lykos INT DEFAULT 0,
    score_opponent INT DEFAULT 0,
    stream_url TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    maps_json JSONB DEFAULT '[]'::jsonb,
    player_kdas JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 6. TROPHIES
  CREATE TABLE IF NOT EXISTS trophies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year TEXT DEFAULT '',
    game TEXT DEFAULT '',
    prize TEXT DEFAULT '',
    mvp TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 7. ABOUT SETTINGS
  CREATE TABLE IF NOT EXISTS about_settings (
    id INT PRIMARY KEY DEFAULT 1,
    history_text TEXT DEFAULT '',
    mission_text TEXT DEFAULT '',
    stat_trophies TEXT DEFAULT '14+',
    stat_winrate TEXT DEFAULT '78%',
    stat_community TEXT DEFAULT '500K+',
    about_image_url TEXT DEFAULT '',
    CONSTRAINT single_about_row CHECK (id = 1)
  );

  INSERT INTO about_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

  -- 8. GALLERY
  CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Campeonatos',
    image_url TEXT NOT NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 9. SOCIAL FEEDS
  CREATE TABLE IF NOT EXISTS social_feeds (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    title TEXT NOT NULL,
    embed_url TEXT NOT NULL,
    post_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 10. RECENT TOURNAMENTS
  CREATE TABLE IF NOT EXISTS recent_tournaments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    year TEXT DEFAULT '',
    placement TEXT DEFAULT '',
    prize TEXT DEFAULT '',
    game TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 11. COMMUNITY TOURNAMENTS
  CREATE TABLE IF NOT EXISTS community_tournaments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    game TEXT DEFAULT '',
    date TEXT DEFAULT '',
    prize_pool TEXT DEFAULT '',
    max_teams INT DEFAULT 16,
    registered_teams INT DEFAULT 0,
    description TEXT DEFAULT '',
    rules_url TEXT DEFAULT '',
    registration_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 12. APP USERS
  CREATE TABLE IF NOT EXISTS app_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    "fullName" TEXT DEFAULT '',
    password TEXT NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb,
    is_master BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

  -- 13. LOGIN LOGS
  CREATE TABLE IF NOT EXISTS login_logs (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    user_name TEXT DEFAULT '',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
  );

-- Schema end
