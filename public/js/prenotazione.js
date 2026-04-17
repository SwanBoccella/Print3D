// ============================================================
// PRENOTAZIONE JS — Form + submit → API /api/prenota + EmailJS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- BOOKING CANVAS ----
  const canvas = document.getElementById('booking-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    const lines = Array.from({ length: 12 }, () => ({
      x1: Math.random() * canvas.width, y1: Math.random() * canvas.height,
      x2: Math.random() * canvas.width, y2: Math.random() * canvas.height,
      vx1: (Math.random() - .5) * .3, vy1: (Math.random() - .5) * .3,
      vx2: (Math.random() - .5) * .3, vy2: (Math.random() - .5) * .3,
      alpha: Math.random() * .15 + .05,
    }));
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach(l => {
        l.x1 += l.vx1; l.y1 += l.vy1; l.x2 += l.vx2; l.y2 += l.vy2;
        ['x1','y1','x2','y2'].forEach(k => {
          const dim = k.includes('x') ? canvas.width : canvas.height;
          if (l[k] < 0 || l[k] > dim) l['v'+k] *= -1;
        });
        ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2);
        ctx.strokeStyle = `rgba(229,62,62,${l.alpha})`; ctx.lineWidth = .5; ctx.stroke();
        ctx.beginPath(); ctx.arc(l.x1, l.y1, 2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(229,62,62,${l.alpha*2})`; ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ---- QUANTITY BUTTONS ----
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('quantita');
      let val = parseInt(input.value) + parseInt(btn.dataset.dir);
      input.value = Math.max(1, Math.min(99, val));
    });
  });

  // ---- MIN DATE ----
  const deadlineInput = document.getElementById('deadline');
  if (deadlineInput) {
    const d = new Date(); d.setDate(d.getDate() + 7);
    deadlineInput.min = d.toISOString().split('T')[0];
  }

  // ---- FORM VALIDATION ----
  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-btn');

  function validateField(input) {
    const group = input.closest('.form-group');
    const errorEl = group && group.querySelector('.field-error');
    let error = '';
    if (input.required && !input.value.trim()) error = 'Campo obbligatorio';
    else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) error = 'Email non valida';
    input.classList.toggle('error', !!error);
    if (errorEl) errorEl.textContent = error;
    return !error;
  }

  form.querySelectorAll('input[required], input[type="email"]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => { if (input.classList.contains('error')) validateField(input); });
  });

  // ---- EMAILJS: invia notifica al proprietario + conferma al cliente ----
  async function sendEmails(prenotazione, siteSettings) {
    // Legge credenziali EmailJS salvate nelle impostazioni admin
    const cfg = await fetch('/api/emailjs-config').then(r => r.json()).catch(() => null);
    if (!cfg || !cfg.service_id || !cfg.template_owner_id || !cfg.public_key) {
      console.log('EmailJS non configurato — email non inviate');
      return;
    }

    // Carica EmailJS SDK se non già presente
    if (!window.emailjs) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    emailjs.init({ publicKey: cfg.public_key });

    const dataFormatted = new Date(prenotazione.data).toLocaleString('it-IT');
    const deadlineFormatted = prenotazione.deadline
      ? new Date(prenotazione.deadline).toLocaleDateString('it-IT')
      : 'Non specificata';

    // Template params comuni
    const params = {
      booking_id:    prenotazione.id,
      cliente_nome:  prenotazione.nome,
      cliente_email: prenotazione.email,
      cliente_tel:   prenotazione.telefono || 'Non fornito',
      oggetto:       prenotazione.oggetto,
      materiale:     prenotazione.materiale,
      colore:        prenotazione.colore || 'Non specificato',
      quantita:      prenotazione.quantita,
      deadline:      deadlineFormatted,
      note:          prenotazione.note || 'Nessuna nota',
      data_invio:    dataFormatted,
      studio_nome:   siteSettings.site_nome   || 'Print3D Studio',
      studio_email:  siteSettings.site_email  || '',
      to_email:      cfg.owner_email || siteSettings.site_email || '',  // destinatario notifica owner
    };

    // Aggiunge to_name per compatibilità con template
    params.to_name = siteSettings.site_nome || 'Print3D Studio';

    // 1. Notifica al proprietario
    try {
      await emailjs.send(cfg.service_id, cfg.template_owner_id, params);
      console.log('✓ Email notifica owner inviata');
    } catch (e) {
      console.error('✗ Notifica owner fallita:', e.text || e.message || JSON.stringify(e));
    }

    // 2. Conferma al cliente (opzionale, solo se template configurato)
    if (cfg.template_client_id) {
      try {
        await emailjs.send(cfg.service_id, cfg.template_client_id, {
          ...params,
          to_email: prenotazione.email,
          to_name:  prenotazione.nome,
        });
        console.log('✓ Email conferma cliente inviata');
      } catch (e) {
        console.warn('Conferma cliente fallita:', e);
      }
    }
  }

  // ---- FORM SUBMIT ----
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const requiredFields = form.querySelectorAll('input[required]');
    let valid = true;
    requiredFields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    submitBtn.classList.add('loading'); submitBtn.disabled = true;
    const formData = {
      nome: form.nome.value.trim(), email: form.email.value.trim(),
      telefono: form.telefono.value.trim(), oggetto: form.oggetto.value.trim(),
      materiale: form.materiale.value, colore: form.colore.value.trim(),
      quantita: form.quantita.value, deadline: form.deadline.value,
      note: form.note.value.trim(),
    };
    try {
      const res = await fetch('/api/prenota', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        // Email inviate lato server automaticamente
        showSuccess(data.id);
      } else {
        alert(data.message || 'Errore nell\'invio. Riprova.');
        submitBtn.classList.remove('loading'); submitBtn.disabled = false;
      }
    } catch (err) {
      console.error(err);
      submitBtn.classList.remove('loading'); submitBtn.disabled = false;
      alert('Errore di connessione. Riprova o contattaci via email.');
    }
  });

  function showSuccess(id) {
    const overlay = document.getElementById('success-overlay');
    if (id) {
      const idEl = overlay.querySelector('#booking-id');
      if (idEl) idEl.textContent = id;
    }
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  document.getElementById('success-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.remove('visible');
      document.body.style.overflow = '';
    }
  });

  // ---- FIELD FOCUS EFFECTS ----
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('focus', () => el.closest('.form-group')?.querySelector('label') && (el.closest('.form-group').querySelector('label').style.color = '#e53e3e'));
    el.addEventListener('blur', () => el.closest('.form-group')?.querySelector('label') && (el.closest('.form-group').querySelector('label').style.color = ''));
  });

});
