/* ==========================================================================
   LYKOS E-SPORTS - GALERIA COMPONENT (Serious Minimalist Design)
   ========================================================================== */

window.renderGaleriaPage = async function (container) {
  const galleryItems = await window.LykosDB.getGallery();

  function renderGalleryGrid(categoryFilter) {
    const filtered = categoryFilter === 'ALL'
      ? galleryItems
      : galleryItems.filter(item => item.category === categoryFilter);

    if (filtered.length === 0) {
      return `<div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted-light);">Nenhuma imagem cadastrada nesta categoria.</div>`;
    }

    return filtered.map(item => `
      <div class="gallery-card" data-id="${item.id}">
        <img src="${item.image_url}" alt="${item.title}">
        <div class="gallery-overlay">
          <span class="gallery-tag">${item.category}</span>
          <h3 class="gallery-title">${item.title}</h3>
        </div>
      </div>
    `).join('');
  }

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 130px;">
      <div class="container">
        <h1 class="section-heading">Galeria de <span>Fotos</span></h1>
        <p class="section-subtitle">Reviva os bastidores, palcos de campeonatos e a energia contagiante da alcateia LYKOS.</p>

        <div style="display: flex; gap: 8px; margin-bottom: 2.25rem; flex-wrap: wrap;">
          <button class="btn-primary cat-btn active" data-cat="ALL" style="padding: 6px 18px; border-radius: 4px;">Todas</button>
          <button class="btn-secondary cat-btn" data-cat="Campeonatos" style="padding: 6px 18px; border-radius: 4px;">Campeonatos</button>
          <button class="btn-secondary cat-btn" data-cat="Bastidores" style="padding: 6px 18px; border-radius: 4px;">Bastidores</button>
          <button class="btn-secondary cat-btn" data-cat="Eventos" style="padding: 6px 18px; border-radius: 4px;">Eventos</button>
        </div>

        <div class="gallery-grid" id="gallery-grid-container">
          ${renderGalleryGrid('ALL')}
        </div>
      </div>
    </section>

    <div id="lightbox-modal" class="modal-backdrop" style="display: none;">
      <div class="modal-content" style="max-width: 680px;">
        <button class="modal-close" id="lightbox-close">&times;</button>
        <div class="lightbox-body" id="lightbox-content" style="text-align: center;">
        </div>
      </div>
    </div>
  `;

  const catBtns = container.querySelectorAll('.cat-btn');
  const gridContainer = container.querySelector('#gallery-grid-container');

  catBtns.forEach(btn => {
    btn.onclick = () => {
      catBtns.forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary', 'active');

      const category = btn.getAttribute('data-cat');
      gridContainer.innerHTML = renderGalleryGrid(category);
      setupLightboxEvents();
    };
  });

  const modal = container.querySelector('#lightbox-modal');
  const modalContent = container.querySelector('#lightbox-content');
  const modalClose = container.querySelector('#lightbox-close');

  function setupLightboxEvents() {
    container.querySelectorAll('.gallery-card').forEach(card => {
      card.onclick = () => {
        const id = card.getAttribute('data-id');
        const item = galleryItems.find(g => g.id === id);
        if (!item) return;

        modalContent.innerHTML = `
          <img src="${item.image_url}" alt="${item.title}" style="max-width: 100%; max-height: 55vh; border-radius: var(--radius-xs); margin-bottom: 1rem; border: 1px solid var(--border-dark);">
          <span class="gallery-tag" style="margin: 0 auto 8px;">${item.category}</span>
          <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: white; margin-bottom: 8px;">${item.title}</h3>
          <p style="color: var(--text-muted-light); font-size: 0.9rem; line-height: 1.6;">${item.description || 'Fotografia oficial da LYKOS E-Sports.'}</p>
        `;
        modal.style.display = 'flex';
      };
    });
  }

  modalClose.onclick = () => modal.style.display = 'none';
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
  };

  setupLightboxEvents();
};
