/* ==========================================================================
   LYKOS E-SPORTS - TORNEIOS COMPONENT
   Plataforma de Divulgação de Torneios Internos e Parcerias
   ========================================================================== */

window.renderTorneiosPage = async function (container) {
  const tournaments = await window.LykosDB.getCommunityTournaments();

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 130px; min-height: 80vh; position: relative; overflow: hidden;">
      <div class="hero-glow-arc-container">
        <div class="hero-glow-arc-bg" style="width: 700px; height: 350px; top: -140px;"></div>
      </div>
      <div class="container" style="position: relative; z-index: 2;">
        <h1 class="section-heading">Torneios <span>& Parcerias</span></h1>
        <p class="section-subtitle">Divulgação oficial de torneios abertos da comunidade, campeonatos parceiros e circuitos da LYKOS.</p>

        ${(() => {
          if (!tournaments || tournaments.length === 0) {
            return `
              <div style="background: var(--bg-dark-card); border: 1px solid var(--border-dark); padding: 3.5rem 2rem; border-radius: var(--radius-sm); text-align: center; margin-top: 2.5rem; max-width: 680px; margin-left: auto; margin-right: auto;">
                <div style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent-neon);">🏆</div>
                <h3 style="font-size: 1.4rem; color: white; margin-bottom: 0.5rem;">Foco Total no Elenco Profissional</h3>
                <p style="color: var(--text-muted-light); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  No momento nossa estrutura está 100% concentrada na preparação do elenco oficial para os grandes campeonatos internacionais.
                </p>
                <p style="font-size: 0.8rem; color: var(--text-muted-light);">
                  Novos torneios da comunidade e circuitos parceiros serão anunciados em breve! Fique atento em nosso Discord oficial.
                </p>
                <a href="/contato" class="btn-secondary" style="display: inline-block; margin-top: 1.5rem; padding: 8px 20px;">Entrar no Discord &rarr;</a>
              </div>
            `;
          }

          const inProgress = tournaments.filter(t => (t.status || '').toLowerCase().includes('andamento'));
          const openOrOther = tournaments.filter(t => !(t.status || '').toLowerCase().includes('andamento'));

          function renderCard(t, isLive = false) {
            return `
              <div class="glass-card glass-card-interactive" style="overflow: hidden; display: flex; flex-direction: column; ${isLive ? 'border: 1px solid rgba(230, 57, 70, 0.6) !important; box-shadow: 0 0 20px rgba(230, 57, 70, 0.25);' : ''}">
                <div style="height: 160px; background-image: url('${t.banner_url || t.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}'); background-size: cover; background-position: center; position: relative;">
                  <span class="game-badge" style="top: 12px; left: 12px;">${t.game || 'Geral'}</span>
                  <span class="match-status-pill ${isLive ? 'status-live' : 'status-open'}" style="position: absolute; top: 12px; right: 12px;">
                    ${isLive ? '🔴 EM ANDAMENTO' : (t.status || 'Inscrições Abertas')}
                  </span>
                </div>
                <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: white; margin-bottom: 6px;">${t.title || t.name || 'Torneio'}</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted-light); line-height: 1.5; margin-bottom: 1rem;">${t.description || 'Sem descrição cadastrada.'}</p>
                  </div>
                  
                  <div style="border-top: 1px solid var(--border-dark); padding-top: 0.85rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-size: 0.75rem; color: var(--text-muted-light);">Premiação</div>
                      <div style="font-weight: 700; color: var(--accent-neon); font-size: 0.95rem;">${t.prize_pool || 'A definir'}</div>
                    </div>
                    ${(t.registration_url || t.rules_url) ? `
                      <a href="${t.registration_url || t.rules_url}" target="_blank" class="btn-primary" style="padding: 6px 14px; font-size: 0.78rem;">
                        ${isLive ? 'Acompanhar / Chaves &rarr;' : 'Inscrever-se &rarr;'}
                      </a>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }

          let html = '';
          if (inProgress.length > 0) {
            html += `
              <div style="margin-top: 2rem; margin-bottom: 3rem;">
                <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff; display: flex; align-items: center; gap: 8px; margin-bottom: 1.25rem;">
                  <span style="color: #ff4d4d; animation: pulse 1.5s infinite;">🔴</span> CAMPEONATOS EM ANDAMENTO
                </h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
                  ${inProgress.map(t => renderCard(t, true)).join('')}
                </div>
              </div>
            `;
          }

          if (openOrOther.length > 0) {
            html += `
              <div style="margin-top: 1.5rem;">
                ${inProgress.length > 0 ? `<h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #ffffff; margin-bottom: 1.25rem;">📋 INSCRIÇÕES ABERTAS & OUTROS</h2>` : ''}
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
                  ${openOrOther.map(t => renderCard(t, false)).join('')}
                </div>
              </div>
            `;
          }

          return html;
        })()}
      </div>
    </section>
  `;
};
