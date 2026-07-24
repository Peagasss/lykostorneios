/* ==========================================================================
   LYKOS E-SPORTS - COMPACT MINIMALIST FOOTER COMPONENT (With Torneios Toggle)
   ========================================================================== */

window.renderFooter = async function () {
  const footerContainer = document.getElementById('main-footer');
  if (!footerContainer) return;

  const settings = await window.LykosDB.getSettings();
  const teamName = settings.team_name || 'LYKOS';
  const showTorneios = settings.show_tournaments_tab === true;

  const socials = (settings.contact_socials_json && settings.contact_socials_json.length > 0)
    ? settings.contact_socials_json
    : [
        { name: 'Discord', url: settings.discord_url || 'https://discord.gg/lykosesports' },
        { name: 'Instagram', url: settings.instagram_url || 'https://instagram.com' },
        { name: 'X', url: settings.x_url || 'https://x.com' }
      ];

  footerContainer.innerHTML = `
    <footer class="site-footer" style="padding: 2rem 0 1.5rem; border-top: 1px solid var(--border-dark);">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 1.25rem;">
          <a href="#/" class="brand-logo" style="font-size: 1.4rem;">
            <img src="${settings.header_logo_url || settings.logo_url || 'assets/logo.png'}" alt="${teamName}" style="max-height: 32px;" onerror="this.src='assets/logo.png'">
          </a>

          <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
            <a href="#/" style="font-size: 0.82rem; color: var(--text-muted-light);">Home</a>
            <a href="#/sobre" style="font-size: 0.82rem; color: var(--text-muted-light);">Sobre</a>
            <a href="#/elenco" style="font-size: 0.82rem; color: var(--text-muted-light);">Elenco</a>
            <a href="#/partidas" style="font-size: 0.82rem; color: var(--text-muted-light);">Partidas</a>
            <a href="#/galeria" style="font-size: 0.82rem; color: var(--text-muted-light);">Galeria</a>
            ${showTorneios ? `<a href="#/torneios" style="font-size: 0.82rem; color: var(--text-muted-light);">Torneios</a>` : ''}
            <a href="#/contato" style="font-size: 0.82rem; color: var(--text-muted-light);">Contato</a>
            <a href="#/admin" style="font-size: 0.82rem; color: var(--accent-neon); font-weight: 600;">Painel Admin</a>
          </div>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            ${socials.map(s => `
              <a href="${s.url}" target="_blank" style="font-size: 0.8rem; color: var(--text-muted-light);">${s.name}</a>
            `).join('')}
          </div>
        </div>

        <div style="text-align: center; border-top: 1px solid var(--border-dark); padding-top: 1rem; margin-top: 1rem;">
          <p style="font-size: 0.75rem; color: var(--text-muted-light);">&copy; ${new Date().getFullYear()} ${teamName} E-SPORTS. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  `;
};
