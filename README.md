# Print3D Studio — Setup Guide

## Struttura del Progetto

```
print3d-studio/
├── server.js              # Backend Express + API prenotazione
├── package.json
└── public/
    ├── index.html         # Homepage
    ├── catalogo.html      # Catalogo prodotti
    ├── materiali.html     # Materiali disponibili
    ├── prenotazione.html  # Form prenotazione
    ├── contatti.html      # Contatti & FAQ
    ├── css/
    │   ├── global.css     # Stili condivisi
    │   ├── index.css      # Stili homepage
    │   ├── prenotazione.css
    │   └── pages.css      # Stili pagine interne
    └── js/
        ├── global.js      # Cursor, nav, scroll reveal, transizioni
        ├── index.js       # Particelle hero + GSAP
        ├── prenotazione.js # Form validation + submit
        ├── catalogo.js    # Sistema filtri
        └── contatti.js    # FAQ accordion
```

## Setup & Avvio

### 1. Installa dipendenze
```bash
npm install
```

### 2. Configura email (OBBLIGATORIO per le prenotazioni)

Il sistema usa Gmail via Nodemailer. Devi configurare una **App Password** di Google:

1. Vai su https://myaccount.google.com/security
2. Attiva la verifica in 2 passaggi (se non attiva)
3. Vai in "Password per le app" e crea una nuova app password
4. Copia la password generata (16 caratteri)

Poi imposta le variabili d'ambiente:

**Opzione A — variabili d'ambiente (Railway/Render):**
```
MAIL_USER=swanboccella@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx   ← la tua app password
PORT=3000
```

**Opzione B — file .env locale:**
```bash
# Installa dotenv
npm install dotenv

# Crea .env
echo "MAIL_USER=swanboccella@gmail.com" >> .env
echo "MAIL_PASS=la_tua_app_password" >> .env
```

E aggiungi all'inizio di server.js:
```js
require('dotenv').config();
```

### 3. Avvia in locale
```bash
npm start
# oppure con hot reload:
npm run dev
```

Apri http://localhost:3000

## Deploy su Railway

1. Push il progetto su GitHub
2. Crea nuovo progetto su Railway da GitHub repo
3. Imposta le variabili d'ambiente:
   - `MAIL_USER` = swanboccella@gmail.com
   - `MAIL_PASS` = la tua app password Gmail
4. Railway rileva automaticamente Node.js e usa `npm start`

## Come funziona la Prenotazione

1. Utente compila il form su `/prenotazione`
2. Il server valida i dati e invia **due email**:
   - Una **conferma** all'utente (swanboccella@gmail.com, con riepilogo)
   - Una **notifica** al proprietario (swanboccella@gmail.com) con tutti i dettagli
3. L'utente vede l'overlay di successo animato

## Personalizzazione rapida

- **Nome studio**: cerca "Print3D" nei file HTML
- **Email**: cerca "swanboccella@gmail.com" in server.js e nei file HTML
- **Colori**: modifica le variabili CSS in `global.css` (`:root`)
- **Aggiungi prodotti**: duplica `.catalog-item` in `catalogo.html`
