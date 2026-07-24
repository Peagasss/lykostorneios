-- ============================================================================
-- LYKOS E-SPORTS - SUPABASE MIGRATION SCRIPT
-- Run this FIRST in the Supabase SQL Editor (replaces the old schema script)
-- This script is safe to run multiple times (idempotent)
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE TABLES (if they don't exist yet)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  team_name TEXT DEFAULT 'LYKOS',
  logo_url TEXT DEFAULT 'assets/logo.png',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS public.modalities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.roster (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  role TEXT NOT NULL,
  game TEXT NOT NULL,
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.matches (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.trophies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year TEXT DEFAULT '',
  game TEXT DEFAULT '',
  prize TEXT DEFAULT '',
  mvp TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.about_settings (
  id INT PRIMARY KEY DEFAULT 1,
  history_text TEXT DEFAULT '',
  mission_text TEXT DEFAULT '',
  stat_trophies TEXT DEFAULT '14+',
  stat_winrate TEXT DEFAULT '78%',
  stat_community TEXT DEFAULT '500K+',
  about_image_url TEXT DEFAULT '',
  CONSTRAINT single_about_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Campeonatos',
  image_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.social_feeds (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  embed_url TEXT NOT NULL,
  post_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.recent_tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  year TEXT DEFAULT '',
  placement TEXT DEFAULT '',
  prize TEXT DEFAULT '',
  game TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.community_tournaments (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.app_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  "fullName" TEXT DEFAULT '',
  password TEXT NOT NULL,
  permissions JSONB DEFAULT '[]'::jsonb,
  is_master BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.login_logs (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT DEFAULT '',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- STEP 2: MIGRATE EXISTING TABLES — ADD MISSING COLUMNS SAFELY
-- These ALTER TABLE statements are safe to run even if columns already exist
-- ============================================================================

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS header_logo_url TEXT DEFAULT 'assets/logo.png';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT 'assets/favicon.png';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#4d00b5';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS show_tournaments_tab BOOLEAN DEFAULT false;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'SANGUE.GARRA.GLÓRIA.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'A organização oficial de e-sports de alta performance.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS discord_url TEXT DEFAULT 'https://discord.gg/lykosesports';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT 'https://instagram.com/lykosesports';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS x_url TEXT DEFAULT 'https://x.com/lykosesports';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT 'https://facebook.com/lykosesports';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_socials_json JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT '';

-- Ensure single row exists for site_settings
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY + OPEN READ/WRITE POLICIES
-- ============================================================================

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public Open Access" ON public.%I;', t);
    EXECUTE format(
      'CREATE POLICY "Public Open Access" ON public.%I FOR ALL USING (true) WITH CHECK (true);',
      t
    );
  END LOOP;
END $$;

-- ============================================================================
-- STEP 4: CREATE PUBLIC STORAGE BUCKET FOR UPLOADED IMAGES
-- Allows /admin to upload logos, banners, etc. as real public URLs
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anonymous reads (anyone can view images)
DROP POLICY IF EXISTS "Public read assets" ON storage.objects;
CREATE POLICY "Public read assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assets');

-- Allow anonymous writes (admin can upload without authentication)
DROP POLICY IF EXISTS "Public upload assets" ON storage.objects;
CREATE POLICY "Public upload assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'assets');

-- Allow anonymous deletes / updates (admin can replace images)
DROP POLICY IF EXISTS "Public update assets" ON storage.objects;
CREATE POLICY "Public update assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'assets');

DROP POLICY IF EXISTS "Public delete assets" ON storage.objects;
CREATE POLICY "Public delete assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'assets');
