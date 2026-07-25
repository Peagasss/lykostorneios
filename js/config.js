/* ==========================================================================
   LYKOS E-SPORTS - APPLICATION CONFIGURATION
   ========================================================================== */

window.LYKOS_CONFIG = {
  // Backend Base API URL (Vercel Serverless + Azure Postgres)
  API_BASE_URL: window.location.hostname.includes('github.io')
    ? 'https://lykostorneios.vercel.app'
    : '',

  // Default branding values
  DEFAULT_BRANDING: {
    team_name: "LYKOS",
    logo_url: "assets/logo.png",
    header_logo_url: "assets/logo.png",
    favicon_url: "assets/favicon.png",
    hero_title: "DOMINANDO O CENÁRIO DE E-SPORTS",
    hero_subtitle: "Excelência, garra e paixão. LYKOS representa a elite dos jogos competitivos no Valorant e CS2.",
    hero_image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    primary_color: "#4d00b5",
    imgbb_api_key: "65be38396ebe8d02b71f57e3c3a8b921"
  }
};
