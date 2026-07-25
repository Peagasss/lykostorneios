window.renderGaleriaPage = async function (container) {
  const [galleryItems, socialFeeds] = await Promise.all([
    window.LykosDB.getGallery(),
    window.LykosDB.getSocialFeeds()
  ]);

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 130px; position: relative; overflow: hidden;">
      <div class="hero-glow-arc-container">
        <div class="hero-glow-arc-bg" style="width: 800px; height: 380px; top: -140px;"></div>
      </div>

      <div class="container" style="position: relative; z-index: 2;">
        <div style="text-align: center; max-width: 800px; margin: 0 auto 3rem auto;">
          <div class="section-title-badge" style="margin-bottom: 1rem;">HUB OFICIAL DE NOTÍCIAS & MÍDIAS</div>
          <h1 class="section-heading" style="font-size: 3.2rem;">PORTAL <span>LYKOS NEWS</span></h1>
          <p class="section-subtitle" style="margin: 0 auto; color: var(--text-muted-light);">
            Fique por dentro das últimas notícias da organização, bastidores exclusivos e publicações oficiais.
          </p>
        </div>

        <!-- NOTÍCIAS & FOTOS / MÍDIAS -->
        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px;">
          📰 Notícias & Registros de Mídia
        </h2>

        <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.75rem; margin-bottom: 4rem;">
          ${galleryItems && galleryItems.length > 0 ? galleryItems.map(item => `
            <div class="glass-card glass-card-interactive news-card" data-id="${item.id}" style="border: 1px solid var(--border-dark-strong); display: flex; flex-direction: column; overflow: hidden; cursor: pointer;">
              <div style="height: 200px; overflow: hidden; position: relative;">
                <span class="game-badge" style="top: 12px; left: 12px; font-family: var(--font-tech);">${item.category || 'Notícia'}</span>
                <img src="${item.image_url}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; transition: var(--transition-smooth);">
              </div>
              <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 8px;">${item.title}</h3>
                  <p style="font-size: 0.85rem; color: var(--text-muted-light); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                    ${item.description || 'Sem texto adicional cadastrado.'}
                  </p>
                </div>
                <div style="margin-top: 1.25rem; font-size: 0.78rem; color: var(--accent-neon); font-weight: 700; text-transform: uppercase;">
                  Ler Notícia Completa &rarr;
                </div>
              </div>
            </div>
          `).join('') : `
            <div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-muted-light);">Nenhuma notícia cadastrada no momento.</div>
          `}
        </div>

        <!-- REDES SOCIAIS & EMBEDS -->
        ${socialFeeds && socialFeeds.length > 0 ? `
          <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px;">
            🔥 Feed & Posts Oficiais das Redes Sociais
          </h2>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.75rem;">
            ${socialFeeds.map(feed => `
              <div class="glass-card" style="padding: 1.5rem; border: 1px solid var(--border-dark-strong);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <span class="social-platform-badge" style="font-family: var(--font-tech); font-size: 0.78rem; font-weight: 700; color: var(--accent-neon); background: rgba(168,85,247,0.15); padding: 4px 12px; border-radius: var(--radius-xs); border: 1px solid var(--border-dark-strong);">
                    ${feed.platform}
                  </span>
                  ${feed.post_url ? `<a href="${feed.post_url}" target="_blank" style="font-size: 0.78rem; color: var(--accent-neon); font-weight: 700;">Ver no ${feed.platform} &rarr;</a>` : ''}
                </div>
                <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: white; margin-bottom: 1rem;">${feed.title}</h4>
                <div style="border-radius: var(--radius-xs); overflow: hidden; background: #000;">
                  ${feed.embed_url ? `<iframe src="${feed.embed_url}" width="100%" height="380" frameborder="0" scrolling="no" allowtransparency="true" style="border: none;"></iframe>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

      </div>
    </section>

    <!-- NEWS MODAL READER -->
    <div id="news-reader-modal" class="modal-backdrop" style="display: none;">
      <div class="modal-content glass-card" style="max-width: 750px; padding: 2.5rem; border: 1px solid var(--border-dark-strong);">
        <button class="modal-close" id="news-modal-close" style="top: 20px; right: 20px;">&times;</button>
        <div id="news-modal-body"></div>
      </div>
    </div>
  `;

  const newsModal = container.querySelector('#news-reader-modal');
  const newsModalBody = container.querySelector('#news-modal-body');
  const newsModalClose = container.querySelector('#news-modal-close');

  container.querySelectorAll('.news-card').forEach(card => {
    card.onclick = () => {
      const id = card.getAttribute('data-id');
      const item = galleryItems.find(g => String(g.id) === String(id));
      if (!item) return;

      newsModalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <span class="game-badge" style="position: static; font-family: var(--font-tech); display: inline-block; margin-bottom: 10px;">${item.category || 'Notícia'}</span>
          <h2 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: #ffffff; line-height: 1.2; margin-bottom: 10px;">${item.title}</h2>
          <div style="font-size: 0.8rem; color: var(--accent-neon); font-weight: 700;">PUBLICAÇÃO OFICIAL LYKOS</div>
        </div>

        <img src="${item.image_url}" alt="${item.title}" style="width: 100%; max-height: 380px; object-fit: cover; border-radius: var(--radius-xs); margin-bottom: 1.75rem; border: 1px solid var(--border-dark-strong);">

        <div style="font-size: 0.98rem; line-height: 1.8; color: var(--text-light); white-space: pre-line;">
          ${item.description || 'Sem descrição adicional para esta notícia.'}
        </div>
      `;

      newsModal.style.display = 'flex';
    };
  });

  if (newsModalClose) {
    newsModalClose.onclick = () => newsModal.style.display = 'none';
  }
  if (newsModal) {
    newsModal.onclick = (e) => {
      if (e.target === newsModal) newsModal.style.display = 'none';
    };
  }
};
