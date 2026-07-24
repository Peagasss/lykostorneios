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

  window.LykosAuth = {
    getCurrentUser() {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
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
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(masterUser));
        if (window.LykosDB && window.LykosDB.addLoginLog) {
          await window.LykosDB.addLoginLog({
            id: 'log_' + Date.now(),
            user_email: masterUser.email,
            user_name: masterUser.fullName,
            timestamp: new Date().toISOString()
          });
        }
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
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        // Fire log in background
        if (window.LykosDB && window.LykosDB.addLoginLog) {
          window.LykosDB.addLoginLog({
            id: 'log_' + Date.now(),
            user_email: user.email,
            user_name: user.fullName || user.email,
            timestamp: new Date().toISOString()
          }).catch(() => {});
        }
        window.dispatchEvent(new CustomEvent('lykos_auth_changed', { detail: user }));
        return user;
      }

      // 2. Fast network lookup with 1.5s timeout (for accounts created on other devices)
      const fetchApiPromise = (async () => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 1500);
          const apiRes = await fetch('/api/login', {
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

        // Fallback direct Supabase SDK
        const config = window.LYKOS_CONFIG || {};
        if (config.SUPABASE_URL && config.SUPABASE_ANON_KEY && window.supabase) {
          try {
            const sb = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
            const { data } = await sb.from('app_users').select('*').ilike('email', normEmail).maybeSingle();
            if (data && data.password === normPass) return data;
          } catch (e) {}
        }
        return null;
      })();

      user = await fetchApiPromise;

      if (!user) {
        throw new Error('E-mail ou senha incorretos.');
      }

      if (!user.permissions) {
        user.permissions = user.is_master ? ALL_PERMISSIONS : ['partidas'];
      }

      // Sync local list
      localUsers.push(user);
      localStorage.setItem('lykos_users', JSON.stringify(localUsers));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      if (window.LykosDB && window.LykosDB.addLoginLog) {
        window.LykosDB.addLoginLog({
          id: 'log_' + Date.now(),
          user_email: user.email,
          user_name: user.fullName || user.email,
          timestamp: new Date().toISOString()
        }).catch(() => {});
      }

      window.dispatchEvent(new CustomEvent('lykos_auth_changed', { detail: user }));
      return user;

      // Ensure user permissions array exists
      if (!user.permissions) {
        user.permissions = user.is_master ? ALL_PERMISSIONS : ['partidas'];
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      if (window.LykosDB && window.LykosDB.addLoginLog) {
        await window.LykosDB.addLoginLog({
          id: 'log_' + Date.now(),
          user_email: user.email,
          user_name: user.fullName || user.email,
          timestamp: new Date().toISOString()
        });
      }
      window.dispatchEvent(new CustomEvent('lykos_auth_changed', { detail: user }));
      return user;
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
