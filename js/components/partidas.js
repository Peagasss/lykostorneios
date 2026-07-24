/* ==========================================================================
   LYKOS E-SPORTS - PARTIDAS COMPONENT
   Priority Featured Match (1. LIVE -> 2. UPCOMING -> 3. FINISHED)
   ========================================================================== */

window.renderPartidasPage = async function (container) {
  const matches = await window.LykosDB.getMatches();
  const settings = await window.LykosDB.getSettings();

  const teamName = settings.team_name || 'LYKOS';
  const teamLogoHtml = settings.logo_url 
    ? `<img src="${settings.logo_url}" alt="${teamName}" class="team-logo-img" style="width: 64px; height: 64px;">`
    : `<div class="brand-logo" style="font-size: 2rem;">${teamName}</div>`;

  // Sort matches by priority: 1. LIVE, 2. UPCOMING, 3. FINISHED
  function getMatchPriority(status) {
    const s = (status || '').toUpperCase();
    if (s === 'LIVE') return 1;
    if (s === 'UPCOMING') return 2;
    if (s === 'FINISHED') return 3;
    return 4;
  }

  const sortedMatches = [...matches].sort((a, b) => {
    const prioA = getMatchPriority(a.status);
    const prioB = getMatchPriority(b.status);
    if (prioA !== prioB) return prioA - prioB;

    const timeA = a && a.match_date ? new Date(a.match_date).getTime() : 0;
    const timeB = b && b.match_date ? new Date(b.match_date).getTime() : 0;
    if (a.status === 'UPCOMING') return timeA - timeB;
    return timeB - timeA;
  });

  // Find the single priority featured match
  const featuredMatch = sortedMatches.length > 0 ? sortedMatches[0] : null;

  function safeDateStr(matchDate) {
    if (!matchDate) return 'A definir';
    const d = new Date(matchDate);
    if (isNaN(d.getTime())) return String(matchDate);
    return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  function renderFeaturedBanner(match) {
    if (!match) return '';

    const statusStr = (match.status || 'UPCOMING').toUpperCase();
    const statusLower = statusStr.toLowerCase();

    let highlightTitle = 'Destaque Principal';
    if (statusStr === 'LIVE') highlightTitle = 'AGORA AO VIVO';
    else if (statusStr === 'UPCOMING') highlightTitle = 'PRÓXIMO CONFRONTO';
    else if (statusStr === 'FINISHED') highlightTitle = 'ÚLTIMO RESULTADO';

    return `
      <div class="featured-match-hero">
        <div class="featured-match-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="featured-title-tag">${highlightTitle}</span>
            <span class="game-badge" style="position: static;">${match.game || 'E-Sports'}</span>
          </div>
          <span class="match-status-pill status-${statusLower}">
            ${statusStr === 'LIVE' ? '🔴 AO VIVO' : statusStr}
          </span>
        </div>

        <div class="featured-tournament-info">
          ${match.tournament_name || 'Torneio Oficial'} ${match.format ? '• ' + match.format : ''}
        </div>

        <div class="match-summary-card featured-card-inner">
          <div class="team-box">
            ${teamLogoHtml}
            <div>
              <div class="team-name" style="font-size: 1.6rem;">${teamName}</div>
            </div>
          </div>

          <div class="match-vs-center">
            <div class="match-score-badge" style="font-size: 2.5rem; padding: 6px 28px;">
              ${statusStr === 'FINISHED' || statusStr === 'LIVE' ? `${match.score_lykos || 0} - ${match.score_opponent || 0}` : 'VS'}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted-light); margin-top: 8px;">
              ${safeDateStr(match.match_date)}
            </div>
          </div>

          <div class="team-box away">
            <img src="${match.opponent_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}" alt="${match.opponent_name || 'Adversário'}" class="team-logo-img">
            <div>
              <div class="team-name" style="font-size: 1.6rem;">${match.opponent_name || 'Adversário'}</div>
            </div>
          </div>
        </div>

        <div class="featured-match-footer">
          <span style="font-size: 0.85rem; color: var(--text-muted-light);">${match.notes || 'Partida em destaque oficial da temporada.'}</span>
          
          <div style="display: flex; gap: 10px;">
            ${statusStr === 'LIVE' && match.stream_url ? `
              <a href="${match.stream_url}" target="_blank" class="btn-live" style="padding: 10px 22px; font-size: 0.85rem;">
                Assistir Transmissão Ao Vivo
              </a>
            ` : ''}
            <a href="#/partidas/${match.id}" class="btn-primary" style="padding: 10px 22px; font-size: 0.85rem;">
              Ver Súmula & Detalhes completos &rarr;
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function renderMatchCards(statusFilter) {
    let filtered = sortedMatches;
    if (statusFilter === 'UPCOMING') filtered = sortedMatches.filter(m => (m.status || '').toUpperCase() === 'UPCOMING');
    if (statusFilter === 'LIVE') filtered = sortedMatches.filter(m => (m.status || '').toUpperCase() === 'LIVE');
    if (statusFilter === 'FINISHED') filtered = sortedMatches.filter(m => (m.status || '').toUpperCase() === 'FINISHED');

    if (filtered.length === 0) {
      return `<div style="padding: 3rem; text-align: center; color: var(--text-muted-light);">Nenhuma partida encontrada nesta categoria.</div>`;
    }

    return filtered.map(match => {
      const statusStr = (match.status || 'UPCOMING').toUpperCase();
      const statusLower = statusStr.toLowerCase();

      return `
        <div style="background: var(--bg-dark-card); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 10px;">
            <div>
              <span class="game-badge" style="position: static; margin-right: 8px;">${match.game || 'E-Sports'}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted-light); font-weight: 600;">
                ${match.tournament_name || 'Torneio Oficial'} ${match.format ? '• ' + match.format : ''}
              </span>
            </div>
            <span class="match-status-pill status-${statusLower}">${statusStr}</span>
          </div>

          <div class="match-summary-card" style="background: transparent; border: none; padding: 0;">
            <div class="team-box">
              ${teamLogoHtml}
              <div>
                <div class="team-name">${teamName}</div>
              </div>
            </div>

            <div class="match-vs-center">
              <div class="match-score-badge">
                ${statusStr === 'FINISHED' || statusStr === 'LIVE' ? `${match.score_lykos || 0} - ${match.score_opponent || 0}` : 'VS'}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted-light); margin-top: 6px;">
                ${safeDateStr(match.match_date)}
              </div>
            </div>

            <div class="team-box away">
              <img src="${match.opponent_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}" alt="${match.opponent_name || 'Adversário'}" class="team-logo-img">
              <div>
                <div class="team-name">${match.opponent_name || 'Adversário'}</div>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-dark); flex-wrap: wrap; gap: 10px;">
            <span style="font-size: 0.85rem; color: var(--text-muted-light);">${match.notes || 'Partida oficial da temporada.'}</span>
            
            <div style="display: flex; gap: 10px;">
              ${statusStr === 'LIVE' && match.stream_url ? `
                <a href="${match.stream_url}" target="_blank" class="btn-live">
                  Acompanhar Ao Vivo
                </a>
              ` : ''}
              <a href="#/partidas/${match.id}" class="btn-primary" style="padding: 8px 18px; font-size: 0.78rem;">
                Detalhes da Partida &rarr;
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 130px;">
      <div class="container">
        <h1 class="section-heading">Partidas <span>LYKOS</span></h1>
        <p class="section-subtitle">Confira os horários dos confrontos, transmissões ao vivo e súmulas dos resultados.</p>

        <!-- FEATURED MATCH HERO CARD -->
        ${renderFeaturedBanner(featuredMatch)}

        <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: white;">Calendário Completo & Resultados</h3>

        <div style="display: flex; gap: 8px; margin-bottom: 2.25rem; flex-wrap: wrap;">
          <button class="btn-primary tab-btn active" data-tab="ALL" style="padding: 6px 18px; border-radius: 4px;">Todas as Partidas</button>
          <button class="btn-secondary tab-btn" data-tab="LIVE" style="padding: 6px 18px; border-radius: 4px; color: #e63946;">Ao Vivo</button>
          <button class="btn-secondary tab-btn" data-tab="UPCOMING" style="padding: 6px 18px; border-radius: 4px;">Próximas</button>
          <button class="btn-secondary tab-btn" data-tab="FINISHED" style="padding: 6px 18px; border-radius: 4px;">Resultados</button>
        </div>

        <div id="matches-list-container">
          ${renderMatchCards('ALL')}
        </div>
      </div>
    </section>
  `;

  const tabs = container.querySelectorAll('.tab-btn');
  const matchesContainer = container.querySelector('#matches-list-container');

  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => {
        t.classList.remove('btn-primary', 'active');
        t.classList.add('btn-secondary');
      });
      tab.classList.remove('btn-secondary');
      tab.classList.add('btn-primary', 'active');

      const filter = tab.getAttribute('data-tab');
      matchesContainer.innerHTML = renderMatchCards(filter);
    };
  });
};
