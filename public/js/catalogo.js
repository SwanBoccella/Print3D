// ============================================================
// CATALOGO JS — Dynamic load + Filter + Hover tilt
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {

  const grid = document.getElementById('catalog-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // ---- SKELETON LOADER ----
  function showSkeletons(count = 6) {
    grid.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const sk = document.createElement('div');
      sk.className = 'catalog-item catalog-skeleton';
      sk.innerHTML = `
        <div class="item-visual">
          <div class="item-placeholder skeleton-pulse" style="background:#111;min-height:200px;"></div>
        </div>
        <div class="item-info">
          <div class="skeleton-line" style="width:40%;height:10px;background:#1a1a1a;border-radius:3px;margin-bottom:10px;"></div>
          <div class="skeleton-line" style="width:70%;height:18px;background:#1a1a1a;border-radius:3px;margin-bottom:8px;"></div>
          <div class="skeleton-line" style="width:90%;height:12px;background:#1a1a1a;border-radius:3px;"></div>
        </div>`;
      grid.appendChild(sk);
    }
  }

  // ---- LOAD ITEMS FROM API ----
  async function loadCatalogo() {
    showSkeletons();
    try {
      const res = await fetch('/api/catalogo');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const items = await res.json();
      if (!Array.isArray(items)) throw new Error('Risposta non valida');
      renderItems(items);
    } catch (e) {
      console.error('Catalogo fetch error:', e);
      grid.innerHTML = '<p style="color:#555;text-align:center;padding:60px 0;grid-column:1/-1;">Errore nel caricamento del catalogo.</p>';
    }
  }

  function renderItems(items) {
    grid.innerHTML = '';
    if (!items.length) {
      grid.innerHTML = '<p style="color:#555;text-align:center;padding:60px 0;grid-column:1/-1;">Nessun articolo disponibile.</p>';
      return;
    }
    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'catalog-item' + (item.large ? ' catalog-item--large' : '');
      el.dataset.cat = item.categoria;
      if (i > 0) el.dataset.delay = (i * 0.05).toFixed(2);

      // Filtra categorie: se il filter corrente è attivo, nascondi subito
      if (currentFilter !== 'all' && item.categoria !== currentFilter) {
        el.classList.add('hidden');
      }

      el.innerHTML = `
        <div class="item-visual">
          ${item.foto
            ? `<img src="${item.foto}" alt="${escapeHtml(item.nome)}" class="item-foto" style="width:100%;height:100%;object-fit:cover;display:block;min-height:200px;">`
            : `<div class="item-placeholder" style="background:${item.bg || '#111'}">${item.svg || ''}</div>`
          }
          <div class="item-overlay">
            <a href="/prenotazione" class="item-cta">Richiedi simile</a>
          </div>
        </div>
        <div class="item-info">
          <span class="item-tag">${capitalize(item.categoria)}</span>
          <h3>${escapeHtml(item.nome)}</h3>
          <p>${escapeHtml(item.descrizione || '')}</p>
          <div class="item-meta">
            <span>${escapeHtml(item.materiale || '')}</span><span>•</span><span>${escapeHtml(item.tag || '')}</span>
          </div>
        </div>`;
      grid.appendChild(el);
    });

    // Re-init hover tilt
    grid.querySelectorAll('.catalog-item').forEach(item => {
      const visual = item.querySelector('.item-visual');
      if (!visual) return;
      visual.addEventListener('mousemove', e => {
        const r = visual.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / r.height) * -8;
        const ry = ((e.clientX - r.left - r.width / 2) / r.width) * 8;
        visual.style.transform = `perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      visual.addEventListener('mouseleave', () => { visual.style.transform = ''; });
    });

  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function capitalize(s) {
    const map = { decorativo: 'Decorativo', gadget: 'Gadget', tecnico: 'Componentistica', prototipo: 'Prototipo' };
    return map[s] || (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
  }

  // ---- FILTER ----
  let currentFilter = 'all';
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      grid.querySelectorAll('.catalog-item').forEach(item => {
        const show = currentFilter === 'all' || item.dataset.cat === currentFilter;
        if (show) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '1';
          });
        } else {
          item.classList.add('hidden');
          item.style.opacity = '';
          item.style.transition = '';
        }
      });
    });
  });

  await loadCatalogo();
});
