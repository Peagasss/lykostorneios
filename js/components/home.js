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

  const nextMatch = matches.find(m => m.status === 'UPCOMING') || matches[0];
  const rosterTeaser = roster.slice(0, 4);
  const galleryTeaser = gallery.slice(0, 3);

  const teamLogoSrc = settings.logo_url || 'assets/logo.png';
  const teamLogoHtml = `<img src="${teamLogoSrc}" alt="${settings.team_name}" class="team-logo-img" onerror="this.src='assets/logo.png'">`;

  container.innerHTML = `
    <!-- HERO SECTION -->
    <section class="hero-section" style="background-image: url('${settings.hero_image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80'}');">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <h1 class="hero-title">${settings.hero_title}</h1>
        <p class="hero-subtitle">${settings.hero_subtitle}</p>
        <div class="hero-actions">
          <a href="#/partidas" class="btn-primary">Calendário de Partidas</a>
          <a href="#/elenco" class="btn-secondary">Conheça o Elenco</a>
        </div>
      </div>
    </section>

    <!-- SECTION 1: PRÓXIMO CONFRONTO -->
    <section class="section-dark-1">
      <div class="container">
        <h2 class="section-heading">Próximo <span>Confronto</span></h2>
        <p class="section-subtitle">Acompanhe datas, horários e placares das nossas modalidades.</p>

        ${nextMatch ? `
          <div class="match-summary-card" style="position: relative; padding-top: 2.75rem;">
            <span class="match-game-label" style="position: absolute; top: 1.25rem; left: 1.5rem; font-family: var(--font-heading); font-size: 0.78rem; font-weight: 700; color: var(--accent-neon); text-transform: uppercase; letter-spacing: 0.08em;">${nextMatch.game}</span>

            <div class="team-box">
              ${teamLogoHtml}
              <div>
                <div class="team-name">${settings.team_name}</div>
              </div>
            </div>

            <div class="match-vs-center">
              ${nextMatch.status === 'LIVE' ? `<span class="match-status-pill status-live" style="margin-bottom: 8px;">🔴 AO VIVO</span>` : ''}
              <div class="match-score-badge">VS.</div>
            </div>

            <div class="team-box away">
              <img src="${nextMatch.opponent_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}" alt="${nextMatch.opponent_name}" class="team-logo-img">
              <div>
                <div class="team-name">${nextMatch.opponent_name}</div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </section>

    <!-- SECTION 2: REDES SOCIAIS -->
    <section class="section-light-1">
      <div class="container">
        <h2 class="section-heading section-heading-dark">Redes <span>Sociais</span></h2>
        <p class="section-subtitle section-subtitle-dark">Atualizações em tempo real enviadas pela nossa equipe.</p>

        <div class="social-feed-grid">
          ${socialFeeds.map(feed => {
            const isEmbedHtml = feed.embed_url && (feed.embed_url.trim().startsWith('<') || feed.embed_url.includes('<blockquote') || feed.embed_url.includes('<iframe'));
            return `
              <div class="social-card">
                <div class="social-card-header">
                  <span class="social-platform-badge platform-${feed.platform}">
                    ${feed.platform.toUpperCase()}
                  </span>
                  ${feed.post_url ? `<a href="${feed.post_url}" target="_blank" style="font-size: 0.75rem; color: var(--accent-neon); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">Ver Post Original &nearr;</a>` : ''}
                </div>
                <h4 style="font-size: 0.95rem; font-family: var(--font-heading); margin-bottom: 0.85rem; color: var(--text-light);">${feed.title}</h4>
                <div class="social-embed-preview">
                  ${isEmbedHtml ? feed.embed_url : `
                    <div style="text-align: center; padding: 1rem; width: 100%;">
                      <p style="font-size: 0.8rem; margin-bottom: 8px; color: var(--text-muted-light);">[Publicação oficial - ${feed.platform.toUpperCase()}]</p>
                      <a href="${feed.embed_url || feed.post_url || '#'}" target="_blank" class="btn-primary" style="padding: 8px 16px; font-size: 0.8rem;">
                        Acessar Publicação &nearr;
                      </a>
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 3: ELENCO SPOTLIGHT -->
    <section class="section-dark-2">
      <div class="container">
        <h2 class="section-heading">Elenco de <span>Elite</span></h2>
        <p class="section-subtitle">Pro-players de destaque vestindo o manto da LYKOS.</p>

        <div class="roster-grid">
          ${rosterTeaser.map(player => `
            <div class="player-card" data-id="${player.id}">
              <div class="player-image-wrap">
                <span class="game-badge">${player.game}</span>
                <img src="${player.photo_url}" alt="${player.nickname}">
              </div>
              <div class="player-info">
                <div class="player-role">${player.role}</div>
                <div class="player-nickname">${player.nickname}</div>
                <div class="player-fullname">${player.name}</div>
                <p class="player-bio">${player.bio}</p>
                <div style="font-size: 0.75rem; color: var(--accent-neon); font-weight: 700; margin-top: 8px;">Ver Perfil &rarr;</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 3rem;">
          <a href="#/elenco" class="btn-primary">Ver Elenco Completo &rarr;</a>
        </div>
      </div>
    </section>

    <!-- SECTION 4: GALERIA -->
    <section class="section-light-2">
      <div class="container">
        <h2 class="section-heading section-heading-dark">Galeria de <span>Destaques</span></h2>
        <p class="section-subtitle section-subtitle-dark">Troféus e bastidores dos campeonatos mais importantes.</p>

        <div class="gallery-grid">
          ${galleryTeaser.map(item => `
            <div class="gallery-card" onclick="window.location.hash='#/galeria'">
              <img src="${item.image_url}" alt="${item.title}">
              <div class="gallery-overlay">
                <span class="gallery-tag">${item.category}</span>
                <h3 class="gallery-title">${item.title}</h3>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center; margin-top: 3rem;">
          <a href="#/galeria" class="btn-light-outline">Explorar Galeria Completa &rarr;</a>
        </div>
      </div>
    </section>

    <!-- PLAYER POP-UP MODAL FOR HOME -->
    <div id="home-player-modal" class="modal-backdrop" style="display: none;">
      <div class="modal-content" style="max-width: 600px;">
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
