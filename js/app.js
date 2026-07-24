/* ==========================================================================
   LYKOS E-SPORTS - MAIN APPLICATION ENTRYPOINT & THEME INITIALIZATION
   ========================================================================== */

async function initLykosApp() {
  try {
    // Apply saved theme (Dark or Light) safely
    const savedTheme = window.LykosDB && window.LykosDB.getTheme ? window.LykosDB.getTheme() : 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Load and apply initial branding settings
    const settings = window.LykosDB && window.LykosDB.getSettings ? await window.LykosDB.getSettings() : { team_name: 'LYKOS' };

    // Dynamic Favicon Head Update
    if (settings && settings.favicon_url) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }

    // Update Page Title
    document.title = `${settings.team_name || 'LYKOS'} E-Sports | Official Team Website`;

    // Render Header & Footer
    if (window.renderHeader) await window.renderHeader();
    if (window.renderFooter) await window.renderFooter();

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

      // Initialize Route
      await window.LykosRouter.handleRoute();
    }
  } catch (err) {
    console.error('[LykosApp] Initialization error:', err);
    // Automatic fail-safe recovery render
    if (window.LykosRouter) {
      await window.LykosRouter.handleRoute();
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
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = settings.favicon_url;
  }

  if (window.renderHeader) await window.renderHeader();
  if (window.renderFooter) await window.renderFooter();
});
