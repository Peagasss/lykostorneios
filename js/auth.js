/* ==========================================================================
   LYKOS E-SPORTS - AUTHENTICATION & GRANULAR PERMISSIONS
   ========================================================================== */

(function () {
  const CURRENT_USER_KEY = 'lykos_current_user';

  const ALL_PERMISSIONS = [
    'partidas', 'torneios', 'elenco', 'staff',
    'modalidades', 'trophies', 'recentTournaments',
    'about', 'galeria', 'social', 'branding', 'roles'
  ];

  const SESSION_EXPIRY_HOURS = 8;

  window.LykosAuth = {
    getCurrentUser() {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        // Check token expiry
        if (parsed._expiresAt && Date.now() > parsed._expiresAt) {
          localStorage.removeItem(CURRENT_USER_KEY);
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    },

    _saveSession(user) {
      const session = { ...user, _expiresAt: Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000 };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
      return session;
    },

    async login(email, password) {
      const normEmail = (email || '').toLowerCase().trim();
      const normPass = (password || '').trim();
      
      // Always allow master admin login fallback
      if (normEmail === 'admin@lykos-esports.com' && normPass === 'admin123') {
        const masterUser = {
          id: 'master-admin',
          email: 'admin@lykos-esports.com',
          fullName: 'Administrador Master',
          role: 'admin',
          is_master: true,
          permissions: ALL_PERMISSIONS,
          password: 'admin123'
        };
        this._saveSession(masterUser);
        this._recordLog(masterUser);
        window.dispatchEvent(new CustomEvent('lykos_auth_changed', { detail: masterUser }));
        return masterUser;
      }

      // 1. Fast local check (0ms)
      const rawLocal = localStorage.getItem('lykos_users');
      const localUsers = safeParse(rawLocal, DEFAULT_USERS);
      let user = localUsers.find(u => u && u.email && u.email.toLowerCase().trim() === normEmail && u.password === normPass);

      if (user) {
        if (!user.permissions) {
          user.permissions = user.is_master ? ALL_PERMISSIONS : ['partidas'];
        }
        this._saveSession(user);
        this._recordLog(user);
        window.dispatchEvent(new CustomEvent('lykos_auth_changed', { detail: user }));
        return user;
      }

      // 2. Ultra-fast network lookup with 1200ms max timeout (for accounts created on other devices)
      const fetchApiPromise = (async () => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 1200);
          const baseUrl = (window.LYKOS_CONFIG && window.LYKOS_CONFIG.API_BASE_URL) || '';
          const apiRes = await fetch(`${baseUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: normEmail, password: normPass }),
            signal: controller.signal
          }).catch(() => null);
          clearTimeout(timer);

          if (apiRes && apiRes.ok) {
            const resData = await apiRes.json();
            if (resData && resData.user) return resData.user;
          }
        } catch (e) {}
        return null;
      })();

      user = await fetchApiPromise;

      if (!user) throw new Error('E-mail ou senha incorretos.');

      if (!user.permissions) {
        user.permissions = user.is_master ? ALL_PERMISSIONS : ['partidas'];
      }

      // Sync local list
      localUsers.push(user);
      localStorage.setItem('lykos_users', JSON.stringify(localUsers));
      this._saveSession(user);
      this._recordLog(user);
      window.dispatchEvent(new CustomEvent('lykos_auth_changed', { detail: user }));
      return user;
    },

    _recordLog(user) {
      const log = {
        id: 'log_' + Date.now(),
        user_email: user.email,
        user_name: user.fullName || user.email,
        timestamp: new Date().toISOString()
      };
      // Save to localStorage
      const raw = localStorage.getItem('lykos_login_logs');
      const logs = raw ? JSON.parse(raw) : [];
      logs.unshift(log);
      localStorage.setItem('lykos_login_logs', JSON.stringify(logs.slice(0, 200)));
      // Save to Azure Postgres in background
      const baseUrl = (window.LYKOS_CONFIG && window.LYKOS_CONFIG.API_BASE_URL) || '';
      fetch(`${baseUrl}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'login_logs', item: log })
      }).catch(() => {});
    },

    logout() {
      localStorage.removeItem(CURRENT_USER_KEY);
      window.dispatchEvent(new CustomEvent('lykos_auth_changed', { detail: null }));
    },

    isMaster() {
      const user = this.getCurrentUser();
      return user && (user.is_master || (user.permissions && user.permissions.includes('roles')));
    }
  };
})();
