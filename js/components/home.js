/* ==========================================================================
   LYKOS E-SPORTS - HOME PAGE COMPONENT (Serious Minimalist Design)
   ========================================================================== */

window.renderHomePage = async function (container) {
  const [settings, matches, roster, gallery, socialFeeds] = await Promise.all([
    window.LykosDB.getSettings(),
    window.LykosDB.getMatches(),
    window.LykosDB.getRoster(),
    window.LykosDB.getGallery(),
    window.LykosDB.getSocialFeeds()
  ]);

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

    // Tie-breaker: closest date
    const timeA = a && a.match_date ? new Date(a.match_date).getTime() : 0;
    const timeB = b && b.match_date ? new Date(b.match_date).getTime() : 0;
    if (a.status === 'UPCOMING') return timeA - timeB;
    return timeB - timeA;
  });

  const featuredMatch = sortedMatches.length > 0 ? sortedMatches[0] : null;
  const rosterTeaser = roster.slice(0, 4);
  const galleryTeaser = gallery.slice(0, 3);

  const teamLogoSrc = settings.logo_url || 'assets/logo.png';
  const teamLogoHtml = `<img src="${teamLogoSrc}" alt="${settings.team_name}" class="team-logo-img" onerror="this.src='assets/logo.png'">`;

  let sectionTitle = 'Próximo Confronto';
  let sectionSubtitle = 'Acompanhe datas, horários e placares das nossas modalidades.';
  if (featuredMatch) {
    const status = (featuredMatch.status || 'UPCOMING').toUpperCase();
    if (status === 'LIVE') {
      sectionTitle = 'Partida Ao Vivo';
      sectionSubtitle = 'Acompanhe a nossa partida em andamento!';
    } else if (status === 'FINISHED') {
      sectionTitle = 'Último Resultado';
      sectionSubtitle = 'Confira o placar do nosso confronto mais recente.';
    }
  }

  // Filter ONLY players who have is_starter marked
  const starterPlayers = roster.filter(p => p.is_starter === true || String(p.is_starter) === 'true');

  container.innerHTML = `
    <!-- MAIN HOME WRAPPER (FULL WIDTH - EDGE TO EDGE WITH ELEGANT TOP SPACING) -->
    <section style="padding-top: 140px; padding-bottom: 4rem; min-height: 80vh; position: relative; width: 100%;">
      <div style="width: 100%; padding: 0 2rem; box-sizing: border-box;">

        <!-- BANNER DE DESTAQUE: 5 JOGADORES PRINCIPAIS DO ELENCO (5 COLUNAS FIXAS 9:16) -->
        <div style="margin-bottom: 3rem; width: 100%; box-sizing: border-box;">
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem;" class="starters-responsive-grid">
            ${Array.from({ length: 5 }).map((_, index) => {
              const player = starterPlayers[index];
              if (player) {
                return `
                  <a href="/elenco" class="starter-card glass-card-interactive" style="border: none; border-radius: var(--radius-sm); overflow: hidden; background: rgba(14, 11, 26, 0.6); display: flex; flex-direction: column; cursor: pointer; transition: all 0.3s ease; text-decoration: none;">
                    <div style="aspect-ratio: 9 / 16; width: 100%; overflow: hidden; position: relative; background: radial-gradient(circle at center, rgba(168,85,247,0.1) 0%, rgba(10,8,22,0.85) 100%); border-radius: var(--radius-sm);">
                      <img src="${player.photo_url}" alt="${player.nickname}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.4s ease;">
                      
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem 0.4rem; background: linear-gradient(to top, rgba(8,6,16,0.98) 0%, rgba(8,6,16,0.6) 70%, transparent 100%); text-align: center; z-index: 2;">
                        <div style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${player.nickname}</div>
                        <div style="font-size: 0.72rem; color: var(--accent-neon); font-weight: 700; text-transform: uppercase; margin-top: 2px;">${player.role || 'Player'}</div>
                      </div>
                    </div>
                  </a>
                `;
              } else {
                return `<div style="aspect-ratio: 9 / 16; width: 100%;"></div>`;
              }
            }).join('')}
          </div>
        </div>

        <!-- DIVISÃO EM DOIS LADOS: PRÓXIMO CONFRONTO (ESQUERDA) | TORCIDA OFICIAL (DIREITA) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;" class="home-split-grid">
          
          <!-- LADO ESQUERDO: NOTIFICAÇÃO PRÓXIMO CONFRONTO HIERÁRQUICO -->
          <div class="glass-card" style="padding: 2.25rem; border: none !important; box-shadow: none; display: flex; flex-direction: column; justify-content: space-between; background: rgba(14, 11, 26, 0.6);">
            <div>
              <div style="margin-bottom: 1rem;">
                <h2 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: #ffffff; line-height: 1.1; margin-bottom: 6px;">
                  PRÓXIMO <span style="color: var(--accent-neon);">CONFRONTO</span>
                </h2>
                <p style="font-size: 0.88rem; color: var(--text-muted-light);">
                  ${sectionSubtitle}
                </p>
              </div>

              ${featuredMatch ? `
                <div style="background: rgba(14, 11, 26, 0.85); border: none !important; border-radius: var(--radius-xs); padding: 1.5rem; margin-top: 1.5rem;">
                  <div style="font-family: var(--font-heading); font-size: 0.78rem; font-weight: 700; color: var(--accent-neon); text-transform: uppercase; margin-bottom: 1rem;">
                    ${featuredMatch.game} • ${featuredMatch.tournament_name || 'Campeonato'}
                  </div>

                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem;">
                    <!-- TIME CASA -->
                    <div style="display: flex; align-items: center; gap: 10px;">
                      ${teamLogoHtml}
                      <div style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: white;">${settings.team_name}</div>
                    </div>

                    <!-- SCORE / VS -->
                    <div style="text-align: center;">
                      ${(featuredMatch.status || '').toUpperCase() === 'LIVE' ? `<span class="match-status-pill status-live" style="margin-bottom: 6px; display: inline-block;">🔴 AO VIVO</span>` : ''}
                      <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: white; padding: 4px 16px; background: rgba(168,85,247,0.15); border-radius: var(--radius-xs); border: none !important;">
                        ${(featuredMatch.status || '').toUpperCase() === 'FINISHED' || (featuredMatch.status || '').toUpperCase() === 'LIVE' 
                          ? `${featuredMatch.score_lykos || 0} - ${featuredMatch.score_opponent || 0}` 
                          : 'VS'}
                      </div>
                    </div>

                    <!-- ADVERSÁRIO -->
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: white;">${featuredMatch.opponent_name}</div>
                      <img src="${featuredMatch.opponent_logo || 'assets/logo-adversario-padrao.webp'}" alt="${featuredMatch.opponent_name}" class="team-logo-img">
                    </div>
                  </div>
                </div>
              ` : `
                <div style="padding: 2rem; text-align: center; color: var(--text-muted-light);">Nenhuma partida agendada.</div>
              `}
            </div>

            <div style="margin-top: 1.75rem; display: flex; gap: 10px; justify-content: flex-end;">
              ${featuredMatch && (featuredMatch.status || '').toUpperCase() === 'LIVE' && featuredMatch.stream_url ? `
                <a href="${featuredMatch.stream_url}" target="_blank" class="btn-live" style="padding: 10px 18px; font-size: 0.8rem;">🔴 ASSISTIR AO VIVO</a>
              ` : ''}
              ${featuredMatch ? `<a href="/partidas/${featuredMatch.id}" class="btn-secondary" style="padding: 10px 18px; font-size: 0.8rem;">Detalhes &rarr;</a>` : ''}
              <a href="/partidas" class="btn-primary" style="padding: 10px 18px; font-size: 0.8rem;">Ver Calendário &rarr;</a>
            </div>
          </div>

          <!-- LADO DIREITO: FAÇA PARTE DA NOSSA TORCIDA OFICIAL (VAI PARA /CONTATO) -->
          <div class="glass-card" style="padding: 2.5rem; border: none !important; box-shadow: none; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(10,8,22,0.85) 100%); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 220px; height: 220px; background: rgba(168,85,247,0.2); filter: blur(50px); border-radius: 50%; pointer-events: none;"></div>

            <div>
              <div class="section-title-badge" style="margin-bottom: 1rem;">COMUNIDADE & TORCIDA</div>
              <h2 style="font-family: var(--font-heading); font-size: 2.4rem; font-weight: 800; color: #ffffff; line-height: 1.15; margin-bottom: 1rem;">
                FAÇA PARTE DA NOSSA <span style="color: var(--accent-neon);">TORCIDA OFICIAL</span>
              </h2>
              <p style="font-size: 0.95rem; color: var(--text-muted-light); line-height: 1.6; margin-bottom: 1.75rem;">
                Entre no nosso servidor do Discord, participe de torneios da comunidade, receba conteúdos exclusivos em primeira mão e torça junto com a alcateia!
              </p>
            </div>

            <div>
              <a href="/contato" class="btn-primary" style="display: block; text-align: center; padding: 16px 24px; font-size: 0.95rem; font-weight: 800; box-shadow: 0 0 25px rgba(168,85,247,0.5);">
                UNIR-SE À TORCIDA AGORA &rarr;
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  `;
};
