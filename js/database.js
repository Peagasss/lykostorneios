/* ==========================================================================
   LYKOS E-SPORTS - DATA ACCESS LAYER (Strict Azure Cloud Sync)
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
  default_opponent_logo: 'assets/logo-adversario-padrao.webp',
  show_tournaments_tab: false,
  hero_title: 'SANGUE.GARRA.GLÓRIA.',
  hero_subtitle: 'A organização oficial de e-sports de alta performance.',
  discord_url: 'https://discord.gg/lykosesports',
  instagram_url: 'https://instagram.com/lykosesports',
  x_url: 'https://x.com/lykosesports',
  facebook_url: 'https://facebook.com/lykosesports',
  imgbb_api_key: '65be38396ebe8d02b71f57e3c3a8b921',
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
    opponent_logo: 'assets/logo-adversario-padrao.webp',
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

function getApiUrl(endpoint) {
  const baseUrl = (window.LYKOS_CONFIG && window.LYKOS_CONFIG.API_BASE_URL) || '';
  return `${baseUrl}${endpoint}`;
}

let _cachedBundle = null;
let _sharedDataPromise = null;
let _sharedDataTimestamp = 0;

function getDefaultBundle() {
  return {
    settings: { ...DEFAULT_SETTINGS },
    modalities: [...DEFAULT_MODALITIES],
    roster: [...DEFAULT_ROSTER],
    staff: [...DEFAULT_STAFF],
    matches: [...DEFAULT_MATCHES],
    trophies: [...DEFAULT_TROPHIES],
    about: { ...DEFAULT_ABOUT },
    gallery: [...DEFAULT_GALLERY],
    social: [...DEFAULT_SOCIAL],
    recentTournaments: [...DEFAULT_RECENT_TOURNAMENTS],
    communityTournaments: [...DEFAULT_COMMUNITY_TOURNAMENTS],
    loginLogs: []
  };
}

function mergeArrayById(localArr, apiArr) {
  if (!Array.isArray(localArr)) return Array.isArray(apiArr) ? apiArr : [];
  if (!Array.isArray(apiArr)) return localArr;

  const map = new Map();
  apiArr.forEach(item => {
    if (item && item.id !== undefined) map.set(String(item.id), item);
  });
  localArr.forEach(item => {
    if (item && item.id !== undefined) map.set(String(item.id), item);
  });
  return Array.from(map.values());
}

function mergeBundles(local, api) {
  if (!api) return local || getDefaultBundle();
  if (!local) return api;

  return {
    settings: { ...(api.settings || {}), ...(local.settings || {}) },
    about: { ...(api.about || {}), ...(local.about || {}) },
    modalities: mergeArrayById(local.modalities, api.modalities),
    roster: mergeArrayById(local.roster, api.roster),
    staff: mergeArrayById(local.staff, api.staff),
    matches: mergeArrayById(local.matches, api.matches),
    trophies: mergeArrayById(local.trophies, api.trophies),
    gallery: mergeArrayById(local.gallery, api.gallery),
    social: mergeArrayById(local.social, api.social),
    recentTournaments: mergeArrayById(local.recentTournaments, api.recentTournaments),
    communityTournaments: mergeArrayById(local.communityTournaments, api.communityTournaments),
    loginLogs: mergeArrayById(local.loginLogs, api.loginLogs)
  };
}

function getOrCreateBundle() {
  if (!_cachedBundle) {
    try {
      const rawLocal = localStorage.getItem('lykos_local_db_cache');
      const rawSession = sessionStorage.getItem('lykos_bundle_cache');
      if (rawLocal) {
        _cachedBundle = JSON.parse(rawLocal);
      } else if (rawSession) {
        _cachedBundle = JSON.parse(rawSession);
      }
    } catch (e) {}
  }
  if (!_cachedBundle) {
    _cachedBundle = getDefaultBundle();
  }
  return _cachedBundle;
}

function persistCachedBundle() {
  if (_cachedBundle) {
    try {
      const str = JSON.stringify(_cachedBundle);
      localStorage.setItem('lykos_local_db_cache', str);
      sessionStorage.setItem('lykos_bundle_cache', str);
    } catch (e) {
      console.warn("[LykosDB] localStorage quota warning:", e);
      try {
        sessionStorage.setItem('lykos_bundle_cache', JSON.stringify(_cachedBundle));
      } catch (err) {}
    }
  }
}

async function fetchFullDataBundle(forceFresh = false) {
  const now = Date.now();
  
  // Use memory cache only if it is less than 5 seconds old
  if (!forceFresh && _cachedBundle && (now - _sharedDataTimestamp < 5000)) {
    return _cachedBundle;
  }
  
  if (_sharedDataPromise && (now - _sharedDataTimestamp < 5000)) {
    return _sharedDataPromise;
  }
  
  _sharedDataTimestamp = now;
  _sharedDataPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const apiRes = await fetch(getApiUrl('/api/data?t=' + now), { 
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      clearTimeout(timeoutId);

      if (!apiRes.ok) throw new Error(`Erro HTTP ${apiRes.status}`);
      const contentType = apiRes.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Resposta inválida do servidor`);
      }
      const data = await apiRes.json();
      if (data) {
        // Network first: overwrite local cache with fresh API data
        _cachedBundle = data;
        persistCachedBundle();
      }
      return _cachedBundle;
    } catch (e) {
      console.warn('[LykosDB] Network fetch failed, falling back to local cache:', e.message);
      return getOrCreateBundle();
    }
  })();
  return _sharedDataPromise;
}

function invalidateBundleCache() {
  _cachedBundle = null;
  _sharedDataTimestamp = 0;
  _sharedDataPromise = null;
  try {
    sessionStorage.removeItem('lykos_bundle_cache');
    localStorage.removeItem('lykos_local_db_cache');
  } catch (e) {}
}

async function fetchFromApi(tableName, fallbackDefault) {
  const bundle = await fetchFullDataBundle();
  if (bundle) {
    const keyMap = {
      site_settings: 'settings',
      about_settings: 'about',
      modalities: 'modalities',
      roster: 'roster',
      staff: 'staff',
      matches: 'matches',
      trophies: 'trophies',
      gallery: 'gallery',
      social_feeds: 'social',
      recent_tournaments: 'recentTournaments',
      community_tournaments: 'communityTournaments',
      login_logs: 'loginLogs'
    };
    const mappedKey = keyMap[tableName];
    if (mappedKey && bundle[mappedKey] !== undefined && bundle[mappedKey] !== null) {
      return bundle[mappedKey];
    }
  }
  return fallbackDefault;
}

// STRICT SAVE TO CLOUD WITH LOCAL FALLBACK CACHE
async function saveToApi(tableName, singleItem, eventName = null) {
  const bundle = getOrCreateBundle();
  const keyMap = {
    site_settings: 'settings',
    about_settings: 'about',
    modalities: 'modalities',
    roster: 'roster',
    staff: 'staff',
    matches: 'matches',
    trophies: 'trophies',
    gallery: 'gallery',
    social_feeds: 'social',
    recent_tournaments: 'recentTournaments',
    community_tournaments: 'communityTournaments',
    login_logs: 'loginLogs'
  };
  const mappedKey = keyMap[tableName];
  if (mappedKey) {
    if (tableName === 'site_settings' || tableName === 'about_settings') {
      bundle[mappedKey] = { ...bundle[mappedKey], ...singleItem };
    } else {
      if (!Array.isArray(bundle[mappedKey])) bundle[mappedKey] = [];
      const idx = bundle[mappedKey].findIndex(i => String(i.id) === String(singleItem.id));
      if (idx !== -1) {
        bundle[mappedKey][idx] = singleItem;
      } else {
        bundle[mappedKey].unshift(singleItem);
      }
    }
    persistCachedBundle();
  }

  window._lastLykosSaveError = null;
  try {
    const apiRes = await fetch(getApiUrl('/api/save'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity: tableName, item: singleItem })
    });

    if (!apiRes.ok) {
      const errData = await apiRes.json().catch(() => ({}));
      const errMsg = errData.error || `HTTP ${apiRes.status}`;
      console.warn(`[LykosDB] Notice from API save (${apiRes.status}):`, errMsg);
      window._lastLykosSaveError = errMsg;
    }
  } catch (err) {
    console.warn(`[LykosDB] API save fallback to local cache:`, err.message);
    window._lastLykosSaveError = err.message;
  }

  if (eventName) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: singleItem }));
  }
}

async function deleteFromApi(tableName, itemId) {
  const bundle = getOrCreateBundle();
  const keyMap = {
    modalities: 'modalities',
    roster: 'roster',
    staff: 'staff',
    matches: 'matches',
    trophies: 'trophies',
    gallery: 'gallery',
    social_feeds: 'social',
    recent_tournaments: 'recentTournaments',
    community_tournaments: 'communityTournaments',
    login_logs: 'loginLogs'
  };
  const mappedKey = keyMap[tableName];
  if (mappedKey && Array.isArray(bundle[mappedKey])) {
    bundle[mappedKey] = bundle[mappedKey].filter(i => String(i.id) !== String(itemId));
    persistCachedBundle();
  }

  try {
    const apiRes = await fetch(getApiUrl('/api/delete'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity: tableName, id: itemId })
    });

    if (!apiRes.ok) {
      console.warn(`[LykosDB] API delete notice: deleted locally.`);
    }
  } catch (err) {
    console.warn(`[LykosDB] API delete fallback to local cache:`, err.message);
  }
}

let _isPollingStarted = false;
let _lastBundleJson = '{}';

function startRealtimePoller() {
  if (_isPollingStarted) return;
  _isPollingStarted = true;

  // Poll every 5 seconds, but skip requests based on tab visibility and admin state
  setInterval(async () => {
    // 1. Skip if the page/tab is in the background to save Netlify bandwidth
    if (document.visibilityState !== 'visible') return;

    // 2. Slow down requests: 15s for admin, 60s for public pages to conserve bandwidth
    const isInsideAdmin = window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#/admin');
    const now = Date.now();
    const minInterval = isInsideAdmin ? 15000 : 60000;
    
    if (window._lastPollTime && (now - window._lastPollTime < minInterval)) {
      return;
    }
    window._lastPollTime = now;

    try {
      const res = await fetch(getApiUrl('/api/data?t=' + now), {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).catch(() => null);
      if (res && res.ok && (res.headers.get('content-type') || '').includes('application/json')) {
        const bundle = await res.json();
        _cachedBundle = mergeBundles(getOrCreateBundle(), bundle);
        persistCachedBundle();
        const currentJson = JSON.stringify(_cachedBundle);

        if (currentJson !== _lastBundleJson) {
           const isFirst = _lastBundleJson === '{}';
           _lastBundleJson = currentJson;
           
           if (!isFirst) {
             if (bundle.settings) {
               window.dispatchEvent(new CustomEvent('lykos_branding_updated', { detail: bundle.settings }));
             }
             
             // Universal modal check: checks both style inline display, class active, or offsetParent visibility
             const hasOpenModal = Array.from(document.querySelectorAll('.modal-backdrop, #player-modal, #news-reader-modal, #lightbox-modal')).some(el => {
               const style = window.getComputedStyle(el);
               return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
             });

             if (!isInsideAdmin && !hasOpenModal && window.LykosRouter && window.LykosRouter.handleRoute) {
               window.LykosRouter.handleRoute().catch(() => {});
             }
           }
        }
      }
    } catch (e) {}
  }, 5000);
}if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startRealtimePoller);
  } else {
    startRealtimePoller();
  }
}

window.LykosDB = {
  // Theme uses localStorage because it is purely client visual preference
  getTheme() {
    return localStorage.getItem('lykos_theme') || 'dark';
  },
  setTheme(theme) {
    localStorage.setItem('lykos_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    window.dispatchEvent(new Event('lykos_theme_changed'));
  },

  async getSettings() {
    return fetchFromApi('site_settings', DEFAULT_SETTINGS);
  },
  async saveSettings(settings) {
    const currentSettings = await this.getSettings();
    const nowIso = new Date().toISOString();
    const mergedSettings = { ...DEFAULT_SETTINGS, ...currentSettings, ...settings, updated_at: nowIso };

    try {
      await saveToApi('site_settings', mergedSettings, 'lykos_branding_updated');
      return mergedSettings;
    } catch (e) {
      console.error("[LykosDB] Strict saveSettings error:", e);
      throw new Error(`Falha ao salvar na Azure PostgreSQL. Verifique suas variáveis na Vercel! Detalhe: ${e.message}`);
    }
  },

  async getModalities() {
    return fetchFromApi('modalities', DEFAULT_MODALITIES);
  },
  async saveModality(modality) {
    if (!modality.id) modality.id = 'mod_' + Date.now();
    await saveToApi('modalities', modality);
    return modality;
  },
  async deleteModality(id) {
    await deleteFromApi('modalities', id);
  },

  async getRoster() {
    return fetchFromApi('roster', DEFAULT_ROSTER);
  },
  async getPlayerById(id) {
    const roster = await this.getRoster();
    return roster.find(p => String(p.id) === String(id));
  },
  async savePlayer(player) {
    if (!player.id) player.id = 'p_' + Date.now();
    await saveToApi('roster', player);
    return player;
  },
  async deletePlayer(id) {
    await deleteFromApi('roster', id);
  },

  async getStaff() {
    return fetchFromApi('staff', DEFAULT_STAFF);
  },
  async saveStaff(staffMember) {
    if (!staffMember.id) staffMember.id = 'st_' + Date.now();
    await saveToApi('staff', staffMember);
    return staffMember;
  },
  async deleteStaff(id) {
    await deleteFromApi('staff', id);
  },

  async getMatches() {
    const matches = await fetchFromApi('matches', DEFAULT_MATCHES);
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
    if (!match.id) match.id = 'm_' + Date.now();
    if (!match.opponent_logo || !match.opponent_logo.trim()) {
      const settings = await this.getSettings();
      match.opponent_logo = settings.default_opponent_logo || 'assets/logo-adversario-padrao.webp';
    }
    await saveToApi('matches', match);
    return match;
  },
  async deleteMatch(id) {
    await deleteFromApi('matches', id);
  },

  async getTrophies() {
    return fetchFromApi('trophies', DEFAULT_TROPHIES);
  },
  async saveTrophy(trophy) {
    if (!trophy.id) trophy.id = 't_' + Date.now();
    await saveToApi('trophies', trophy);
    return trophy;
  },
  async deleteTrophy(id) {
    await deleteFromApi('trophies', id);
  },

  async getAboutSettings() {
    return fetchFromApi('about_settings', DEFAULT_ABOUT);
  },
  async saveAboutSettings(about) {
    await saveToApi('about_settings', about);
    return about;
  },

  async getGallery() {
    return fetchFromApi('gallery', DEFAULT_GALLERY);
  },
  async saveGalleryItem(item) {
    if (!item.id) item.id = 'g_' + Date.now();
    await saveToApi('gallery', item);
    return item;
  },
  async deleteGalleryItem(id) {
    await deleteFromApi('gallery', id);
  },

  async getSocialFeeds() {
    return fetchFromApi('social_feeds', DEFAULT_SOCIAL);
  },
  async saveSocialFeed(feed) {
    if (!feed.id) feed.id = 's_' + Date.now();
    await saveToApi('social_feeds', feed);
    return feed;
  },
  async deleteSocialFeed(id) {
    await deleteFromApi('social_feeds', id);
  },

  async getRecentTournaments() {
    return fetchFromApi('recent_tournaments', DEFAULT_RECENT_TOURNAMENTS);
  },
  async saveRecentTournament(tournament) {
    if (!tournament.id) tournament.id = 'rec_' + Date.now();
    await saveToApi('recent_tournaments', tournament);
    return tournament;
  },
  async deleteRecentTournament(id) {
    await deleteFromApi('recent_tournaments', id);
  },

  async getCommunityTournaments() {
    return fetchFromApi('community_tournaments', DEFAULT_COMMUNITY_TOURNAMENTS);
  },
  async saveCommunityTournament(tournament) {
    if (!tournament.id) tournament.id = 'tourn_' + Date.now();
    await saveToApi('community_tournaments', tournament);
    return tournament;
  },
  async deleteCommunityTournament(id) {
    await deleteFromApi('community_tournaments', id);
  },

  // USERS are still kept locally because they are not exposed in public /api/data
  // This is a known limitation to protect passwords.
  async getUsers() {
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

    try {
      await saveToApi('app_users', user);
    } catch (e) {
      console.warn("[LykosDB] Strict saveUser error:", e);
      throw new Error(`Falha ao sincronizar admin com a nuvem: ${e.message}`);
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
    try {
      await deleteFromApi('app_users', id);
    } catch (e) {
      console.warn("[LykosDB] Strict deleteUser error:", e);
    }
  },

  async getLoginLogs() {
    return fetchFromApi('login_logs', []);
  },
  async addLoginLog(log) {
    // Fire and forget via API
    fetch(getApiUrl('/api/save'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity: 'login_logs', item: log })
    }).catch(()=>{});
    return log;
  },
  async clearLoginLogs() {
    // Intentionally left blank as login logs should persist
  },

  async uploadAsset(file) {
    return new Promise(async (resolve, reject) => {
      try {
        const settings = await this.getSettings();
        const apiKey = settings.imgbb_api_key;
        if (apiKey && apiKey.trim()) {
          const formData = new FormData();
          formData.append('image', file);
          const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey.trim()}`, {
            method: 'POST',
            body: formData
          });
          if (imgbbRes && imgbbRes.ok) {
            const imgbbData = await imgbbRes.json();
            if (imgbbData && imgbbData.data && imgbbData.data.url) {
              resolve(imgbbData.data.url);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("[LykosDB] ImgBB cloud upload failed, falling back to local compression:", e);
      }

      if (!file || !file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
        return;
      }

      const maxWidth = 400;
      const maxHeight = 400;
      const quality = 0.6;

      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      reader.readAsDataURL(file);
    });
  }
};
