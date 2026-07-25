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
      : allRoster.filter(p => p.game.toLowerCase() === filter.toLowerCase());

    filtered = [...filtered].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    if (filtered.length === 0) {
      return `<div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted-light);">Nenhum jogador cadastrado nesta modalidade.</div>`;
    }

    return filtered.map(player => `
      <div class="player-card" data-id="${player.id}">
        <div class="player-image-wrap">
          <span class="game-badge">${player.game}</span>
          <img src="${player.photo_url}" alt="${player.nickname}">
        </div>
        <div class="player-info">
          <div class="player-role">${player.role}</div>
          <div class="player-nickname">${player.nickname}</div>
          <div class="player-fullname">${player.name}</div>
          <p class="player-bio">${player.bio || ''}</p>
          <div style="font-size: 0.75rem; color: var(--accent-neon); font-weight: 700; margin-top: 10px;">
            Ver Ficha & Periféricos &rarr;
          </div>
        </div>
      </div>
    `).join('');
  }

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 130px;">
      <div class="container">
        <h1 class="section-heading">Elenco <span>LYKOS</span></h1>
        <p class="section-subtitle">Conheça os pro-players das nossas modalidades competitivas.</p>

        <div style="display: flex; gap: 8px; margin-bottom: 2.25rem; flex-wrap: wrap;" id="modality-tabs-container">
          <button class="btn-primary filter-btn active" data-filter="ALL" style="padding: 6px 18px; border-radius: 4px;">Todos</button>
          ${modalities.map(mod => `
            <button class="btn-secondary filter-btn" data-filter="${mod.name}" style="padding: 6px 18px; border-radius: 4px;">
              ${mod.name}
            </button>
          `).join('')}
        </div>

        <div class="roster-grid" id="roster-container">
          ${renderRosterGrid('ALL')}
        </div>

        <!-- COMISSÃO TÉCNICA & DIRETORIA -->
        <div style="margin-top: 5rem; border-top: 1px solid var(--border-dark); padding-top: 3rem;">
          <h2 class="section-heading" style="font-size: 1.8rem;">Comissão Técnica & <span>Diretoria</span></h2>
          <p class="section-subtitle">A equipe por trás da estratégia, preparação física e liderança da organização.</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
            ${staffMembers && staffMembers.length > 0 ? [...staffMembers].sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)).map(st => `
              <div style="background: var(--bg-dark-card); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); overflow: hidden; display: flex; align-items: center; padding: 1rem; gap: 1rem;">
                <img src="${st.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" alt="${st.name}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-neon);">
                <div>
                  <span class="game-badge" style="position: static; font-size: 0.65rem; padding: 2px 6px;">${st.game || 'Staff'}</span>
                  <div style="font-family: var(--font-heading); font-weight: 700; font-size: 1.1rem; color: white; margin-top: 4px;">${st.nickname ? st.nickname + ' (' + st.name + ')' : st.name}</div>
                  <div style="font-size: 0.8rem; color: var(--accent-neon); font-weight: 700;">${st.role}</div>
                </div>
              </div>
            `).join('') : `
              <div style="color: var(--text-muted-light); font-size: 0.85rem;">Membros da comissão técnica em atualização.</div>
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

          <div style="display: flex; gap: 12px; border-top: 1px solid var(--border-dark); padding-top: 1rem;">
            ${player.social_x ? `<a href="${player.social_x}" target="_blank" class="btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;">Perfil no X</a>` : ''}
            ${player.social_instagram ? `<a href="${player.social_instagram}" target="_blank" class="btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;">Instagram</a>` : ''}
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
