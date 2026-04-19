const express = require('express');
const path    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');
const multer  = require('multer');
const app     = express();

// ─── Multer: upload foto articoli ──────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '') || '.jpg';
    const name = 'foto-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7) + ext;
    cb(null, name);
  },
});
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  cb(null, allowed.includes(file.mimetype));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });

// ─── ANSI colors ───────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',  bold:  '\x1b[1m',  dim:   '\x1b[2m',
  red:    '\x1b[31m', green: '\x1b[32m', yellow:'\x1b[33m',
  cyan:   '\x1b[36m', white: '\x1b[37m', gray:  '\x1b[90m',
};
function ts() { return c.gray + new Date().toLocaleTimeString('it-IT') + c.reset; }

// ─── Helpers ───────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, 'data.json');

function hashPassword(p) {
  return crypto.createHash('sha256').update(String(p)).digest('hex');
}

const DEFAULT_PWD_PLAIN = 'print3d2025';

const DEFAULT_DATA = {
  settings: {
    site_nome:      'Print3D Studio',
    site_email:     'info@print3d.studio',
    site_telefono:  '',
    site_indirizzo: '',
    site_citta:     '',
    site_sito:      '',
    disponibilita:  'Lun–Ven 9:00–18:00',
    risposta_tempi: 'Entro 24h',
    orari_lun_ven:  '09:00–18:00',
    orari_sab:      '10:00–14:00',
    orari_dom:      'Chiuso',
    materiali_disponibili: 'PLA, PLA+, PLA Silk, PLA Matte, PETG, ABS',
    colori_disponibili:    'Bianco, Nero, Rosso, Blu, Verde, Giallo, Grigio, Arancione',
    meta_descrizione: 'Stampa 3D professionale su misura. Prototipazione, gadget, componenti tecnici e oggetti decorativi.',
    meta_keywords:    'stampa 3D, prototipazione, PLA, Milano, su misura',
    notifiche_email:  false,
    notifiche_nuove:  true,
    emailjs_service_id:      '',
    emailjs_template_owner:  '',
    emailjs_template_client: '',
    emailjs_public_key:      '',
    emailjs_owner_email:     '',   // email destinatario notifiche owner
    // ── Manutenzione ──────────────────────────────────────
    maintenance_enabled:  false,
    maintenance_target:   '',
    maintenance_progress: 0,
    maintenance_message:  '',
    maintenance_title:    '',
    maintenance_submsg:   '',
    // ─────────────────────────────────────────────────────
    admin_password:   hashPassword(DEFAULT_PWD_PLAIN),
  },
  prenotazioni: [],
  catalogo: [],
  recensioni: [],
  cat_pages: {
    decorativi: {
      hero_titolo: 'OGGETTI\nDECORATIVI',
      hero_sub: 'Statue, vasi, sculture, decorazioni su misura per casa e ufficio. Ogni pezzo è unico — realizzato esattamente come lo immagini tu.',
      cta_titolo: 'Porta la tua idea\nnella realtà fisica.',
      features: [
        { icon: '🎨', titolo: 'Design Personalizzato', desc: 'Partiamo dal tuo file o dalla tua idea. Adattiamo proporzioni, colori e stile al tuo spazio.' },
        { icon: '✦',  titolo: 'Finiture di Qualità',  desc: 'Strati ultra-fini, superfici lisce, dettagli nitidi. Puoi scegliere finitura grezza, levigata o verniciata.' },
        { icon: '📦', titolo: 'Imballaggio Sicuro',   desc: 'Ogni oggetto è confezionato con cura per garantire l\'integrità durante il trasporto.' },
      ],
      gallery: [
        { label: 'Sculture Geometriche', foto: '' },
        { label: 'Vasi & Fioriere',      foto: '' },
        { label: 'Statue & Busti',       foto: '' },
        { label: 'Wall Art',             foto: '' },
      ],
    },
    componentistica: {
      hero_titolo: 'COMPONEN-\nTISTICA',
      hero_sub: 'Parti di ricambio funzionali, giunti, supporti, bracket e componenti tecnici. Precisione ingegneristica, produzione artigianale.',
      cta_titolo: 'Hai un progetto\ntecnico in mente?',
      features: [
        { icon: '⚙️', titolo: 'Tolleranze Precise',   desc: 'Stampe calibrate per accoppiamenti meccanici. Testato su materiali PLA+, PETG e ABS.' },
        { icon: '🔩', titolo: 'Materiali Tecnici',    desc: 'Disponibili PETG, ABS, ASA e carbon-filled per applicazioni ad alta resistenza.' },
        { icon: '📐', titolo: 'File STL o Disegno',   desc: 'Lavoriamo dal tuo file o lo modelliamo noi da un disegno tecnico o foto.' },
      ],
      gallery: [
        { label: 'Supporti & Bracket', foto: '' },
        { label: 'Giunti & Raccordi',  foto: '' },
        { label: 'Parti di Ricambio',  foto: '' },
        { label: 'Enclosure & Cover',  foto: '' },
      ],
    },
    prototipi: {
      hero_titolo: 'PROTO-\nTIPI',
      hero_sub: 'Dai vita alla tua invenzione. Dalla concept car al gadget tech, dal pezzo medico al modello architettonico — rapido, preciso, economico.',
      cta_titolo: 'Dal concept\nal prototipo in giorni.',
      features: [
        { icon: '🧪', titolo: 'Iterazione Rapida',    desc: 'Prototipa, testa, correggi. Ogni revisione è veloce e conveniente rispetto alla produzione tradizionale.' },
        { icon: '📏', titolo: 'Scala 1:1 o in Scala', desc: 'Realizziamo modelli in scala reale o ridotta per presentazioni, test funzionali e pitch.' },
        { icon: '🚀', titolo: 'Consegna Express',     desc: 'Tempi ridotti grazie a processo ottimizzato. Dal file al prototipo fisico in pochi giorni lavorativi.' },
      ],
      gallery: [
        { label: 'Modelli Architettonici', foto: '' },
        { label: 'Gadget & Tech',          foto: '' },
        { label: 'Componenti Medici',      foto: '' },
        { label: 'Concept Car & Scale',    foto: '' },
      ],
    },
    personalizzati: {
      hero_titolo: 'PERSONA-\nLIZZATI',
      hero_sub: 'Regali unici, oggetti su misura, targhe, portachiavi, miniature. Se lo immagini, possiamo stamparlo.',
      cta_titolo: 'Il tuo oggetto\nunico, su misura.',
      features: [
        { icon: '🎁', titolo: 'Regali Originali',     desc: 'Miniature di persone, animali, case o oggetti speciali. Il regalo che non si trova in nessun negozio.' },
        { icon: '✏️', titolo: 'Il Tuo Testo & Logo',  desc: 'Targhe, porta-nomi, insegne personalizzate con font e colori a tua scelta.' },
        { icon: '❤️', titolo: 'Edizioni Speciali',    desc: 'Matrimoni, compleanni, nascite: creiamo oggetti commemorativi unici per ogni occasione.' },
      ],
      gallery: [
        { label: 'Miniature Personali', foto: '' },
        { label: 'Targhe & Insegne',    foto: '' },
        { label: 'Portachiavi & Pin',   foto: '' },
        { label: 'Gadget Evento',       foto: '' },
      ],
    },
  },
};

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
    console.log(`${ts()} ${c.yellow}⚠  data.json creato — password: ${c.bold}${DEFAULT_PWD_PLAIN}${c.reset}`);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  if (raw.settings && raw.settings.admin_password && raw.settings.admin_password.length < 64) {
    console.log(`${ts()} ${c.yellow}⚙  Migrazione password → SHA-256${c.reset}`);
    raw.settings.admin_password = hashPassword(raw.settings.admin_password);
    fs.writeFileSync(DATA_FILE, JSON.stringify(raw, null, 2));
  }
  const def = DEFAULT_DATA.settings;
  let migrated = false;
  Object.keys(def).forEach(k => {
    if (raw.settings[k] === undefined) { raw.settings[k] = def[k]; migrated = true; }
  });
  if (migrated) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(raw, null, 2));
    console.log(`${ts()} ${c.yellow}⚙  Settings migrati con nuovi campi${c.reset}`);
  }
  if (!raw.recensioni) { raw.recensioni = []; fs.writeFileSync(DATA_FILE, JSON.stringify(raw, null, 2)); }
  if (!raw.cat_pages)  { raw.cat_pages  = DEFAULT_DATA.cat_pages; fs.writeFileSync(DATA_FILE, JSON.stringify(raw, null, 2)); }
  return raw;
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ─── EmailJS server-side helper ───────────────────────────
async function sendEmailJS(templateId, params) {
  const s = readData().settings;
  if (!s.emailjs_service_id || !s.emailjs_public_key || !templateId) return;
  try {
    const body = {
      service_id:  s.emailjs_service_id,
      template_id: templateId,
      user_id:     s.emailjs_public_key,
      template_params: params,
    };
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'origin': 'http://localhost' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (res.ok) {
      console.log(`${ts()} ${c.green}✓  Email inviata${c.reset} (template: ${templateId})`);
    } else {
      console.warn(`${ts()} ${c.yellow}⚠  EmailJS errore${c.reset}: ${text}`);
    }
  } catch (e) {
    console.warn(`${ts()} ${c.yellow}⚠  EmailJS fetch error${c.reset}:`, e.message);
  }
}

// ─── SSE — Admin push notifications ───────────────────────
const sseClients = new Set();

function pushToAdmins(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try { res.write(msg); } catch (_) { sseClients.delete(res); }
  }
}

// ─── Middleware ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next();
  res.on('finish', () => {
    const sc = res.statusCode;
    const col = sc >= 500 ? c.red : sc >= 400 ? c.yellow : c.green;
    console.log(`${ts()} ${col}${c.bold}${sc}${c.reset}  ${c.white}${req.method.padEnd(6)}${c.reset} ${c.dim}${req.path}${c.reset}`);
  });
  next();
});

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  const data  = readData();
  if (token && token === data.settings.admin_password) return next();
  console.log(`${ts()} ${c.red}✗  Auth fallita${c.reset} ${c.dim}${req.method} ${req.path}${c.reset}`);
  res.status(401).json({ success: false, message: 'Non autorizzato' });
}

// ─── /maintenance: accessibile solo se manutenzione attiva ──
app.get('/maintenance', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  const data = readData();
  // Disattiva automaticamente se il countdown è scaduto
  if (data.settings.maintenance_enabled && data.settings.maintenance_target) {
    const target = new Date(data.settings.maintenance_target);
    if (!isNaN(target.getTime()) && Date.now() >= target.getTime()) {
      data.settings.maintenance_enabled = false;
      writeData(data);
      console.log(`${ts()} ${c.green}✓  Manutenzione disattivata automaticamente (GET /maintenance)${c.reset}`);
    }
  }
  if (!data.settings.maintenance_enabled) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'maintenance.html'));
});

// ─── Maintenance middleware ────────────────────────────────
// Blocca le pagine pubbliche se manutenzione attiva
// (admin, api, assets statici sempre accessibili)
const PUBLIC_PAGES = ['/', '/catalogo', '/materiali', '/prenotazione', '/contatti', '/tos', '/recensioni', '/decorativi', '/componentistica', '/prototipi', '/personalizzati'];

app.use((req, res, next) => {
  // Salta per admin, api, file statici NON-html, maintenance stessa
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/admin') ||
    req.path === '/maintenance' ||
    req.path === '/maintenance.html' ||
    (req.path.includes('.') && !req.path.endsWith('.html')) // css, js, png… ma non .html
  ) return next();

  // Forza il browser a non cachare le pagine HTML:
  // evita che un redirect 302 verso /maintenance rimanga in cache
  // dopo che l'admin riattiva il sito.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  const data = readData();
  if (data.settings.maintenance_enabled) {
    // Se il countdown è già scaduto, disattiva subito senza redirect
    if (data.settings.maintenance_target) {
      const target = new Date(data.settings.maintenance_target);
      if (!isNaN(target.getTime()) && Date.now() >= target.getTime()) {
        data.settings.maintenance_enabled = false;
        writeData(data);
        console.log(`${ts()} ${c.green}✓  Manutenzione disattivata automaticamente (richiesta in arrivo)${c.reset}`);
        return next();
      }
    }
    return res.redirect('/maintenance');
  }
  next();
});

// ─── Static files (dopo il middleware manutenzione) ────────
// index: false evita che /  venga servita staticamente prima delle route
app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
    }
  }
}));

// ─── SEO Routes ────────────────────────────────────────────

// Sitemap XML dinamica (aggiorna lastmod automaticamente)
app.get('/sitemap.xml', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const BASE   = 'https://www.print3dstudio.it';
  const urls = [
    { loc: '/',               freq: 'weekly',  pri: '1.0'  },
    { loc: '/catalogo',       freq: 'weekly',  pri: '0.9'  },
    { loc: '/personalizzati', freq: 'monthly', pri: '0.9'  },
    { loc: '/prototipi',      freq: 'monthly', pri: '0.85' },
    { loc: '/decorativi',     freq: 'monthly', pri: '0.85' },
    { loc: '/componentistica',freq: 'monthly', pri: '0.85' },
    { loc: '/materiali',      freq: 'monthly', pri: '0.8'  },
    { loc: '/prenotazione',   freq: 'monthly', pri: '0.9'  },
    { loc: '/contatti',       freq: 'monthly', pri: '0.8'  },
    { loc: '/recensioni',     freq: 'weekly',  pri: '0.75' },
  ];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls.map(u =>
      `  <url>\n    <loc>${BASE}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`
    ),
    '</urlset>'
  ].join('\n');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // cache 24h
  res.send(xml);
});

// robots.txt con cache
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// ─── Public Routes ─────────────────────────────────────────
const noCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  next();
};
app.get('/',                noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/catalogo',        noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'catalogo.html')));
app.get('/materiali',       noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'materiali.html')));
app.get('/prenotazione',    noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'prenotazione.html')));
app.get('/contatti',        noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'contatti.html')));
app.get('/tos',             noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'tos.html')));
app.get('/admin',                    (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/recensioni',      noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'recensioni.html')));
app.get('/decorativi',      noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'decorativi.html')));
app.get('/componentistica', noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'componentistica.html')));
app.get('/prototipi',       noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'prototipi.html')));
app.get('/personalizzati',  noCache, (req, res) => res.sendFile(path.join(__dirname, 'public', 'personalizzati.html')));

// ─── Public API ────────────────────────────────────────────

app.get('/api/emailjs-config', (req, res) => {
  const s = readData().settings;
  res.json({
    service_id:        s.emailjs_service_id      || '',
    template_owner_id: s.emailjs_template_owner  || '',
    template_client_id:s.emailjs_template_client || '',
    public_key:        s.emailjs_public_key       || '',
    owner_email:       s.emailjs_owner_email      || s.site_email || '',
    site_nome:         s.site_nome  || 'Print3D Studio',
    site_email:        s.site_email || '',
  });
});

app.get('/api/catalogo', (req, res) => {
  const data = readData();
  res.json(data.catalogo.filter(i => i.visibile !== false));
});

// Espone anche le impostazioni di manutenzione (pubbliche, servono alla pagina maintenance)
app.get('/api/settings', (req, res) => {
  const data = readData();
  const {
    site_email, site_nome, disponibilita, risposta_tempi,
    site_telefono, site_indirizzo, site_citta, site_sito,
    maintenance_enabled, maintenance_target, maintenance_progress,
    maintenance_message, maintenance_title, maintenance_submsg,
  } = data.settings;
  res.json({
    site_email, site_nome, disponibilita, risposta_tempi,
    site_telefono, site_indirizzo, site_citta, site_sito,
    maintenance_enabled, maintenance_target, maintenance_progress,
    maintenance_message, maintenance_title, maintenance_submsg,
  });
});

app.post('/api/prenota', (req, res) => {
  const { nome, email, telefono, oggetto, materiale, colore, quantita, note, deadline } = req.body;
  if (!nome || !email || !oggetto)
    return res.status(400).json({ success: false, message: 'Campi obbligatori mancanti.' });
  const data  = readData();
  const nuova = {
    id: 'PRE-' + Date.now(), nome, email,
    telefono:  telefono  || '',
    oggetto,
    materiale: materiale || 'PLA Standard',
    colore:    colore    || '',
    quantita:  quantita  || 1,
    deadline:  deadline  || '',
    note:      note      || '',
    stato: 'nuova',
    data:  new Date().toISOString(),
  };
  data.prenotazioni.unshift(nuova);
  writeData(data);
  console.log(`${ts()} ${c.green}✓  Nuova prenotazione${c.reset} ${c.bold}${nuova.id}${c.reset} — ${nome} <${email}>`);
  pushToAdmins('nuova-prenotazione', {
    id:        nuova.id,
    nome:      nuova.nome,
    email:     nuova.email,
    oggetto:   nuova.oggetto,
    materiale: nuova.materiale,
    data:      nuova.data,
  });
  res.json({ success: true, id: nuova.id, message: 'Prenotazione registrata!' });

  const s = readData().settings;
  const deadlineFmt = nuova.deadline
    ? new Date(nuova.deadline).toLocaleDateString('it-IT')
    : 'Non specificata';
  const emailParams = {
    booking_id:    nuova.id,
    cliente_nome:  nuova.nome,
    cliente_email: nuova.email,
    cliente_tel:   nuova.telefono  || 'Non fornito',
    oggetto:       nuova.oggetto,
    materiale:     nuova.materiale,
    colore:        nuova.colore    || 'Non specificato',
    quantita:      nuova.quantita,
    deadline:      deadlineFmt,
    note:          nuova.note      || 'Nessuna nota',
    data_invio:    new Date(nuova.data).toLocaleString('it-IT'),
    studio_nome:   s.site_nome     || 'Print3D Studio',
    studio_email:  s.site_email    || '',
    to_email:      s.emailjs_owner_email || s.site_email || '',
    to_name:       s.site_nome     || 'Print3D Studio',
  };
  sendEmailJS(s.emailjs_template_owner, emailParams).catch(() => {});
  if (s.emailjs_template_client) {
    sendEmailJS(s.emailjs_template_client, {
      ...emailParams,
      to_email: nuova.email,
      to_name:  nuova.nome,
    }).catch(() => {});
  }
  // Nota: le email vengono inviate anche lato client (prenotazione.js) via browser SDK.
  // Il server tenta come fallback ma EmailJS potrebbe bloccare richieste server-side
  // se il dominio non è in whitelist su emailjs.com.
});

// ─── Admin: Login ──────────────────────────────────────────

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false, message: 'Password mancante' });
  const data      = readData();
  const inputHash = hashPassword(password);
  const stored    = data.settings.admin_password;
  if (inputHash === stored) {
    console.log(`${ts()} ${c.green}✓  Login admin${c.reset}`);
    res.json({ success: true, token: stored });
  } else {
    console.log(`${ts()} ${c.red}✗  Login admin fallito${c.reset}`);
    res.status(401).json({ success: false, message: 'Password errata' });
  }
});

// ─── Admin API: Prenotazioni ───────────────────────────────

// ─── SSE stream (admin notifications) ─────────────────────
app.get('/api/admin/events', adminAuth, (req, res) => {
  res.set({
    'Content-Type':  'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection':    'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.write(': connected\n\n');
  sseClients.add(res);
  const keepalive = setInterval(() => {
    try { res.write(': ping\n\n'); } catch (_) {}
  }, 25000);
  req.on('close', () => {
    clearInterval(keepalive);
    sseClients.delete(res);
  });
});

app.get('/api/admin/prenotazioni', adminAuth, (req, res) => {
  res.json(readData().prenotazioni);
});

app.patch('/api/admin/prenotazioni/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  const { stato, nota_admin } = req.body;
  const data = readData();
  const p    = data.prenotazioni.find(x => x.id === id);
  if (!p) return res.status(404).json({ success: false, message: 'Non trovata' });
  if (stato)                    p.stato      = stato;
  if (nota_admin !== undefined) p.nota_admin = nota_admin;
  writeData(data);
  if (stato) console.log(`${ts()} ${c.cyan}↻  ${id}${c.reset} → ${c.bold}${stato}${c.reset}`);
  res.json({ success: true, prenotazione: p });
});

app.delete('/api/admin/prenotazioni/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  const data   = readData();
  const idx    = data.prenotazioni.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Non trovata' });
  data.prenotazioni.splice(idx, 1);
  writeData(data);
  console.log(`${ts()} ${c.red}🗑  Prenotazione eliminata${c.reset} — ${id}`);
  res.json({ success: true });
});

// ─── Admin API: Catalogo ───────────────────────────────────

app.get('/api/admin/catalogo', adminAuth, (req, res) => {
  res.json(readData().catalogo);
});

app.post('/api/admin/catalogo', adminAuth, (req, res) => {
  const data     = readData();
  const articolo = { id: 'cat-' + Date.now(), ...req.body, visibile: req.body.visibile !== false };
  data.catalogo.push(articolo);
  writeData(data);
  console.log(`${ts()} ${c.green}✓  Articolo aggiunto${c.reset} — ${articolo.nome}`);
  res.json({ success: true, articolo });
});

app.patch('/api/admin/catalogo/:id', adminAuth, (req, res) => {
  const data = readData();
  const idx  = data.catalogo.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Non trovato' });
  data.catalogo[idx] = { ...data.catalogo[idx], ...req.body };
  writeData(data);
  res.json({ success: true, articolo: data.catalogo[idx] });
});

app.delete('/api/admin/catalogo/:id', adminAuth, (req, res) => {
  const data = readData();
  const idx  = data.catalogo.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Non trovato' });
  const articolo = data.catalogo[idx];
  if (articolo.foto) {
    const fotoPath = path.join(__dirname, 'public', articolo.foto.replace(/^\//, ''));
    if (fs.existsSync(fotoPath)) {
      try { fs.unlinkSync(fotoPath); } catch(e) { /* ignora */ }
    }
  }
  data.catalogo.splice(idx, 1);
  writeData(data);
  console.log(`${ts()} ${c.red}🗑  Articolo eliminato${c.reset} — ${articolo.nome}`);
  res.json({ success: true });
});

app.post('/api/admin/catalogo/:id/foto', adminAuth, upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'File non valido o troppo grande (max 8MB, formati: JPG/PNG/WEBP/GIF)' });
  const data = readData();
  const idx  = data.catalogo.findIndex(x => x.id === req.params.id);
  if (idx === -1) {
    fs.unlinkSync(req.file.path);
    return res.status(404).json({ success: false, message: 'Articolo non trovato' });
  }
  if (data.catalogo[idx].foto) {
    const oldPath = path.join(__dirname, 'public', data.catalogo[idx].foto.replace(/^\//, ''));
    if (fs.existsSync(oldPath)) try { fs.unlinkSync(oldPath); } catch(e) { /* ignora */ }
  }
  const fotoUrl = '/uploads/' + req.file.filename;
  data.catalogo[idx].foto = fotoUrl;
  writeData(data);
  console.log(`${ts()} ${c.green}📸  Foto caricata${c.reset} — ${data.catalogo[idx].nome}: ${fotoUrl}`);
  res.json({ success: true, foto: fotoUrl });
});

app.delete('/api/admin/catalogo/:id/foto', adminAuth, (req, res) => {
  const data = readData();
  const idx  = data.catalogo.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Non trovato' });
  if (data.catalogo[idx].foto) {
    const fotoPath = path.join(__dirname, 'public', data.catalogo[idx].foto.replace(/^\//, ''));
    if (fs.existsSync(fotoPath)) try { fs.unlinkSync(fotoPath); } catch(e) { /* ignora */ }
    delete data.catalogo[idx].foto;
    writeData(data);
  }
  res.json({ success: true });
});

// ─── Admin API: Settings ───────────────────────────────────

app.get('/api/admin/settings', adminAuth, (req, res) => {
  const { admin_password, ...pub } = readData().settings;
  res.json(pub);
});

app.patch('/api/admin/settings', adminAuth, (req, res) => {
  const data    = readData();
  const allowed = [
    'site_email', 'site_nome', 'disponibilita', 'risposta_tempi',
    'site_telefono', 'site_indirizzo', 'site_citta', 'site_sito',
    'orari_lun_ven', 'orari_sab', 'orari_dom',
    'materiali_disponibili', 'colori_disponibili',
    'meta_descrizione', 'meta_keywords',
    'notifiche_email', 'notifiche_nuove',
    'emailjs_service_id', 'emailjs_template_owner', 'emailjs_template_client', 'emailjs_public_key', 'emailjs_owner_email',
    // Manutenzione
    'maintenance_enabled', 'maintenance_target', 'maintenance_progress',
    'maintenance_message', 'maintenance_title', 'maintenance_submsg',
  ];
  allowed.forEach(k => { if (req.body[k] !== undefined) data.settings[k] = req.body[k]; });
  if (req.body.nuova_password) {
    data.settings.admin_password = hashPassword(req.body.nuova_password);
    console.log(`${ts()} ${c.yellow}⚙  Password admin aggiornata${c.reset}`);
  }
  writeData(data);
  // Log manutenzione
  if (req.body.maintenance_enabled !== undefined) {
    const stato = req.body.maintenance_enabled ? `${c.yellow}ATTIVATA` : `${c.green}DISATTIVATA`;
    console.log(`${ts()} 🔧 Manutenzione ${stato}${c.reset}`);
  }
  res.json({ success: true });
});

// ─── Admin API: Stats ──────────────────────────────────────

app.get('/api/admin/stats', adminAuth, (req, res) => {
  const data = readData();
  const p    = data.prenotazioni;
  const oggi = new Date().toDateString();
  const settimana = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const mese      = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  res.json({
    totale:          p.length,
    nuove:           p.filter(x => x.stato === 'nuova').length,
    in_lavorazione:  p.filter(x => x.stato === 'in_lavorazione').length,
    completate:      p.filter(x => x.stato === 'completata').length,
    annullate:       p.filter(x => x.stato === 'annullata').length,
    oggi:            p.filter(x => new Date(x.data).toDateString() === oggi).length,
    settimana:       p.filter(x => new Date(x.data) >= settimana).length,
    mese:            p.filter(x => new Date(x.data) >= mese).length,
    catalogo:        data.catalogo.length,
    catalogo_visibili: data.catalogo.filter(x => x.visibile !== false).length,
    maintenance_enabled: data.settings.maintenance_enabled,
  });
});

// ─── Admin API: Export ─────────────────────────────────────

app.get('/api/admin/export/prenotazioni', adminAuth, (req, res) => {
  const data = readData();
  const rows = ['ID,Nome,Email,Telefono,Oggetto,Materiale,Colore,Quantita,Deadline,Stato,Data,Nota Admin'];
  data.prenotazioni.forEach(p => {
    rows.push([
      p.id, p.nome, p.email, p.telefono || '', p.oggetto,
      p.materiale, p.colore || '', p.quantita, p.deadline || '',
      p.stato, p.data, (p.nota_admin || '').replace(/,/g, ';')
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="prenotazioni.csv"');
  res.send('\uFEFF' + rows.join('\r\n'));
});

app.get('/api/admin/export/catalogo', adminAuth, (req, res) => {
  const data = readData();
  const rows = ['ID,Nome,Categoria,Materiale,Descrizione,Tag,Visibile'];
  data.catalogo.forEach(c => {
    rows.push([
      c.id, c.nome, c.categoria, c.materiale || '', c.descrizione || '',
      c.tag || '', c.visibile !== false ? 'si' : 'no'
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="catalogo.csv"');
  res.send('\uFEFF' + rows.join('\r\n'));
});

app.get('/api/admin/export/backup', adminAuth, (req, res) => {
  const data = readData();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="backup-${new Date().toISOString().slice(0,10)}.json"`);
  res.json(data);
});

// ─── Recensioni API (public) ───────────────────────────────

app.get('/api/recensioni', (req, res) => {
  const data = readData();
  res.json({ recensioni: data.recensioni || [] });
});

app.post('/api/recensioni', (req, res) => {
  const { stelle, categoria, nome, email, titolo, testo } = req.body;
  if (!stelle || !nome || !titolo || !testo) return res.status(400).json({ error: 'Campi obbligatori mancanti' });
  if (stelle < 1 || stelle > 5) return res.status(400).json({ error: 'Valutazione non valida' });
  if (testo.length < 10) return res.status(400).json({ error: 'Testo troppo corto' });
  const data = readData();
  const nuova = {
    id:        Date.now().toString(),
    stelle:    parseInt(stelle),
    categoria: categoria || 'Altro',
    nome:      nome.substring(0, 50),
    email:     email || '',
    titolo:    titolo.substring(0, 80),
    testo:     testo.substring(0, 800),
    stato:     'in_attesa',
    verificata: false,
    data:      new Date().toISOString(),
  };
  if (!data.recensioni) data.recensioni = [];
  data.recensioni.unshift(nuova);
  writeData(data);
  console.log(`${ts()} ⭐ Nuova recensione da ${nome} (${stelle}★) — in attesa`);
  res.json({ success: true });
});

// ─── Recensioni API (admin) ────────────────────────────────

app.get('/api/admin/recensioni', adminAuth, (req, res) => {
  const data = readData();
  res.json(data.recensioni || []);
});

app.patch('/api/admin/recensioni/:id', adminAuth, (req, res) => {
  const data = readData();
  if (!data.recensioni) return res.status(404).json({ error: 'Non trovata' });
  const idx = data.recensioni.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Non trovata' });
  const allowed = ['stato', 'verificata', 'titolo', 'testo', 'nome', 'stelle', 'categoria'];
  allowed.forEach(k => { if (req.body[k] !== undefined) data.recensioni[idx][k] = req.body[k]; });
  writeData(data);
  res.json({ success: true, recensione: data.recensioni[idx] });
});

app.delete('/api/admin/recensioni/:id', adminAuth, (req, res) => {
  const data = readData();
  if (!data.recensioni) return res.status(404).json({ error: 'Non trovata' });
  const before = data.recensioni.length;
  data.recensioni = data.recensioni.filter(r => r.id !== req.params.id);
  if (data.recensioni.length === before) return res.status(404).json({ error: 'Non trovata' });
  writeData(data);
  res.json({ success: true });
});


// ─── API Pagine Categorie (public) ────────────────────────
app.get('/api/cat-page/:slug', (req, res) => {
  const { slug } = req.params;
  const valid = ['decorativi', 'componentistica', 'prototipi', 'personalizzati'];
  if (!valid.includes(slug)) return res.status(404).json({ error: 'Pagina non trovata' });
  const data = readData();
  const page = (data.cat_pages && data.cat_pages[slug]) || DEFAULT_DATA.cat_pages[slug];
  res.json(page);
});

// ─── API Pagine Categorie (admin) ──────────────────────────
app.get('/api/admin/cat-pages', adminAuth, (req, res) => {
  const data = readData();
  res.json(data.cat_pages || DEFAULT_DATA.cat_pages);
});

app.patch('/api/admin/cat-pages/:slug', adminAuth, (req, res) => {
  const { slug } = req.params;
  const valid = ['decorativi', 'componentistica', 'prototipi', 'personalizzati'];
  if (!valid.includes(slug)) return res.status(404).json({ error: 'Slug non valido' });
  const data = readData();
  if (!data.cat_pages) data.cat_pages = JSON.parse(JSON.stringify(DEFAULT_DATA.cat_pages));
  const allowed = ['hero_titolo', 'hero_sub', 'cta_titolo', 'features', 'gallery'];
  allowed.forEach(k => { if (req.body[k] !== undefined) data.cat_pages[slug][k] = req.body[k]; });
  writeData(data);
  console.log(`${ts()} ${c.green}✓  Pagina categoria aggiornata${c.reset} — /${slug}`);
  res.json({ success: true, page: data.cat_pages[slug] });
});

// Upload immagine gallery item
app.post('/api/admin/cat-pages/:slug/gallery/:idx/foto', adminAuth, upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'File non valido (max 8MB, JPG/PNG/WEBP/GIF)' });
  const { slug } = req.params;
  const idx = parseInt(req.params.idx);
  const valid = ['decorativi', 'componentistica', 'prototipi', 'personalizzati'];
  if (!valid.includes(slug)) { fs.unlinkSync(req.file.path); return res.status(404).json({ error: 'Slug non valido' }); }
  const data = readData();
  if (!data.cat_pages) data.cat_pages = JSON.parse(JSON.stringify(DEFAULT_DATA.cat_pages));
  const gallery = data.cat_pages[slug].gallery;
  if (!gallery || idx < 0 || idx >= gallery.length) { fs.unlinkSync(req.file.path); return res.status(400).json({ error: 'Index non valido' }); }
  // Elimina vecchia foto
  if (gallery[idx].foto) {
    const old = path.join(__dirname, 'public', gallery[idx].foto.replace(/^\//, ''));
    if (fs.existsSync(old)) try { fs.unlinkSync(old); } catch(e) {}
  }
  const fotoUrl = '/uploads/' + req.file.filename;
  gallery[idx].foto = fotoUrl;
  writeData(data);
  console.log(`${ts()} ${c.green}📸  Gallery foto${c.reset} — /${slug}[${idx}]: ${fotoUrl}`);
  res.json({ success: true, foto: fotoUrl });
});

app.delete('/api/admin/cat-pages/:slug/gallery/:idx/foto', adminAuth, (req, res) => {
  const { slug } = req.params;
  const idx = parseInt(req.params.idx);
  const data = readData();
  if (!data.cat_pages || !data.cat_pages[slug]) return res.status(404).json({ error: 'Non trovato' });
  const gallery = data.cat_pages[slug].gallery;
  if (!gallery || idx < 0 || idx >= gallery.length) return res.status(400).json({ error: 'Index non valido' });
  if (gallery[idx].foto) {
    const fp = path.join(__dirname, 'public', gallery[idx].foto.replace(/^\//, ''));
    if (fs.existsSync(fp)) try { fs.unlinkSync(fp); } catch(e) {}
    gallery[idx].foto = '';
    writeData(data);
  }
  res.json({ success: true });
});

// ─── Auto-disattiva manutenzione al termine del countdown ──
// Controlla ogni 30s: se maintenance_enabled è true e maintenance_target
// è nel passato, disattiva automaticamente la manutenzione.
setInterval(() => {
  const data = readData();
  const s = data.settings;
  if (!s.maintenance_enabled || !s.maintenance_target) return;
  const target = new Date(s.maintenance_target);
  if (isNaN(target.getTime())) return;
  if (Date.now() >= target.getTime()) {
    data.settings.maintenance_enabled = false;
    writeData(data);
    console.log(`${ts()} ${c.green}✓  Manutenzione disattivata automaticamente (countdown scaduto)${c.reset}`);
  }
}, 30_000);

// ─── 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
  // API routes restituiscono JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Endpoint non trovato' });
  }
  console.log(`${ts()} ${c.yellow}404${c.reset}  ${c.dim}${req.method} ${req.path}${c.reset}`);
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ─── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const startData = readData();
  const currentHash = startData.settings.admin_password;
  const defaultHash = hashPassword(DEFAULT_PWD_PLAIN);
  const pwdDisplay = currentHash === defaultHash
    ? `${c.bold}${c.green}${DEFAULT_PWD_PLAIN}${c.reset} ${c.dim}(password di default)${c.reset}`
    : `${c.yellow}[password personalizzata — non mostrabile in chiaro]${c.reset}`;

  console.log('');
  console.log(`  ${c.bold}${c.white}🖨  Print3D Studio — v16${c.reset}`);
  console.log(`  ${c.green}▶  http://localhost:${PORT}${c.reset}`);
  console.log(`  ${c.cyan}⚙  Admin  →  http://localhost:${PORT}/admin${c.reset}`);
  console.log(`  ${c.gray}   data   →  ${DATA_FILE}${c.reset}`);
  console.log(`  ${c.yellow}🔑  Password Admin: ${pwdDisplay}`);
  if (startData.settings.maintenance_enabled) {
    console.log(`  ${c.yellow}⚠  MANUTENZIONE ATTIVA — sito pubblico bloccato${c.reset}`);
  }
  console.log('');
});
