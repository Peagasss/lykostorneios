/* ==========================================================================
   LYKOS E-SPORTS - SOBRE PAGE COMPONENT (With Recent Tournaments Section)
   ========================================================================== */

window.renderSobrePage = async function (container) {
  const [settings, aboutSettings, trophies, recentTournaments] = await Promise.all([
    window.LykosDB.getSettings(),
    window.LykosDB.getAboutSettings(),
    window.LykosDB.getTrophies(),
    window.LykosDB.getRecentTournaments()
  ]);

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 130px; text-align: center;">
      <div class="container">
        <h1 class="section-heading">Sobre a <span>${settings.team_name}</span></h1>
        <p class="section-subtitle" style="margin: 0 auto 2rem;">
          ${aboutSettings.history_text}
        </p>
      </div>
    </section>

    <section class="section-light-1">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <div>
            <h2 class="section-heading section-heading-dark">Mentalidade <span>Vencedora</span></h2>
            <p style="margin-bottom: 1.5rem; color: var(--text-muted-dark); line-height: 1.7;">
              ${aboutSettings.mission_text}
            </p>
            <div style="display: flex; gap: 2rem;">
              <div>
                <h3 style="font-size: 2rem; color: var(--primary-purple); font-family: var(--font-heading);">${aboutSettings.stat_trophies}</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted-dark);">Troféus Oficiais</p>
              </div>
              <div>
                <h3 style="font-size: 2rem; color: var(--primary-purple); font-family: var(--font-heading);">${aboutSettings.stat_winrate}</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted-dark);">Winrate Histórico</p>
              </div>
              <div>
                <h3 style="font-size: 2rem; color: var(--primary-purple); font-family: var(--font-heading);">${aboutSettings.stat_community}</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted-dark);">Fãs Conectados</p>
              </div>
            </div>
          </div>

          <div>
            <img src="${aboutSettings.about_image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'}" alt="LYKOS Arena" style="width: 100%; border-radius: var(--radius-xs); border: 1px solid var(--border-light); max-height: 420px; object-fit: cover;">
          </div>
        </div>
      </div>
    </section>

    <!-- TROPHY CABINET -->
    <section class="section-dark-2">
      <div class="container">
        <h2 class="section-heading">Nossas <span>Conquistas</span></h2>
        <p class="section-subtitle">Títulos históricos conquistados pelos nossos atletas nas principais arenas mundiais.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3.5rem;">
          ${trophies.map(t => `
            <div class="trophy-card" data-id="${t.id}">
              <span class="game-badge" style="position: static; margin-bottom: 6px; display: inline-block;">${t.game} • ${t.year}</span>
              <h3 style="font-size: 1.2rem; margin-bottom: 6px; color: white;">${t.title}</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted-light); line-height: 1.5;">${(t.description || '').substring(0, 85)}${(t.description || '').length > 85 ? '...' : ''}</p>
            </div>
          `).join('')}
        </div>

        <!-- CAMPEONATOS RECENTES -->
        <h2 class="section-heading" style="margin-top: 2rem;">Campeonatos <span>Recentes</span></h2>
        <p class="section-subtitle">Desempenho da LYKOS nos últimos campeonatos disputados.</p>

        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.5rem;">
          <table class="kda-table">
            <thead>
              <tr>
                <th>Campeonato / Torneio</th>
                <th>Modalidade</th>
                <th>Ano</th>
                <th>Colocação Final</th>
                <th>Premiação</th>
              </tr>
            </thead>
            <tbody>
              ${recentTournaments.map(rec => `
                <tr>
                  <td><strong>${rec.name}</strong></td>
                  <td><span class="game-badge" style="position: static; font-size: 0.68rem;">${rec.game}</span></td>
                  <td>${rec.year}</td>
                  <td><strong style="color: var(--accent-neon);">${rec.placement}</strong></td>
                  <td>${rec.prize}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  `;
};
