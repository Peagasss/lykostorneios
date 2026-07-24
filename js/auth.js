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

      // Lookup user in DB
      const users = window.LykosDB ? await window.LykosDB.getUsers() : JSON.parse(localStorage.getItem('lykos_users') || '[]');
      const user = users.find(u => u.email && u.email.toLowerCase().trim() === normEmail && u.password === normPass);

      if (!user) {
        throw new Error('E-mail ou senha incorretos.');
      }

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
