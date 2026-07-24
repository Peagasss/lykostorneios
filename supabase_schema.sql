-- ============================================================================
-- LYKOS E-SPORTS - SUPABASE DATABASE SCHEMA
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  team_name VARCHAR(255) DEFAULT 'LYKOS',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  hero_title TEXT DEFAULT 'DOMINANDO O CENÁRIO DE E-SPORTS',
  hero_subtitle TEXT DEFAULT 'Excelência, garra e paixão. LYKOS representa a elite dos jogos competitivos de Valorant e CS2.',
  hero_image_url TEXT DEFAULT '',
  primary_color VARCHAR(50) DEFAULT '#4d00b5',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game VARCHAR(50) NOT NULL,
  opponent_name VARCHAR(255) NOT NULL,
  opponent_logo TEXT DEFAULT '',
  tournament_name VARCHAR(255) NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  format VARCHAR(50) DEFAULT 'BO3',
  status VARCHAR(50) DEFAULT 'UPCOMING',
  score_lykos INT DEFAULT 0,
  score_opponent INT DEFAULT 0,
  maps_json JSONB DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.roster (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL,
  game VARCHAR(50) NOT NULL,
  role VARCHAR(100) NOT NULL,
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  social_x VARCHAR(255) DEFAULT '',
  social_instagram VARCHAR(255) DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'Campeonatos',
  is_highlight BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.social_feeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  embed_url TEXT NOT NULL,
  post_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.site_settings (id, team_name, hero_title, hero_subtitle, primary_color)
VALUES (1, 'LYKOS', 'DOMINANDO O CENÁRIO DE E-SPORTS', 'Excelência, garra e paixão. LYKOS representa a elite dos jogos competitivos de Valorant e CS2.', '#4d00b5')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_first_user_admin();

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roster ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_feeds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Read Matches" ON public.matches;
DROP POLICY IF EXISTS "Public Read Roster" ON public.roster;
DROP POLICY IF EXISTS "Public Read Gallery" ON public.gallery;
DROP POLICY IF EXISTS "Public Read Social Feeds" ON public.social_feeds;
DROP POLICY IF EXISTS "Public Read User Roles" ON public.user_roles;

DROP POLICY IF EXISTS "Admin Write Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Write Matches" ON public.matches;
DROP POLICY IF EXISTS "Admin Write Roster" ON public.roster;
DROP POLICY IF EXISTS "Admin Write Gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin Write Social Feeds" ON public.social_feeds;
DROP POLICY IF EXISTS "Admin Write User Roles" ON public.user_roles;

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

ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public App Users" ON public.app_users;
DROP POLICY IF EXISTS "Public Login Logs" ON public.login_logs;

CREATE POLICY "Public App Users" ON public.app_users FOR ALL USING (true);
CREATE POLICY "Public Login Logs" ON public.login_logs FOR ALL USING (true);

