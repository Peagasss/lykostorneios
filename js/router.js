/* ==========================================================================
   LYKOS E-SPORTS - CLIENT SIDE SPA ROUTER (HTML5 History API + Hash Fallback)
   Clean URLs: /sobre, /elenco, /partidas, /partidas/:id, /galeria, /contato, /admin
   ========================================================================== */

(function () {
  class Router {
    constructor() {
      this.routes = [];
      this.currentRoute = null;

      // Handle back / forward browser navigation
      window.addEventListener('popstate', () => this.handleRoute());
      window.addEventListener('hashchange', () => this.handleRoute());

      // Intercept anchor click navigation for clean URLs
      document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href) return;

        // Clean link click (e.g., href="/sobre" or href="#/sobre")
        if (href.startsWith('/') || href.startsWith('#/')) {
          e.preventDefault();
          const targetPath = href.startsWith('#') ? href.slice(1) : href;
          this.navigate(targetPath);
        }
      });
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

    getPath() {
      // Prefer clean pathname, fallback to hash if present or protocol is file:
      if (window.location.protocol === 'file:') {
        if (window.location.hash && window.location.hash.startsWith('#/')) {
          return window.location.hash.slice(1);
        }
        return '/';
      }
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        return window.location.hash.slice(1);
      }
      let pathname = window.location.pathname || '/';
      if (!pathname.startsWith('/')) pathname = '/' + pathname;
      return pathname;
    }

    navigate(path) {
      if (!path.startsWith('/')) path = '/' + path;
      if (window.location.protocol === 'file:') {
        window.location.hash = '#' + path;
        return;
      }
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      this.handleRoute();
    }

    async handleRoute() {
      try {
        let path = this.getPath();

        const appContainer = document.getElementById('app-content');
        if (!appContainer) return;

        const isRouteChange = this.currentRoute !== path;

        for (const route of this.routes) {
          const match = path.match(route.regex);
          if (match) {
            const params = {};
            route.paramNames.forEach((name, index) => {
              params[name] = match[index + 1];
            });

            if (path.startsWith('/admin')) {
              document.body.classList.add('admin-body');
            } else {
              document.body.classList.remove('admin-body');
            }

            if (isRouteChange) {
              window.scrollTo(0, 0);
            }

            this.currentRoute = path;
            this.updateActiveNavLinks(path);
            await route.renderFunc(appContainer, params);
            return;
          }
        }

        // Default fallback to home if route not found
        if (isRouteChange) window.scrollTo({ top: 0, behavior: 'instant' });
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

    updateActiveNavLinks(currentPath) {
      const links = document.querySelectorAll('.site-header .nav-link, .nav-menu .nav-link');
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        const targetRoute = href.replace('#', '');
        if (currentPath === targetRoute || (targetRoute !== '/' && targetRoute !== '' && currentPath.startsWith(targetRoute))) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

  }

  window.LykosRouter = new Router();
})();
