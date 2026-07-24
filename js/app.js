/* ==========================================================================
   LYKOS E-SPORTS - MAIN APPLICATION ENTRYPOINT & THEME INITIALIZATION
   ========================================================================== */

function updateFavicon(url) {
  if (!url) return;
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach(el => el.remove());

  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = url.endsWith('.ico') ? 'image/x-icon' : (url.endsWith('.svg') ? 'image/svg+xml' : 'image/png');
  link.href = url;
  document.head.appendChild(link);
}

async function initLykosApp() {
  try {
    // Apply saved theme (Dark or Light) safely
    const savedTheme = (window.LykosDB && window.LykosDB.getTheme) ? window.LykosDB.getTheme() : 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Dynamic Favicon Head Update
    const rawSettings = localStorage.getItem('lykos_settings');
    if (rawSettings) {
      try {
        const s = JSON.parse(rawSettings);
        if (s && s.favicon_url) updateFavicon(s.favicon_url);
      } catch (e) {}
    }

    // Render Header & Footer safely without waiting
    if (window.renderHeader) window.renderHeader().catch(console.error);
    if (window.renderFooter) window.renderFooter().catch(console.error);

    // Register SPA Routes
    if (window.LykosRouter) {
      window.LykosRouter.addRoute('/', window.renderHomePage);
      window.LykosRouter.addRoute('/sobre', window.renderSobrePage);
      window.LykosRouter.addRoute('/elenco', window.renderElencoPage);
      window.LykosRouter.addRoute('/partidas', window.renderPartidasPage);
      window.LykosRouter.addRoute('/partidas/:id', window.renderMatchDetailPage);
      window.LykosRouter.addRoute('/galeria', window.renderGaleriaPage);
      window.LykosRouter.addRoute('/contato', window.renderContatoPage);
      window.LykosRouter.addRoute('/torneios', window.renderTorneiosPage);
      window.LykosRouter.addRoute('/admin', window.renderAdminPage);

      // Initialize Route immediately
      await window.LykosRouter.handleRoute();
    }
  } catch (err) {
    console.error('[LykosApp] Initialization error:', err);
    if (window.LykosRouter) {
      await window.LykosRouter.handleRoute().catch(console.error);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLykosApp);
} else {
  initLykosApp();
}

// Global Event listener for branding changes
window.addEventListener('lykos_branding_updated', async (e) => {
  const settings = e.detail || {};
  document.title = `${settings.team_name || 'LYKOS'} E-Sports | Official Team Website`;

  if (settings.favicon_url) {
    updateFavicon(settings.favicon_url);
  }

  if (window.renderHeader) await window.renderHeader();
  if (window.renderFooter) await window.renderFooter();
});
