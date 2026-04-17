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

// ─── /maintenance sempre accessibile (prima del middleware) ─
app.get('/maintenance', (req, res) => res.sendFile(path.join(__dirname, 'public', 'maintenance.html')));

// ─── Maintenance middleware ────────────────────────────────
// Blocca le pagine pubbliche se manutenzione attiva
// (admin, api, assets statici sempre accessibili)
const PUBLIC_PAGES = ['/', '/catalogo', '/materiali', '/prenotazione', '/contatti'];

app.use((req, res, next) => {
  // Salta per admin, api, file statici NON-html, maintenance stessa
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/admin') ||
    req.path === '/maintenance' ||
    req.path === '/maintenance.html' ||
    (req.path.includes('.') && !req.path.endsWith('.html')) // css, js, png… ma non .html
  ) return next();

  const data = readData();
  if (data.settings.maintenance_enabled) {
    return res.redirect('/maintenance');
  }
  next();
});

// ─── Static files (dopo il middleware manutenzione) ────────
// index: false evita che /  venga servita staticamente prima delle route
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// ─── Public Routes ─────────────────────────────────────────
app.get('/',             (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/catalogo',     (req, res) => res.sendFile(path.join(__dirname, 'public', 'catalogo.html')));
app.get('/materiali',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'materiali.html')));
app.get('/prenotazione', (req, res) => res.sendFile(path.join(__dirname, 'public', 'prenotazione.html')));
app.get('/contatti',     (req, res) => res.sendFile(path.join(__dirname, 'public', 'contatti.html')));
app.get('/admin',        (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ─── Public API ────────────────────────────────────────────

app.get('/api/emailjs-config', (req, res) => {
  const s = readData().settings;
  res.json({
    service_id:        s.emailjs_service_id      || '',
    template_owner_id: s.emailjs_template_owner  || '',
    template_client_id:s.emailjs_template_client || '',
    public_key:        s.emailjs_public_key       || '',
    owner_email:       s.emailjs_owner_email      || s.site_email || '',
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
  sendEmailJS(s.emailjs_template_owner, emailParams);
  if (s.emailjs_template_client) {
    sendEmailJS(s.emailjs_template_client, {
      ...emailParams,
      to_email: nuova.email,
      to_name:  nuova.nome,
    });
  }
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
    'emailjs_service_id', 'emailjs_template_owner', 'emailjs_template_client', 'emailjs_public_key',
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
