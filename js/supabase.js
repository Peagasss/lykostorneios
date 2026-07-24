/* ==========================================================================
   LYKOS E-SPORTS - DATA ACCESS LAYER (With Supabase Sync & Local Fallback)
   ========================================================================== */

function safeParse(jsonString, fallback) {
  if (!jsonString) return fallback;
  try {
    const parsed = JSON.parse(jsonString);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

const DEFAULT_SETTINGS = {
  team_name: 'LYKOS',
  primary_color: '#4d00b5',
  logo_url: 'assets/logo.png',
  header_logo_url: 'assets/logo.png',
  favicon_url: 'assets/favicon.png',
  show_tournaments_tab: false,
  hero_title: 'SANGUE.GARRA.GLÓRIA.',
  hero_subtitle: 'A organização oficial de e-sports de alta performance.',
  discord_url: 'https://discord.gg/lykosesports',
  instagram_url: 'https://instagram.com/lykosesports',
  x_url: 'https://x.com/lykosesports',
  facebook_url: 'https://facebook.com/lykosesports',
  contact_socials_json: [
    { name: 'Discord', platform: 'discord', url: 'https://discord.gg/lykosesports' },
    { name: 'Instagram', platform: 'instagram', url: 'https://instagram.com/lykosesports' },
    { name: 'X (Twitter)', platform: 'x', url: 'https://x.com/lykosesports' }
  ],
  hero_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80'
};

const DEFAULT_MODALITIES = [
  { id: '1', name: 'Valorant', icon_url: '', description: '5v5 Tactical Shooter' },
  { id: '2', name: 'CS2', icon_url: '', description: 'Counter-Strike 2 Tactical FPS' },
  { id: '3', name: 'League of Legends', icon_url: '', description: '5v5 MOBA Competitivo' }
];

const DEFAULT_ROSTER = [
  {
    id: '1',
    name: 'Erick Santos',
    nickname: 'ASPAS',
    game: 'Valorant',
    role: 'Duelist / Entry',
    bio: 'Campeão mundial e MVP de múltiplos torneios internacionais de Valorant.',
    photo_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80',
    mouse: 'Logitech G Pro X Superlight 2',
    keyboard: 'Wooting 60HE',
    headset: 'HyperX Cloud III Wireless',
    microphone: 'Shure SM7B',
    mousepad: 'Artisan Zero Soft XL',
    monitor: 'BenQ ZOWIE XL2566K 360Hz',
    social_x: 'https://x.com',
    social_instagram: 'https://instagram.com'
  }
];

const DEFAULT_STAFF = [
  { id: 'st1', name: 'Rodrigo Silva', nickname: 'ONQ', role: 'Head Coach', game: 'Valorant', photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'st2', name: 'Felipe Mendonça', nickname: 'SAGE', role: 'CEO & Fundador', game: 'Geral', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'st3', name: 'Mariana Costa', nickname: 'MAVR', role: 'Performance Manager', game: 'Geral', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' }
];

const DEFAULT_MATCHES = [
  {
    id: 'm1',
    game: 'Valorant',
    opponent_name: 'Sentinels',
    opponent_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    tournament_name: 'VCT Americas Stage 2',
    format: 'MD3',
    match_date: '2026-08-15T18:00',
    status: 'UPCOMING',
    score_lykos: 0,
    score_opponent: 0,
    stream_url: 'https://www.twitch.tv/valorant_br',
    notes: 'Grande final da chave superior valendo vaga no Masters.',
    maps_json: [
      { map_name: 'Ascent', map_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', score_lykos: 13, score_opponent: 9 },
      { map_name: 'Haven', map_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', score_lykos: 13, score_opponent: 11 }
    ],
    player_kdas: [
      { nickname: 'ASPAS', kills: 28, deaths: 14, assists: 6, first_kills: 5, first_deaths: 2, team: 'LYKOS' },
      { nickname: 'LESS', kills: 20, deaths: 12, assists: 9, first_kills: 3, first_deaths: 1, team: 'LYKOS' },
      { nickname: 'TENZ', kills: 22, deaths: 16, assists: 4, first_kills: 4, first_deaths: 3, team: 'Sentinels' },
      { nickname: 'ZEKKEN', kills: 18, deaths: 17, assists: 5, first_kills: 2, first_deaths: 4, team: 'Sentinels' }
    ]
  }
];

const DEFAULT_TROPHIES = [
  {
    id: 't1',
    title: 'VCT Americas Champions',
    year: '2026',
    game: 'Valorant',
    prize: '$250.000 USD',
    mvp: 'ASPAS',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    description: 'Vitória invicta na grande final em Los Angeles.'
  }
];

const DEFAULT_ABOUT = {
  history_text: 'Fundada em 2024, a LYKOS nasceu com o propósito de redefinir os padrões do e-sports sul-americano.',
  mission_text: 'Desenvolver atletas de alta performance com disciplina e infraestrutura de classe mundial.',
  stat_trophies: '14+',
  stat_winrate: '78%',
  stat_community: '500K+',
  about_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
};

const DEFAULT_GALLERY = [
  { id: 'g1', title: 'Levantando o Troféu', category: 'Campeonatos', image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80', description: 'Comemoração no palco principal do VCT Americas.' }
];

const DEFAULT_SOCIAL = [
  {
    id: 's1',
    platform: 'instagram',
    title: 'Bastidores do Treino',
    embed_url: `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DZ28WXqmF6y/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DZ28WXqmF6y/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">Ver essa foto no Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/DZ28WXqmF6y/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">Um post compartilhado por LEVIATAN (@leviatangg)</a></p></div></blockquote>`,
    post_url: 'https://www.instagram.com/p/DZ28WXqmF6y/'
  }
];

const DEFAULT_RECENT_TOURNAMENTS = [
  { id: 'rec1', name: 'VCT Americas Stage 2', year: '2026', placement: '1º Lugar (Campeão)', prize: '$250.000', game: 'Valorant' },
  { id: 'rec2', name: 'CS2 Major Championship', year: '2025', placement: '2º Lugar (Vice-Campeão)', prize: '$150.000', game: 'CS2' },
  { id: 'rec3', name: 'CBLOL Split 1', year: '2025', placement: '1º Lugar (Campeão)', prize: 'R$ 100.000', game: 'League of Legends' }
];

const DEFAULT_COMMUNITY_TOURNAMENTS = [];

const DEFAULT_USERS = [
  {
    id: 'u1',
    email: 'admin@lykos-esports.com',
    fullName: 'Administrador Master',
    role: 'admin',
    password: 'admin123',
    is_master: true,
    permissions: [
      'partidas', 'torneios', 'elenco', 'staff',
      'modalidades', 'trophies', 'recentTournaments',
      'about', 'galeria', 'social', 'branding', 'roles'
    ]
  }
];

let _supabase = null;
function getSupabaseClient() {
  if (_supabase) return _supabase;
  const config = window.LYKOS_CONFIG || {};
  const url = config.SUPABASE_URL;
  const key = config.SUPABASE_ANON_KEY;

  if (url && key && !url.includes("your-supabase-project")) {
    try {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        _supabase = window.supabase.createClient(url, key);
      } else if (typeof window.createClient === 'function') {
        _supabase = window.createClient(url, key);
      }
    } catch (e) {
      console.warn("[LykosDB] Supabase init warning:", e);
    }
  }
  return _supabase;
}

// Helpers for Supabase real-time sync with instant local cache (stale-while-revalidate)
async function fetchSupabaseOrLocal(tableName, storageKey, fallbackDefault) {
  const raw = localStorage.getItem(storageKey);
  const localData = safeParse(raw, null);
  const sb = getSupabaseClient();

  if (!sb) {
    return localData !== null ? localData : fallbackDefault;
  }

  // Remote fetch to sync cache
  const remotePromise = (async () => {
    try {
      const { data, error } = await sb.from(tableName).select('*');
      if (data && !error && data.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn(`[LykosDB] Supabase select error for ${tableName}:`, e);
    }
    return null;
  })();

  // Instant zero-latency render if local cache exists
  if (localData !== null) {
    remotePromise.then(() => {});
    return localData;
  }

  // Fast timeout fallback for first visit
  const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1200));
  const result = await Promise.race([remotePromise, timeoutPromise]);
  return result !== null ? result : fallbackDefault;
}

async function saveSupabaseAndLocal(tableName, storageKey, fullList, singleItem) {
  localStorage.setItem(storageKey, JSON.stringify(fullList));
  const sb = getSupabaseClient();
  if (sb && singleItem) {
    try {
      const { data, error } = await sb.from(tableName).upsert(singleItem);
      if (error) {
        console.error(`[LykosDB] Supabase upsert error on table '${tableName}':`, error);
        if (error.code === '42P01') {
          console.warn(`[LykosDB] A tabela '${tableName}' ainda não foi criada no Supabase SQL Editor.`);
        }
      }
    } catch (e) {
      console.warn(`[LykosDB] Supabase upsert exception for ${tableName}:`, e);
    }
  }
}

async function deleteSupabaseAndLocal(tableName, storageKey, fullList, itemId) {
  localStorage.setItem(storageKey, JSON.stringify(fullList));
  const sb = getSupabaseClient();
  if (sb && itemId) {
    try {
      const { error } = await sb.from(tableName).delete().eq('id', String(itemId));
      if (error) {
        console.error(`[LykosDB] Supabase delete error on table '${tableName}':`, error);
      }
    } catch (e) {
      console.warn(`[LykosDB] Supabase delete exception for ${tableName}:`, e);
    }
  }
}

window.LykosDB = {
  getTheme() {
    return localStorage.getItem('lykos_theme') || 'dark';
  },
  setTheme(theme) {
    localStorage.setItem('lykos_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    window.dispatchEvent(new Event('lykos_theme_changed'));
  },

  async getSettings() {
    const rawLocal = localStorage.getItem('lykos_settings');
    const localParsed = safeParse(rawLocal, {});
    const currentSettings = { ...DEFAULT_SETTINGS, ...localParsed };

    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('site_settings').select('*').eq('id', 1).maybeSingle();
        if (data && !error) {
          const localTime = localParsed.updated_at ? new Date(localParsed.updated_at).getTime() : 0;
          const remoteTime = data.updated_at ? new Date(data.updated_at).getTime() : 0;

          if (remoteTime >= localTime) {
            let updated = false;
            Object.keys(data).forEach(key => {
              if (data[key] !== null && data[key] !== undefined && data[key] !== '' && currentSettings[key] !== data[key]) {
                currentSettings[key] = data[key];
                updated = true;
              }
            });
            if (updated) {
              localStorage.setItem('lykos_settings', JSON.stringify(currentSettings));
              window.dispatchEvent(new CustomEvent('lykos_branding_updated', { detail: currentSettings }));
            }
          }
        }
      } catch (e) {
        console.warn("[LykosDB] Supabase getSettings sync warning:", e);
      }
    }

    return currentSettings;
  },
  async saveSettings(settings) {
    const rawLocal = localStorage.getItem('lykos_settings');
    const localParsed = safeParse(rawLocal, {});
    const nowIso = new Date().toISOString();
    const mergedSettings = { ...DEFAULT_SETTINGS, ...localParsed, ...settings, updated_at: nowIso };

    localStorage.setItem('lykos_settings', JSON.stringify(mergedSettings));
    window.dispatchEvent(new CustomEvent('lykos_branding_updated', { detail: mergedSettings }));

    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('site_settings').upsert({ id: 1, ...mergedSettings, updated_at: nowIso });
        if (error) {
          console.error("[LykosDB] Supabase saveSettings error:", error);
          alert('Aviso do Supabase ao salvar marca: ' + (error.message || 'Erro de permissão ou tabela. Execute o arquivo supabase_schema.sql no Supabase.'));
        }
      } catch (e) {
        console.warn("[LykosDB] Supabase saveSettings exception:", e);
      }
    }
    return mergedSettings;
  },

  async getModalities() {
    return fetchSupabaseOrLocal('modalities', 'lykos_modalities', DEFAULT_MODALITIES);
  },
  async saveModality(modality) {
    const modalities = await this.getModalities();
    if (modality.id) {
      const idx = modalities.findIndex(m => String(m.id) === String(modality.id));
      if (idx !== -1) modalities[idx] = { ...modalities[idx], ...modality };
    } else {
      modality.id = 'mod_' + Date.now();
      modalities.push(modality);
    }
    await saveSupabaseAndLocal('modalities', 'lykos_modalities', modalities, modality);
    return modality;
  },
  async deleteModality(id) {
    let modalities = await this.getModalities();
    modalities = modalities.filter(m => String(m.id) !== String(id));
    await deleteSupabaseAndLocal('modalities', 'lykos_modalities', modalities, id);
  },

  async getRoster() {
    return fetchSupabaseOrLocal('roster', 'lykos_roster', DEFAULT_ROSTER);
  },
  async getPlayerById(id) {
    const roster = await this.getRoster();
    return roster.find(p => String(p.id) === String(id));
  },
  async savePlayer(player) {
    const roster = await this.getRoster();
    if (player.id) {
      const idx = roster.findIndex(p => String(p.id) === String(player.id));
      if (idx !== -1) roster[idx] = { ...roster[idx], ...player };
    } else {
      player.id = 'p_' + Date.now();
      roster.push(player);
    }
    await saveSupabaseAndLocal('roster', 'lykos_roster', roster, player);
    return player;
  },
  async deletePlayer(id) {
    let roster = await this.getRoster();
    roster = roster.filter(p => String(p.id) !== String(id));
    await deleteSupabaseAndLocal('roster', 'lykos_roster', roster, id);
  },

  async getStaff() {
    return fetchSupabaseOrLocal('staff', 'lykos_staff', DEFAULT_STAFF);
  },
  async saveStaff(staffMember) {
    const staff = await this.getStaff();
    if (staffMember.id) {
      const idx = staff.findIndex(s => String(s.id) === String(staffMember.id));
      if (idx !== -1) staff[idx] = { ...staff[idx], ...staffMember };
    } else {
      staffMember.id = 'st_' + Date.now();
      staff.push(staffMember);
    }
    await saveSupabaseAndLocal('staff', 'lykos_staff', staff, staffMember);
    return staffMember;
  },
  async deleteStaff(id) {
    let staff = await this.getStaff();
    staff = staff.filter(s => String(s.id) !== String(id));
    await deleteSupabaseAndLocal('staff', 'lykos_staff', staff, id);
  },

  async getMatches() {
    const matches = await fetchSupabaseOrLocal('matches', 'lykos_matches', DEFAULT_MATCHES);
    const list = Array.isArray(matches) ? matches : DEFAULT_MATCHES;
    return list.sort((a, b) => {
      const timeA = a && a.match_date ? new Date(a.match_date).getTime() : 0;
      const timeB = b && b.match_date ? new Date(b.match_date).getTime() : 0;
      return timeB - timeA;
    });
  },
  async getMatchById(id) {
    const matches = await this.getMatches();
    return matches.find(m => m && String(m.id) === String(id));
  },
  async getRelatedMatches(game, currentId) {
    const matches = await this.getMatches();
    return matches.filter(m => m && m.game === game && String(m.id) !== String(currentId) && m.status === 'FINISHED').slice(0, 3);
  },
  async saveMatch(match) {
    const matches = await this.getMatches();
    if (match.id) {
      const idx = matches.findIndex(m => String(m.id) === String(match.id));
      if (idx !== -1) matches[idx] = { ...matches[idx], ...match };
    } else {
      match.id = 'm_' + Date.now();
      matches.unshift(match);
    }
    await saveSupabaseAndLocal('matches', 'lykos_matches', matches, match);
    return match;
  },
  async deleteMatch(id) {
    let matches = await this.getMatches();
    matches = matches.filter(m => String(m.id) !== String(id));
    await deleteSupabaseAndLocal('matches', 'lykos_matches', matches, id);
  },

  async getTrophies() {
    return fetchSupabaseOrLocal('trophies', 'lykos_trophies', DEFAULT_TROPHIES);
  },
  async saveTrophy(trophy) {
    const trophies = await this.getTrophies();
    if (trophy.id) {
      const idx = trophies.findIndex(t => String(t.id) === String(trophy.id));
      if (idx !== -1) trophies[idx] = { ...trophies[idx], ...trophy };
    } else {
      trophy.id = 't_' + Date.now();
      trophies.unshift(trophy);
    }
    await saveSupabaseAndLocal('trophies', 'lykos_trophies', trophies, trophy);
    return trophy;
  },
  async deleteTrophy(id) {
    let trophies = await this.getTrophies();
    trophies = trophies.filter(t => String(t.id) !== String(id));
    await deleteSupabaseAndLocal('trophies', 'lykos_trophies', trophies, id);
  },

  async getAboutSettings() {
    const rawLocal = localStorage.getItem('lykos_about');
    const localParsed = safeParse(rawLocal, null);
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('about_settings').select('*').eq('id', 1).maybeSingle();
        if (data && !error) {
          localStorage.setItem('lykos_about', JSON.stringify(data));
          return data;
        }
      } catch (e) {}
    }
    return localParsed !== null ? localParsed : DEFAULT_ABOUT;
  },
  async saveAboutSettings(about) {
    localStorage.setItem('lykos_about', JSON.stringify(about));
    const sb = getSupabaseClient();
    if (sb) {
      try {
        await sb.from('about_settings').upsert({ id: 1, ...about });
      } catch (e) {
        console.warn("[LykosDB] Supabase saveAboutSettings error:", e);
      }
    }
    return about;
  },

  async getGallery() {
    return fetchSupabaseOrLocal('gallery', 'lykos_gallery', DEFAULT_GALLERY);
  },
  async saveGalleryItem(item) {
    const gallery = await this.getGallery();
    if (item.id) {
      const idx = gallery.findIndex(g => String(g.id) === String(item.id));
      if (idx !== -1) gallery[idx] = { ...gallery[idx], ...item };
    } else {
      item.id = 'g_' + Date.now();
      gallery.unshift(item);
    }
    await saveSupabaseAndLocal('gallery', 'lykos_gallery', gallery, item);
    return item;
  },
  async deleteGalleryItem(id) {
    let gallery = await this.getGallery();
    gallery = gallery.filter(g => String(g.id) !== String(id));
    await deleteSupabaseAndLocal('gallery', 'lykos_gallery', gallery, id);
  },

  async getSocialFeeds() {
    return fetchSupabaseOrLocal('social_feeds', 'lykos_social', DEFAULT_SOCIAL);
  },
  async saveSocialFeed(feed) {
    const feeds = await this.getSocialFeeds();
    if (feed.id) {
      const idx = feeds.findIndex(s => String(s.id) === String(feed.id));
      if (idx !== -1) feeds[idx] = { ...feeds[idx], ...feed };
    } else {
      feed.id = 's_' + Date.now();
      feeds.unshift(feed);
    }
    await saveSupabaseAndLocal('social_feeds', 'lykos_social', feeds, feed);
    return feed;
  },
  async deleteSocialFeed(id) {
    let feeds = await this.getSocialFeeds();
    feeds = feeds.filter(s => String(s.id) !== String(id));
    await deleteSupabaseAndLocal('social_feeds', 'lykos_social', feeds, id);
  },

  async getRecentTournaments() {
    return fetchSupabaseOrLocal('recent_tournaments', 'lykos_recent_tournaments', DEFAULT_RECENT_TOURNAMENTS);
  },
  async saveRecentTournament(tournament) {
    const tournaments = await this.getRecentTournaments();
    if (tournament.id) {
      const idx = tournaments.findIndex(t => String(t.id) === String(tournament.id));
      if (idx !== -1) tournaments[idx] = { ...tournaments[idx], ...tournament };
    } else {
      tournament.id = 'rec_' + Date.now();
      tournaments.unshift(tournament);
    }
    await saveSupabaseAndLocal('recent_tournaments', 'lykos_recent_tournaments', tournaments, tournament);
    return tournament;
  },
  async deleteRecentTournament(id) {
    let tournaments = await this.getRecentTournaments();
    tournaments = tournaments.filter(t => String(t.id) !== String(id));
    await deleteSupabaseAndLocal('recent_tournaments', 'lykos_recent_tournaments', tournaments, id);
  },

  async getCommunityTournaments() {
    return fetchSupabaseOrLocal('community_tournaments', 'lykos_community_tournaments', DEFAULT_COMMUNITY_TOURNAMENTS);
  },
  async saveCommunityTournament(tournament) {
    const tournaments = await this.getCommunityTournaments();
    if (tournament.id) {
      const idx = tournaments.findIndex(t => String(t.id) === String(tournament.id));
      if (idx !== -1) tournaments[idx] = { ...tournaments[idx], ...tournament };
    } else {
      tournament.id = 'tourn_' + Date.now();
      tournaments.unshift(tournament);
    }
    await saveSupabaseAndLocal('community_tournaments', 'lykos_community_tournaments', tournaments, tournament);
    return tournament;
  },
  async deleteCommunityTournament(id) {
    let tournaments = await this.getCommunityTournaments();
    tournaments = tournaments.filter(t => String(t.id) !== String(id));
    await deleteSupabaseAndLocal('community_tournaments', 'lykos_community_tournaments', tournaments, id);
  },

  async getUsers() {
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('app_users').select('*');
        if (data && !error && data.length > 0) {
          localStorage.setItem('lykos_users', JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn("[LykosDB] Supabase getUsers error, falling back to localStorage", e);
      }
    }
    const raw = localStorage.getItem('lykos_users');
    return safeParse(raw, DEFAULT_USERS);
  },
  async saveUser(user) {
    const users = await this.getUsers();
    if (user.id) {
      const idx = users.findIndex(u => String(u.id) === String(user.id));
      if (idx !== -1) users[idx] = { ...users[idx], ...user };
    } else {
      user.id = 'u_' + Date.now();
      users.push(user);
    }
    localStorage.setItem('lykos_users', JSON.stringify(users));

    const sb = getSupabaseClient();
    if (sb) {
      try {
        await sb.from('app_users').upsert({
          id: String(user.id),
          email: user.email,
          fullName: user.fullName || '',
          password: user.password,
          permissions: user.permissions || [],
          is_master: user.is_master || false
        });
      } catch (e) {
        console.warn("[LykosDB] Supabase saveUser error:", e);
      }
    }
    return user;
  },
  async saveUserRole(userId, newRole) {
    const users = await this.getUsers();
    const user = users.find(u => String(u.id) === String(userId));
    if (user) {
      user.role = newRole;
      await this.saveUser(user);
    }
  },
  async deleteUser(id) {
    let users = await this.getUsers();
    users = users.filter(u => String(u.id) !== String(id));
    localStorage.setItem('lykos_users', JSON.stringify(users));

    const sb = getSupabaseClient();
    if (sb) {
      try {
        await sb.from('app_users').delete().eq('id', String(id));
      } catch (e) {}
    }
  },

  async getLoginLogs() {
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('login_logs').select('*').order('timestamp', { ascending: false }).limit(200);
        if (data && !error && data.length > 0) {
          localStorage.setItem('lykos_login_logs', JSON.stringify(data));
          return data;
        }
      } catch (e) {}
    }
    const raw = localStorage.getItem('lykos_login_logs');
    return safeParse(raw, []);
  },
  async addLoginLog(log) {
    const logs = await this.getLoginLogs();
    logs.unshift(log);
    localStorage.setItem('lykos_login_logs', JSON.stringify(logs.slice(0, 200)));

    const sb = getSupabaseClient();
    if (sb) {
      try {
        await sb.from('login_logs').insert(log);
      } catch (e) {}
    }
    return log;
  },
  async clearLoginLogs() {
    localStorage.removeItem('lykos_login_logs');
    const sb = getSupabaseClient();
    if (sb) {
      try {
        await sb.from('login_logs').delete().neq('id', '0');
      } catch (e) {}
    }
  },

  async uploadAsset(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }
};
