/* ==========================================================================
   LYKOS E-SPORTS - CLIENT SIDE SPA ROUTER (Fail-Safe Error Handler)
   Routes: #/, #/sobre, #/elenco, #/partidas, #/partidas/:id, #/galeria, #/contato, #/admin
   ========================================================================== */

(function () {
  class Router {
    constructor() {
      this.routes = [];
      this.currentRoute = null;
      window.addEventListener('hashchange', () => this.handleRoute());
    }

    addRoute(pattern, renderFunc) {
      const paramNames = [];
      const regexPath = pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      });

      const regex = new RegExp(`^${regexPath}$`);
      this.routes.push({ pattern, regex, paramNames, renderFunc });
    }

    async handleRoute() {
      try {
        let hash = window.location.hash.slice(1) || '/';
        if (!hash.startsWith('/')) hash = '/' + hash;

        const appContainer = document.getElementById('app-content');
        if (!appContainer) return;

        window.scrollTo(0, 0);

        for (const route of this.routes) {
          const match = hash.match(route.regex);
          if (match) {
            const params = {};
            route.paramNames.forEach((name, index) => {
              params[name] = match[index + 1];
            });

            this.currentRoute = hash;
            this.updateActiveNavLinks(hash);
            await route.renderFunc(appContainer, params);
            return;
          }
        }

        // Default fallback to home if route not found
        this.updateActiveNavLinks('/');
        const homeRoute = this.routes.find(r => r.pattern === '/');
        if (homeRoute) await homeRoute.renderFunc(appContainer, {});
      } catch (err) {
        console.error('[LykosRouter] Render error:', err);
        const appContainer = document.getElementById('app-content');
        if (appContainer) {
          appContainer.innerHTML = `
            <section class="section-dark-1" style="padding-top: 140px; text-align: center;">
              <div class="container" style="max-width: 500px;">
                <h2 style="font-size: 1.6rem; color: #ff4d4d;">Recuperação do Sistema</h2>
                <p style="color: var(--text-muted-light); margin: 1rem 0;">Ocorreu um erro temporário durante o carregamento da visualização.</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                  <button onclick="window.location.reload()" class="btn-primary">Recarregar Página</button>
                  <button onclick="localStorage.clear(); window.location.reload()" class="btn-secondary">Restaurar Dados Iniciais</button>
                </div>
              </div>
            </section>
          `;
        }
      }
    }

    updateActiveNavLinks(hash) {
      const links = document.querySelectorAll('.nav-link');
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        const targetRoute = href.replace('#', '');
        if (hash === targetRoute || (targetRoute !== '/' && hash.startsWith(targetRoute))) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    navigate(path) {
      window.location.hash = path;
    }
  }

  window.LykosRouter = new Router();
})();
