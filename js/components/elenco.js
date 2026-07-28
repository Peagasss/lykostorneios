/* ==========================================================================
   LYKOS E-SPORTS - ELENCO COMPONENT (With Staff & Comissão Técnica Section)
   ========================================================================== */

window.renderElencoPage = async function (container) {
  const [allRoster, modalities, staffMembers] = await Promise.all([
    window.LykosDB.getRoster(),
    window.LykosDB.getModalities(),
    window.LykosDB.getStaff()
  ]);

  function renderRosterGrid(filter) {
    let filtered = filter === 'ALL' 
      ? allRoster 
      : allRoster.filter(p => {
          const gameName = p?.game || 'não especificado';
          return gameName.toLowerCase() === filter.toLowerCase();
        });

    filtered = [...filtered].sort((a, b) => ((a && a.sort_order) || 0) - ((b && b.sort_order) || 0));

    if (filtered.length === 0) {
      return `<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted-light);">Nenhum atleta cadastrado nesta categoria.</div>`;
    }

    return filtered.map(player => `
      <div class="glass-card glass-card-interactive player-card float-effect" data-id="${player.id}" style="border: 1px solid var(--border-dark-strong); padding: 0; overflow: hidden; display: flex; flex-direction: column;">
        <div class="player-image-wrap" style="aspect-ratio: 3 / 4; width: 100%; position: relative; background: radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.25) 0%, rgba(10, 8, 20, 0.95) 75%); overflow: hidden;">
          <span class="game-badge" style="top: 14px; right: 14px; background: rgba(10, 8, 20, 0.85); border: 1px solid var(--border-dark-strong); color: var(--accent-neon); font-family: var(--font-tech); font-size: 0.82rem; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-xs); letter-spacing: 0.08em;">${player.game || 'E-Sports'}</span>
          <img src="${player.photo_url}" alt="${player.nickname}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: var(--transition-smooth); filter: contrast(1.05);">
          
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 100px; background: linear-gradient(to top, rgba(6, 5, 12, 1) 0%, transparent 100%);"></div>
        </div>

        <div class="player-info" style="padding: 1.5rem; background: rgba(14, 11, 26, 0.9); flex: 1; display: flex; flex-direction: column; justify-content: space-between; border-top: 1px solid var(--border-dark);">
          <div>
            <div class="player-role" style="font-family: var(--font-tech); font-size: 0.85rem; font-weight: 700; color: var(--accent-neon); letter-spacing: 0.1em; text-transform: uppercase;">${player.role || 'Player'}</div>
            <div class="player-nickname" style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #ffffff; margin-top: 2px; line-height: 1.1;">${player.nickname}</div>
            <div class="player-fullname" style="font-size: 0.85rem; color: var(--text-muted-light); margin-top: 4px;">${player.name}</div>
            <p class="player-bio" style="font-size: 0.84rem; color: var(--text-muted-light); margin-top: 10px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${player.bio || ''}</p>
          </div>

          <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid var(--border-dark); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: var(--font-tech); font-size: 0.85rem; font-weight: 700; color: var(--accent-neon); letter-spacing: 0.06em;">SPEC & SETUP</span>
            <span class="btn-primary" style="padding: 6px 14px; font-size: 0.75rem; border-radius: var(--radius-xs);">Ficha Técnica &rarr;</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 130px; position: relative; overflow: hidden;">
      <div class="hero-glow-arc-container">
        <div class="hero-glow-arc-bg" style="width: 850px; height: 420px; top: -160px;"></div>
        <div class="hero-glow-arc-line" style="width: 800px; height: 350px; top: -130px;"></div>
      </div>

      <div class="container" style="position: relative; z-index: 2;">
        <div style="text-align: center; max-width: 800px; margin: 0 auto 3rem auto;">
          <div class="section-title-badge" style="margin-bottom: 1rem;">PRO ROSTER & LINEUPS</div>
          <h1 class="section-heading" style="font-size: 3.5rem; font-weight: 800;">ALCATEIA DE <span>ELITE</span></h1>
          <p class="section-subtitle" style="margin: 0 auto; font-size: 1.1rem; color: var(--text-muted-light);">Pro-players de alto rendimento representando a LYKOS nas arenas mundiais.</p>
        </div>

        <!-- CATEGORY MODALITY TABS -->
        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 3rem; flex-wrap: wrap;" id="modality-tabs-container">
          <button class="btn-primary filter-btn active" data-filter="ALL" style="padding: 10px 24px; font-size: 0.85rem; border-radius: var(--radius-xs); box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);">Todos os Atletas</button>
          ${modalities.map(mod => `
            <button class="btn-secondary filter-btn" data-filter="${mod.name}" style="padding: 10px 24px; font-size: 0.85rem; border-radius: var(--radius-xs);">
              ${mod.name}
            </button>
          `).join('')}
        </div>

        <div class="roster-grid" id="roster-container" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem;">
          ${renderRosterGrid('ALL')}
        </div>

        <!-- COMISSÃO TÉCNICA & DIRETORIA -->
        <div style="margin-top: 6rem; border-top: 1px solid var(--border-dark-strong); padding-top: 4rem;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 class="section-heading" style="font-size: 2.2rem;">COMISSÃO TÉCNICA <span>& DIREÇÃO</span></h2>
            <p class="section-subtitle" style="margin: 0 auto; max-width: 650px;">A liderança estratégica e suporte de alta performance nos bastidores.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.75rem;">
            ${staffMembers && staffMembers.length > 0 ? [...staffMembers].sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)).map(st => `
              <div class="glass-card glass-card-interactive staff-card" data-id="${st.id}" style="padding: 1.25rem; display: flex; align-items: center; gap: 1.25rem; border: 1px solid var(--border-dark-strong); cursor: pointer;">
                <img src="${st.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" alt="${st.name}" style="width: 88px; height: 110px; border-radius: var(--radius-xs); object-fit: cover; object-position: top center; border: 2px solid var(--accent-neon); box-shadow: 0 0 15px rgba(168, 85, 247, 0.4); flex-shrink: 0;">
                <div>
                  <span class="game-badge" style="position: static; font-size: 0.68rem; padding: 2px 8px; font-family: var(--font-tech);">${st.game || 'Staff'}</span>
                  <div style="font-family: var(--font-heading); font-weight: 800; font-size: 1.15rem; color: #ffffff; margin-top: 4px; line-height: 1.2;">${st.nickname ? st.nickname + ' (' + st.name + ')' : st.name}</div>
                  <div style="font-family: var(--font-tech); font-size: 0.85rem; color: var(--accent-neon); font-weight: 700; letter-spacing: 0.06em; margin-top: 2px;">${st.role}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted-light); margin-top: 4px;">Ver Perfil &rarr;</div>
                </div>
              </div>
            `).join('') : `
              <div style="color: var(--text-muted-light); font-size: 0.85rem; text-align: center; grid-column: 1/-1;">Membros da comissão técnica em atualização.</div>
            `}
          </div>
        </div>

      </div>
    </section>

    <!-- PLAYER POP-UP MODAL -->
    <div id="player-modal" class="modal-backdrop" style="display: none;">
      <div class="modal-content" style="max-width: 620px;">
        <button class="modal-close" id="player-modal-close">&times;</button>
        <div id="player-modal-body"></div>
      </div>
    </div>
  `;

  const filterBtns = container.querySelectorAll('.filter-btn');
  const rosterContainer = container.querySelector('#roster-container');

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary', 'active');

      const filter = btn.getAttribute('data-filter');
      rosterContainer.innerHTML = renderRosterGrid(filter);
      setupPlayerModalEvents();
    };
  });

  const modal = container.querySelector('#player-modal');
  const modalBody = container.querySelector('#player-modal-body');
  const modalClose = container.querySelector('#player-modal-close');

  function setupPlayerModalEvents() {
    container.querySelectorAll('.player-card').forEach(card => {
      card.onclick = async () => {
        const id = card.getAttribute('data-id');
        const player = await window.LykosDB.getPlayerById(id);
        if (!player) return;

        modalBody.innerHTML = `
          <div style="display: flex; gap: 1.5rem; align-items: start; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <img src="${player.photo_url}" alt="${player.nickname}" style="width: 130px; height: 130px; border-radius: var(--radius-xs); object-fit: cover; border: 1px solid var(--border-dark);">
            <div style="flex: 1;">
              <span class="game-badge" style="position: static; margin-bottom: 6px; display: inline-block;">${player.game}</span>
              <h2 style="font-family: var(--font-heading); font-size: 2rem; color: var(--text-light); line-height: 1.1;">${player.nickname}</h2>
              <div style="font-size: 0.9rem; color: var(--text-muted-light); margin-bottom: 4px;">${player.name}</div>
              <div style="color: var(--accent-neon); font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">${player.role}</div>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.85rem; color: var(--text-muted-light); text-transform: uppercase; margin-bottom: 6px;">Biografia</h4>
            <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-light);">${player.bio || 'Sem biografia disponível.'}</p>
          </div>

          <div style="background: var(--bg-dark-base); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1.25rem; margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.85rem; color: var(--accent-neon); text-transform: uppercase; margin-bottom: 12px;">Setup & Periféricos Oficiais</h4>
            <div class="peripheral-spec-grid">
              <div class="spec-chip"><span class="spec-chip-label">Mouse</span><span class="spec-chip-val">${player.mouse || 'Não informado'}</span></div>
              <div class="spec-chip"><span class="spec-chip-label">Teclado</span><span class="spec-chip-val">${player.keyboard || 'Não informado'}</span></div>
              <div class="spec-chip"><span class="spec-chip-label">Headset</span><span class="spec-chip-val">${player.headset || 'Não informado'}</span></div>
              <div class="spec-chip"><span class="spec-chip-label">Microfone</span><span class="spec-chip-val">${player.microphone || 'Não informado'}</span></div>
              <div class="spec-chip"><span class="spec-chip-label">Mousepad</span><span class="spec-chip-val">${player.mousepad || 'Não informado'}</span></div>
              <div class="spec-chip"><span class="spec-chip-label">Monitor</span><span class="spec-chip-val">${player.monitor || 'Não informado'}</span></div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; border-top: 1px solid var(--border-dark); padding-top: 1rem; flex-wrap: wrap;">
            ${player.social_x ? `<a href="${player.social_x}" target="_blank" class="btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;">Perfil no X</a>` : ''}
            ${player.social_instagram ? `<a href="${player.social_instagram}" target="_blank" class="btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;">Instagram</a>` : ''}
            ${player.social_youtube ? `<a href="${player.social_youtube}" target="_blank" class="btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;">Canal YouTube</a>` : ''}
            ${player.social_twitch ? `<a href="${player.social_twitch}" target="_blank" class="btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;">TwitchTV</a>` : ''}
          </div>
        `;

        modal.style.display = 'flex';
      };
    });

    container.querySelectorAll('.staff-card').forEach(card => {
      card.onclick = async () => {
        const id = card.getAttribute('data-id');
        const st = staffMembers.find(s => String(s.id) === String(id));
        if (!st) return;

        modalBody.innerHTML = `
          <div style="display: flex; gap: 1.5rem; align-items: start; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <img src="${st.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" alt="${st.name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-neon);">
            <div style="flex: 1;">
              <span class="game-badge" style="position: static; margin-bottom: 6px; display: inline-block;">${st.game || 'Comissão Técnica'}</span>
              <h2 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--text-light); line-height: 1.1;">${st.nickname ? st.nickname + ' (' + st.name + ')' : st.name}</h2>
              <div style="color: var(--accent-neon); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-top: 4px;">${st.role}</div>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.85rem; color: var(--text-muted-light); text-transform: uppercase; margin-bottom: 6px;">Biografia & Liderança</h4>
            <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-light);">${st.bio || 'Membro oficial da comissão técnica da LYKOS.'}</p>
          </div>

          <div style="display: flex; gap: 12px; border-top: 1px solid var(--border-dark); padding-top: 1rem;">
            ${st.social_x ? `<a href="${st.social_x}" target="_blank" class="btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;">Perfil no X</a>` : ''}
            ${st.social_instagram ? `<a href="${st.social_instagram}" target="_blank" class="btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;">Instagram</a>` : ''}
          </div>
        `;

        modal.style.display = 'flex';
      };
    });
  }

  modalClose.onclick = () => modal.style.display = 'none';
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };

  setupPlayerModalEvents();
};
