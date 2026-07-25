/* ==========================================================================
   LYKOS E-SPORTS - HEADER COMPONENT (With Dynamic Torneios Tab Toggle)
   ========================================================================== */

window.renderHeader = async function () {
  const headerContainer = document.getElementById('main-header');
  if (!headerContainer) return;

  const settings = await window.LykosDB.getSettings();
  const teamName = settings.team_name || 'LYKOS';
  
  const headerLogoSrc = settings.header_logo_url || settings.logo_url || 'assets/logo.png';
  const logoContent = `<img src="${headerLogoSrc}" alt="${teamName} Logo" style="max-height: 42px; height: 42px; width: auto; object-fit: contain; vertical-align: middle;" onerror="this.src='assets/logo.png'">`;

  const showTorneios = settings.show_tournaments_tab === true;

  const matches = await window.LykosDB.getMatches().catch(() => []);
  const hasLiveMatch = matches.some(m => (m.status || '').toUpperCase() === 'LIVE');

  headerContainer.innerHTML = `
    <header class="site-header" style="position: fixed; top: 12px; left: 50%; transform: translateX(-50%); width: 92%; max-width: 1240px; border-radius: 20px; z-index: 1000; background: rgba(10, 8, 20, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(168, 85, 247, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div class="container nav-container" style="display: flex; align-items: center; justify-content: space-between; height: 68px; padding: 0 1.5rem;">
        <a href="/" class="brand-logo" style="display: inline-flex; align-items: center; gap: 10px; text-decoration: none;">
          ${logoContent}
          <span style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.06em; display: inline-block;">
            ${(() => {
              const parts = teamName.trim().split(' ');
              if (parts.length === 1) return parts[0];
              const first = parts[0];
              const rest = parts.slice(1).join(' ');
              return `${first} <span style="color: var(--accent-neon);">${rest}</span>`;
            })()}
          </span>
        </a>

        <ul class="nav-menu" id="nav-menu" style="display: flex; align-items: center; gap: 1.75rem; list-style: none; margin: 0; padding: 0;">
          <li><a href="/" class="nav-link" style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted-light); letter-spacing: 0.08em;">Home</a></li>
          <li><a href="/sobre" class="nav-link" style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted-light); letter-spacing: 0.08em;">Sobre</a></li>
          <li><a href="/elenco" class="nav-link" style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted-light); letter-spacing: 0.08em;">Elenco</a></li>
          <li>
            <a href="/partidas" class="nav-link" style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted-light); letter-spacing: 0.08em; display: inline-flex; align-items: center; gap: 6px;">
              Partidas
              ${hasLiveMatch ? `<span class="btn-live" style="padding: 2px 8px; font-size: 0.65rem; border-radius: 4px; box-shadow: 0 0 10px rgba(230, 57, 70, 0.6);">🔴 AO VIVO</span>` : ''}
            </a>
          </li>
          <li><a href="/galeria" class="nav-link" style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted-light); letter-spacing: 0.08em;">Mídias & News</a></li>
          ${showTorneios ? `<li><a href="/torneios" class="nav-link" style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted-light); letter-spacing: 0.08em;">Torneios</a></li>` : ''}
          <li><a href="/contato" class="nav-link" style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted-light); letter-spacing: 0.08em;">Contato</a></li>
        </ul>

        <button class="mobile-menu-toggle" id="mobile-toggle" aria-label="Abrir menu" style="display: none; background: none; color: #ffffff; font-size: 1.4rem; cursor: pointer; border: none;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </header>
  `;

  // Theme Toggle Listener
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.onclick = () => {
      const active = window.LykosDB.getTheme();
      const nextTheme = active === 'dark' ? 'light' : 'dark';
      window.LykosDB.setTheme(nextTheme);
      themeBtn.innerHTML = nextTheme === 'dark' ? '☀️' : '🌙';
    };
  }

  // Mobile menu toggle
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (toggleBtn && navMenu) {
    toggleBtn.onclick = () => navMenu.classList.toggle('mobile-open');
    navMenu.querySelectorAll('a').forEach(link => {
      link.onclick = () => navMenu.classList.remove('mobile-open');
    });
  }

  // SMART COLLAPSIBLE NAVBAR ON SCROLL & HOVER
  const headerElem = headerContainer.querySelector('.site-header');
  if (headerElem) {
    let isHovered = false;

    function checkScrollNavbar() {
      if (window.scrollY > 80 && !isHovered) {
        headerElem.classList.add('navbar-collapsed');
      } else {
        headerElem.classList.remove('navbar-collapsed');
      }
    }

    // Scroll listener
    window.removeEventListener('scroll', window._lykosNavbarScrollHandler);
    window._lykosNavbarScrollHandler = checkScrollNavbar;
    window.addEventListener('scroll', window._lykosNavbarScrollHandler, { passive: true });

    // Mouse hover listener with padding/margin safety
    headerElem.onmouseenter = () => {
      isHovered = true;
      headerElem.classList.remove('navbar-collapsed');
    };

    headerElem.onmouseleave = () => {
      isHovered = false;
      if (window.scrollY > 80) {
        headerElem.classList.add('navbar-collapsed');
      }
    };

    // Initial check
    checkScrollNavbar();
  }
};

window.addEventListener('lykos_branding_updated', () => window.renderHeader());
window.addEventListener('lykos_theme_changed', () => window.renderHeader());
