<div align="center">

```
██████╗ ██████╗ ██╗███╗   ██╗████████╗██████╗ ██████╗
██╔══██╗██╔══██╗██║████╗  ██║╚══██╔══╝╚════██╗██╔══██╗
██████╔╝██████╔╝██║██╔██╗ ██║   ██║    █████╔╝██║  ██║
██╔═══╝ ██╔══██╗██║██║╚██╗██║   ██║    ╚═══██╗██║  ██║
██║     ██║  ██║██║██║ ╚████║   ██║   ██████╔╝██████╔╝
╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═════╝ ╚═════╝
                                              STUDIO
```

**Sito vetrina per servizio di stampa 3D artigianale su prenotazione**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-e53e3e?style=flat-square)](LICENSE)
[![i18n](https://img.shields.io/badge/i18n-IT%20%2F%20EN-blue?style=flat-square)](#-internazionalizzazione)
[![Flat-file DB](https://img.shields.io/badge/DB-flat--file%20JSON-f6c90e?style=flat-square)](#-architettura-dati)

</div>

---

## Indice

- [Panoramica](#-panoramica)
- [Stack Tecnico](#-stack-tecnico)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Setup e Avvio](#-setup-e-avvio)
- [Pagine Frontend](#-pagine-frontend)
- [Pannello Admin](#-pannello-admin)
- [API Reference](#-api-reference)
- [Internazionalizzazione](#-internazionalizzazione)
- [Architettura Dati](#-architettura-dati)
- [Modalità Manutenzione](#-modalità-manutenzione)
- [Configurazione Avanzata](#-configurazione-avanzata)

---

## 📦 Panoramica

**Print3D Studio** è un sito web completo per un servizio di stampa 3D FDM artigianale su prenotazione. Include vetrina prodotti, sistema di prenotazione, gestione recensioni e un pannello di amministrazione completo — tutto senza database esterno, usando un singolo file `data.json` come storage.

**Caratteristiche principali:**

- Sito multilingua **IT / EN** con toggle istantaneo e persistenza `localStorage`
- Sistema di **prenotazione integrato** con email via EmailJS
- **Catalogo prodotti dinamico** gestito dall'admin
- **Pannello admin** con 8 sezioni: prenotazioni, catalogo, recensioni, impostazioni, statistiche, export, tema, manutenzione
- **Modalità manutenzione** con countdown, progress bar e redirect automatico
- Animazioni canvas generative su ogni pagina (GSAP + Web API)
- Design dark brutalist full responsive

---

## 🛠 Stack Tecnico

| Layer | Tecnologia |
|---|---|
| Runtime | Node.js 18+ |
| Server | Express 4.18 |
| Upload | Multer 1.4 |
| Dev | Nodemon 3.0 |
| Frontend | HTML5 / CSS3 / Vanilla JS |
| Animazioni | GSAP 3.12 + Canvas API |
| Email | EmailJS (client-side) |
| Storage | Flat-file JSON (`data.json`) |
| Auth | Token SHA-256 (header `X-Admin-Token`) |
| i18n | Sistema custom dual-engine (i18n.js + translate-map.js) |

---

## 📁 Struttura del Progetto

```
Print3D_v12/
├── server.js                  # Entry point — Express server + tutte le API
├── data.json                  # Database flat-file (auto-generato al primo avvio)
├── package.json
└── public/
    ├── index.html             # Homepage
    ├── catalogo.html          # Catalogo prodotti
    ├── materiali.html         # Schede materiali (PLA, PLA+, Silk, Matte)
    ├── prenotazione.html      # Form di prenotazione
    ├── contatti.html          # Contatti + mappa
    ├── recensioni.html        # Recensioni clienti
    ├── decorativi.html        # Categoria: oggetti decorativi
    ├── componentistica.html   # Categoria: componentistica
    ├── prototipi.html         # Categoria: prototipi
    ├── personalizzati.html    # Categoria: personalizzati
    ├── tos.html               # Termini, Privacy & Cookie Policy
    ├── admin.html             # Pannello di amministrazione
    ├── maintenance.html       # Pagina manutenzione (animazione generativa)
    ├── 404.html               # Pagina errore 404
    ├── css/
    │   ├── global.css         # Reset, variabili, nav, footer
    │   ├── index.css          # Stili homepage
    │   ├── pages.css          # Stili pagine interne
    │   └── prenotazione.css   # Stili form prenotazione
    ├── js/
    │   ├── i18n.js            # Engine traduzione (dizionario + toggle)
    │   ├── translate-map.js   # Engine snapshot per testi senza data-i18n
    │   ├── global.js          # Nav mobile, scroll effects, componenti condivisi
    │   ├── index.js           # Animazioni homepage
    │   ├── catalogo.js        # Fetch e render catalogo dinamico
    │   ├── prenotazione.js    # Logica form + submit
    │   ├── contatti.js        # Form contatti + mappa
    │   └── canvas-deco.js     # Decorazioni canvas pagine categoria
    └── uploads/               # Foto prodotti (upload via admin)
```

---

## 🚀 Setup e Avvio

### Requisiti

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installazione

```bash
# Clona la repository
git clone https://github.com/tuo-username/print3d-studio.git
cd print3d-studio

# Installa le dipendenze
npm install

# Avvio sviluppo (con auto-reload)
npm run dev

# Avvio produzione
npm start
```

Il server si avvia su **`http://localhost:3000`**.

Al primo avvio viene generato automaticamente `data.json` con i dati di default e la password admin viene stampata in console:

```
  🖨  Print3D Studio — v16
  ▶  http://localhost:3000
  🔐  Admin: /admin  |  password: print3d2025 (password di default)
```

> ⚠️ **Cambia la password admin immediatamente** dopo il primo accesso tramite il pannello → Impostazioni → Sicurezza.

### Variabili d'ambiente

| Variabile | Default | Descrizione |
|---|---|---|
| `PORT` | `3000` | Porta su cui ascolta il server |

---

## 🌐 Pagine Frontend

| Percorso | Pagina | Descrizione |
|---|---|---|
| `/` | Homepage | Hero, processo, categorie, materiale PLA |
| `/catalogo` | Catalogo | Griglia prodotti dinamica (dati da `/api/catalogo`) |
| `/materiali` | Materiali | Schede tecniche PLA, PLA+, Silk, Matte |
| `/prenotazione` | Prenota | Form multi步 con submit via EmailJS |
| `/contatti` | Contatti | Card contatti, mappa Google, form rapido |
| `/recensioni` | Recensioni | Griglia recensioni + form invio |
| `/decorativi` | Categoria | Oggetti decorativi |
| `/componentistica` | Categoria | Componentistica tecnica |
| `/prototipi` | Categoria | Prototipazione |
| `/personalizzati` | Categoria | Oggetti personalizzati |
| `/tos` | T&C | Termini di Servizio, Privacy Policy, Cookie Policy |
| `/admin` | Admin | Pannello di amministrazione (accesso protetto) |
| `/maintenance` | Manutenzione | Pagina manutenzione con countdown |

---

## 🔧 Pannello Admin

Accessibile su `/admin`. Autenticazione tramite password (hash SHA-256 in `data.json`).

### Sezioni

| Sezione | Funzionalità |
|---|---|
| **Dashboard** | Statistiche real-time: prenotazioni, catalogo, recensioni, messaggi |
| **Prenotazioni** | Lista prenotazioni, cambio stato (in attesa / confermata / completata / annullata), eliminazione, export CSV |
| **Catalogo** | CRUD prodotti, upload foto (max 8MB, jpg/png/webp/gif), gestione per categorie |
| **Recensioni** | Moderazione (approva / rifiuta / elimina), visualizzazione pubblica |
| **Impostazioni** | Dati aziendali, orari, email, materiali, meta SEO, cambio password |
| **Tema** | Preset colori (non ancora connesso al frontend) |
| **Manutenzione** | Attiva/disattiva, messaggio personalizzato, countdown (data target), progress bar |
| **Export** | Download JSON/CSV per prenotazioni, catalogo, backup completo |

### Autenticazione API

Tutte le route `/api/admin/*` richiedono l'header:

```http
X-Admin-Token: <password_in_chiaro>
```

---

## 📡 API Reference

### Pubbliche

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/settings` | Impostazioni pubbliche del sito |
| `GET` | `/api/catalogo` | Lista prodotti del catalogo |
| `GET` | `/api/recensioni` | Recensioni approvate |
| `POST` | `/api/prenota` | Invio nuova prenotazione |
| `POST` | `/api/recensioni` | Invio nuova recensione (pending moderazione) |
| `GET` | `/api/emailjs-config` | Config EmailJS (serviceId, templateId, publicKey) |

### Admin (richiedono `X-Admin-Token`)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `POST` | `/api/admin/login` | Verifica credenziali |
| `GET` | `/api/admin/events` | SSE: aggiornamenti live per la dashboard |
| `GET` | `/api/admin/prenotazioni` | Lista prenotazioni |
| `PATCH` | `/api/admin/prenotazioni/:id` | Aggiorna stato prenotazione |
| `DELETE` | `/api/admin/prenotazioni/:id` | Elimina prenotazione |
| `GET` | `/api/admin/catalogo` | Lista prodotti (con campi admin) |
| `POST` | `/api/admin/catalogo` | Crea prodotto |
| `PATCH` | `/api/admin/catalogo/:id` | Aggiorna prodotto |
| `DELETE` | `/api/admin/catalogo/:id` | Elimina prodotto |
| `POST` | `/api/admin/catalogo/:id/foto` | Upload foto prodotto |
| `DELETE` | `/api/admin/catalogo/:id/foto` | Rimuovi foto prodotto |
| `GET` | `/api/admin/recensioni` | Lista tutte le recensioni |
| `PATCH` | `/api/admin/recensioni/:id` | Aggiorna stato recensione |
| `DELETE` | `/api/admin/recensioni/:id` | Elimina recensione |
| `GET` | `/api/admin/settings` | Leggi impostazioni |
| `PATCH` | `/api/admin/settings` | Aggiorna impostazioni |
| `GET` | `/api/admin/stats` | Statistiche aggregate |
| `GET` | `/api/admin/export/prenotazioni` | Export CSV prenotazioni |
| `GET` | `/api/admin/export/catalogo` | Export CSV catalogo |
| `GET` | `/api/admin/export/backup` | Download backup completo `data.json` |

---

## 🌍 Internazionalizzazione

Il sistema i18n è composto da **due engine** che lavorano in sincronia:

### Engine 1 — `i18n.js` (dizionario + `data-i18n`)

Gestisce tutti gli elementi marcati con attributi `data-*`:

```html
<!-- Testo -->
<span data-i18n="nav.home">Home</span>

<!-- Placeholder input -->
<input data-i18n-placeholder="pre.nome">

<!-- Attributo title -->
<button data-i18n-title="tooltip.prenota">
```

Il toggle IT → EN avviene senza reload di pagina: aggiorna il DOM in-place e dispatcha l'evento `p3d:langchange`.

### Engine 2 — `translate-map.js` (snapshot + text node)

Cattura al load tutti i **text node** puri il cui contenuto è mappato nel dizionario `IT_TO_EN`. Ad ogni cambio lingua:

1. Ripristina il testo IT originale (baseline snapshot)
2. Se la lingua è EN, applica la map di traduzione

Questo rende il sistema **idempotente** e **toggle-safe** su qualsiasi numero di switch consecutivi.

### Persistenza

La lingua scelta viene salvata in `localStorage('p3d_lang')` e ripristinata automaticamente ad ogni caricamento di pagina.

### Aggiungere traduzioni

**Metodo 1 — Dizionario** (per nuovi elementi HTML):

```js
// In i18n.js, sezione DICT
'mia.chiave': { it: 'Testo italiano', en: 'English text' },
```

```html
<p data-i18n="mia.chiave">Testo italiano</p>
```

**Metodo 2 — Translate map** (per testi hardcoded esistenti):

```js
// In translate-map.js, oggetto IT_TO_EN
'Testo esistente in italiano': 'Existing Italian text in English',
```

---

## 🗄 Architettura Dati

Il database è un singolo file `data.json` con la seguente struttura:

```json
{
  "settings": {
    "site_nome": "Print3D Studio",
    "site_email": "info@print3d.studio",
    "admin_password": "<sha256>",
    "maintenance_enabled": false,
    "maintenance_target": null,
    "maintenance_progress": 0,
    "maintenance_message": "...",
    "emailjs_service_id": "",
    "emailjs_template_id": "",
    "emailjs_public_key": ""
  },
  "prenotazioni": [
    {
      "id": "PRE-1234567890",
      "nome": "Mario Rossi",
      "email": "mario@esempio.it",
      "materiale": "PLA",
      "colore": "Nero",
      "quantita": 1,
      "desc": "...",
      "stato": "in_attesa",
      "data": "2025-04-19T10:30:00.000Z"
    }
  ],
  "catalogo": [
    {
      "id": "CAT-1234567890",
      "nome": "Nome prodotto",
      "categoria": "decorativi",
      "materiale": "PLA",
      "colore": "Rosso",
      "prezzo": "25.00",
      "descrizione": "...",
      "foto": "uploads/foto-1234.jpg",
      "visibile": true
    }
  ],
  "recensioni": [
    {
      "id": "REC-1234567890",
      "nome": "Cliente",
      "voto": 5,
      "testo": "...",
      "approvata": false,
      "data": "2025-04-19T10:30:00.000Z"
    }
  ]
}
```

> **Nota:** `data.json` viene rigenerato automaticamente se mancante o corrotto, preservando la struttura di default.

---

## 🔴 Modalità Manutenzione

Attivabile dall'admin oppure direttamente in `data.json`:

```json
"maintenance_enabled": true,
"maintenance_target": "2025-05-01T12:00:00.000Z",
"maintenance_progress": 65,
"maintenance_message": "Aggiornamento sistemi in corso."
```

**Comportamento:**

- Tutte le route pubbliche reindirizzano a `/maintenance`
- La pagina mostra countdown in tempo reale verso `maintenance_target`
- Allo scadere del countdown: redirect automatico a `/`
- Il server fa polling ogni 5 secondi a `/api/settings` per redirect immediato quando la manutenzione viene disattivata dall'admin
- Le route `/admin`, `/api/*`, `/maintenance` rimangono sempre accessibili

**Escluse dal redirect:**

```
/admin, /api/*, /maintenance, /404, /uploads/*
```

---

## ⚙️ Configurazione Avanzata

### EmailJS

Per abilitare le email di prenotazione, configura dall'admin → Impostazioni → Email:

1. Crea un account su [emailjs.com](https://emailjs.com)
2. Crea un **Service** (Gmail, SMTP, ecc.)
3. Crea un **Template** con le variabili: `{{from_name}}`, `{{from_email}}`, `{{message}}`
4. Inserisci `Service ID`, `Template ID` e `Public Key` nelle impostazioni admin

### Upload foto

- Formati accettati: `jpg`, `png`, `webp`, `gif`
- Dimensione massima: **8 MB** per file
- Le foto vengono salvate in `public/uploads/` con nome randomizzato
- Servite staticamente da Express

### Produzione con reverse proxy (Nginx)

```nginx
server {
    listen 80;
    server_name print3d.studio;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        alias /var/www/print3d/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### PM2 (process manager)

```bash
npm install -g pm2
pm2 start server.js --name print3d
pm2 save
pm2 startup
```

---

## 🔐 Sicurezza

- La password admin è hashata con **SHA-256** — non è mai memorizzata in chiaro
- L'autenticazione admin usa un header custom (`X-Admin-Token`) su ogni request
- Gli upload sono filtrati per mimetype e limitati a 8MB
- Il server non espone mai la password in chiaro una volta cambiata dalla default
- Le route admin restituiscono `401 Unauthorized` senza informazioni aggiuntive se il token è errato

> ⚠️ Per un uso in produzione si raccomanda di aggiungere HTTPS (Let's Encrypt + Nginx), rate limiting sulle API pubbliche e un sistema di backup automatico di `data.json`.

---

## 📄 Licenza

Distribuito sotto licenza **MIT**. Vedi [`LICENSE`](LICENSE) per i dettagli.

---

<div align="center">

Fatto con ❤️ e tanto PLA

**[print3dstudio.it](https://print3dstudio.it)**

</div>
