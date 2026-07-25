/* ==========================================================================
   LYKOS E-SPORTS - HEADER COMPONENT (With Dynamic Torneios Tab Toggle)
   ========================================================================== */

window.renderHeader = async function () {
  const headerContainer = document.getElementById('main-header');
  if (!headerContainer) return;

  const settings = await window.LykosDB.getSettings();
  const currentTheme = window.LykosDB.getTheme();
  const teamName = settings.team_name || 'LYKOS';
  
  const headerLogoSrc = settings.header_logo_url || settings.logo_url || 'assets/logo.png';
  const logoContent = `<img src="${headerLogoSrc}" alt="${teamName} Logo" style="max-height: 52px; height: 52px; width: auto; object-fit: contain; vertical-align: middle;" onerror="this.src='assets/logo.png'">`;

  const showTorneios = settings.show_tournaments_tab === true;

  headerContainer.innerHTML = `
    <header class="site-header">
      <div class="container nav-container">
        <a href="/" class="brand-logo" style="display: inline-flex; align-items: center; gap: 10px; padding: 4px 0; text-decoration: none;">
          ${logoContent}
          <span style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; display: inline-block;">
            ${(() => {
              const parts = teamName.trim().split(' ');
              if (parts.length === 1) return parts[0];
              const first = parts[0];
              const rest = parts.slice(1).join(' ');
              return `${first} <span style="color: var(--accent-neon);">${rest}</span>`;
            })()}
          </span>
        </a>

        <ul class="nav-menu" id="nav-menu">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/sobre" class="nav-link">Sobre</a></li>
          <li><a href="/elenco" class="nav-link">Elenco</a></li>
          <li><a href="/partidas" class="nav-link">Partidas</a></li>
          <li><a href="/galeria" class="nav-link">Galeria</a></li>
          ${showTorneios ? `<li><a href="/torneios" class="nav-link">Torneios</a></li>` : ''}
          <li><a href="/contato" class="nav-link">Contato</a></li>
          <li>
            <button class="theme-toggle-btn" id="theme-toggle" title="Alternar Tema Claro / Escuro">
              ${currentTheme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>

        <button class="mobile-menu-toggle" id="mobile-toggle" aria-label="Abrir menu">
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
};

window.addEventListener('lykos_branding_updated', () => window.renderHeader());
window.addEventListener('lykos_theme_changed', () => window.renderHeader());
