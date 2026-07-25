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

  container.innerHTML = `
    <!-- HERO SECTION WITH CYBER GLOW ARC -->
    <section class="hero-section" style="position: relative; overflow: hidden;">
      <div class="hero-glow-arc-container">
        <div class="hero-glow-arc-bg"></div>
        <div class="hero-glow-arc-line"></div>
      </div>

      <div class="container hero-content" style="position: relative; z-index: 2; text-align: center; max-width: 900px; margin: 0 auto;">
        <div class="section-title-badge" style="margin: 0 auto 1.5rem auto;">
          <span>PRO TEAM & E-SPORTS ORGANIZATION</span>
        </div>
        <h1 class="hero-title" style="font-size: 3.5rem; font-weight: 700; line-height: 1.1; margin-bottom: 1.25rem;">${settings.hero_title}</h1>
        <p class="hero-subtitle" style="font-size: 1.15rem; color: var(--text-muted-light); max-width: 700px; margin: 0 auto 2.25rem auto;">${settings.hero_subtitle}</p>
        
        <div class="hero-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="/partidas" class="btn-primary" style="padding: 14px 30px; font-size: 0.88rem; box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);">Calendário de Partidas &rarr;</a>
          <a href="/elenco" class="btn-secondary" style="padding: 14px 30px; font-size: 0.88rem;">Conheça o Elenco</a>
        </div>

        <!-- TECH TRUST BAR -->
        <div class="trust-bar">
          <div class="trust-item"><span class="highlight">VALORANT</span> PRO LEAGUE</div>
          <div class="trust-item">•</div>
          <div class="trust-item"><span class="highlight">CS2</span> MAJOR CIRCUIT</div>
          <div class="trust-item">•</div>
          <div class="trust-item"><span class="highlight">14+</span> TROFÉUS</div>
          <div class="trust-item">•</div>
          <div class="trust-item"><span class="highlight">500K+</span> TORCEDORES</div>
        </div>
      </div>
    </section>

    <!-- SECTION 1: DESTAQUE DE PARTIDAS (GLASS CARD) -->
    <section class="section-dark-1" style="padding-top: 3rem;">
      <div class="container">
        <h2 class="section-heading">${sectionTitle.split(' ')[0]} <span>${sectionTitle.split(' ').slice(1).join(' ')}</span></h2>
        <p class="section-subtitle">${sectionSubtitle}</p>

        ${featuredMatch ? `
          <div class="glass-card" style="padding: 2.25rem; display: flex; flex-direction: column; gap: 1.5rem; position: relative;">
            <span class="match-game-label" style="position: absolute; top: 1.25rem; left: 1.5rem; font-family: var(--font-heading); font-size: 0.78rem; font-weight: 700; color: var(--accent-neon); text-transform: uppercase; letter-spacing: 0.08em;">
              ${featuredMatch.game} ${featuredMatch.tournament_name ? '• ' + featuredMatch.tournament_name : ''}
            </span>

            <div style="display: flex; width: 100%; justify-content: space-between; align-items: center; gap: 1.5rem; flex-wrap: wrap; box-sizing: border-box; padding-top: 1rem;">
              <div class="team-box" style="display: flex; align-items: center; gap: 1.25rem;">
                ${teamLogoHtml}
                <div>
                  <div class="team-name" style="font-size: 1.4rem; font-weight: 700;">${settings.team_name}</div>
                </div>
              </div>

              <div class="match-vs-center" style="text-align: center;">
                ${(featuredMatch.status || '').toUpperCase() === 'LIVE' ? `<span class="match-status-pill status-live" style="margin-bottom: 12px; display: inline-block;">🔴 AO VIVO</span>` : ''}
                <div class="match-score-badge" style="font-size: 2.2rem; padding: 6px 24px; background: rgba(168, 85, 247, 0.15); border: 1px solid var(--border-dark-strong); border-radius: var(--radius-sm);">
                  ${(featuredMatch.status || '').toUpperCase() === 'FINISHED' || (featuredMatch.status || '').toUpperCase() === 'LIVE' 
                    ? `${featuredMatch.score_lykos || 0} - ${featuredMatch.score_opponent || 0}` 
                    : 'VS.'}
                </div>
              </div>

              <div class="team-box away" style="display: flex; align-items: center; gap: 1.25rem;">
                <img src="${featuredMatch.opponent_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}" alt="${featuredMatch.opponent_name}" class="team-logo-img">
                <div>
                  <div class="team-name" style="font-size: 1.4rem; font-weight: 700;">${featuredMatch.opponent_name}</div>
                </div>
              </div>
            </div>

            <!-- STREAM / ACTIONS ROW -->
            <div style="display: flex; justify-content: flex-end; gap: 12px; align-items: center; border-top: 1px solid var(--border-dark); padding-top: 1.25rem; width: 100%; box-sizing: border-box;">
              ${(featuredMatch.status || '').toUpperCase() === 'LIVE' && featuredMatch.stream_url ? `
                <a href="${featuredMatch.stream_url}" target="_blank" class="btn-live">
                  Assistir Ao Vivo
                </a>
              ` : (featuredMatch.stream_url ? `
                <a href="${featuredMatch.stream_url}" target="_blank" class="btn-secondary" style="padding: 10px 18px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px;">
                  Transmissão
                </a>
              ` : '')}
              <a href="/partidas/${featuredMatch.id}" class="btn-primary" style="padding: 10px 20px; font-size: 0.8rem;">
                Detalhes da Partida &rarr;
              </a>
            </div>
          </div>
        ` : ''}
      </div>
    </section>

    <!-- SECTION 2: PILARES & STATS (01, 02, 03, 04) -->
    <section class="section-dark-2">
      <div class="container">
        <h2 class="section-heading">Nossa <span>Excelência</span></h2>
        <p class="section-subtitle">A estrutura que move a alcateia rumo ao topo mundial.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
          <div class="cyber-stat-card">
            <div class="cyber-stat-num">01</div>
            <div class="cyber-stat-title">Pro-Teams Dedicados</div>
            <div class="cyber-stat-desc">Lineups treinadas com suporte psicológico e comissão técnica de alto nível.</div>
          </div>

          <div class="cyber-stat-card">
            <div class="cyber-stat-num">02</div>
            <div class="cyber-stat-title">78% Winrate Global</div>
            <div class="cyber-stat-desc">Consistência e alto desempenho comprovados nas principais ligas nacionais e internacionais.</div>
          </div>

          <div class="cyber-stat-card">
            <div class="cyber-stat-num">03</div>
            <div class="cyber-stat-title">Comunidade Viva</div>
            <div class="cyber-stat-desc">Mais de 500 mil torcedores conectados no Discord, redes sociais e transmissões.</div>
          </div>

          <div class="cyber-stat-card">
            <div class="cyber-stat-num">04</div>
            <div class="cyber-stat-title">Infraestrutura Gaming</div>
            <div class="cyber-stat-desc">Gaming House moderna para bootcamps e preparação estratégica contínua.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: ELENCO SPOTLIGHT (GLASS CARDS) -->
    <section class="section-dark-1">
      <div class="container">
        <h2 class="section-heading">Elenco de <span>Elite</span></h2>
        <p class="section-subtitle">Pro-players de destaque vestindo o manto da LYKOS.</p>

        <div class="roster-grid">
          ${rosterTeaser.map(player => `
            <div class="glass-card glass-card-interactive player-card" data-id="${player.id}" style="padding: 1.25rem;">
              <div class="player-image-wrap" style="border-radius: var(--radius-sm); overflow: hidden;">
                <span class="game-badge">${player.game}</span>
                <img src="${player.photo_url}" alt="${player.nickname}">
              </div>
              <div class="player-info" style="padding-top: 1rem;">
                <div class="player-role">${player.role}</div>
                <div class="player-nickname" style="font-size: 1.35rem; color: #ffffff;">${player.nickname}</div>
                <div class="player-fullname">${player.name}</div>
                <p class="player-bio" style="font-size: 0.82rem; margin-top: 6px;">${player.bio}</p>
                <div style="font-size: 0.78rem; color: var(--accent-neon); font-weight: 700; margin-top: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Ver Perfil &rarr;</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 3rem;">
          <a href="/elenco" class="btn-primary">Ver Elenco Completo &rarr;</a>
        </div>
      </div>
    </section>

    <!-- SECTION 4: DESTAQUES / PURPLE BANNER -->
    <section class="section-dark-2">
      <div class="container">
        <div class="purple-highlight-section" style="text-align: center; max-width: 1000px; margin: 0 auto;">
          <h2 style="font-family: var(--font-heading); font-size: 2.4rem; font-weight: 700; color: #ffffff; margin-bottom: 1rem;">Faça Parte da Nossa Torcida Oficial</h2>
          <p style="font-size: 1.05rem; color: rgba(255,255,255,0.85); max-width: 650px; margin: 0 auto 2rem auto;">Entre no nosso servidor do Discord, participe de torneios da comunidade e acompanhe os bastidores exclusivos da alcateia.</p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="${settings.discord_url || 'https://discord.gg/lykosesports'}" target="_blank" class="btn-secondary" style="background: #ffffff !important; color: #4c1d95 !important; border: none; font-weight: 700; padding: 12px 28px;">Entrar no Discord &rarr;</a>
            <a href="/contato" class="btn-secondary" style="background: rgba(0,0,0,0.25); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); padding: 12px 28px;">Canais Oficiais</a>
          </div>
        </div>
      </div>
    </section>

    <!-- PLAYER POP-UP MODAL FOR HOME -->
    <div id="home-player-modal" class="modal-backdrop" style="display: none;">
      <div class="modal-content glass-card" style="max-width: 600px; border: 1px solid var(--border-dark-strong);">
        <button class="modal-close" id="home-player-modal-close">&times;</button>
        <div id="home-player-modal-body"></div>
      </div>
    </div>
  `;

  const modal = container.querySelector('#home-player-modal');
  const modalBody = container.querySelector('#home-player-modal-body');
  const modalClose = container.querySelector('#home-player-modal-close');

  container.querySelectorAll('.player-card').forEach(card => {
    card.onclick = async () => {
      const id = card.getAttribute('data-id');
      const player = await window.LykosDB.getPlayerById(id);
      if (!player) return;

      modalBody.innerHTML = `
        <div style="display: flex; gap: 1.25rem; align-items: start; margin-bottom: 1.25rem;">
          <img src="${player.photo_url}" alt="${player.nickname}" style="width: 110px; height: 110px; border-radius: var(--radius-xs); object-fit: cover; border: 1px solid var(--border-dark);">
          <div>
            <span class="game-badge" style="position: static; margin-bottom: 4px; display: inline-block;">${player.game}</span>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; color: white;">${player.nickname}</h2>
            <div style="font-size: 0.85rem; color: var(--text-muted-light);">${player.name}</div>
            <div style="color: var(--accent-neon); font-size: 0.8rem; font-weight: 700; margin-top: 4px; text-transform: uppercase;">${player.role}</div>
          </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <p style="font-size: 0.88rem; line-height: 1.6; color: white;">${player.bio}</p>
        </div>

        <div style="display: flex; gap: 10px;">
          ${player.social_x ? `<a href="${player.social_x}" target="_blank" class="btn-secondary" style="padding: 5px 12px; font-size: 0.75rem;">X (Twitter)</a>` : ''}
          ${player.social_instagram ? `<a href="${player.social_instagram}" target="_blank" class="btn-secondary" style="padding: 5px 12px; font-size: 0.75rem;">Instagram</a>` : ''}
        </div>
      `;

      modal.style.display = 'flex';
    };
  });

  modalClose.onclick = () => modal.style.display = 'none';
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };

  // Trigger Instagram embed parser if blockquotes are present
  if (container.querySelector('.instagram-media')) {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    } else {
      let script = document.querySelector('script[src*="instagram.com/embed.js"]');
      if (!script) {
        script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.instagram.com/embed.js';
        document.body.appendChild(script);
      }
    }
  }
};
