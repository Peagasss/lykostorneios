/* ==========================================================================
   LYKOS E-SPORTS - CONTATO PAGE COMPONENT (With EmailJS Integration)
   ========================================================================== */

const EMAILJS_PUBLIC_KEY  = 'guFkdeIGlHSDn19ev';
const EMAILJS_SERVICE_ID  = 'service_k4xw3fd';
const EMAILJS_TEMPLATE_ID = 'template_qbd8a6j';

window.renderContatoPage = async function (container) {
  const settings = await window.LykosDB.getSettings();

  const socials = (settings.contact_socials_json && settings.contact_socials_json.length > 0)
    ? settings.contact_socials_json
    : [
        { name: 'Discord', url: settings.discord_url || 'https://discord.gg/lykosesports' },
        { name: 'Instagram', url: settings.instagram_url || 'https://instagram.com' },
        { name: 'X (Twitter)', url: settings.x_url || 'https://x.com' }
      ];

  container.innerHTML = `
    <section class="section-dark-1" style="padding-top: 140px; padding-bottom: 4rem; position: relative; overflow: hidden;">
      <div class="hero-glow-arc-container">
        <div class="hero-glow-arc-bg" style="width: 800px; height: 400px; top: -160px;"></div>
      </div>

      <div class="container" style="max-width: 900px; position: relative; z-index: 2;">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <div class="section-title-badge" style="margin: 0 auto 10px auto;">CANAIS OFICIAIS DE COMUNICAÇÃO</div>
          <h1 class="section-heading" style="font-size: 3rem; margin-bottom: 0.5rem;">Fale com a <span style="color: var(--accent-neon);">LYKOS</span></h1>
          <p class="section-subtitle" style="margin: 0 auto; max-width: 650px;">
            Junte-se à nossa comunidade no Discord oficial ou envie-nos um e-mail diretamente.
          </p>
        </div>

        <!-- 1. PRIORIDADE MÁXIMA: HERO DISCORD BANNER (DESTAQUE PRINCIPAL) -->
        <div class="glass-card" style="padding: 3rem 2.5rem; border: none; border-radius: var(--radius-md); text-align: center; margin-bottom: 2.5rem; background: linear-gradient(135deg, rgba(88,101,242,0.28) 0%, rgba(14,11,26,0.95) 100%); position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          <div style="position: absolute; top: -60px; right: -60px; width: 250px; height: 250px; background: rgba(88,101,242,0.3); filter: blur(60px); border-radius: 50%; pointer-events: none;"></div>

          <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: #5865F2; border-radius: 18px; margin-bottom: 1.25rem; box-shadow: 0 10px 25px rgba(88,101,242,0.5);">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          </div>

          <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: white; margin-bottom: 10px;">DISCORD OFICIAL DA LYKOS</h2>
          <p style="color: rgba(255,255,255,0.85); font-size: 1rem; max-width: 620px; margin: 0 auto 2rem auto; line-height: 1.6;">
            Acesse nosso servidor oficial para peneiras, campeonatos da comunidade, suporte em tempo real e bate-papo exclusivo com pro-players e a torcida!
          </p>

          <a href="${settings.discord_url || 'https://discord.gg/lykosesports'}" target="_blank" class="btn-primary" style="display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; font-size: 1rem; font-weight: 800; background: #5865F2; box-shadow: 0 0 30px rgba(88,101,242,0.6); border: none;">
            ENTRAR NO DISCORD AGORA &rarr;
          </a>
        </div>

        <!-- 2. SEGUNDA PRIORIDADE: FORMULÁRIO DE CONTATO VIA EMAIL -->
        <div class="glass-card" style="padding: 2.75rem 2.5rem; border: none; border-radius: var(--radius-md); margin-bottom: 3rem; background: rgba(14, 11, 26, 0.75);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem;">
            <span style="font-size: 1.5rem;">✉️</span>
            <div>
              <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: white; margin: 0;">ENVIE UM E-MAIL</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted-light); margin-top: 2px;">Para propostas comerciais, parcerias ou contatos diretos com a diretoria.</p>
            </div>
          </div>

          <form id="lykos-contact-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
              <div>
                <label style="display: block; color: var(--text-muted-light); font-size: 0.78rem; text-transform: uppercase; font-family: var(--font-heading); font-weight: 700; margin-bottom: 6px;">Nome *</label>
                <input id="contact-name" type="text" placeholder="Seu nome completo" required
                  style="width: 100%; padding: 14px 16px; background: rgba(8, 6, 16, 0.9); border: none; border-radius: var(--radius-xs); color: white; font-size: 0.95rem; outline: none; box-sizing: border-box;">
              </div>
              <div>
                <label style="display: block; color: var(--text-muted-light); font-size: 0.78rem; text-transform: uppercase; font-family: var(--font-heading); font-weight: 700; margin-bottom: 6px;">E-mail *</label>
                <input id="contact-email" type="email" placeholder="seu@email.com" required
                  style="width: 100%; padding: 14px 16px; background: rgba(8, 6, 16, 0.9); border: none; border-radius: var(--radius-xs); color: white; font-size: 0.95rem; outline: none; box-sizing: border-box;">
              </div>
            </div>

            <div>
              <label style="display: block; color: var(--text-muted-light); font-size: 0.78rem; text-transform: uppercase; font-family: var(--font-heading); font-weight: 700; margin-bottom: 6px;">Mensagem *</label>
              <textarea id="contact-message" placeholder="Escreva sua mensagem detalhada aqui..." required rows="5"
                style="width: 100%; padding: 14px 16px; background: rgba(8, 6, 16, 0.9); border: none; border-radius: var(--radius-xs); color: white; font-size: 0.95rem; outline: none; resize: vertical; box-sizing: border-box;"></textarea>
            </div>

            <div id="contact-feedback" style="display: none; padding: 12px 16px; border-radius: var(--radius-xs); font-size: 0.9rem;"></div>

            <button type="submit" id="contact-submit" class="btn-primary" style="align-self: flex-start; padding: 14px 36px; font-weight: 800;">
              ENVIAR MENSAGEM &rarr;
            </button>
          </form>
        </div>

        <!-- 3. REDES SOCIAIS OFICIAIS MODERNIZADAS EM PILLS (CLEAN) -->
        <div style="text-align: center;">
          <div style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: var(--text-muted-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.25rem;">
            REDES SOCIAIS & PLATAFORMAS OFICIAIS
          </div>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            ${socials.map(s => `
              <a href="${s.url}" target="_blank" class="glass-card-interactive" style="background: rgba(14, 11, 26, 0.8); border: none; padding: 12px 26px; border-radius: 30px; display: inline-flex; align-items: center; justify-content: center; color: white; text-decoration: none; font-family: var(--font-heading); font-size: 0.88rem; font-weight: 700; transition: all 0.3s ease;">
                <span>${s.name}</span>
              </a>
            `).join('')}
          </div>
        </div>

      </div>
    </section>
  `;

  // Load EmailJS SDK and initialize form
  if (!window.emailjs) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      attachContactFormHandler();
    };
    document.head.appendChild(script);
  } else {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    attachContactFormHandler();
  }
};

function attachContactFormHandler() {
  const form = document.getElementById('lykos-contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const btn     = document.getElementById('contact-submit');
    const feedback = document.getElementById('contact-feedback');

    if (!name || !email || !message) return;

    btn.disabled = true;
    btn.textContent = 'Enviando...';
    feedback.style.display = 'none';

    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        message:    message
      });

      feedback.style.display = 'block';
      feedback.style.background = 'rgba(34,197,94,0.12)';
      feedback.style.border = '1px solid rgba(34,197,94,0.3)';
      feedback.style.color = '#22c55e';
      feedback.textContent = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
      form.reset();
    } catch (err) {
      console.error('[EmailJS] Error:', err);
      feedback.style.display = 'block';
      feedback.style.background = 'rgba(239,68,68,0.12)';
      feedback.style.border = '1px solid rgba(239,68,68,0.3)';
      feedback.style.color = '#ef4444';
      feedback.textContent = '❌ Erro ao enviar mensagem. Tente novamente ou entre em contato pelas redes sociais.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar Mensagem →';
    }
  });
}
