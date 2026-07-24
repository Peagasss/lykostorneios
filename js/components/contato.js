/* ==========================================================================
   LYKOS E-SPORTS - CONTATO PAGE COMPONENT (Serious Minimalist Design)
   ========================================================================== */

window.renderContatoPage = async function (container) {
  const settings = await window.LykosDB.getSettings();

  const socials = (settings.contact_socials_json && settings.contact_socials_json.length > 0)
    ? settings.contact_socials_json
    : [
        { name: 'Discord', url: settings.discord_url || 'https://discord.gg/lykosesports' },
        { name: 'Instagram', url: settings.instagram_url || 'https://instagram.com' },
        { name: 'X (Twitter)', url: settings.x_url || 'https://x.com' }
      ];

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 130px; text-align: center;">
      <div class="container" style="max-width: 780px;">
        <h1 class="section-heading">Entre em <span>Contato</span></h1>
        <p class="section-subtitle" style="margin: 0 auto 2.5rem;">
          Toda a nossa comunicação oficial, suporte a fãs, atendimento de imprensa e tickets de peneiras são realizados através das nossas redes sociais oficiais.
        </p>

        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark-strong); border-radius: var(--radius-sm); padding: 3rem 2rem; margin-bottom: 2.5rem;">
          <h2 style="font-family: var(--font-heading); font-size: 1.8rem; color: white; margin-bottom: 8px;">Discord Oficial da LYKOS</h2>
          <p style="color: var(--text-muted-light); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.6;">
            Acesse nosso servidor oficial para conversar com os moderadores, participar de peneiras, solicitar assessoria de imprensa ou interagir com a torcida.
          </p>

          <a href="${settings.discord_url || 'https://discord.gg/lykosesports'}" target="_blank" class="btn-primary" style="padding: 14px 32px; font-size: 0.9rem;">
            Entrar no Servidor do Discord &rarr;
          </a>
        </div>

        <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: white; margin-bottom: 1.25rem;">Canais & Mídias Sociais Oficiais</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 3rem;">
          ${socials.map(s => `
            <a href="${s.url}" target="_blank" style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1.25rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: white; text-decoration: none;">
              <strong style="font-size: 1.05rem;">${s.name}</strong>
              <span style="font-size: 0.75rem; color: var(--accent-neon);">Acessar Canal &rarr;</span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
};
