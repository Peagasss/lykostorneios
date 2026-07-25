/* ==========================================================================
   LYKOS E-SPORTS - VERTICAL ADMIN DASHBOARD
   All Tab Event Handlers (Elenco, Modalidades, Conquistas, Galeria, Redes, etc.)
   ========================================================================== */

window.renderAdminPage = async function (container) {
  let currentUser = window.LykosAuth.getCurrentUser();
  let activeTab = 'partidas';
  let pendingDeleteAction = null;

  if (!currentUser) {
    container.innerHTML = `
      <section class="admin-container">
        <div class="container" style="max-width: 440px;">
          <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark-strong); border-radius: var(--radius-sm); padding: 2.25rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
              <div class="brand-logo" style="justify-content: center; font-size: 2rem; margin-bottom: 8px;">
                LYK<span class="logo-accent">OS</span>
              </div>
              <h2 style="font-size: 1.35rem;">Painel de Gestão</h2>
              <p style="font-size: 0.8rem; color: var(--text-muted-light); margin-top: 4px;">Área restrita a membros autorizados.</p>
            </div>

            <form id="auth-form">
              <div class="form-group">
                <label class="form-label">E-mail</label>
                <input type="email" id="auth-email" class="form-input" placeholder="seu-email@lykos-esports.com" required>
              </div>

              <div class="form-group">
                <label class="form-label">Senha</label>
                <input type="password" id="auth-password" class="form-input" placeholder="••••••••••••••••" required>
              </div>

              <button type="submit" class="btn-primary" style="width: 100%;">Acessar Painel &rarr;</button>
              <div id="auth-error" style="color: #ff4d4d; font-size: 0.8rem; margin-top: 1rem; text-align: center; display: none;"></div>
            </form>
          </div>
        </div>
      </section>
    `;

    const authForm = container.querySelector('#auth-form');
    const authError = container.querySelector('#auth-error');
    const submitBtn = authForm.querySelector('button[type="submit"]');

    authForm.onsubmit = async (e) => {
      e.preventDefault();
      authError.style.display = 'none';
      const email = container.querySelector('#auth-email').value;
      const password = container.querySelector('#auth-password').value;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Autenticando...';
      }

      try {
        await window.LykosAuth.login(email, password);
        window.renderAdminPage(container);
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Acessar Painel →';
        }
        authError.style.display = 'block';
        authError.innerText = err.message || 'Erro de autenticação.';
      }
    };

    return;
  }

  function generateStrongPassword(length = 16) {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = upper + lower + numbers + symbols;

    let pass = '';
    pass += upper.charAt(Math.floor(Math.random() * upper.length));
    pass += lower.charAt(Math.floor(Math.random() * lower.length));
    pass += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pass += symbols.charAt(Math.floor(Math.random() * symbols.length));

    for (let i = 4; i < length; i++) {
      pass += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    return pass.split('').sort(() => 0.5 - Math.random()).join('');
  }

  function hasPermission(tabName) {
    if (!currentUser) return false;
    if (currentUser.is_master || (currentUser.permissions && currentUser.permissions.includes('all'))) return true;
    if (Array.isArray(currentUser.permissions)) {
      return currentUser.permissions.includes(tabName);
    }
    return false;
  }

  async function renderDashboard() {
    const [
      settings, modalities, matches, roster, staffMembers,
      gallery, trophies, recentTournaments, communityTournaments,
      aboutSettings, socialFeeds, users, loginLogs
    ] = await Promise.all([
      window.LykosDB.getSettings(),
      window.LykosDB.getModalities(),
      window.LykosDB.getMatches(),
      window.LykosDB.getRoster(),
      window.LykosDB.getStaff(),
      window.LykosDB.getGallery(),
      window.LykosDB.getTrophies(),
      window.LykosDB.getRecentTournaments(),
      window.LykosDB.getCommunityTournaments(),
      window.LykosDB.getAboutSettings(),
      window.LykosDB.getSocialFeeds(),
      window.LykosDB.getUsers(),
      window.LykosDB.getLoginLogs()
    ]);

    // Ensure activeTab is permitted for currentUser
    if (!hasPermission(activeTab)) {
      const allowedTabs = ['partidas', 'torneios', 'elenco', 'staff', 'modalidades', 'trophies', 'about', 'galeria', 'social', 'branding', 'roles'].filter(t => hasPermission(t));
      if (allowedTabs.length > 0) activeTab = allowedTabs[0];
    }

    container.innerHTML = `
      <section class="admin-container">
        <div class="container">
          
          <div class="admin-header">
            <div>
              <h1 style="font-size: 1.8rem;">Painel de Gestão <span>LYKOS</span></h1>
              <p style="color: var(--text-muted-light); font-size: 0.85rem;">Área administrativa oficial de e-sports.</p>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="text-align: right;">
                <div style="font-weight: 700; font-size: 0.85rem; color: white;">${currentUser.fullName || currentUser.email}</div>
                <span style="background: rgba(157,80,255,0.15); border: 1px solid var(--border-dark-strong); color: var(--accent-neon); font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
                  PERMISSÃO: ${currentUser.is_master ? 'ADMIN MASTER (NÍVEL MAIS ALTO)' : 'PERSONALIZADA'}
                </span>
              </div>
              <button id="admin-logout-btn" class="btn-secondary" style="padding: 6px 14px; font-size: 0.78rem;">Sair</button>
            </div>
          </div>

          <div class="admin-layout-grid">
            
            <div class="admin-sidebar-nav">
              ${hasPermission('partidas') ? `<button class="admin-nav-item ${activeTab === 'partidas' ? 'active' : ''}" data-tab="partidas">Partidas & Súmulas</button>` : ''}
              ${hasPermission('torneios') ? `<button class="admin-nav-item ${activeTab === 'torneios' ? 'active' : ''}" data-tab="torneios">Torneios (Divulgação)</button>` : ''}
              ${hasPermission('elenco') ? `<button class="admin-nav-item ${activeTab === 'elenco' ? 'active' : ''}" data-tab="elenco">Elenco Pro-Players</button>` : ''}
              ${hasPermission('staff') ? `<button class="admin-nav-item ${activeTab === 'staff' ? 'active' : ''}" data-tab="staff">Comissão Técnica & Staff</button>` : ''}
              ${hasPermission('modalidades') ? `<button class="admin-nav-item ${activeTab === 'modalidades' ? 'active' : ''}" data-tab="modalidades">Modalidades (Games)</button>` : ''}
              ${hasPermission('trophies') ? `<button class="admin-nav-item ${activeTab === 'trophies' ? 'active' : ''}" data-tab="trophies">Conquistas & Troféus</button>` : ''}
              ${hasPermission('about') ? `<button class="admin-nav-item ${activeTab === 'about' ? 'active' : ''}" data-tab="about">Página Sobre</button>` : ''}
              ${hasPermission('galeria') ? `<button class="admin-nav-item ${activeTab === 'galeria' ? 'active' : ''}" data-tab="galeria">Galeria de Fotos</button>` : ''}
              ${hasPermission('social') ? `<button class="admin-nav-item ${activeTab === 'social' ? 'active' : ''}" data-tab="social">Redes Sociais & Feeds</button>` : ''}
              ${hasPermission('branding') ? `<button class="admin-nav-item ${activeTab === 'branding' ? 'active' : ''}" data-tab="branding">Logo & Marca</button>` : ''}
              ${hasPermission('roles') ? `<button class="admin-nav-item ${activeTab === 'roles' ? 'active' : ''}" data-tab="roles">Usuários & Permissões</button>` : ''}
            </div>

            <div id="admin-tab-content">
              ${renderTabBody(activeTab, { matches, roster, staffMembers, modalities, trophies, recentTournaments, communityTournaments, aboutSettings, gallery, socialFeeds, settings, users, loginLogs })}
            </div>

          </div>

        </div>
      </section>

      <!-- UNIVERSAL EDIT POP-UP MODAL -->
      <div id="admin-universal-modal" class="modal-backdrop" style="display: none;">
        <div class="modal-content" style="max-width: 760px;">
          <button class="modal-close" id="universal-modal-close">&times;</button>
          <h3 id="universal-modal-title" style="margin-bottom: 1.25rem; font-size: 1.3rem;">Editar Item</h3>
          <div id="universal-modal-body"></div>
        </div>
      </div>

      <!-- CONFIRM DELETION POP-UP MODAL -->
      <div id="admin-confirm-delete-modal" class="modal-backdrop" style="display: none;">
        <div class="modal-content" style="max-width: 440px; text-align: center;">
          <h3 style="font-size: 1.35rem; color: #ff4d4d; margin-bottom: 0.75rem;">Confirmar Exclusão</h3>
          <p id="confirm-delete-text" style="color: var(--text-muted-light); font-size: 0.9rem; margin-bottom: 1.75rem; line-height: 1.5;"></p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button id="confirm-delete-btn" class="btn-danger" style="padding: 10px 20px;">Confirmar Exclusão</button>
            <button id="cancel-delete-btn" class="btn-secondary" style="padding: 10px 20px;">Cancelar</button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#admin-logout-btn').onclick = () => {
      window.LykosAuth.logout();
      window.renderAdminPage(container);
    };

    container.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.onclick = () => {
        activeTab = btn.getAttribute('data-tab');
        renderDashboard();
      };
    });

    setupDeleteModalEvents();
    attachTabFormHandlers({ matches, roster, staffMembers, modalities, trophies, recentTournaments, communityTournaments, aboutSettings, gallery, socialFeeds, settings, users });
  }

  function promptDeletion(itemTitle, deleteCallback) {
    const modal = container.querySelector('#admin-confirm-delete-modal');
    const textEl = container.querySelector('#confirm-delete-text');
    const confirmBtn = container.querySelector('#confirm-delete-btn');
    const cancelBtn = container.querySelector('#cancel-delete-btn');

    textEl.innerText = `Tem certeza de que deseja excluir "${itemTitle}"? Esta ação não pode ser desfeita.`;
    modal.style.display = 'flex';

    pendingDeleteAction = deleteCallback;

    confirmBtn.onclick = async () => {
      if (pendingDeleteAction) {
        await pendingDeleteAction();
        pendingDeleteAction = null;
      }
      modal.style.display = 'none';
    };

    cancelBtn.onclick = () => {
      pendingDeleteAction = null;
      modal.style.display = 'none';
    };
  }

  function setupDeleteModalEvents() {
    const modal = container.querySelector('#admin-confirm-delete-modal');
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  }

  function openUniversalModal(title, formHtml, submitCallback) {
    const modal = container.querySelector('#admin-universal-modal');
    const titleEl = container.querySelector('#universal-modal-title');
    const bodyEl = container.querySelector('#universal-modal-body');
    const closeBtn = container.querySelector('#universal-modal-close');

    titleEl.innerText = title;
    bodyEl.innerHTML = formHtml;
    modal.style.display = 'flex';

    closeBtn.onclick = () => modal.style.display = 'none';
    const cancelBtn = bodyEl.querySelector('.cancel-pop-btn');
    if (cancelBtn) cancelBtn.onclick = () => modal.style.display = 'none';

    const form = bodyEl.querySelector('form');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        await submitCallback(form);
        modal.style.display = 'none';
        renderDashboard();
      };
    }
  }

  function renderTabBody(tab, data) {
    if (tab === 'partidas') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Cadastrar Nova Partida</h3>
          <form id="form-match">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem;">
              <div class="form-group">
                <label class="form-label">Modalidade / Game</label>
                <select id="match-game" class="form-select" required>
                  ${data.modalities.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Nome do Adversário</label>
                <input type="text" id="match-opponent" class="form-input" placeholder="Ex: Sentinels" required>
              </div>

              <div class="form-group">
                <label class="form-label">Logo do Adversário (Upload PC)</label>
                <input type="file" id="match-opponent-file" class="form-input" accept="image/*">
                <span class="upload-hint">Tamanho recomendado: 300x300px (Quadrado 1:1, PNG Transparente)</span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1.25rem;">
              <div class="form-group">
                <label class="form-label">Campeonato / Torneio</label>
                <input type="text" id="match-tournament" class="form-input" placeholder="Ex: VCT Americas Stage 2" required>
              </div>

              <div class="form-group">
                <label class="form-label">Formato</label>
                <input type="text" id="match-format" class="form-input" placeholder="Ex: MD3" value="MD3">
              </div>

              <div class="form-group">
                <label class="form-label">Data e Hora</label>
                <input type="datetime-local" id="match-date" class="form-input" required>
              </div>

              <div class="form-group">
                <label class="form-label">Status da Partida</label>
                <select id="match-status" class="form-select">
                  <option value="UPCOMING">UPCOMING (Próxima)</option>
                  <option value="LIVE">LIVE (Ao Vivo)</option>
                  <option value="FINISHED">FINISHED (Encerrada)</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn-primary">Salvar Partida &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Partidas Registradas</h3>
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          ${data.matches.map(m => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="game-badge" style="position: static; margin-right: 8px;">${m.game}</span>
                <span class="match-status-pill status-${(m.status || 'upcoming').toLowerCase()}">${m.status || 'UPCOMING'}</span>
                <strong style="margin-left: 8px;">${data.settings.team_name} vs ${m.opponent_name}</strong> (${m.tournament_name})
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn-edit pop-edit-match-btn" data-id="${m.id}">Editar</button>
                <button class="btn-danger delete-match-btn" data-id="${m.id}" data-title="${data.settings.team_name} vs ${m.opponent_name}">Excluir</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'sumula') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Súmula de Partidas (Kills, Deaths, Assists, FK & FD)</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted-light); margin-bottom: 1.5rem;">Gerencie em pop-up a performance completa de todos os jogadores (Time da casa e Adversários) por confronto.</p>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${data.matches.map(m => `
              <div style="background: var(--bg-dark-card); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span class="game-badge" style="position: static; margin-right: 8px;">${m.game}</span>
                  <strong style="font-size: 1rem; color: white;">${data.settings.team_name} vs ${m.opponent_name}</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted-light); margin-top: 4px;">
                    ${m.tournament_name} • ${m.player_kdas ? m.player_kdas.length : 0} Jogadores na Súmula
                  </div>
                </div>
                <button class="btn-edit pop-edit-sumula-btn" data-id="${m.id}">Editar Súmula no Pop-up</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (tab === 'tournaments' || tab === 'torneios') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Cadastrar Novo Torneio de Divulgação (Comunidade / Parceiros)</h3>
          <form id="form-community-tournament">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem;">
              <div class="form-group"><label class="form-label">Título do Torneio</label><input type="text" id="comm-tourn-title" class="form-input" placeholder="Ex: Copa Comunidade LYKOS #1" required></div>
              <div class="form-group">
                <label class="form-label">Modalidade</label>
                <select id="comm-tourn-game" class="form-select">
                  ${data.modalities.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group"><label class="form-label">Premiação Total</label><input type="text" id="comm-tourn-prize" class="form-input" placeholder="Ex: R$ 5.000 + Troféu" required></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
              <div class="form-group"><label class="form-label">URL de Inscrição / Formulário</label><input type="url" id="comm-tourn-url" class="form-input" placeholder="https://battlefy.com/..."></div>
              <div class="form-group">
                <label class="form-label">Status do Torneio</label>
                <select id="comm-tourn-status" class="form-select">
                  <option value="Inscrições Abertas">Inscrições Abertas</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Encerrado">Encerrado</option>
                </select>
              </div>
            </div>

            <div class="form-group"><label class="form-label">Descrição / Regras</label><textarea id="comm-tourn-desc" class="form-textarea" rows="3" placeholder="Insira o resumo do regulamento e formato do torneio."></textarea></div>
            <div class="form-group">
              <label class="form-label">Banner do Torneio (Upload PC)</label>
              <input type="file" id="comm-tourn-file" class="form-input" accept="image/*">
              <span class="upload-hint">Tamanho recomendado: 800x400px (Proporção 2:1, JPG/WEBP)</span>
            </div>

            <button type="submit" class="btn-primary">Salvar e Divulgar Torneio &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Torneios Cadastrados</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
          ${data.communityTournaments && data.communityTournaments.length > 0 ? data.communityTournaments.map(ct => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1.25rem;">
              <span class="game-badge" style="position: static; margin-bottom: 6px; display: inline-block;">${ct.game} • ${ct.status}</span>
              <h4 style="color: white; font-size: 1.1rem; margin-top: 4px;">${ct.title}</h4>
              <div style="font-size: 0.8rem; color: var(--accent-neon); margin-top: 4px; font-weight: 700;">Premiação: ${ct.prize_pool || 'N/A'}</div>
              <div style="display: flex; gap: 6px; margin-top: 12px;">
                <button class="btn-edit pop-edit-comm-tourn-btn" data-id="${ct.id}">Editar</button>
                <button class="btn-danger delete-comm-tourn-btn" data-id="${ct.id}" data-title="${ct.title}">Excluir</button>
              </div>
            </div>
          `).join('') : `
            <div style="color: var(--text-muted-light); font-size: 0.85rem; grid-column: 1/-1;">Nenhum torneio cadastrado no momento.</div>
          `}
        </div>
      `;
    }

    if (tab === 'elenco') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Cadastrar Novo Jogador & Periféricos</h3>
          <form id="form-roster">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Nome Completo</label><input type="text" id="roster-name" class="form-input" placeholder="Ex: Erick Santos" required></div>
              <div class="form-group"><label class="form-label">Nickname</label><input type="text" id="roster-nickname" class="form-input" placeholder="Ex: ASPAS" required></div>
              <div class="form-group">
                <label class="form-label">Modalidade</label>
                <select id="roster-game" class="form-select" required>
                  ${data.modalities.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group"><label class="form-label">Função / Role</label><input type="text" id="roster-role" class="form-input" placeholder="Ex: Duelist" required></div>
            </div>

            <h4 style="font-size: 0.85rem; color: var(--accent-neon); text-transform: uppercase; margin: 1rem 0 0.5rem;">Setup & Periféricos</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.85rem;">
              <input type="text" id="roster-mouse" class="form-input" placeholder="Mouse (Ex: Logitech G Pro X)">
              <input type="text" id="roster-keyboard" class="form-input" placeholder="Teclado (Ex: Wooting 60HE)">
              <input type="text" id="roster-headset" class="form-input" placeholder="Headset (Ex: HyperX Cloud)">
              <input type="text" id="roster-microphone" class="form-input" placeholder="Microfone (Ex: Shure SM7B)">
              <input type="text" id="roster-mousepad" class="form-input" placeholder="Mousepad (Ex: Artisan Zero)">
              <input type="text" id="roster-monitor" class="form-input" placeholder="Monitor (Ex: ZOWIE 360Hz)">
            </div>

            <div class="form-group" style="margin-top: 1rem;">
              <label class="form-label">Foto do Pro-Player (Upload PC)</label>
              <input type="file" id="roster-file" class="form-input" accept="image/*">
              <span class="upload-hint">Tamanho recomendado: 800x800px (Quadrado 1:1, JPG/PNG)</span>
            </div>

            <button type="submit" class="btn-primary">Salvar Novo Jogador &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Atletas do Elenco</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem;">
          ${data.roster.map(p => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1rem; display: flex; gap: 0.85rem; align-items: center;">
              <img src="${p.photo_url}" alt="${p.nickname}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
              <div style="flex: 1;">
                <span class="game-badge" style="position: static; font-size: 0.65rem;">${p.game}</span>
                <div style="font-family: var(--font-heading); font-weight: 700; font-size: 1rem; color: white;">${p.nickname}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted-light);">${p.name}</div>
              </div>
              <div style="display: flex; gap: 4px;">
                <button class="btn-edit pop-edit-roster-btn" data-id="${p.id}">Editar</button>
                <button class="btn-danger delete-roster-btn" data-id="${p.id}" data-title="${p.nickname}">Excluir</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'staff') {
      return `
        <!-- GESTÃO DA COMISSÃO TÉCNICA (STAFF) -->
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Cadastrar Membro da Comissão Técnica & Staff</h3>
          <form id="form-staff">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Nome Completo</label><input type="text" id="staff-name" class="form-input" placeholder="Ex: Rodrigo Silva" required></div>
              <div class="form-group"><label class="form-label">Nickname (Opcional)</label><input type="text" id="staff-nickname" class="form-input" placeholder="Ex: ONQ"></div>
              <div class="form-group"><label class="form-label">Cargo / Função</label><input type="text" id="staff-role" class="form-input" placeholder="Ex: Head Coach" required></div>
              <div class="form-group"><label class="form-label">Modalidade / Setor</label><input type="text" id="staff-game" class="form-input" placeholder="Ex: Valorant" value="Geral"></div>
            </div>

            <div class="form-group">
              <label class="form-label">Foto do Membro da Staff (Upload PC)</label>
              <input type="file" id="staff-file" class="form-input" accept="image/*">
              <span class="upload-hint">Tamanho recomendado: 400x400px (Quadrado 1:1, JPG/PNG)</span>
            </div>

            <button type="submit" class="btn-primary">Salvar Membro da Staff &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Comissão Técnica Cadastrada</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem;">
          ${data.staffMembers.map(st => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1rem; display: flex; gap: 0.85rem; align-items: center;">
              <img src="${st.photo_url}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;">
              <div style="flex: 1;">
                <div style="font-weight: 700; color: white;">${st.name}</div>
                <div style="font-size: 0.75rem; color: var(--accent-neon);">${st.role}</div>
              </div>
              <div style="display: flex; gap: 4px;">
                <button class="btn-edit pop-edit-staff-btn" data-id="${st.id}">Editar</button>
                <button class="btn-danger delete-staff-btn" data-id="${st.id}" data-title="${st.name}">Excluir</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'modalidades') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Criar Nova Modalidade (Game)</h3>
          <form id="form-modality">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
              <div class="form-group"><label class="form-label">Nome da Modalidade</label><input type="text" id="mod-name" class="form-input" placeholder="Ex: League of Legends" required></div>
              <div class="form-group">
                <label class="form-label">Ícone (Upload PC)</label>
                <input type="file" id="mod-file" class="form-input" accept="image/*">
                <span class="upload-hint">Tamanho recomendado: 128x128px (PNG Transparente)</span>
              </div>
            </div>
            <div class="form-group"><label class="form-label">Descrição</label><input type="text" id="mod-desc" class="form-input" placeholder="Ex: 5v5 MOBA"></div>
            <button type="submit" class="btn-primary">Criar Modalidade &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Modalidades Ativas</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem;">
          ${data.modalities.map(m => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
              <div style="flex: 1;">
                <h4 style="color: white; font-size: 1.05rem;">${m.name}</h4>
                <p style="font-size: 0.75rem; color: var(--text-muted-light);">${m.description || 'Sem descrição.'}</p>
              </div>
              <div style="display: flex; gap: 4px;">
                <button class="btn-edit pop-edit-mod-btn" data-id="${m.id}">Editar</button>
                <button class="btn-danger delete-mod-btn" data-id="${m.id}" data-title="${m.name}">Excluir</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'trophies') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Cadastrar Conquista / Troféu</h3>
          <form id="form-trophy">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem;">
              <div class="form-group"><label class="form-label">Título da Conquista</label><input type="text" id="trophy-title" class="form-input" required></div>
              <div class="form-group"><label class="form-label">Ano do Título</label><input type="text" id="trophy-year" class="form-input" required></div>
              <div class="form-group">
                <label class="form-label">Modalidade</label>
                <select id="trophy-game" class="form-select">
                  ${data.modalities.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Imagem do Troféu (Upload PC)</label>
              <input type="file" id="trophy-file" class="form-input" accept="image/*">
              <span class="upload-hint">Tamanho recomendado: 800x600px (Proporção 4:3, JPG/PNG)</span>
            </div>
            <div class="form-group"><label class="form-label">Histórico da Campanha</label><textarea id="trophy-desc" class="form-textarea" rows="3"></textarea></div>
            <button type="submit" class="btn-primary">Salvar Conquista &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Troféus Registrados</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 3rem;">
          ${data.trophies.map(t => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1.25rem;">
              <span class="game-badge" style="position: static; margin-bottom: 6px; display: inline-block;">${t.game} • ${t.year}</span>
              <h4 style="color: white; font-size: 1rem; margin-top: 4px;">${t.title}</h4>
              <div style="display: flex; gap: 6px; margin-top: 10px;">
                <button class="btn-edit pop-edit-trophy-btn" data-id="${t.id}">Editar</button>
                <button class="btn-danger delete-trophy-btn" data-id="${t.id}" data-title="${t.title}">Remover</button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- CAMPEONATOS RECENTES -->
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Cadastrar Campeonato Recente</h3>
          <form id="form-recent-tournament">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Nome do Campeonato</label><input type="text" id="rec-tourn-name" class="form-input" placeholder="Ex: VCT Americas Stage 2" required></div>
              <div class="form-group"><label class="form-label">Ano</label><input type="text" id="rec-tourn-year" class="form-input" value="2026" required></div>
              <div class="form-group"><label class="form-label">Colocação</label><input type="text" id="rec-tourn-placement" class="form-input" placeholder="Ex: 1º Lugar (Campeão)" required></div>
              <div class="form-group"><label class="form-label">Premiação / Modalidade</label><input type="text" id="rec-tourn-prize" class="form-input" placeholder="Ex: $250.000" required></div>
            </div>
            <button type="submit" class="btn-primary">Salvar Campeonato Recente &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Campeonatos Recentes Registrados</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${data.recentTournaments.map(rt => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); padding: 10px 14px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>${rt.name} (${rt.year})</strong> — <span style="color: var(--accent-neon); font-weight: 700;">${rt.placement}</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn-edit pop-edit-recent-tourn-btn" data-id="${rt.id}">Editar</button>
                <button class="btn-danger delete-recent-tourn-btn" data-id="${rt.id}" data-title="${rt.name}">Excluir</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'about') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Editar Página "Sobre a LYKOS"</h3>
          <form id="form-about">
            <div class="form-group">
              <label class="form-label">Foto Principal (Upload PC)</label>
              <input type="file" id="about-image-file" class="form-input" accept="image/*">
              <span class="upload-hint">Tamanho recomendado: 1200x800px (Proporção 3:2, JPG/WEBP)</span>
            </div>

            <div class="form-group"><label class="form-label">História do Time</label><textarea id="about-history" class="form-textarea" rows="4" required>${data.aboutSettings.history_text}</textarea></div>
            <div class="form-group"><label class="form-label">Missão & Visão</label><textarea id="about-mission" class="form-textarea" rows="3" required>${data.aboutSettings.mission_text}</textarea></div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.25rem;">
              <div class="form-group"><label class="form-label">Estatística 1</label><input type="text" id="about-stat-trophies" class="form-input" value="${data.aboutSettings.stat_trophies}"></div>
              <div class="form-group"><label class="form-label">Estatística 2</label><input type="text" id="about-stat-winrate" class="form-input" value="${data.aboutSettings.stat_winrate}"></div>
              <div class="form-group"><label class="form-label">Estatística 3</label><input type="text" id="about-stat-community" class="form-input" value="${data.aboutSettings.stat_community}"></div>
            </div>

            <button type="submit" class="btn-primary">Salvar Página Sobre &rarr;</button>
          </form>
        </div>
      `;
    }

    if (tab === 'galeria') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Adicionar Imagem à Galeria</h3>
          <form id="form-gallery">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
              <div class="form-group"><label class="form-label">Título da Foto</label><input type="text" id="gal-title" class="form-input" required></div>
              <div class="form-group">
                <label class="form-label">Categoria</label>
                <select id="gal-category" class="form-select">
                  <option value="Campeonatos">Campeonatos</option>
                  <option value="Bastidores">Bastidores</option>
                  <option value="Eventos">Eventos</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label class="form-label">Descrição da Foto</label><textarea id="gal-desc" class="form-textarea" rows="2" placeholder="Ex: Momento da comemoração no palco principal."></textarea></div>
            <div class="form-group">
              <label class="form-label">Upload de Foto (PC)</label>
              <input type="file" id="gal-file" class="form-input" accept="image/*">
              <span class="upload-hint">Tamanho recomendado: 1200x800px (Proporção 3:2, JPG/WEBP)</span>
            </div>
            <button type="submit" class="btn-primary">Adicionar à Galeria &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Fotos Registradas</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 1rem;">
          ${data.gallery.map(g => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); overflow: hidden;">
              <img src="${g.image_url}" style="width: 100%; height: 120px; object-fit: cover;">
              <div style="padding: 0.85rem;">
                <span class="gallery-tag">${g.category}</span>
                <div style="font-weight: 700; font-size: 0.85rem; margin-top: 4px; color: white;">${g.title}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted-light); margin-top: 4px; max-height: 36px; overflow: hidden;">${g.description || ''}</div>
                <div style="display: flex; gap: 4px; margin-top: 8px;">
                  <button class="btn-edit pop-edit-gallery-btn" data-id="${g.id}">Editar</button>
                  <button class="btn-danger delete-gallery-btn" data-id="${g.id}" data-title="${g.title}">Remover</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'social') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Cadastrar Novo Post / Rede Social</h3>
          <form id="form-social">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
              <div class="form-group">
                <label class="form-label">Plataforma</label>
                <select id="social-platform" class="form-select" required>
                  <option value="instagram">Instagram</option>
                  <option value="x">X (Twitter)</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitch">Twitch</option>
                  <option value="facebook">Facebook</option>
                  <option value="discord">Discord</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div class="form-group"><label class="form-label">Título da Publicação</label><input type="text" id="social-title" class="form-input" placeholder="Ex: Bastidores do Treino" required></div>
            </div>
            <div class="form-group">
              <label class="form-label">Código de Embed (Cole o Bloco &lt;blockquote...&gt;, &lt;iframe...&gt; ou URL)</label>
              <textarea id="social-embed-url" class="form-textarea" rows="4" placeholder="Cole aqui o código de incorporação (embed HTML) fornecido pelo Instagram, X/Twitter, etc." required></textarea>
            </div>
            <div class="form-group"><label class="form-label">URL Direta do Post Original (Opcional)</label><input type="url" id="social-post-url" class="form-input" placeholder="https://instagram.com/p/..."></div>
            <button type="submit" class="btn-primary">Salvar Rede Social &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Redes e Feeds Ativos</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem;">
          ${data.socialFeeds.map(s => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1rem;">
              <span class="social-platform-badge">${s.platform.toUpperCase()}</span>
              <h4 style="color: white; margin-top: 6px; font-size: 0.95rem;">${s.title}</h4>
              <div style="display: flex; gap: 4px; margin-top: 10px;">
                <button class="btn-edit pop-edit-social-btn" data-id="${s.id}">Editar</button>
                <button class="btn-danger delete-social-btn" data-id="${s.id}" data-title="${s.title}">Excluir</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'branding') {
      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem;">
          <h3 style="margin-bottom: 1.25rem; font-size: 1.15rem;">Logos Independentes, Redes de Contato & Marca</h3>
          <form id="form-branding">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
              <div class="form-group"><label class="form-label">Nome do Time</label><input type="text" id="brand-team-name" class="form-input" value="${data.settings.team_name}" required></div>
              <div class="form-group"><label class="form-label">Cor Primária (Hex)</label><input type="color" id="brand-primary-color" class="form-input" value="${data.settings.primary_color || '#4d00b5'}" style="height: 42px;"></div>
            </div>

            <!-- TOGGLE ABA TORNEIOS -->
            <div style="margin-top: 1rem; background: rgba(157,80,255,0.08); border: 1px solid var(--border-dark-strong); padding: 14px; border-radius: 6px;">
              <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; color: white; font-weight: 700;">
                <input type="checkbox" id="brand-show-tournaments-tab" ${data.settings.show_tournaments_tab ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--accent-neon);">
                Exibir Aba "Torneios" no Menu de Navegação (Navbar & Footer)
              </label>
              <span class="upload-hint" style="margin-top: 6px; display: block; line-height: 1.4;">
                Ative ou desative a visibilidade pública da página de divulgação de torneios comunitários e parcerias.
              </span>
            </div>

            <!-- TEXTO DA PÁGINA INICIAL -->
            <h4 style="font-size: 0.85rem; color: var(--accent-neon); text-transform: uppercase; margin: 1.5rem 0 0.75rem;">Texto da Página Inicial (Hero)</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.5rem;">
              <div class="form-group">
                <label class="form-label">Título Principal (Hero)</label>
                <input type="text" id="brand-hero-title" class="form-input" value="${data.settings.hero_title || 'SANGUE.GARRA.GLÓRIA.'}" placeholder="Ex: SANGUE.GARRA.GLÓRIA.">
                <span class="upload-hint">Texto grande em destaque na página inicial.</span>
              </div>
              <div class="form-group">
                <label class="form-label">Subtítulo (Hero)</label>
                <input type="text" id="brand-hero-subtitle" class="form-input" value="${data.settings.hero_subtitle || ''}" placeholder="Ex: A organização oficial de e-sports de alta performance.">
                <span class="upload-hint">Texto descritivo abaixo do título principal.</span>
              </div>
            </div>

            <h4 style="font-size: 0.85rem; color: var(--accent-neon); text-transform: uppercase; margin: 1.5rem 0 0.75rem;">Logos & Ícones do Site</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div class="form-group" style="background: var(--bg-dark-surface); padding: 12px; border: 1px solid var(--border-dark); border-radius: 6px;">
                <label class="form-label">1. Logo Oficial das Partidas</label>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <img id="brand-logo-preview" src="${data.settings.logo_url || 'assets/logo.png'}" style="width: 44px; height: 44px; object-fit: contain; background: rgba(0,0,0,0.4); border-radius: 4px; border: 1px solid var(--border-dark); padding: 2px;">
                  <span style="font-size: 0.75rem; color: var(--text-muted-light);">Preview atual</span>
                </div>
                <input type="text" id="brand-logo-url" class="form-input" value="${data.settings.logo_url || ''}" placeholder="URL da imagem (ex: https://...)" style="margin-bottom: 6px;">
                <input type="file" id="brand-logo-file" class="form-input" accept="image/*">
                <span class="upload-hint">Upload de arquivo ou cole a URL acima.</span>
              </div>

              <div class="form-group" style="background: var(--bg-dark-surface); padding: 12px; border: 1px solid var(--border-dark); border-radius: 6px;">
                <label class="form-label">2. Logo da Barra de Navegação</label>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <img id="brand-header-logo-preview" src="${data.settings.header_logo_url || 'assets/logo.png'}" style="height: 44px; max-width: 120px; object-fit: contain; background: rgba(0,0,0,0.4); border-radius: 4px; border: 1px solid var(--border-dark); padding: 2px;">
                  <span style="font-size: 0.75rem; color: var(--text-muted-light);">Preview atual</span>
                </div>
                <input type="text" id="brand-header-logo-url" class="form-input" value="${data.settings.header_logo_url || ''}" placeholder="URL da imagem (ex: https://...)" style="margin-bottom: 6px;">
                <input type="file" id="brand-header-logo-file" class="form-input" accept="image/*">
                <span class="upload-hint">Upload de arquivo ou cole a URL acima.</span>
              </div>

              <div class="form-group" style="background: var(--bg-dark-surface); padding: 12px; border: 1px solid var(--border-dark); border-radius: 6px;">
                <label class="form-label">3. Favicon do Navegador</label>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <img id="brand-favicon-preview" src="${data.settings.favicon_url || 'assets/favicon.png'}" style="width: 32px; height: 32px; object-fit: contain; background: rgba(0,0,0,0.4); border-radius: 4px; border: 1px solid var(--border-dark); padding: 2px;">
                  <span style="font-size: 0.75rem; color: var(--text-muted-light);">Preview atual</span>
                </div>
                <input type="text" id="brand-favicon-url" class="form-input" value="${data.settings.favicon_url || ''}" placeholder="URL do favicon (ex: assets/favicon.png ou https://...)" style="margin-bottom: 6px;">
                <input type="file" id="brand-favicon-file" class="form-input" accept="image/*">
                <span class="upload-hint">Upload de arquivo ou cole a URL acima.</span>
              </div>
            </div>

            <!-- GESTÃO DINÂMICA DAS REDES SOCIAIS DE CONTATO -->
            <h4 style="font-size: 0.85rem; color: var(--accent-neon); text-transform: uppercase; margin: 1.5rem 0 0.75rem; display: flex; justify-content: space-between; align-items: center;">
              <span>Links das Redes de Contato & Mídias Sociais</span>
              <button type="button" id="btn-add-contact-social" class="btn-edit" style="font-size: 0.75rem; padding: 4px 10px;">+ Adicionar Rede Social</button>
            </h4>

            <div id="brand-contact-socials-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1rem;">
              ${(data.settings.contact_socials_json && data.settings.contact_socials_json.length > 0 ? data.settings.contact_socials_json : [
                { name: 'Discord', platform: 'discord', url: data.settings.discord_url || '' },
                { name: 'Instagram', platform: 'instagram', url: data.settings.instagram_url || '' }
              ]).map(socialItem => `
                <div class="brand-social-row" style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); padding: 8px 10px; border-radius: 4px; display: grid; grid-template-columns: 1fr 1fr 2fr auto; gap: 8px; align-items: center;">
                  <input type="text" class="form-input brand-soc-name" value="${socialItem.name || ''}" placeholder="Nome (Ex: Discord)" required>
                  <select class="form-select brand-soc-platform">
                    <option value="discord" ${socialItem.platform === 'discord' ? 'selected' : ''}>Discord</option>
                    <option value="instagram" ${socialItem.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                    <option value="x" ${socialItem.platform === 'x' ? 'selected' : ''}>X (Twitter)</option>
                    <option value="tiktok" ${socialItem.platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
                    <option value="youtube" ${socialItem.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                    <option value="twitch" ${socialItem.platform === 'twitch' ? 'selected' : ''}>Twitch</option>
                    <option value="facebook" ${socialItem.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                    <option value="linkedin" ${socialItem.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                  </select>
                  <input type="url" class="form-input brand-soc-url" value="${socialItem.url || ''}" placeholder="URL Direta (Ex: https://discord.gg/...)" required>
                  <button type="button" class="btn-danger remove-social-row-btn" style="padding: 4px 8px; font-size: 0.75rem; height: 36px;" title="Remover Rede">&times;</button>
                </div>
              `).join('')}
            </div>

            <button type="submit" class="btn-primary" style="margin-top: 1rem;">Salvar Configurações de Marca &rarr;</button>
          </form>
        </div>
      `;
    }

    if (tab === 'roles') {
      if (!hasPermission('roles')) {
        return `
          <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); padding: 2rem; border-radius: var(--radius-sm); text-align: center;">
            <h3 style="color: #ff4d4d; margin-bottom: 0.5rem;">Acesso Restrito</h3>
            <p style="color: var(--text-muted-light); font-size: 0.9rem;">Somente usuários autorizados de nível Master possuem acesso para gerenciar usuários e conceder permissões.</p>
          </div>
        `;
      }

      const availablePermissions = [
        { id: 'partidas', label: 'Partidas & Súmulas K/D' },
        { id: 'torneios', label: 'Divulgação de Torneios' },
        { id: 'elenco', label: 'Elenco & Setup Pro-Players' },
        { id: 'staff', label: 'Comissão Técnica & Staff' },
        { id: 'modalidades', label: 'Modalidades (Games)' },
        { id: 'trophies', label: 'Conquistas & Troféus' },
        { id: 'recentTournaments', label: 'Campeonatos Recentes' },
        { id: 'about', label: 'Página Sobre a LYKOS' },
        { id: 'galeria', label: 'Galeria de Fotos' },
        { id: 'social', label: 'Redes Sociais & Feeds' },
        { id: 'branding', label: 'Logos & Marca' },
        { id: 'roles', label: 'Gestão de Usuários & Permissões (Master)' }
      ];

      return `
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="margin-bottom: 0.5rem; font-size: 1.15rem;">Criar Novo Usuário com Permissões Personalizadas</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted-light); margin-bottom: 1.25rem;">
            Selecione as permissões individuais via checkbox para definir exatamente o que o novo usuário poderá gerenciar.
          </p>

          <form id="form-create-user">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label class="form-label">E-mail de Acesso (Login)</label>
                <input type="email" id="new-user-email" class="form-input" placeholder="exemplo@lykos-esports.com" required>
              </div>

              <div class="form-group">
                <label class="form-label">Nome Completo</label>
                <input type="text" id="new-user-name" class="form-input" placeholder="Ex: Carlos Silva" required>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label">Senha de Acesso (Gerada de 16 Caracteres Fortes)</label>
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <input type="password" id="new-user-password" class="form-input" readonly placeholder="Clique para gerar senha de 16 caracteres" required style="flex: 1; min-width: 200px; font-family: monospace; font-size: 1rem; font-weight: 700; letter-spacing: 0.15em; background: rgba(0,0,0,0.15);">
                <button type="button" id="btn-toggle-show-pass" class="btn-secondary" style="padding: 10px 14px; font-size: 0.8rem;" title="Mostrar/Ocultar Senha">Ver Senha</button>
                <button type="button" id="btn-generate-password" class="btn-secondary" style="padding: 10px 16px; font-size: 0.8rem; white-space: nowrap;">
                  Gerar Senha (16 Caracteres)
                </button>
                <button type="button" id="btn-copy-password" class="btn-edit" style="padding: 10px 16px; font-size: 0.8rem; white-space: nowrap;">
                  Copiar Senha
                </button>
              </div>
              <span class="upload-hint">Por segurança, a senha é gerada com 16 caracteres fortes e mantida oculta. Use o botão Copiar Senha para enviar ao usuário.</span>
            </div>

            <div style="margin-top: 1.25rem; background: rgba(157,80,255,0.05); border: 1px solid var(--border-dark-strong); padding: 1.25rem; border-radius: var(--radius-xs);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
                <h4 style="font-size: 0.85rem; color: var(--accent-neon); text-transform: uppercase;">Permissões Concedidas (Checkboxes)</h4>
                <div style="display: flex; gap: 8px;">
                  <button type="button" id="btn-check-all-perm" class="btn-edit" style="font-size: 0.7rem; padding: 2px 8px;">Marcar Todas</button>
                  <button type="button" id="btn-uncheck-all-perm" class="btn-secondary" style="font-size: 0.7rem; padding: 2px 8px;">Desmarcar Todas</button>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                ${availablePermissions.map(p => `
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: white; cursor: pointer; background: var(--bg-dark-surface); padding: 8px 10px; border-radius: 4px; border: 1px solid var(--border-dark);">
                    <input type="checkbox" class="user-perm-checkbox" value="${p.id}" style="accent-color: var(--accent-neon); width: 16px; height: 16px;">
                    ${p.label}
                  </label>
                `).join('')}
              </div>
            </div>

            <button type="submit" class="btn-primary" style="margin-top: 1.5rem;">Criar Usuário & Conceder Permissões &rarr;</button>
          </form>
        </div>

        <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Usuários Cadastrados & Permissões</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 2.5rem;">
          ${data.users.map(u => `
            <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <strong style="font-size: 1rem; color: white;">${u.email}</strong>
                  ${u.is_master ? '<span style="background: var(--primary-purple); color: white; font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">Master Admin</span>' : ''}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted-light); margin-top: 2px;">${u.fullName || 'Usuário do Sistema'}</div>
                
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
                  ${(u.is_master ? availablePermissions.map(p=>p.id) : (u.permissions || [])).map(perm => {
                    const found = availablePermissions.find(p=>p.id === perm);
                    return found ? `<span class="game-badge" style="position: static; font-size: 0.65rem; padding: 2px 6px;">${found.label}</span>` : '';
                  }).join('')}
                </div>
              </div>

              <div style="display: flex; gap: 6px;">
                <button class="btn-edit pop-edit-user-btn" data-id="${u.id}">Editar Permissões & Senha</button>
                ${!u.is_master ? `<button class="btn-danger delete-user-btn" data-id="${u.id}" data-title="${u.email}">Excluir</button>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- LOGS DE LOGIN E ACESSO DOS USUÁRIOS -->
        <h3 style="margin-bottom: 1rem; font-size: 1.15rem; display: flex; justify-content: space-between; align-items: center;">
          <span>📜 Histórico & Logs de Login dos Usuários</span>
          <button type="button" id="btn-clear-login-logs" class="btn-danger" style="font-size: 0.75rem; padding: 4px 10px;">Limpar Histórico de Logs</button>
        </h3>

        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-sm); max-height: 280px; overflow-y: auto; padding: 1.25rem;">
          ${data.loginLogs && data.loginLogs.length > 0 ? data.loginLogs.map(log => {
            const d = new Date(log.timestamp);
            const formattedDate = `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
            return `
              <div style="border-bottom: 1px dashed var(--border-dark); padding: 8px 0; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: white;">${log.user_name}</strong>
                  <span style="color: var(--text-muted-light); font-size: 0.78rem;">(${log.user_email})</span>
                </div>
                <div style="color: var(--accent-neon); font-size: 0.78rem; font-weight: 600;">
                  logou em ${formattedDate}
                </div>
              </div>
            `;
          }).join('') : `
            <div style="color: var(--text-muted-light); font-size: 0.85rem; text-align: center; padding: 1rem;">Nenhum registro de login até o momento.</div>
          `}
        </div>
      `;
    }

    return `<div style="padding: 2rem; color: var(--text-muted-light);">Selecione uma opção válida no menu lateral.</div>`;
  }

  function attachTabFormHandlers(data) {
    // 1. PARTIDAS HANDLERS
    const formMatch = container.querySelector('#form-match');
    if (formMatch) {
      formMatch.onsubmit = async (e) => {
        e.preventDefault();
        const oppFile = container.querySelector('#match-opponent-file');
        let opponentLogo = '';
        if (oppFile && oppFile.files && oppFile.files[0]) {
          opponentLogo = await window.LykosDB.uploadAsset(oppFile.files[0]);
        }

        const matchData = {
          game: container.querySelector('#match-game').value,
          opponent_name: container.querySelector('#match-opponent').value,
          opponent_logo: opponentLogo,
          tournament_name: container.querySelector('#match-tournament').value,
          format: container.querySelector('#match-format').value || 'MD3',
          match_date: container.querySelector('#match-date').value,
          status: container.querySelector('#match-status').value,
          score_lykos: 0,
          score_opponent: 0
        };
        await window.LykosDB.saveMatch(matchData);
        renderDashboard();
      };
    }

    container.querySelectorAll('.pop-edit-match-btn').forEach(btn => {
      btn.onclick = () => {
        const match = data.matches.find(m => String(m.id) === String(btn.getAttribute('data-id')));
        if (!match) return;

        const html = `
          <form>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Modalidade</label>
                <select id="pop-m-game" class="form-select">${data.modalities.map(mod => `<option value="${mod.name}" ${match.game === mod.name ? 'selected' : ''}>${mod.name}</option>`).join('')}</select>
              </div>
              <div class="form-group"><label class="form-label">Nome do Adversário</label><input type="text" id="pop-m-opp" class="form-input" value="${match.opponent_name}" required></div>
              <div class="form-group"><label class="form-label">Campeonato</label><input type="text" id="pop-m-tourn" class="form-input" value="${match.tournament_name}" required></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Data e Hora</label><input type="datetime-local" id="pop-m-date" class="form-input" value="${match.match_date ? match.match_date.slice(0,16) : ''}" required></div>
              <div class="form-group">
                <label class="form-label">Status</label>
                <select id="pop-m-status" class="form-select">
                  <option value="UPCOMING" ${match.status === 'UPCOMING' ? 'selected' : ''}>UPCOMING</option>
                  <option value="LIVE" ${match.status === 'LIVE' ? 'selected' : ''}>LIVE</option>
                  <option value="FINISHED" ${match.status === 'FINISHED' ? 'selected' : ''}>FINISHED</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Placar (LYKOS x Adv)</label>
                <div style="display: flex; gap: 4px;">
                  <input type="number" id="pop-m-s1" class="form-input" value="${match.score_lykos || 0}">
                  <input type="number" id="pop-m-s2" class="form-input" value="${match.score_opponent || 0}">
                </div>
              </div>
            </div>

            <div class="form-group" style="margin-top: 1rem;">
              <label class="form-label">Logo do Adversário (Upload PC)</label>
              <input type="file" id="pop-m-opp-file" class="form-input" accept="image/*">
            </div>

            <h4 style="font-size: 0.85rem; color: var(--accent-neon); text-transform: uppercase; margin: 1.25rem 0 0.5rem; display: flex; justify-content: space-between; align-items: center;">
              <span>Placar por Mapa & Fotos de Capa</span>
              <button type="button" id="add-map-row-btn" class="btn-edit" style="font-size: 0.75rem; padding: 4px 10px;">+ Adicionar Mapa</button>
            </h4>

            <div id="pop-maps-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto; margin-bottom: 1rem;">
              ${(match.maps_json && match.maps_json.length > 0 ? match.maps_json : [{ map_name: 'Ascent', score_lykos: 0, score_opponent: 0 }]).map((mapItem, idx) => `
                <div class="pop-map-row" data-existing-img="${mapItem.map_image || ''}" style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); padding: 8px 10px; border-radius: 4px; display: grid; grid-template-columns: 1.5fr 1fr 1fr 2fr auto; gap: 8px; align-items: center;">
                  <input type="text" class="form-input pop-map-name" value="${mapItem.map_name || ''}" placeholder="Nome do Mapa (Ex: Ascent)" required>
                  <input type="number" class="form-input pop-map-s1" value="${mapItem.score_lykos || 0}" placeholder="${data.settings.team_name}">
                  <input type="number" class="form-input pop-map-s2" value="${mapItem.score_opponent || 0}" placeholder="${match.opponent_name}">
                  <div>
                    <input type="file" class="form-input pop-map-file" accept="image/*" style="padding: 2px 4px; font-size: 0.75rem;">
                  </div>
                  <button type="button" class="btn-danger remove-map-row-btn" style="padding: 4px 8px; font-size: 0.75rem; height: 36px;" title="Remover Mapa">&times;</button>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: 10px; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Atualizar Partida & Mapas &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Partida & Mapas: vs ${match.opponent_name}`, html, async (form) => {
          const oppFile = form.querySelector('#pop-m-opp-file');
          let opponentLogo = match.opponent_logo || '';
          if (oppFile && oppFile.files && oppFile.files[0]) {
            opponentLogo = await window.LykosDB.uploadAsset(oppFile.files[0]);
          }

          const updatedMaps = [];
          const mapRows = form.querySelectorAll('.pop-map-row');

          for (let i = 0; i < mapRows.length; i++) {
            const row = mapRows[i];
            const mName = row.querySelector('.pop-map-name').value;
            if (!mName) continue;

            let mapImg = row.getAttribute('data-existing-img') || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';

            const mFileInput = row.querySelector('.pop-map-file');
            if (mFileInput && mFileInput.files && mFileInput.files[0]) {
              mapImg = await window.LykosDB.uploadAsset(mFileInput.files[0]);
            }

            updatedMaps.push({
              map_name: mName,
              map_image: mapImg,
              score_lykos: parseInt(row.querySelector('.pop-map-s1').value || 0),
              score_opponent: parseInt(row.querySelector('.pop-map-s2').value || 0)
            });
          }

          const updated = {
            ...match,
            game: form.querySelector('#pop-m-game').value,
            opponent_name: form.querySelector('#pop-m-opp').value,
            opponent_logo: opponentLogo,
            tournament_name: form.querySelector('#pop-m-tourn').value,
            match_date: form.querySelector('#pop-m-date').value,
            status: form.querySelector('#pop-m-status').value,
            score_lykos: parseInt(form.querySelector('#pop-m-s1').value || 0),
            score_opponent: parseInt(form.querySelector('#pop-m-s2').value || 0),
            maps_json: updatedMaps
          };
          await window.LykosDB.saveMatch(updated);
        });

        // Attach dynamic map row handler in modal
        setTimeout(() => {
          const modalBackdrop = document.querySelector('.modal-backdrop');
          if (!modalBackdrop) return;
          const mapList = modalBackdrop.querySelector('#pop-maps-list');
          const addBtn = modalBackdrop.querySelector('#add-map-row-btn');

          if (addBtn && mapList) {
            addBtn.onclick = (e) => {
              e.preventDefault();
              const row = document.createElement('div');
              row.className = 'pop-map-row';
              row.style.cssText = 'background: var(--bg-dark-surface); border: 1px solid var(--border-dark); padding: 8px 10px; border-radius: 4px; display: grid; grid-template-columns: 1.5fr 1fr 1fr 2fr auto; gap: 8px; align-items: center;';
              row.innerHTML = `
                <input type="text" class="form-input pop-map-name" value="" placeholder="Nome do Mapa (Ex: Haven)" required>
                <input type="number" class="form-input pop-map-s1" value="0" placeholder="${data.settings.team_name}">
                <input type="number" class="form-input pop-map-s2" value="0" placeholder="${match.opponent_name}">
                <div>
                  <input type="file" class="form-input pop-map-file" accept="image/*" style="padding: 2px 4px; font-size: 0.75rem;">
                </div>
                <button type="button" class="btn-danger remove-map-row-btn" style="padding: 4px 8px; font-size: 0.75rem; height: 36px;" title="Remover Mapa">&times;</button>
              `;
              row.querySelector('.remove-map-row-btn').onclick = () => row.remove();
              mapList.appendChild(row);
              mapList.scrollTop = mapList.scrollHeight;
            };

            mapList.querySelectorAll('.remove-map-row-btn').forEach(btn => {
              btn.onclick = () => {
                const row = btn.closest('.pop-map-row');
                if (row) row.remove();
              };
            });
          }
        }, 50);
      };
    });

    container.querySelectorAll('.delete-match-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deleteMatch(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });

    // 2. SÚMULA BULK POP-UP EDITOR
    container.querySelectorAll('.pop-edit-sumula-btn').forEach(btn => {
      btn.onclick = () => {
        const match = data.matches.find(m => String(m.id) === String(btn.getAttribute('data-id')));
        if (!match) return;

        const kdas = match.player_kdas || [];

        const html = `
          <form id="popup-sumula-bulk-form">
            <p style="font-size: 0.85rem; color: var(--text-muted-light); margin-bottom: 1rem;">
              Gerencie todos os jogadores da súmula para <strong>${data.settings.team_name} vs ${match.opponent_name}</strong>.
            </p>

            <div id="sumula-players-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 45vh; overflow-y: auto; margin-bottom: 1rem;">
              ${kdas.map((p, idx) => `
                <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); padding: 8px 10px; border-radius: 4px; display: grid; grid-template-columns: 1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 6px; align-items: center;">
                  <input type="text" class="form-input pop-sum-nick" value="${p.nickname}" placeholder="Nick">
                  <select class="form-select pop-sum-team">
                    <option value="${data.settings.team_name}" ${p.team === data.settings.team_name ? 'selected' : ''}>${data.settings.team_name}</option>
                    <option value="${match.opponent_name}" ${p.team === match.opponent_name ? 'selected' : ''}>${match.opponent_name}</option>
                  </select>
                  <input type="number" class="form-input pop-sum-k" value="${p.kills || 0}" placeholder="K">
                  <input type="number" class="form-input pop-sum-d" value="${p.deaths || 0}" placeholder="D">
                  <input type="number" class="form-input pop-sum-a" value="${p.assists || 0}" placeholder="A">
                  <input type="number" class="form-input pop-sum-fk" value="${p.first_kills || 0}" placeholder="FK">
                  <input type="number" class="form-input pop-sum-fd" value="${p.first_deaths || 0}" placeholder="FD">
                </div>
              `).join('')}
            </div>

            <div style="background: rgba(157,80,255,0.08); border: 1px solid var(--border-dark); padding: 10px; border-radius: 4px; margin-bottom: 1.25rem;">
              <h5 style="color: var(--accent-neon); margin-bottom: 6px; font-size: 0.82rem;">Adicionar Novo Jogador à Súmula</h5>
              <div style="display: grid; grid-template-columns: 1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr; gap: 6px;">
                <input type="text" id="new-pop-sum-nick" class="form-input" placeholder="Nick">
                <select id="new-pop-sum-team" class="form-select">
                  <option value="${data.settings.team_name}">${data.settings.team_name}</option>
                  <option value="${match.opponent_name}">${match.opponent_name}</option>
                </select>
                <input type="number" id="new-pop-sum-k" class="form-input" placeholder="K" value="0">
                <input type="number" id="new-pop-sum-d" class="form-input" placeholder="D" value="0">
                <input type="number" id="new-pop-sum-a" class="form-input" placeholder="A" value="0">
                <input type="number" id="new-pop-sum-fk" class="form-input" placeholder="FK" value="0">
                <input type="number" id="new-pop-sum-fd" class="form-input" placeholder="FD" value="0">
              </div>
            </div>

            <div style="display: flex; gap: 10px;">
              <button type="submit" class="btn-primary" style="flex: 1;">Salvar Toda a Súmula &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Súmula de Partida`, html, async (form) => {
          const updatedKdas = [];
          const rows = form.querySelectorAll('#sumula-players-list > div');
          rows.forEach(row => {
            const nick = row.querySelector('.pop-sum-nick').value;
            if (nick) {
              updatedKdas.push({
                nickname: nick,
                team: row.querySelector('.pop-sum-team').value,
                kills: parseInt(row.querySelector('.pop-sum-k').value || 0),
                deaths: parseInt(row.querySelector('.pop-sum-d').value || 0),
                assists: parseInt(row.querySelector('.pop-sum-a').value || 0),
                first_kills: parseInt(row.querySelector('.pop-sum-fk').value || 0),
                first_deaths: parseInt(row.querySelector('.pop-sum-fd').value || 0)
              });
            }
          });

          const newNick = form.querySelector('#new-pop-sum-nick').value;
          if (newNick) {
            updatedKdas.push({
              nickname: newNick,
              team: form.querySelector('#new-pop-sum-team').value,
              kills: parseInt(form.querySelector('#new-pop-sum-k').value || 0),
              deaths: parseInt(form.querySelector('#new-pop-sum-d').value || 0),
              assists: parseInt(form.querySelector('#new-pop-sum-a').value || 0),
              first_kills: parseInt(form.querySelector('#new-pop-sum-fk').value || 0),
              first_deaths: parseInt(form.querySelector('#new-pop-sum-fd').value || 0)
            });
          }

          await window.LykosDB.saveMatch({ ...match, player_kdas: updatedKdas });
        });
      };
    });

    // 3. ELENCO & SETUP HANDLERS
    const formRoster = container.querySelector('#form-roster');
    if (formRoster) {
      formRoster.onsubmit = async (e) => {
        e.preventDefault();
        const fileInput = container.querySelector('#roster-file');
        let photoUrl = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80';
        if (fileInput && fileInput.files && fileInput.files[0]) {
          photoUrl = await window.LykosDB.uploadAsset(fileInput.files[0]);
        }

        await window.LykosDB.savePlayer({
          name: container.querySelector('#roster-name').value,
          nickname: container.querySelector('#roster-nickname').value,
          game: container.querySelector('#roster-game').value,
          role: container.querySelector('#roster-role').value,
          mouse: container.querySelector('#roster-mouse').value || '',
          keyboard: container.querySelector('#roster-keyboard').value || '',
          headset: container.querySelector('#roster-headset').value || '',
          microphone: container.querySelector('#roster-microphone').value || '',
          mousepad: container.querySelector('#roster-mousepad').value || '',
          monitor: container.querySelector('#roster-monitor').value || '',
          photo_url: photoUrl
        });
        renderDashboard();
      };
    }

    container.querySelectorAll('.pop-edit-roster-btn').forEach(btn => {
      btn.onclick = () => {
        const player = data.roster.find(p => String(p.id) === String(btn.getAttribute('data-id')));
        if (!player) return;

        const html = `
          <form>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Nome Completo</label><input type="text" id="pop-p-name" class="form-input" value="${player.name}" required></div>
              <div class="form-group"><label class="form-label">Nickname</label><input type="text" id="pop-p-nick" class="form-input" value="${player.nickname}" required></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Modalidade</label>
                <select id="pop-p-game" class="form-select">${data.modalities.map(m => `<option value="${m.name}" ${player.game === m.name ? 'selected' : ''}>${m.name}</option>`).join('')}</select>
              </div>
              <div class="form-group"><label class="form-label">Função / Role</label><input type="text" id="pop-p-role" class="form-input" value="${player.role || ''}" required></div>
            </div>

            <h4 style="font-size: 0.85rem; color: var(--accent-neon); text-transform: uppercase; margin: 1rem 0 0.5rem;">Setup & Periféricos</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.85rem;">
              <input type="text" id="pop-p-mouse" class="form-input" value="${player.mouse || ''}" placeholder="Mouse">
              <input type="text" id="pop-p-keyboard" class="form-input" value="${player.keyboard || ''}" placeholder="Teclado">
              <input type="text" id="pop-p-headset" class="form-input" value="${player.headset || ''}" placeholder="Headset">
              <input type="text" id="pop-p-microphone" class="form-input" value="${player.microphone || ''}" placeholder="Microfone">
              <input type="text" id="pop-p-mousepad" class="form-input" value="${player.mousepad || ''}" placeholder="Mousepad">
              <input type="text" id="pop-p-monitor" class="form-input" value="${player.monitor || ''}" placeholder="Monitor">
            </div>

            <div class="form-group" style="margin-top: 1rem;">
              <label class="form-label">Nova Foto do Atleta (Upload PC)</label>
              <input type="file" id="pop-p-file" class="form-input" accept="image/*">
            </div>

            <div style="display: flex; gap: 10px; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Atualizar Atleta &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Pro-Player: ${player.nickname}`, html, async (form) => {
          const pFile = form.querySelector('#pop-p-file');
          let photoUrl = player.photo_url;
          if (pFile && pFile.files && pFile.files[0]) {
            photoUrl = await window.LykosDB.uploadAsset(pFile.files[0]);
          }

          await window.LykosDB.savePlayer({
            ...player,
            name: form.querySelector('#pop-p-name').value,
            nickname: form.querySelector('#pop-p-nick').value,
            game: form.querySelector('#pop-p-game').value,
            role: form.querySelector('#pop-p-role').value,
            mouse: form.querySelector('#pop-p-mouse').value,
            keyboard: form.querySelector('#pop-p-keyboard').value,
            headset: form.querySelector('#pop-p-headset').value,
            microphone: form.querySelector('#pop-p-microphone').value,
            mousepad: form.querySelector('#pop-p-mousepad').value,
            monitor: form.querySelector('#pop-p-monitor').value,
            photo_url: photoUrl
          });
        });
      };
    });

    container.querySelectorAll('.delete-roster-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deletePlayer(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });

    // 4. STAFF HANDLERS
    const formStaff = container.querySelector('#form-staff');
    if (formStaff) {
      formStaff.onsubmit = async (e) => {
        e.preventDefault();
        const fileInput = container.querySelector('#staff-file');
        let photoUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        if (fileInput && fileInput.files && fileInput.files[0]) {
          photoUrl = await window.LykosDB.uploadAsset(fileInput.files[0]);
        }

        await window.LykosDB.saveStaff({
          name: container.querySelector('#staff-name').value,
          nickname: container.querySelector('#staff-nickname').value || '',
          role: container.querySelector('#staff-role').value,
          game: container.querySelector('#staff-game').value || 'Geral',
          photo_url: photoUrl
        });
        renderDashboard();
      };
    }

    container.querySelectorAll('.pop-edit-staff-btn').forEach(btn => {
      btn.onclick = () => {
        const st = data.staffMembers.find(s => String(s.id) === String(btn.getAttribute('data-id')));
        if (!st) return;

        const html = `
          <form>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Nome Completo</label><input type="text" id="pop-st-name" class="form-input" value="${st.name}" required></div>
              <div class="form-group"><label class="form-label">Nickname</label><input type="text" id="pop-st-nick" class="form-input" value="${st.nickname || ''}"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Cargo / Função</label><input type="text" id="pop-st-role" class="form-input" value="${st.role}" required></div>
              <div class="form-group"><label class="form-label">Modalidade / Setor</label><input type="text" id="pop-st-game" class="form-input" value="${st.game || 'Geral'}"></div>
            </div>
            <div class="form-group"><label class="form-label">Foto do Membro da Staff (Upload PC)</label><input type="file" id="pop-st-file" class="form-input" accept="image/*"></div>
            <div style="display: flex; gap: 10px; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Atualizar Staff &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Staff: ${st.name}`, html, async (form) => {
          const stFile = form.querySelector('#pop-st-file');
          let photoUrl = st.photo_url;
          if (stFile && stFile.files && stFile.files[0]) {
            photoUrl = await window.LykosDB.uploadAsset(stFile.files[0]);
          }

          await window.LykosDB.saveStaff({
            ...st,
            name: form.querySelector('#pop-st-name').value,
            nickname: form.querySelector('#pop-st-nick').value,
            role: form.querySelector('#pop-st-role').value,
            game: form.querySelector('#pop-st-game').value,
            photo_url: photoUrl
          });
        });
      };
    });

    container.querySelectorAll('.delete-staff-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deleteStaff(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });

    // 5. MODALIDADES HANDLERS
    const formModality = container.querySelector('#form-modality');
    if (formModality) {
      formModality.onsubmit = async (e) => {
        e.preventDefault();
        const fileInput = container.querySelector('#mod-file');
        let iconUrl = '';
        if (fileInput && fileInput.files && fileInput.files[0]) {
          iconUrl = await window.LykosDB.uploadAsset(fileInput.files[0]);
        }

        await window.LykosDB.saveModality({
          name: container.querySelector('#mod-name').value,
          description: container.querySelector('#mod-desc').value || '',
          icon_url: iconUrl
        });
        renderDashboard();
      };
    }

    container.querySelectorAll('.pop-edit-mod-btn').forEach(btn => {
      btn.onclick = () => {
        const mod = data.modalities.find(m => String(m.id) === String(btn.getAttribute('data-id')));
        if (!mod) return;

        const html = `
          <form>
            <div class="form-group"><label class="form-label">Nome da Modalidade</label><input type="text" id="pop-m-name" class="form-input" value="${mod.name}" required></div>
            <div class="form-group"><label class="form-label">Descrição</label><input type="text" id="pop-m-desc" class="form-input" value="${mod.description || ''}"></div>
            <div class="form-group"><label class="form-label">Ícone (Upload PC)</label><input type="file" id="pop-m-icon" class="form-input" accept="image/*"></div>
            <div style="display: flex; gap: 10px; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Atualizar Modalidade &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Modalidade: ${mod.name}`, html, async (form) => {
          const modFile = form.querySelector('#pop-m-icon');
          let iconUrl = mod.icon_url;
          if (modFile && modFile.files && modFile.files[0]) {
            iconUrl = await window.LykosDB.uploadAsset(modFile.files[0]);
          }

          await window.LykosDB.saveModality({
            ...mod,
            name: form.querySelector('#pop-m-name').value,
            description: form.querySelector('#pop-m-desc').value,
            icon_url: iconUrl
          });
        });
      };
    });

    container.querySelectorAll('.delete-mod-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deleteModality(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });

    // 6. CONQUISTAS (TROFÉUS) HANDLERS
    const formTrophy = container.querySelector('#form-trophy');
    if (formTrophy) {
      formTrophy.onsubmit = async (e) => {
        e.preventDefault();
        const fileInput = container.querySelector('#trophy-file');
        let imgUrl = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80';
        if (fileInput && fileInput.files && fileInput.files[0]) {
          imgUrl = await window.LykosDB.uploadAsset(fileInput.files[0]);
        }

        await window.LykosDB.saveTrophy({
          title: container.querySelector('#trophy-title').value,
          year: container.querySelector('#trophy-year').value,
          game: container.querySelector('#trophy-game').value,
          description: container.querySelector('#trophy-desc').value || '',
          image_url: imgUrl
        });
        renderDashboard();
      };
    }

    container.querySelectorAll('.pop-edit-trophy-btn').forEach(btn => {
      btn.onclick = () => {
        const tr = data.trophies.find(t => String(t.id) === String(btn.getAttribute('data-id')));
        if (!tr) return;

        const html = `
          <form>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Título da Conquista</label><input type="text" id="pop-t-title" class="form-input" value="${tr.title}" required></div>
              <div class="form-group"><label class="form-label">Ano do Título</label><input type="text" id="pop-t-year" class="form-input" value="${tr.year}" required></div>
              <div class="form-group">
                <label class="form-label">Modalidade</label>
                <select id="pop-t-game" class="form-select">${data.modalities.map(m => `<option value="${m.name}" ${tr.game === m.name ? 'selected' : ''}>${m.name}</option>`).join('')}</select>
              </div>
            </div>
            <div class="form-group"><label class="form-label">Histórico da Campanha</label><textarea id="pop-t-desc" class="form-textarea" rows="3">${tr.description || ''}</textarea></div>
            <div class="form-group"><label class="form-label">Foto do Troféu (Upload PC)</label><input type="file" id="pop-t-file" class="form-input" accept="image/*"></div>
            <div style="display: flex; gap: 10px; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Atualizar Conquista &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Conquista: ${tr.title}`, html, async (form) => {
          const trFile = form.querySelector('#pop-t-file');
          let imgUrl = tr.image_url;
          if (trFile && trFile.files && trFile.files[0]) {
            imgUrl = await window.LykosDB.uploadAsset(trFile.files[0]);
          }

          await window.LykosDB.saveTrophy({
            ...tr,
            title: form.querySelector('#pop-t-title').value,
            year: form.querySelector('#pop-t-year').value,
            game: form.querySelector('#pop-t-game').value,
            description: form.querySelector('#pop-t-desc').value,
            image_url: imgUrl
          });
        });
      };
    });

    container.querySelectorAll('.delete-trophy-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deleteTrophy(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });

    // 7. CAMPEONATOS RECENTES HANDLERS
    const formRecentTourn = container.querySelector('#form-recent-tournament');
    if (formRecentTourn) {
      formRecentTourn.onsubmit = async (e) => {
        e.preventDefault();
        await window.LykosDB.saveRecentTournament({
          name: container.querySelector('#rec-tourn-name').value,
          year: container.querySelector('#rec-tourn-year').value,
          placement: container.querySelector('#rec-tourn-placement').value,
          prize: container.querySelector('#rec-tourn-prize').value
        });
        renderDashboard();
      };
    }

    container.querySelectorAll('.pop-edit-recent-tourn-btn').forEach(btn => {
      btn.onclick = () => {
        const rt = data.recentTournaments.find(t => String(t.id) === String(btn.getAttribute('data-id')));
        if (!rt) return;

        const html = `
          <form>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Nome do Campeonato</label><input type="text" id="pop-rt-name" class="form-input" value="${rt.name}" required></div>
              <div class="form-group"><label class="form-label">Ano</label><input type="text" id="pop-rt-year" class="form-input" value="${rt.year}" required></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Colocação</label><input type="text" id="pop-rt-placement" class="form-input" value="${rt.placement}" required></div>
              <div class="form-group"><label class="form-label">Premiação / Detalhe</label><input type="text" id="pop-rt-prize" class="form-input" value="${rt.prize || ''}"></div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Atualizar Campeonato &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Campeonato Recente: ${rt.name}`, html, async (form) => {
          await window.LykosDB.saveRecentTournament({
            ...rt,
            name: form.querySelector('#pop-rt-name').value,
            year: form.querySelector('#pop-rt-year').value,
            placement: form.querySelector('#pop-rt-placement').value,
            prize: form.querySelector('#pop-rt-prize').value
          });
        });
      };
    });

    container.querySelectorAll('.delete-recent-tourn-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deleteRecentTournament(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });

    // 8. TORNEIOS (DIVULGAÇÃO) HANDLERS
    const formCommTourn = container.querySelector('#form-community-tournament');
    if (formCommTourn) {
      formCommTourn.onsubmit = async (e) => {
        e.preventDefault();
        const fileInput = container.querySelector('#comm-tourn-file');
        let bannerUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
        if (fileInput && fileInput.files && fileInput.files[0]) {
          bannerUrl = await window.LykosDB.uploadAsset(fileInput.files[0]);
        }

        await window.LykosDB.saveCommunityTournament({
          title: container.querySelector('#comm-tourn-title').value,
          game: container.querySelector('#comm-tourn-game').value,
          prize_pool: container.querySelector('#comm-tourn-prize').value,
          registration_url: container.querySelector('#comm-tourn-url').value,
          status: container.querySelector('#comm-tourn-status').value,
          description: container.querySelector('#comm-tourn-desc').value,
          banner_url: bannerUrl
        });
        renderDashboard();
      };
    }

    container.querySelectorAll('.pop-edit-comm-tourn-btn').forEach(btn => {
      btn.onclick = () => {
        const ct = data.communityTournaments.find(t => String(t.id) === String(btn.getAttribute('data-id')));
        if (!ct) return;

        const html = `
          <form>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Título</label><input type="text" id="pop-ct-title" class="form-input" value="${ct.title}" required></div>
              <div class="form-group"><label class="form-label">Premiação</label><input type="text" id="pop-ct-prize" class="form-input" value="${ct.prize_pool || ''}" required></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">URL de Inscrição</label><input type="url" id="pop-ct-url" class="form-input" value="${ct.registration_url || ''}"></div>
              <div class="form-group">
                <label class="form-label">Status</label>
                <select id="pop-ct-status" class="form-select">
                  <option value="Inscrições Abertas" ${ct.status === 'Inscrições Abertas' ? 'selected' : ''}>Inscrições Abertas</option>
                  <option value="Em Andamento" ${ct.status === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
                  <option value="Encerrado" ${ct.status === 'Encerrado' ? 'selected' : ''}>Encerrado</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label class="form-label">Descrição</label><textarea id="pop-ct-desc" class="form-textarea" rows="3">${ct.description || ''}</textarea></div>
            <div style="display: flex; gap: 10px; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Atualizar Torneio &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Torneio: ${ct.title}`, html, async (form) => {
          await window.LykosDB.saveCommunityTournament({
            ...ct,
            title: form.querySelector('#pop-ct-title').value,
            prize_pool: form.querySelector('#pop-ct-prize').value,
            registration_url: form.querySelector('#pop-ct-url').value,
            status: form.querySelector('#pop-ct-status').value,
            description: form.querySelector('#pop-ct-desc').value
          });
        });
      };
    });

    container.querySelectorAll('.delete-comm-tourn-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deleteCommunityTournament(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });

    // 9. PÁGINA SOBRE HANDLER
    const formAbout = container.querySelector('#form-about');
    if (formAbout) {
      formAbout.onsubmit = async (e) => {
        e.preventDefault();
        const fileInput = container.querySelector('#about-image-file');
        let imgUrl = data.aboutSettings.about_image_url;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          imgUrl = await window.LykosDB.uploadAsset(fileInput.files[0]);
        }

        await window.LykosDB.saveAboutSettings({
          history_text: container.querySelector('#about-history').value,
          mission_text: container.querySelector('#about-mission').value,
          stat_trophies: container.querySelector('#about-stat-trophies').value,
          stat_winrate: container.querySelector('#about-stat-winrate').value,
          stat_community: container.querySelector('#about-stat-community').value,
          about_image_url: imgUrl
        });
        renderDashboard();
      };
    }

    // 10. GALERIA HANDLERS
    const formGallery = container.querySelector('#form-gallery');
    if (formGallery) {
      formGallery.onsubmit = async (e) => {
        e.preventDefault();
        const fileInput = container.querySelector('#gal-file');
        let imgUrl = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80';
        if (fileInput && fileInput.files && fileInput.files[0]) {
          imgUrl = await window.LykosDB.uploadAsset(fileInput.files[0]);
        }

        await window.LykosDB.saveGalleryItem({
          title: container.querySelector('#gal-title').value,
          category: container.querySelector('#gal-category').value,
          description: container.querySelector('#gal-desc').value || '',
          image_url: imgUrl
        });
        renderDashboard();
      };
    }

    container.querySelectorAll('.pop-edit-gallery-btn').forEach(btn => {
      btn.onclick = () => {
        const g = data.gallery.find(item => String(item.id) === String(btn.getAttribute('data-id')));
        if (!g) return;

        const html = `
          <form>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group"><label class="form-label">Título da Foto</label><input type="text" id="pop-g-title" class="form-input" value="${g.title}" required></div>
              <div class="form-group">
                <label class="form-label">Categoria</label>
                <select id="pop-g-cat" class="form-select">
                  <option value="Campeonatos" ${g.category === 'Campeonatos' ? 'selected' : ''}>Campeonatos</option>
                  <option value="Bastidores" ${g.category === 'Bastidores' ? 'selected' : ''}>Bastidores</option>
                  <option value="Eventos" ${g.category === 'Eventos' ? 'selected' : ''}>Eventos</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label class="form-label">Descrição</label><textarea id="pop-g-desc" class="form-textarea" rows="2">${g.description || ''}</textarea></div>
            <div class="form-group"><label class="form-label">Nova Foto (Upload PC)</label><input type="file" id="pop-g-file" class="form-input" accept="image/*"></div>
            <div style="display: flex; gap: 10px; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Atualizar Imagem &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Foto da Galeria: ${g.title}`, html, async (form) => {
          const gFile = form.querySelector('#pop-g-file');
          let imgUrl = g.image_url;
          if (gFile && gFile.files && gFile.files[0]) {
            imgUrl = await window.LykosDB.uploadAsset(gFile.files[0]);
          }

          await window.LykosDB.saveGalleryItem({
            ...g,
            title: form.querySelector('#pop-g-title').value,
            category: form.querySelector('#pop-g-cat').value,
            description: form.querySelector('#pop-g-desc').value,
            image_url: imgUrl
          });
        });
      };
    });

    container.querySelectorAll('.delete-gallery-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deleteGalleryItem(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });

    // 11. REDES SOCIAIS HANDLERS
    const formSocial = container.querySelector('#form-social');
    if (formSocial) {
      formSocial.onsubmit = async (e) => {
        e.preventDefault();
        await window.LykosDB.saveSocialFeed({
          platform: container.querySelector('#social-platform').value,
          title: container.querySelector('#social-title').value,
          embed_url: container.querySelector('#social-embed-url').value,
          post_url: container.querySelector('#social-post-url').value
        });
        renderDashboard();
      };
    }

    container.querySelectorAll('.pop-edit-social-btn').forEach(btn => {
      btn.onclick = () => {
        const s = data.socialFeeds.find(item => String(item.id) === String(btn.getAttribute('data-id')));
        if (!s) return;

        const html = `
          <form>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Plataforma</label>
                <select id="pop-s-platform" class="form-select">
                  <option value="instagram" ${s.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                  <option value="x" ${s.platform === 'x' ? 'selected' : ''}>X (Twitter)</option>
                  <option value="tiktok" ${s.platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
                  <option value="youtube" ${s.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                  <option value="twitch" ${s.platform === 'twitch' ? 'selected' : ''}>Twitch</option>
                  <option value="facebook" ${s.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                  <option value="discord" ${s.platform === 'discord' ? 'selected' : ''}>Discord</option>
                  <option value="linkedin" ${s.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                </select>
              </div>
              <div class="form-group"><label class="form-label">Título da Publicação</label><input type="text" id="pop-s-title" class="form-input" value="${s.title}" required></div>
            </div>
            <div class="form-group">
              <label class="form-label">Código de Embed (Cole o Bloco &lt;blockquote...&gt;, &lt;iframe...&gt; ou URL)</label>
              <textarea id="pop-s-embed" class="form-textarea" rows="4" required>${s.embed_url || ''}</textarea>
            </div>
            <div class="form-group"><label class="form-label">URL Direta do Post Original (Opcional)</label><input type="url" id="pop-s-post" class="form-input" value="${s.post_url || ''}"></div>
            <div style="display: flex; gap: 10px; margin-top: 1rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Atualizar Rede Social &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Rede Social: ${s.title}`, html, async (form) => {
          await window.LykosDB.saveSocialFeed({
            ...s,
            platform: form.querySelector('#pop-s-platform').value,
            title: form.querySelector('#pop-s-title').value,
            embed_url: form.querySelector('#pop-s-embed').value,
            post_url: form.querySelector('#pop-s-post').value
          });
        });
      };
    });

    container.querySelectorAll('.delete-social-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deleteSocialFeed(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });

    // 12. BRANDING HANDLER
    const btnAddContactSocial = container.querySelector('#btn-add-contact-social');
    const contactSocialsList = container.querySelector('#brand-contact-socials-list');
    if (btnAddContactSocial && contactSocialsList) {
      btnAddContactSocial.onclick = (e) => {
        e.preventDefault();
        const row = document.createElement('div');
        row.className = 'brand-social-row';
        row.style.cssText = 'background: var(--bg-dark-surface); border: 1px solid var(--border-dark); padding: 8px 10px; border-radius: 4px; display: grid; grid-template-columns: 1fr 1fr 2fr auto; gap: 8px; align-items: center; margin-top: 8px;';
        row.innerHTML = `
          <input type="text" class="form-input brand-soc-name" placeholder="Nome (Ex: TikTok)" required>
          <select class="form-select brand-soc-platform">
            <option value="discord">Discord</option>
            <option value="instagram">Instagram</option>
            <option value="x">X (Twitter)</option>
            <option value="tiktok" selected>TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="twitch">Twitch</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          <input type="url" class="form-input brand-soc-url" placeholder="URL Direta (https://...)" required>
          <button type="button" class="btn-danger remove-social-row-btn" style="padding: 4px 8px; font-size: 0.75rem; height: 36px;" title="Remover Rede">&times;</button>
        `;
        contactSocialsList.appendChild(row);

        row.querySelector('.remove-social-row-btn').onclick = () => row.remove();
      };

      contactSocialsList.querySelectorAll('.remove-social-row-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          const row = btn.closest('.brand-social-row');
          if (row) row.remove();
        };
      });
    }

    const formBranding = container.querySelector('#form-branding');
    if (formBranding) {
      const setupPreview = (fileId, urlId, previewId) => {
        const fileInp = container.querySelector('#' + fileId);
        const urlInp = container.querySelector('#' + urlId);
        const imgPrev = container.querySelector('#' + previewId);
        if (fileInp && imgPrev) {
          fileInp.onchange = () => {
            if (fileInp.files && fileInp.files[0]) {
              const reader = new FileReader();
              reader.onload = (ev) => { imgPrev.src = ev.target.result; };
              reader.readAsDataURL(fileInp.files[0]);
            }
          };
        }
        if (urlInp && imgPrev) {
          urlInp.oninput = () => {
            if (urlInp.value.trim()) imgPrev.src = urlInp.value.trim();
          };
        }
      };

      setupPreview('brand-logo-file', 'brand-logo-url', 'brand-logo-preview');
      setupPreview('brand-header-logo-file', 'brand-header-logo-url', 'brand-header-logo-preview');
      setupPreview('brand-favicon-file', 'brand-favicon-url', 'brand-favicon-preview');

      formBranding.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = formBranding.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Salvando Alterações...';
        }

        try {
          const logoFile = container.querySelector('#brand-logo-file');
          const logoUrlInp = container.querySelector('#brand-logo-url');
          let logoUrl = data.settings.logo_url;
          if (logoFile && logoFile.files && logoFile.files[0]) {
            logoUrl = await window.LykosDB.uploadAsset(logoFile.files[0]);
          } else if (logoUrlInp && logoUrlInp.value.trim()) {
            logoUrl = logoUrlInp.value.trim();
          }

          const headerLogoFile = container.querySelector('#brand-header-logo-file');
          const headerLogoUrlInp = container.querySelector('#brand-header-logo-url');
          let headerLogoUrl = data.settings.header_logo_url;
          if (headerLogoFile && headerLogoFile.files && headerLogoFile.files[0]) {
            headerLogoUrl = await window.LykosDB.uploadAsset(headerLogoFile.files[0]);
          } else if (headerLogoUrlInp && headerLogoUrlInp.value.trim()) {
            headerLogoUrl = headerLogoUrlInp.value.trim();
          }

          const faviconFile = container.querySelector('#brand-favicon-file');
          const faviconUrlInp = container.querySelector('#brand-favicon-url');
          let faviconUrl = data.settings.favicon_url;
          if (faviconFile && faviconFile.files && faviconFile.files[0]) {
            faviconUrl = await window.LykosDB.uploadAsset(faviconFile.files[0]);
          } else if (faviconUrlInp && faviconUrlInp.value.trim()) {
            faviconUrl = faviconUrlInp.value.trim();
          }

          const showTournaments = container.querySelector('#brand-show-tournaments-tab').checked;

          const contactSocials = [];
          container.querySelectorAll('.brand-social-row').forEach(row => {
            const name = row.querySelector('.brand-soc-name').value;
            const platform = row.querySelector('.brand-soc-platform').value;
            const url = row.querySelector('.brand-soc-url').value;
            if (name && url) {
              contactSocials.push({ name, platform, url });
            }
          });

          const newSettings = {
            ...data.settings,
            team_name: container.querySelector('#brand-team-name').value,
            primary_color: container.querySelector('#brand-primary-color').value,
            hero_title: container.querySelector('#brand-hero-title').value.trim() || data.settings.hero_title,
            hero_subtitle: container.querySelector('#brand-hero-subtitle').value.trim() || data.settings.hero_subtitle,
            logo_url: logoUrl,
            header_logo_url: headerLogoUrl,
            favicon_url: faviconUrl,
            show_tournaments_tab: showTournaments,
            contact_socials_json: contactSocials,
            discord_url: contactSocials.find(s => s.platform === 'discord')?.url || data.settings.discord_url,
            instagram_url: contactSocials.find(s => s.platform === 'instagram')?.url || data.settings.instagram_url
          };

          await window.LykosDB.saveSettings(newSettings);

          alert('✓ Configurações de marca e Favicon salvas com sucesso!');
          renderDashboard();
        } catch (err) {
          console.error('[Admin] Error saving branding settings:', err);
          alert('Erro ao salvar configurações de marca: ' + err.message);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Salvar Configurações de Marca →';
          }
        }
      };
    }

    // 13. GESTÃO DE USUÁRIOS & PERMISSÕES HANDLERS
    const btnGenPass = container.querySelector('#btn-generate-password');
    const inputPass = container.querySelector('#new-user-password');
    const btnTogglePass = container.querySelector('#btn-toggle-show-pass');
    const btnCopyPass = container.querySelector('#btn-copy-password');

    if (btnGenPass && inputPass) {
      btnGenPass.onclick = (e) => {
        e.preventDefault();
        const newPass = generateStrongPassword(16);
        inputPass.value = newPass;
      };
    }

    if (btnTogglePass && inputPass) {
      btnTogglePass.onclick = (e) => {
        e.preventDefault();
        if (inputPass.type === 'password') {
          inputPass.type = 'text';
          btnTogglePass.innerText = 'Ocultar Senha';
        } else {
          inputPass.type = 'password';
          btnTogglePass.innerText = 'Ver Senha';
        }
      };
    }

    if (btnCopyPass && inputPass) {
      btnCopyPass.onclick = async (e) => {
        e.preventDefault();
        if (!inputPass.value) {
          alert('Por favor, gere uma senha primeiro clicando em "Gerar Senha (16 Caracteres)".');
          return;
        }
        try {
          await navigator.clipboard.writeText(inputPass.value);
          alert('Senha de 16 caracteres copiada para a área de transferência com sucesso!');
        } catch (err) {
          inputPass.select();
          document.execCommand('copy');
          alert('Senha de 16 caracteres copiada para a área de transferência com sucesso!');
        }
      };
    }

    const btnCheckAll = container.querySelector('#btn-check-all-perm');
    const btnUncheckAll = container.querySelector('#btn-uncheck-all-perm');
    if (btnCheckAll && btnUncheckAll) {
      btnCheckAll.onclick = (e) => {
        e.preventDefault();
        container.querySelectorAll('.user-perm-checkbox').forEach(cb => cb.checked = true);
      };
      btnUncheckAll.onclick = (e) => {
        e.preventDefault();
        container.querySelectorAll('.user-perm-checkbox').forEach(cb => cb.checked = false);
      };
    }

    const formCreateUser = container.querySelector('#form-create-user');
    if (formCreateUser) {
      formCreateUser.onsubmit = async (e) => {
        e.preventDefault();
        const email = container.querySelector('#new-user-email').value;
        const fullName = container.querySelector('#new-user-name').value;
        const password = container.querySelector('#new-user-password').value;

        if (!password) {
          alert('Por favor, clique em "Gerar Senha (16 Caracteres)" para criar a senha do usuário.');
          return;
        }

        const selectedPermissions = [];
        container.querySelectorAll('.user-perm-checkbox:checked').forEach(cb => {
          selectedPermissions.push(cb.value);
        });

        await window.LykosDB.saveUser({
          email,
          fullName,
          password,
          permissions: selectedPermissions,
          is_master: false
        });

        renderDashboard();
      };
    }

    const btnClearLogs = container.querySelector('#btn-clear-login-logs');
    if (btnClearLogs) {
      btnClearLogs.onclick = async () => {
        if (confirm('Tem certeza de que deseja limpar todo o histórico de logs de login?')) {
          await window.LykosDB.clearLoginLogs();
          renderDashboard();
        }
      };
    }

    const availablePermissions = [
      { id: 'partidas', label: 'Partidas & Súmulas K/D' },
      { id: 'torneios', label: 'Divulgação de Torneios' },
      { id: 'elenco', label: 'Elenco & Setup Pro-Players' },
      { id: 'staff', label: 'Comissão Técnica & Staff' },
      { id: 'modalidades', label: 'Modalidades (Games)' },
      { id: 'trophies', label: 'Conquistas & Troféus' },
      { id: 'recentTournaments', label: 'Campeonatos Recentes' },
      { id: 'about', label: 'Página Sobre a LYKOS' },
      { id: 'galeria', label: 'Galeria de Fotos' },
      { id: 'social', label: 'Redes Sociais & Feeds' },
      { id: 'branding', label: 'Logos & Marca' },
      { id: 'roles', label: 'Gestão de Usuários & Permissões (Master)' }
    ];

    container.querySelectorAll('.pop-edit-user-btn').forEach(btn => {
      btn.onclick = () => {
        const userToEdit = data.users.find(u => String(u.id) === String(btn.getAttribute('data-id')));
        if (!userToEdit) return;

        const userPerms = userToEdit.permissions || [];

        const html = `
          <form id="popup-edit-user-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label class="form-label">E-mail (Login)</label>
                <input type="email" id="pop-u-email" class="form-input" value="${userToEdit.email}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Nome Completo</label>
                <input type="text" id="pop-u-name" class="form-input" value="${userToEdit.fullName || ''}" required>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label">Senha de Acesso (Gerada)</label>
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <input type="password" id="pop-u-password" class="form-input" readonly value="${userToEdit.password || ''}" required style="flex: 1; min-width: 180px; font-family: monospace; font-size: 1rem; font-weight: 700; letter-spacing: 0.15em; background: rgba(0,0,0,0.15);">
                <button type="button" id="pop-btn-toggle-pass" class="btn-secondary" style="padding: 10px 12px; font-size: 0.8rem;">Ver Senha</button>
                <button type="button" id="pop-btn-gen-pass" class="btn-secondary" style="padding: 10px 14px; font-size: 0.8rem; white-space: nowrap;">
                  Nova Senha (16 Chars)
                </button>
                <button type="button" id="pop-btn-copy-pass" class="btn-edit" style="padding: 10px 14px; font-size: 0.8rem; white-space: nowrap;">
                  Copiar Senha
                </button>
              </div>
            </div>

            <div style="background: rgba(157,80,255,0.05); border: 1px solid var(--border-dark-strong); padding: 1.25rem; border-radius: var(--radius-xs); margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.85rem; color: var(--accent-neon); text-transform: uppercase; margin-bottom: 0.85rem;">Alterar Permissões Concedidas</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                ${availablePermissions.map(p => `
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: white; cursor: pointer; background: var(--bg-dark-surface); padding: 8px 10px; border-radius: 4px; border: 1px solid var(--border-dark);">
                    <input type="checkbox" class="pop-user-perm-cb" value="${p.id}" ${userToEdit.is_master || userPerms.includes(p.id) ? 'checked' : ''} style="accent-color: var(--accent-neon); width: 16px; height: 16px;">
                    ${p.label}
                  </label>
                `).join('')}
              </div>
            </div>

            <div style="display: flex; gap: 10px;">
              <button type="submit" class="btn-primary" style="flex: 1;">Salvar Permissões & Senha &rarr;</button>
              <button type="button" class="btn-secondary cancel-pop-btn">Cancelar</button>
            </div>
          </form>
        `;

        openUniversalModal(`Editar Usuário: ${userToEdit.email}`, html, async (form) => {
          const editedPerms = [];
          form.querySelectorAll('.pop-user-perm-cb:checked').forEach(cb => editedPerms.push(cb.value));

          await window.LykosDB.saveUser({
            ...userToEdit,
            email: form.querySelector('#pop-u-email').value,
            fullName: form.querySelector('#pop-u-name').value,
            password: form.querySelector('#pop-u-password').value,
            permissions: editedPerms
          });
        });

        setTimeout(() => {
          const modalBackdrop = document.querySelector('.modal-backdrop');
          if (!modalBackdrop) return;
          const popGenBtn = modalBackdrop.querySelector('#pop-btn-gen-pass');
          const popPassInput = modalBackdrop.querySelector('#pop-u-password');
          const popToggleBtn = modalBackdrop.querySelector('#pop-btn-toggle-pass');
          const popCopyBtn = modalBackdrop.querySelector('#pop-btn-copy-pass');

          if (popGenBtn && popPassInput) {
            popGenBtn.onclick = (e) => {
              e.preventDefault();
              popPassInput.value = generateStrongPassword(16);
            };
          }
          if (popToggleBtn && popPassInput) {
            popToggleBtn.onclick = (e) => {
              e.preventDefault();
              popToggleBtn.innerText = popPassInput.type === 'password' ? 'Ocultar Senha' : 'Ver Senha';
              popPassInput.type = popPassInput.type === 'password' ? 'text' : 'password';
            };
          }
          if (popCopyBtn && popPassInput) {
            popCopyBtn.onclick = async (e) => {
              e.preventDefault();
              try {
                await navigator.clipboard.writeText(popPassInput.value);
                alert('Senha copiada com sucesso!');
              } catch (err) {
                popPassInput.select();
                document.execCommand('copy');
                alert('Senha copiada com sucesso!');
              }
            };
          }
        }, 50);
      };
    });

    container.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.onclick = () => promptDeletion(btn.getAttribute('data-title'), async () => {
        await window.LykosDB.deleteUser(btn.getAttribute('data-id'));
        renderDashboard();
      });
    });
  }

  renderDashboard();
};
