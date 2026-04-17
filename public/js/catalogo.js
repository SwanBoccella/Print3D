// ============================================================
// CATALOGO JS — Dynamic load + Filter + Hover tilt + Lightbox
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {

  const grid = document.getElementById('catalog-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // ---- LIGHTBOX ----
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = [
    'display:none', 'position:fixed', 'inset:0', 'z-index:9999',
    'background:rgba(0,0,0,0.92)',
    'align-items:center', 'justify-content:center',
    'cursor:zoom-out', 'padding:16px', 'box-sizing:border-box'
  ].join(';');
  lightbox.innerHTML =
    '<img id="lightbox-img" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:4px;box-shadow:0 0 40px rgba(0,0,0,0.8);cursor:default;" />' +
    '<button id="lightbox-close" style="position:fixed;top:16px;right:20px;background:none;border:none;color:#fff;font-size:32px;cursor:pointer;line-height:1;opacity:.8;">&#x2715;</button>';
  document.body.appendChild(lightbox);

  function openLightbox(src) {
    lightbox.style.display = 'flex';
    document.getElementById('lightbox-img').src = src;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.getElementById('lightbox-img').src = '';
    document.body.style.overflow = '';
  }
  lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLightbox(); });

  // ---- SKELETON LOADER ----
  function showSkeletons(count) {
    count = count || 6;
    grid.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var sk = document.createElement('div');
      sk.className = 'catalog-item catalog-skeleton';
      sk.innerHTML =
        '<div class="item-info">' +
          '<div class="skeleton-line" style="width:40%;height:10px;background:#1a1a1a;border-radius:3px;margin-bottom:10px;"></div>' +
          '<div class="skeleton-line" style="width:70%;height:18px;background:#1a1a1a;border-radius:3px;margin-bottom:8px;"></div>' +
        '</div>' +
        '<div class="item-visual">' +
          '<div class="item-placeholder skeleton-pulse" style="background:#111;min-height:200px;"></div>' +
        '</div>' +
        '<div class="item-info">' +
          '<div class="skeleton-line" style="width:90%;height:12px;background:#1a1a1a;border-radius:3px;"></div>' +
        '</div>';
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
    items.forEach(function(item, i) {
      const el = document.createElement('div');
      el.className = 'catalog-item' + (item.large ? ' catalog-item--large' : '');
      el.dataset.cat = item.categoria;
      if (i > 0) el.dataset.delay = (i * 0.05).toFixed(2);

      if (currentFilter !== 'all' && item.categoria !== currentFilter) {
        el.classList.add('hidden');
      }

      const hasFoto = !!item.foto;
      const nomeSafe = escapeHtml(item.nome);
      const descSafe = escapeHtml(item.descrizione || '');
      const matSafe  = escapeHtml(item.materiale || '');
      const tagSafe  = escapeHtml(item.tag || '');

      const visualInner = hasFoto
        ? '<img src="' + item.foto + '" alt="' + nomeSafe + '" class="item-foto" style="width:100%;height:100%;object-fit:cover;display:block;min-height:200px;">' +
          '<div class="item-zoom-hint" style="position:absolute;bottom:8px;right:10px;color:#fff;font-size:12px;opacity:.7;pointer-events:none;">&#128269; Ingrandisci</div>'
        : '<div class="item-placeholder" style="background:' + (item.bg || '#111') + '">' + (item.svg || '') + '</div>';

      el.innerHTML =
        '<div class="item-info item-info--top">' +
          '<span class="item-tag">' + capitalize(item.categoria) + '</span>' +
          '<h3>' + nomeSafe + '</h3>' +
        '</div>' +
        '<div class="item-visual' + (hasFoto ? ' item-visual--clickable' : '') + '" style="position:relative;">' +
          visualInner +
          '<div class="item-overlay">' +
            '<a href="/prenotazione" class="item-cta">Richiedi simile</a>' +
          '</div>' +
        '</div>' +
        '<div class="item-info">' +
          '<p>' + descSafe + '</p>' +
          '<div class="item-meta">' +
            '<span>' + matSafe + '</span><span>&bull;</span><span>' + tagSafe + '</span>' +
          '</div>' +
        '</div>';

      // Lightbox click
      if (hasFoto) {
        const fotoSrc = item.foto;
        const visual = el.querySelector('.item-visual');
        visual.style.cursor = 'zoom-in';
        visual.addEventListener('click', function(e) {
          if (e.target.closest && e.target.closest('.item-cta')) return;
          openLightbox(fotoSrc);
        });
      }

      grid.appendChild(el);
    });

    // Re-init hover tilt
    grid.querySelectorAll('.catalog-item').forEach(function(item) {
      const visual = item.querySelector('.item-visual');
      if (!visual) return;
      visual.addEventListener('mousemove', function(e) {
        const r = visual.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / r.height) * -8;
        const ry = ((e.clientX - r.left - r.width / 2) / r.width) * 8;
        visual.style.transform = 'perspective(500px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      });
      visual.addEventListener('mouseleave', function() { visual.style.transform = ''; });
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
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      grid.querySelectorAll('.catalog-item').forEach(function(item) {
        const show = currentFilter === 'all' || item.dataset.cat === currentFilter;
        if (show) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          requestAnimationFrame(function() {
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
