/* ==========================================================================
   LYKOS E-SPORTS - SOBRE PAGE COMPONENT (With Recent Tournaments Section)
   ========================================================================== */

window.renderSobrePage = async function (container) {
  const [settings, aboutSettings, trophies, recentTournaments, communityTournaments] = await Promise.all([
    window.LykosDB.getSettings(),
    window.LykosDB.getAboutSettings(),
    window.LykosDB.getTrophies(),
    window.LykosDB.getRecentTournaments(),
    window.LykosDB.getCommunityTournaments().catch(() => [])
  ]);

  const activeTournaments = communityTournaments.filter(t => (t.status || '').toLowerCase().includes('andamento'));
  const openTournaments = communityTournaments.filter(t => (t.status || '').toLowerCase().includes('aberta') || (t.status || '').toLowerCase().includes('inscriç'));
  const featuredTournaments = activeTournaments.length > 0 ? activeTournaments : openTournaments;

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 130px; text-align: center; position: relative; overflow: hidden;">
      <div class="hero-glow-arc-container">
        <div class="hero-glow-arc-bg" style="width: 700px; height: 350px; top: -140px;"></div>
      </div>
      <div class="container" style="position: relative; z-index: 2;">
        <h1 class="section-heading" style="font-size: 3.2rem;">Sobre a <span>${settings.team_name}</span></h1>
        <p class="section-subtitle" style="margin: 0 auto 2.5rem; max-width: 750px; font-size: 1.1rem; line-height: 1.7;">
          ${aboutSettings.history_text}
        </p>
      </div>
    </section>

    <section class="section-dark-2">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: center;">
          <div class="glass-card" style="padding: 2.5rem;">
            <h2 class="section-heading" style="font-size: 2rem;">Mentalidade <span>Vencedora</span></h2>
            <p style="margin-bottom: 2rem; color: var(--text-muted-light); line-height: 1.7; font-size: 0.95rem;">
              ${aboutSettings.mission_text}
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem; text-align: center; border-top: 1px solid var(--border-dark); padding-top: 1.5rem;">
              <div>
                <div style="font-family: var(--font-tech); font-size: 2.4rem; font-weight: 700; color: var(--accent-neon); line-height: 1;">${aboutSettings.stat_trophies}</div>
                <p style="font-size: 0.78rem; color: var(--text-muted-light); text-transform: uppercase; margin-top: 4px; font-weight: 600;">Troféus</p>
              </div>
              <div>
                <div style="font-family: var(--font-tech); font-size: 2.4rem; font-weight: 700; color: var(--accent-neon); line-height: 1;">${aboutSettings.stat_winrate}</div>
                <p style="font-size: 0.78rem; color: var(--text-muted-light); text-transform: uppercase; margin-top: 4px; font-weight: 600;">Winrate</p>
              </div>
              <div>
                <div style="font-family: var(--font-tech); font-size: 2.4rem; font-weight: 700; color: var(--accent-neon); line-height: 1;">${aboutSettings.stat_community}</div>
                <p style="font-size: 0.78rem; color: var(--text-muted-light); text-transform: uppercase; margin-top: 4px; font-weight: 600;">Comunidade</p>
              </div>
            </div>
          </div>

          <div style="position: relative;">
            <img src="${aboutSettings.about_image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'}" alt="LYKOS Arena" style="width: 100%; border-radius: var(--radius-md); border: 1px solid var(--border-dark-strong); max-height: 420px; object-fit: cover; box-shadow: 0 15px 40px rgba(0,0,0,0.5);">
          </div>
        </div>
      </div>
    </section>

    <!-- TORNEIOS EM ANDAMENTO / ATIVOS -->
    ${featuredTournaments && featuredTournaments.length > 0 ? `
      <section class="section-dark-1" style="border-top: 1px solid var(--border-dark); border-bottom: 1px solid var(--border-dark); padding: 3.5rem 0;">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 class="section-heading" style="font-size: 2rem; margin-bottom: 0.25rem;">
                <span style="color: #ff4d4d; animation: pulse 1.5s infinite;">🔴</span> Torneios <span>em Andamento</span>
              </h2>
              <p class="section-subtitle" style="margin: 0;">Competições ativas e circuitos abertos que a LYKOS está participando.</p>
            </div>
            <a href="/torneios" class="btn-primary" style="padding: 8px 18px; font-size: 0.82rem;">Ver Todos os Torneios &rarr;</a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
            ${featuredTournaments.map(t => `
              <div class="glass-card glass-card-interactive" style="overflow: hidden; display: flex; flex-direction: column; border: 1px solid rgba(168, 85, 247, 0.4);">
                <div style="height: 150px; background-image: url('${t.banner_url || t.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}'); background-size: cover; background-position: center; position: relative;">
                  <span class="game-badge" style="top: 12px; left: 12px;">${t.game || 'Geral'}</span>
                  <span class="match-status-pill ${activeTournaments.length > 0 ? 'status-live' : 'status-open'}" style="position: absolute; top: 12px; right: 12px;">
                    ${activeTournaments.length > 0 ? '🔴 EM ANDAMENTO' : (t.status || 'Inscrições Abertas')}
                  </span>
                </div>
                <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: white; margin-bottom: 6px;">${t.title || t.name || 'Torneio'}</h3>
                    <p style="font-size: 0.83rem; color: var(--text-muted-light); line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${t.description || 'Sem descrição cadastrada.'}</p>
                  </div>
                  
                  <div style="border-top: 1px solid var(--border-dark); padding-top: 0.85rem; margin-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-size: 0.72rem; color: var(--text-muted-light);">Premiação</div>
                      <div style="font-weight: 700; color: var(--accent-neon); font-size: 0.9rem;">${t.prize_pool || 'A definir'}</div>
                    </div>
                    <a href="/torneios" class="btn-secondary" style="padding: 6px 14px; font-size: 0.78rem;">Detalhes &rarr;</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    ` : ''}

    <!-- TROPHY CABINET -->
    <section class="section-dark-1">
      <div class="container">
        <h2 class="section-heading">Nossas <span>Conquistas</span></h2>
        <p class="section-subtitle">Títulos históricos conquistados pelos nossos atletas nas principais arenas mundiais.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3.5rem;">
          ${trophies.map(t => `
            <div class="trophy-card" data-id="${t.id}">
              <span class="game-badge" style="position: static; margin-bottom: 6px; display: inline-block;">${t.game || 'Geral'} • ${t.year}</span>
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
                  <td><span class="game-badge" style="position: static; font-size: 0.68rem;">${rec.game || 'Geral'}</span></td>
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
