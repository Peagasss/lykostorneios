/* ==========================================================================
   LYKOS E-SPORTS - MATCH DETAIL COMPONENT
   Features: Team Logos in Performance Tables & First Kills / First Deaths
   ========================================================================== */

window.renderMatchDetailPage = async function (container, params) {
  try {
    const matchId = params ? params.id : null;
    const match = matchId ? await window.LykosDB.getMatchById(matchId) : null;
    const settings = await window.LykosDB.getSettings();
    const teamName = settings.team_name || 'LYKOS';

    if (!match) {
      container.innerHTML = `
        <section class="section-dark-1" style="padding-top: 140px; text-align: center;">
          <div class="container">
            <h2>Partida não encontrada</h2>
            <a href="#/partidas" class="btn-primary" style="margin-top: 2rem;">Voltar para Partidas</a>
          </div>
        </section>
      `;
      return;
    }

    const relatedMatches = await window.LykosDB.getRelatedMatches(match.game || 'Valorant', match.id);

    const teamLogoHtml = settings && settings.logo_url 
      ? `<img src="${settings.logo_url}" alt="${teamName}" class="team-logo-img" style="width: 64px; height: 64px;">`
      : `<div class="brand-logo" style="font-size: 2.2rem;">${teamName}</div>`;

    const statusStr = (match.status || 'UPCOMING').toUpperCase();
    const statusLower = statusStr.toLowerCase();

    let formattedDate = 'A definir';
    let formattedTime = '';
    if (match.match_date) {
      const d = new Date(match.match_date);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('pt-BR');
        formattedTime = 'às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      } else {
        formattedDate = String(match.match_date);
      }
    }

    // Fail-safe Array Parsers
    let mapsList = [];
    if (Array.isArray(match.maps_json)) {
      mapsList = match.maps_json;
    } else if (typeof match.maps_json === 'string') {
      try { mapsList = JSON.parse(match.maps_json); } catch (e) { mapsList = []; }
    }

    let kdasList = [];
    if (Array.isArray(match.player_kdas)) {
      kdasList = match.player_kdas;
    } else if (typeof match.player_kdas === 'string') {
      try { kdasList = JSON.parse(match.player_kdas); } catch (e) { kdasList = []; }
    }

    const homePlayers = kdasList.filter(p => !p.team || p.team === teamName || p.team.toLowerCase().includes(teamName.toLowerCase()));
    const awayPlayers = kdasList.filter(p => p.team && p.team !== teamName && !p.team.toLowerCase().includes(teamName.toLowerCase()));

    function renderPlayerTable(players, teamTitle, logoUrl) {
      if (!players || players.length === 0) {
        return `<div style="padding: 1rem; color: var(--text-muted-light); font-size: 0.85rem;">Nenhum jogador registrado para ${teamTitle}.</div>`;
      }

      const logoImgHtml = logoUrl 
        ? `<img src="${logoUrl}" alt="${teamTitle}" style="width: 28px; height: 28px; object-fit: contain; vertical-align: middle;">` 
        : `<span class="game-badge" style="position: static;">${teamTitle}</span>`;

      return `
        <div style="margin-bottom: 2rem;">
          <h4 style="font-size: 1.1rem; color: white; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 10px;">
            ${logoImgHtml}
            <span style="font-weight: 700;">${teamTitle}</span>
            <span style="color: var(--text-muted-light); font-size: 0.8rem; font-weight: 400;">(Súmula de Performance)</span>
          </h4>
          <table class="kda-table">
            <thead>
              <tr>
                <th>Jogador</th>
                <th>Kills (K)</th>
                <th>Mortes (D)</th>
                <th>Assistências (A)</th>
                <th>First Kills (FK)</th>
                <th>First Deaths (FD)</th>
                <th>Calculado K/D</th>
              </tr>
            </thead>
            <tbody>
              ${players.map(p => {
                const kills = Number(p.kills) || 0;
                const deaths = Math.max(1, Number(p.deaths) || 0);
                const kdRatio = (kills / deaths).toFixed(1);

                return `
                  <tr>
                    <td><strong>${p.nickname || 'Jogador'}</strong></td>
                    <td style="color: #28a745; font-weight: 700;">${kills}</td>
                    <td style="color: #ff4d4d;">${p.deaths || 0}</td>
                    <td style="color: var(--accent-neon);">${p.assists || 0}</td>
                    <td style="color: #ffb703; font-weight: 700;">${p.first_kills || 0}</td>
                    <td style="color: #e63946;">${p.first_deaths || 0}</td>
                    <td>
                      <span style="background: rgba(157,80,255,0.18); border: 1px solid var(--accent-neon); color: var(--accent-neon); font-weight: 700; padding: 3px 10px; border-radius: 12px; font-size: 0.85rem; display: inline-block;">
                        ${kdRatio} K/D
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    container.innerHTML = `
      <!-- HEADER MATCH DETAIL BANNER -->
      <section class="match-detail-banner">
        <div class="container">
          <a href="#/partidas" style="color: var(--accent-neon); font-size: 0.85rem; font-weight: 700;">&larr; Voltar para Partidas</a>
          
          <div style="text-align: center; margin-top: 1.25rem;">
            <span class="game-badge" style="position: static;">${match.game || 'E-Sports'}</span>
            <div style="font-size: 1rem; color: var(--text-muted-light); margin-top: 6px;">
              ${match.tournament_name || 'Torneio Oficial'} ${match.format ? '• ' + match.format : ''}
            </div>
          </div>

          <div class="match-summary-card" style="margin-top: 1.75rem;">
            <div class="team-box">
              ${teamLogoHtml}
              <div>
                <div class="team-name" style="font-size: 1.6rem;">${teamName}</div>
              </div>
            </div>

            <div class="match-vs-center">
              <span class="match-status-pill status-${statusLower}">${statusStr}</span>
              <div class="match-score-badge" style="font-size: 2.5rem; padding: 8px 28px;">
                ${statusStr === 'FINISHED' || statusStr === 'LIVE' ? `${match.score_lykos || 0} - ${match.score_opponent || 0}` : 'VS'}
              </div>
              <div style="color: var(--text-muted-light); font-size: 0.85rem; margin-top: 6px;">
                ${formattedDate} ${formattedTime}
              </div>
              ${statusStr === 'LIVE' && match.stream_url ? `
                <a href="${match.stream_url}" target="_blank" class="btn-live" style="margin-top: 10px;">
                  Assistir Transmissão Ao Vivo
                </a>
              ` : ''}
            </div>

            <div class="team-box away">
              <img src="${match.opponent_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}" alt="${match.opponent_name || 'Adversário'}" class="team-logo-img" style="width: 64px; height: 64px;">
              <div>
                <div class="team-name" style="font-size: 1.6rem;">${match.opponent_name || 'Adversário'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CONTENT GRID -->
      <section class="section-dark-2">
        <div class="container">
          <div class="match-detail-grid">
            
            <div>
              <h3 style="font-size: 1.4rem; margin-bottom: 1.25rem;">Placar por <span>Mapa</span></h3>
              
              ${mapsList && mapsList.length > 0 ? mapsList.map((m, idx) => `
                <div class="map-cover-card" style="background-image: url('${m.map_image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}');">
                  <div class="map-cover-overlay"></div>
                  <div class="map-cover-content">
                    <div>
                      <span style="color: var(--accent-neon); font-weight: 700; font-size: 0.8rem; text-transform: uppercase;">MAPA ${idx + 1}</span>
                      <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: white;">${m.map_name || 'Mapa ' + (idx+1)}</h3>
                    </div>
                    <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700;">
                      <span style="color: ${(m.score_lykos || 0) > (m.score_opponent || 0) ? 'var(--accent-neon)' : 'white'}">${m.score_lykos || 0}</span>
                      <span style="color: var(--text-muted-light); margin: 0 6px;">-</span>
                      <span style="color: ${(m.score_opponent || 0) > (m.score_lykos || 0) ? '#ff4d4d' : 'white'}">${m.score_opponent || 0}</span>
                    </div>
                  </div>
                </div>
              `).join('') : `
                <div style="background: var(--bg-dark-card); border: 1px solid var(--border-dark); padding: 1.5rem; border-radius: var(--radius-xs); color: var(--text-muted-light);">
                  Placar de mapas aguardando encerramento do confronto.
                </div>
              `}

              <div style="margin-top: 2.5rem;">
                <h3 style="font-size: 1.35rem; margin-bottom: 1.5rem;">Performance dos Jogadores <span>(Súmulas K/D)</span></h3>
                
                ${renderPlayerTable(homePlayers, teamName, settings.logo_url)}
                ${renderPlayerTable(awayPlayers, match.opponent_name || 'Adversário', match.opponent_logo)}
              </div>

              <div style="margin-top: 2rem;">
                <h4 style="font-size: 0.9rem; margin-bottom: 6px; color: var(--text-muted-light);">Observações Oficiais</h4>
                <p style="color: var(--text-light); font-size: 0.9rem; line-height: 1.6;">${match.notes || 'Nenhuma informação adicional.'}</p>
              </div>
            </div>

            <div>
              <h3 style="font-size: 1.2rem; margin-bottom: 1.25rem;">Últimas Partidas Concluídas</h3>
              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                ${relatedMatches && relatedMatches.length > 0 ? relatedMatches.map(m => `
                  <a href="#/partidas/${m.id}" style="background: var(--bg-dark-card); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1rem; display: flex; justify-content: space-between; align-items: center; transition: var(--transition-fast);">
                    <div>
                      <div style="font-size: 0.75rem; color: var(--accent-neon); font-weight: 700;">${m.game || 'Game'} • ${m.tournament_name || 'Torneio'}</div>
                      <div style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; margin-top: 2px;">vs ${m.opponent_name || 'Adversário'}</div>
                    </div>
                    <div style="font-family: var(--font-heading); font-weight: 700; color: ${(m.score_lykos || 0) > (m.score_opponent || 0) ? '#28a745' : '#ff4d4d'}; font-size: 1.1rem;">
                      ${m.score_lykos || 0} - ${m.score_opponent || 0}
                    </div>
                  </a>
                `).join('') : `
                  <div style="color: var(--text-muted-light); font-size: 0.85rem;">Nenhuma outra partida recente.</div>
                `}
              </div>
            </div>

          </div>
        </div>
      </section>
    `;
  } catch (err) {
    console.error('[MatchDetail] Render error:', err);
    container.innerHTML = `
      <section class="section-dark-1" style="padding-top: 140px; text-align: center;">
        <div class="container">
          <h2>Partida selecionada indisponível</h2>
          <p style="color: var(--text-muted-light); margin-top: 8px;">Os detalhes deste confronto ainda estão sendo processados pela equipe técnica.</p>
          <a href="#/partidas" class="btn-primary" style="margin-top: 1.5rem;">Voltar para Lista de Partidas</a>
        </div>
      </section>
    `;
  }
};
