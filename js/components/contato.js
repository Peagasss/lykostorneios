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
    <section class="section-dark-1" style="padding-top: 130px;">
      <div class="container" style="max-width: 820px;">
        <div style="text-align: center; margin-bottom: 3rem;">
          <h1 class="section-heading">Entre em <span>Contato</span></h1>
          <p class="section-subtitle" style="margin: 0 auto;">
            Fale com a equipe LYKOS pelo formulário abaixo ou acesse nossas redes sociais oficiais.
          </p>
        </div>

        <!-- Contact Form -->
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark-strong); border-radius: var(--radius-sm); padding: 2.5rem 2rem; margin-bottom: 2.5rem;">
          <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: white; margin-bottom: 1.75rem;">📩 Envie uma Mensagem</h2>

          <form id="lykos-contact-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
              <div>
                <label style="display: block; color: var(--text-muted-light); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Nome *</label>
                <input id="contact-name" type="text" placeholder="Seu nome completo" required
                  style="width: 100%; padding: 12px 14px; background: var(--bg-dark-base); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); color: white; font-size: 0.95rem; outline: none; box-sizing: border-box;">
              </div>
              <div>
                <label style="display: block; color: var(--text-muted-light); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">E-mail *</label>
                <input id="contact-email" type="email" placeholder="seu@email.com" required
                  style="width: 100%; padding: 12px 14px; background: var(--bg-dark-base); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); color: white; font-size: 0.95rem; outline: none; box-sizing: border-box;">
              </div>
            </div>

            <div>
              <label style="display: block; color: var(--text-muted-light); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Assunto *</label>
              <input id="contact-subject" type="text" placeholder="Ex: Peneira, Parceria, Imprensa..." required
                style="width: 100%; padding: 12px 14px; background: var(--bg-dark-base); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); color: white; font-size: 0.95rem; outline: none; box-sizing: border-box;">
            </div>

            <div>
              <label style="display: block; color: var(--text-muted-light); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Mensagem *</label>
              <textarea id="contact-message" placeholder="Escreva sua mensagem aqui..." required rows="5"
                style="width: 100%; padding: 12px 14px; background: var(--bg-dark-base); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); color: white; font-size: 0.95rem; outline: none; resize: vertical; box-sizing: border-box;"></textarea>
            </div>

            <div id="contact-feedback" style="display: none; padding: 12px 16px; border-radius: var(--radius-xs); font-size: 0.9rem;"></div>

            <button type="submit" id="contact-submit" class="btn-primary" style="align-self: flex-start; padding: 13px 32px;">
              Enviar Mensagem →
            </button>
          </form>
        </div>

        <!-- Discord CTA -->
        <div style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark-strong); border-radius: var(--radius-sm); padding: 2rem; text-align: center; margin-bottom: 2.5rem;">
          <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: white; margin-bottom: 8px;">Discord Oficial da LYKOS</h2>
          <p style="color: var(--text-muted-light); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">
            Acesse nosso servidor oficial para peneiras, suporte e interação com a torcida.
          </p>
          <a href="${settings.discord_url || 'https://discord.gg/lykosesports'}" target="_blank" class="btn-primary" style="padding: 13px 28px; font-size: 0.9rem;">
            Entrar no Servidor →
          </a>
        </div>

        <!-- Social Links -->
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: white; margin-bottom: 1.25rem; text-align: center;">Redes Sociais Oficiais</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 3rem;">
          ${socials.map(s => `
            <a href="${s.url}" target="_blank" style="background: var(--bg-dark-surface); border: 1px solid var(--border-dark); border-radius: var(--radius-xs); padding: 1.25rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: white; text-decoration: none;">
              <strong style="font-size: 1rem;">${s.name}</strong>
              <span style="font-size: 0.75rem; color: var(--accent-neon);">Acessar →</span>
            </a>
          `).join('')}
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
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const btn     = document.getElementById('contact-submit');
    const feedback = document.getElementById('contact-feedback');

    if (!name || !email || !subject || !message) return;

    btn.disabled = true;
    btn.textContent = 'Enviando...';
    feedback.style.display = 'none';

    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        subject:    subject,
        message:    message
      });

      feedback.style.display = 'block';
      feedback.style.background = 'rgba(34,197,94,0.12)';
      feedback.style.border = '1px solid rgba(34,197,94,0.3)';
      feedback.style.color = '#22c55e';
      feedback.textContent = 'Mensagem enviada com sucesso. Entraremos em contato em breve.';
      form.reset();
    } catch (err) {
      console.error('[EmailJS] Error:', err);
      feedback.style.display = 'block';
      feedback.style.background = 'rgba(239,68,68,0.12)';
      feedback.style.border = '1px solid rgba(239,68,68,0.3)';
      feedback.style.color = '#ef4444';
      feedback.textContent = 'Erro ao enviar a mensagem. Tente novamente ou entre em contato pelas redes sociais.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar Mensagem →';
    }
  });
}
