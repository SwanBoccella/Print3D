// ============================================================
// PRINT3D STUDIO — i18n.js v1.0
// Sistema di traduzione IT/EN collettivo per tutte le pagine
// Persistenza: localStorage('p3d_lang')
// Utilizzo: aggiungere data-i18n="chiave" agli elementi HTML
//           data-i18n-placeholder="chiave" per placeholder input
//           data-i18n-title="chiave" per attributo title
// ============================================================

(function () {
  'use strict';

  // ── Dizionario completo ──────────────────────────────────────────────────
  const DICT = {

    // ── NAV (comune a tutte le pagine) ──────────────────────────────────
    'nav.home':           { it: 'Home',                   en: 'Home' },
    'nav.catalogo':       { it: 'Catalogo',               en: 'Catalog' },
    'nav.materiali':      { it: 'Materiali',              en: 'Materials' },
    'nav.recensioni':     { it: 'Recensioni',             en: 'Reviews' },
    'nav.tc':             { it: 'T&C',                    en: 'T&C' },
    'nav.contatti':       { it: 'Contatti',               en: 'Contact' },
    'nav.prenota':        { it: 'Prenota',                en: 'Book' },
    'nav.prenota_mobile': { it: 'Prenota ora',            en: 'Book now' },
    'nav.termini':        { it: 'Termini &amp; Privacy',  en: 'Terms &amp; Privacy' },

    // ── FOOTER (comune) ─────────────────────────────────────────────────
    'footer.tagline':     { it: 'Stampa 3D artigianale<br>su prenotazione', en: '3D printing by appointment<br>handcrafted quality' },
    'footer.nav_title':   { it: 'Navigazione',            en: 'Navigation' },
    'footer.prenotazione':{ it: 'Prenotazione',           en: 'Booking' },
    'footer.contatti_h':  { it: 'Contatti',               en: 'Contact' },
    'footer.risposta':    { it: 'Risposta entro 24 ore.', en: 'Response within 24 hours.' },
    'footer.disponibile': { it: 'Disponibile Lun–Sab.',   en: 'Available Mon–Sat.' },
    'footer.copyright':   { it: '2025-2026 &copy; Print3D Studio — Tutti i diritti riservati', en: '2025-2026 &copy; Print3D Studio — All rights reserved' },
    'footer.termini':     { it: 'Termini &amp; Privacy',  en: 'Terms &amp; Privacy' },

    // ── CAT FOOTER (pagine categoria) ───────────────────────────────────
    'footer.categorie':   { it: 'Categorie',              en: 'Categories' },
    'footer.decorativi':  { it: 'Oggetti Decorativi',     en: 'Decorative Objects' },
    'footer.componentistica': { it: 'Componentistica',    en: 'Components' },
    'footer.prototipi':   { it: 'Prototipi',              en: 'Prototypes' },
    'footer.personalizzati': { it: 'Personalizzati',      en: 'Custom Items' },

    // ── INDEX ────────────────────────────────────────────────────────────
    'index.hero_badge':   { it: 'Stampa 3D su prenotazione', en: '3D Printing by appointment' },
    'index.hero_line1':   { it: 'DAL FILE',               en: 'FROM FILE' },
    'index.hero_line2':   { it: "ALL'OGGETTO",            en: 'TO OBJECT' },
    'index.hero_line3':   { it: 'REALE.',                 en: 'REAL.' },
    'index.hero_sub':     { it: 'Realizziamo ogni idea con precisione millimetrica.<br>Stampa 3D artigianale su misura — solo su prenotazione.', en: 'We bring every idea to life with millimeter precision.<br>Handcrafted 3D printing — by appointment only.' },
    'index.hero_cta1':    { it: 'Prenota Ora',            en: 'Book Now' },
    'index.hero_cta2':    { it: 'Vedi il Catalogo',       en: 'View Catalog' },
    'index.ticker1':      { it: '⬡ STAMPA FDM',           en: '⬡ FDM PRINTING' },
    'index.ticker2':      { it: '⬡ SU PRENOTAZIONE',      en: '⬡ BY APPOINTMENT' },
    'index.ticker3':      { it: '⬡ QUALSIASI FORMA',      en: '⬡ ANY SHAPE' },
    'index.ticker4':      { it: '⬡ CONSEGNA RAPIDA',      en: '⬡ FAST DELIVERY' },
    'index.process_label':{ it: 'Come Funziona',          en: 'How It Works' },
    'index.process_title1':{ it: 'Tre passi verso',       en: 'Three steps toward' },
    'index.process_title2':{ it: 'il tuo oggetto.',       en: 'your object.' },
    'index.step1_title':  { it: "Descrivi l'idea",        en: 'Describe your idea' },
    'index.step1_desc':   { it: 'Mandaci la tua idea, un file 3D o anche solo un disegno. Niente è troppo complesso.', en: 'Send us your idea, a 3D file or even just a sketch. Nothing is too complex.' },
    'index.step2_title':  { it: 'Preventivo & Stampa',    en: 'Quote & Print' },
    'index.step2_desc':   { it: 'Ricevi un preventivo in 24h. Approvato il costo, iniziamo la stampa con precisione millimetrica.', en: 'Receive a quote within 24h. Once approved, we start printing with millimeter precision.' },
    'index.step3_title':  { it: 'Ritiro o Spedizione',    en: 'Pickup or Shipping' },
    'index.step3_desc':   { it: 'Il tuo oggetto è pronto. Ritiro in zona o spedizione tracciata. Qualità garantita.', en: 'Your object is ready. Local pickup or tracked shipping. Quality guaranteed.' },
    'index.cat_label':    { it: 'Cosa Realizziamo',       en: 'What We Make' },
    'index.cat_title1':   { it: 'Dalla piccola',          en: 'From small' },
    'index.cat_title2':   { it: 'decorazione al pezzo tecnico.', en: 'decoration to technical part.' },
    'index.cat1_name':    { it: 'Oggetti Decorativi',     en: 'Decorative Objects' },
    'index.cat1_desc':    { it: 'Statue, vasi, sculture, decorazioni su misura per casa e ufficio.', en: 'Statues, vases, sculptures, custom decorations for home and office.' },
    'index.cat2_name':    { it: 'Componentistica',        en: 'Components' },
    'index.cat2_desc':    { it: 'Parti di ricambio, giunti, supporti e pezzi tecnici funzionali.', en: 'Spare parts, joints, supports and functional technical pieces.' },
    'index.cat3_name':    { it: 'Prototipi',              en: 'Prototypes' },
    'index.cat3_desc':    { it: "Dai vita a un'invenzione o un prodotto. Rapido, preciso, economico.", en: 'Bring an invention or product to life. Fast, precise, affordable.' },
    'index.cat4_name':    { it: 'Personalizzati',         en: 'Custom Items' },
    'index.cat4_desc':    { it: 'Gadget, regali, targhette, portachiavi e molto altro — tutti unici.', en: 'Gadgets, gifts, nameplates, keychains and more — all unique.' },
    'index.esplora':      { it: 'Esplora →',              en: 'Explore →' },
    'index.mat_label':    { it: 'Materiale Principale',   en: 'Main Material' },
    'index.mat_title1':   { it: 'PLA — Il meglio',        en: 'PLA — The best' },
    'index.mat_title2':   { it: 'per iniziare.',          en: 'place to start.' },
    'index.mat_desc':     { it: 'Il PLA (Acido Polilattico) è un bioplastica derivata da amido di mais. Resistente, preciso, disponibile in decine di colori.', en: 'PLA (Polylactic Acid) is a bioplastic derived from corn starch. Durable, precise, available in dozens of colors.' },
    'index.mat_feat1':    { it: 'Alta precisione dimensionale', en: 'High dimensional accuracy' },
    'index.mat_feat2':    { it: 'Biodegradabile ed ecologico', en: 'Biodegradable and eco-friendly' },
    'index.mat_feat3':    { it: '30+ colori disponibili', en: '30+ colors available' },
    'index.mat_feat4':    { it: 'Adatto per oggetti decorativi e funzionali', en: 'Suitable for decorative and functional objects' },
    'index.mat_cta':      { it: 'Scopri tutti i materiali →', en: 'Discover all materials →' },
    'index.cta_title1':   { it: "Hai un'idea?",           en: 'Got an idea?' },
    'index.cta_title2':   { it: 'Realizziamola insieme.', en: "Let's build it together." },
    'index.cta_btn':      { it: 'Inizia la Prenotazione', en: 'Start Booking' },

    // ── CATALOGO ─────────────────────────────────────────────────────────
    'cat.label':          { it: 'Cosa realizziamo',       en: 'What we make' },
    'cat.title1':         { it: 'Catalogo',               en: 'Catalog' },
    'cat.title2':         { it: '&amp; Ispirazioni',      en: '&amp; Inspirations' },
    'cat.sub':            { it: 'Esempi di quello che puoi richiedere. Ogni oggetto è personalizzabile.', en: 'Examples of what you can request. Every object is customizable.' },
    'cat.filter_all':     { it: 'Tutto',                  en: 'All' },
    'cat.filter_deco':    { it: 'Decorativi',             en: 'Decorative' },
    'cat.filter_comp':    { it: 'Componentistica',        en: 'Components' },
    'cat.filter_proto':   { it: 'Prototipi',              en: 'Prototypes' },
    'cat.filter_gadget':  { it: 'Gadget',                 en: 'Gadget' },
    'cat.empty_title':    { it: 'Non trovi quello<br>che cerchi?', en: "Can't find what<br>you're looking for?" },
    'cat.empty_sub':      { it: 'Realizziamo qualsiasi forma. Descrivici il tuo progetto.', en: 'We make any shape. Tell us about your project.' },
    'cat.empty_cta':      { it: 'Inizia la Prenotazione', en: 'Start Booking' },

    // ── MATERIALI ─────────────────────────────────────────────────────────
    'mat.label':          { it: 'Specifiche tecniche',    en: 'Technical specs' },
    'mat.title1':         { it: 'I nostri',               en: 'Our' },
    'mat.title2':         { it: 'Materiali.',             en: 'Materials.' },
    'mat.sub':            { it: 'Scegliamo il materiale giusto per il tuo progetto. Attualmente PLA in tutte le varianti.', en: 'We choose the right material for your project. Currently PLA in all variants.' },
    'mat.badge_main':     { it: 'Principale',             en: 'Main' },
    'mat.badge_upgrade':  { it: 'Upgrade',                en: 'Upgrade' },
    'mat.badge_estetico': { it: 'Estetico',               en: 'Aesthetic' },
    'mat.badge_finish':   { it: 'Finish',                 en: 'Finish' },
    'mat.pla_name':       { it: 'PLA Standard',           en: 'Standard PLA' },
    'mat.pla_sub':        { it: 'Il punto di partenza per ogni progetto', en: 'The starting point for any project' },
    'mat.pla_desc':       { it: 'Il PLA (Acido Polilattico) è il materiale FDM più diffuso e versatile. Derivato da fonti rinnovabili (amido di mais), è facile da stampare e offre ottima precisione dimensionale.', en: 'PLA (Polylactic Acid) is the most common and versatile FDM material. Derived from renewable sources (corn starch), it is easy to print and offers excellent dimensional accuracy.' },
    'mat.temp':           { it: 'Temperatura stampa',     en: 'Print temperature' },
    'mat.resist':         { it: 'Resistenza',             en: 'Resistance' },
    'mat.resist_media':   { it: 'Media',                  en: 'Medium' },
    'mat.resist_alta':    { it: 'Alta',                   en: 'High' },
    'mat.flex':           { it: 'Flessibilità',           en: 'Flexibility' },
    'mat.rigido':         { it: 'Rigido',                 en: 'Rigid' },
    'mat.colori':         { it: 'Colori disponibili',     en: 'Available colors' },
    'mat.pla_pro1':       { it: 'Facile da stampare, alta precisione', en: 'Easy to print, high precision' },
    'mat.pla_pro2':       { it: 'Ecologico e biodegradabile', en: 'Eco-friendly and biodegradable' },
    'mat.pla_pro3':       { it: 'Ampia scelta colori',   en: 'Wide color selection' },
    'mat.pla_pro4':       { it: 'Ottimo per decorazioni e gadget', en: 'Great for decorations and gadgets' },
    'mat.pla_con1':       { it: 'Scarsa resistenza al calore (&gt;60°C)', en: 'Low heat resistance (&gt;60°C)' },
    'mat.pla_con2':       { it: 'Non adatto per ambienti umidi prolungati', en: 'Not suitable for prolonged humid environments' },
    'mat.plaplus_name':   { it: 'PLA+',                   en: 'PLA+' },
    'mat.plaplus_sub':    { it: 'Più resistente, stessa facilità', en: 'Stronger, same ease of use' },
    'mat.plaplus_desc':   { it: "Versione migliorata del PLA classico con additivi che aumentano resistenza all'impatto e riduzione della fragilità. Ideale per pezzi funzionali.", en: 'Improved version of classic PLA with additives that increase impact resistance and reduce brittleness. Ideal for functional parts.' },
    'mat.plaplus_pro1':   { it: "+40% resistenza all'impatto vs PLA", en: '+40% impact resistance vs PLA' },
    'mat.plaplus_pro2':   { it: 'Meno fragile a basse temperature', en: 'Less brittle at low temperatures' },
    'mat.plaplus_pro3':   { it: 'Stessa facilità di stampa', en: 'Same ease of printing' },
    'mat.plaplus_ideal':  { it: 'Ideale per:',            en: 'Ideal for:' },
    'mat.plaplus_use':    { it: 'Componentistica, pezzi di ricambio, supporti', en: 'Components, spare parts, supports' },
    'mat.silk_name':      { it: 'PLA Silk',               en: 'PLA Silk' },
    'mat.silk_sub':       { it: 'Finitura satinata premium', en: 'Premium satin finish' },
    'mat.silk_desc':      { it: 'Filamento PLA con additivi che conferiscono una finitura simile alla seta, lucida e metallica. Perfetto per oggetti decorativi di alta qualità.', en: 'PLA filament with additives that give a silk-like, shiny and metallic finish. Perfect for high-quality decorative objects.' },
    'mat.silk_pro1':      { it: 'Aspetto satinato/metallizzato', en: 'Satin/metallic appearance' },
    'mat.silk_pro2':      { it: 'Effetti bicolore disponibili', en: 'Bicolor effects available' },
    'mat.silk_pro3':      { it: 'Ottimo per decorazioni e gioielli', en: 'Great for decorations and jewelry' },
    'mat.silk_use':       { it: 'Decorazioni, regali, gioielleria', en: 'Decorations, gifts, jewelry' },
    'mat.matte_name':     { it: 'PLA Matte',              en: 'PLA Matte' },
    'mat.matte_sub':      { it: 'Finitura opaca professionale', en: 'Professional matte finish' },
    'mat.matte_desc':     { it: 'PLA con finitura opaca che nasconde le righe di stampa per un aspetto più pulito e professionale. Texture piacevole al tatto.', en: 'PLA with matte finish that hides print lines for a cleaner, more professional look. Pleasant texture to the touch.' },
    'mat.matte_pro1':     { it: 'Linee di stampa meno visibili', en: 'Less visible print lines' },
    'mat.matte_pro2':     { it: 'Aspetto professionale',  en: 'Professional appearance' },
    'mat.matte_pro3':     { it: 'Piacevole al tatto',     en: 'Pleasant to the touch' },
    'mat.matte_use':      { it: 'Prototipi, modelli, presentazioni', en: 'Prototypes, models, presentations' },
    'mat.custom_title':   { it: 'Hai bisogno di un materiale specifico?', en: 'Need a specific material?' },
    'mat.custom_desc':    { it: 'PETG, TPU, ABS, Nylon, ASA — possiamo valutare materiali alternativi su richiesta. Contattaci e troveremo la soluzione migliore.', en: 'PETG, TPU, ABS, Nylon, ASA — we can evaluate alternative materials on request. Contact us and we will find the best solution.' },
    'mat.custom_cta':     { it: 'Chiedi informazioni →',  en: 'Ask for info →' },
    'mat.params_label':   { it: 'Parametri di stampa',    en: 'Print parameters' },
    'mat.params_title1':  { it: 'Precisione',             en: 'Precision' },
    'mat.params_title2':  { it: 'nei dettagli.',          en: 'in every detail.' },
    'mat.param1_label':   { it: 'Layer Height standard',  en: 'Standard Layer Height' },
    'mat.param1_val':     { it: '0.1 – 0.3mm disponibili su richiesta', en: '0.1 – 0.3mm available on request' },
    'mat.param2_label':   { it: 'Infill configurabile',   en: 'Configurable Infill' },
    'mat.param2_val':     { it: 'Da leggero a completamente solido', en: 'From light to fully solid' },
    'mat.param3_label':   { it: 'Tolleranza dimensionale', en: 'Dimensional tolerance' },
    'mat.param3_val':     { it: 'Precisione elevata su FDM standard', en: 'High precision on standard FDM' },
    'mat.param4_label':   { it: 'Colori disponibili',     en: 'Available colors' },
    'mat.param4_val':     { it: 'PLA in tutte le varianti cromatiche', en: 'PLA in all color variants' },
    'mat.cta_title1':     { it: 'Pronto a scegliere',     en: 'Ready to choose' },
    'mat.cta_title2':     { it: 'il tuo materiale?',      en: 'your material?' },
    'mat.cta_sub':        { it: 'Indicalo nella prenotazione — se non sei sicuro, ti consigliamo noi.', en: 'Indicate it in the booking — if unsure, we will advise you.' },
    'mat.cta_btn':        { it: 'Prenota la tua stampa',  en: 'Book your print' },

    // ── CONTATTI ──────────────────────────────────────────────────────────
    'con.label':          { it: 'Siamo qui',              en: 'We are here' },
    'con.title1':         { it: 'Scrivici.',              en: 'Write to us.' },
    'con.title2':         { it: 'Rispondiamo.',           en: 'We respond.' },
    'con.sub':            { it: "Hai domande? Vuoi un preventivo rapido? Siamo a un'email di distanza.", en: 'Have questions? Want a quick quote? We are just one email away.' },
    'con.email_label':    { it: 'Email principale',       en: 'Main email' },
    'con.email_sub':      { it: 'Risposta entro 24 ore — Lun/Sab', en: 'Response within 24 hours — Mon/Sat' },
    'con.disp_label':     { it: 'Disponibilità',         en: 'Availability' },
    'con.disp_val':       { it: 'Lun – Sab',             en: 'Mon – Sat' },
    'con.disp_sub':       { it: 'Risposta entro 24h lavorative', en: 'Response within 24 working hours' },
    'con.zona_label':     { it: 'Zona operativa',         en: 'Operating area' },
    'con.zona_val':       { it: 'Italia',                 en: 'Italy' },
    'con.zona_sub':       { it: 'Spedizione nazionale disponibile', en: 'National shipping available' },
    'con.file_label':     { it: 'File accettati',         en: 'Accepted files' },
    'con.file_sub':       { it: 'Invia via email dopo la prenotazione', en: 'Send via email after booking' },
    'con.faq_label':      { it: 'FAQ',                    en: 'FAQ' },
    'con.faq1_q':         { it: 'Quanto costa una stampa?', en: 'How much does a print cost?' },
    'con.faq1_a':         { it: 'Il costo dipende da dimensioni, materiale, infill e complessità. Inviaci la prenotazione e riceverai un preventivo personalizzato.', en: 'The cost depends on size, material, infill and complexity. Send us your booking and you will receive a personalized quote.' },
    'con.faq2_q':         { it: 'Devo avere già il file 3D?', en: 'Do I need to have the 3D file already?' },
    'con.faq2_a':         { it: "No. Puoi descriverci l'oggetto a parole, inviare un disegno, o trovare un file su siti come Thingiverse/Printables. Aiutiamo anche nella ricerca.", en: 'No. You can describe the object in words, send a drawing, or find a file on sites like Thingiverse/Printables. We also help with the search.' },
    'con.faq3_q':         { it: 'Quanto tempo ci vuole?', en: 'How long does it take?' },
    'con.faq3_a':         { it: 'La stampa in sé può richiedere da poche ore a qualche giorno. Con tempi di lavorazione e consegna, calcola 3–10 giorni lavorativi.', en: 'Printing itself can take from a few hours to a few days. Including processing and delivery, allow 3–10 working days.' },
    'con.faq4_q':         { it: 'Come avviene la consegna?', en: 'How does delivery work?' },
    'con.faq4_a':         { it: "Spedizione postale/corriere su tutto il territorio italiano, o ritiro diretto in zona. Le spese di spedizione sono a carico del cliente.", en: 'Postal/courier shipping throughout Italy, or direct pickup locally. Shipping costs are borne by the customer.' },
    'con.faq5_q':         { it: 'Posso chiedere colori specifici?', en: 'Can I request specific colors?' },
    'con.faq5_a':         { it: 'Sì, abbiamo oltre 30 colori PLA disponibili tra cui bianco, nero, grigio, rosso, e molti altri. Se hai un colore specifico, scrivici.', en: 'Yes, we have over 30 PLA colors including white, black, grey, red, and many others. If you have a specific color, write to us.' },
    'con.faq_more':       { it: 'Domanda non trovata? Scrivici direttamente.', en: "Question not found? Write to us directly." },
    'con.faq_cta':        { it: "Scrivi un'email →",     en: 'Send an email →' },
    'con.map_label':      { it: 'Dove siamo',            en: 'Where we are' },
    'con.map_zona':       { it: 'Zona operativa: Calenzano e dintorni — spedizione su tutta Italia', en: 'Operating area: Calenzano and surroundings — shipping across Italy' },
    'con.map_open':       { it: 'Apri in Maps ↗',        en: 'Open in Maps ↗' },
    'con.cta_title':      { it: 'Pronto a iniziare?',    en: 'Ready to start?' },
    'con.cta_sub':        { it: 'Compila la prenotazione — è veloce e senza impegno fino al preventivo.', en: 'Fill in the booking — it is quick and non-binding until the quote.' },
    'con.cta_btn':        { it: 'Prenota Ora',           en: 'Book Now' },

    // ── PRENOTAZIONE ──────────────────────────────────────────────────────
    'pre.label':          { it: 'Inizia il processo',    en: 'Start the process' },
    'pre.title1':         { it: 'Prenota',               en: 'Book' },
    'pre.title2':         { it: 'la tua stampa.',        en: 'your print.' },
    'pre.sub':            { it: 'Compila il modulo — rispondiamo entro 24 ore con preventivo.', en: 'Fill in the form — we respond within 24 hours with a quote.' },
    'pre.step1':          { it: 'Dati personali',        en: 'Personal details' },
    'pre.nome':           { it: 'Nome e Cognome *',      en: 'Full Name *' },
    'pre.email':          { it: 'Email *',               en: 'Email *' },
    'pre.tel':            { it: 'Telefono',              en: 'Phone' },
    'pre.step2':          { it: 'Specifiche oggetto',    en: 'Object specifications' },
    'pre.desc':           { it: 'Descrizione oggetto *', en: 'Object description *' },
    'pre.materiale':      { it: 'Materiale',             en: 'Material' },
    'pre.pla':            { it: 'PLA Standard',          en: 'Standard PLA' },
    'pre.plaplus':        { it: 'PLA+',                  en: 'PLA+' },
    'pre.silk':           { it: 'PLA Silk (lucido)',     en: 'PLA Silk (glossy)' },
    'pre.matte':          { it: 'PLA Matte (opaco)',     en: 'PLA Matte (matte)' },
    'pre.altro':          { it: 'Altro — da definire',   en: 'Other — to be defined' },
    'pre.colore':         { it: 'Colore preferito',      en: 'Preferred color' },
    'pre.quantita':       { it: 'Quantità',              en: 'Quantity' },
    'pre.deadline':       { it: 'Consegna desiderata entro', en: 'Desired delivery by' },
    'pre.note':           { it: 'Note aggiuntive',       en: 'Additional notes' },
    'pre.note_ph':        { it: 'Descrizione dettagliata, file disponibili, preferenze', en: 'Detailed description, available files, preferences' },
    'pre.file_hint':      { it: 'Se hai file 3D (.STL, .OBJ, .3MF), inviaci tutto via email dopo la prenotazione a', en: 'If you have 3D files (.STL, .OBJ, .3MF), send everything via email after booking to' },
    'pre.submit':         { it: 'Invia Prenotazione',   en: 'Submit Booking' },
    'pre.info1_label':    { it: 'Tempi di risposta',    en: 'Response times' },
    'pre.info1_val':      { it: 'risposta con preventivo', en: 'response with quote' },
    'pre.info2_label':    { it: 'Come funziona',        en: 'How it works' },
    'pre.how1':           { it: 'Compili il modulo',    en: 'Fill in the form' },
    'pre.how2':           { it: 'Ricevi preventivo via email', en: 'Receive quote by email' },
    'pre.how3':           { it: 'Approvi e iniziamo',   en: 'Approve and we start' },
    'pre.how4':           { it: 'Oggetto pronto in 2–7gg', en: 'Object ready in 2–7 days' },
    'pre.mat_label':      { it: 'Materiale standard',   en: 'Standard material' },
    'pre.mat_desc':       { it: 'PLA — disponibile in oltre 30 colori. Su richiesta è possibile valutare materiali alternativi.', en: 'PLA — available in over 30 colors. Alternative materials can be evaluated on request.' },
    'pre.success_title':  { it: 'Prenotazione Inviata!', en: 'Booking Sent!' },
    'pre.success_sub':    { it: 'Abbiamo ricevuto la tua richiesta.', en: 'We have received your request.' },
    'pre.success_desc':   { it: 'Riceverai risposta entro 24 ore.', en: 'You will receive a response within 24 hours.' },
    'pre.back_home':      { it: 'Torna alla Home',      en: 'Back to Home' },

    // ── CATEGORIE (decorativi/componentistica/prototipi/personalizzati) ──
    'catpage.label':      { it: 'Categoria',             en: 'Category' },
    'catpage.cta_prenota':{ it: 'Richiedi un Preventivo', en: 'Request a Quote' },
    'catpage.cta_cat':    { it: 'Vedi il Catalogo →',   en: 'View the Catalog →' },
    'catpage.works_label':{ it: 'I Nostri Lavori',       en: 'Our Work' },
    'catpage.works_title1':{ it: 'Esempi di',            en: 'Examples of' },
    'catpage.works_title2':{ it: 'produzione',           en: 'production' },
    'catpage.works_sub':  { it: 'Ogni pezzo è stampato su ordinazione. Nessun magazzino, massima qualità.', en: 'Every piece is printed to order. No stock, maximum quality.' },
    'catpage.process_label':{ it: 'Come Funziona',       en: 'How It Works' },
    'catpage.process_title1':{ it: "Dal concept all'oggetto", en: 'From concept to object' },
    'catpage.process_title2':{ it: 'in 4 passi.',        en: 'in 4 steps.' },
    'catpage.step1_title':{ it: "Descrivi l'idea",       en: 'Describe the idea' },
    'catpage.step1_desc': { it: "Mandaci il tuo file STL o descrivi l'oggetto che vuoi. Più dettagli hai, meglio è.", en: 'Send us your STL file or describe the object you want. The more details, the better.' },
    'catpage.step2_title':{ it: 'Preventivo',            en: 'Quote' },
    'catpage.step2_desc': { it: 'Ricevi un preventivo personalizzato entro 24 ore lavorative, con materiale e tempi.', en: 'Receive a personalized quote within 24 working hours, with material and timelines.' },
    'catpage.step3_title':{ it: 'Stampa',               en: 'Print' },
    'catpage.step3_desc': { it: 'Avviamo la produzione. Ogni layer è controllato per garantire la qualità finale.', en: 'We start production. Every layer is checked to ensure final quality.' },
    'catpage.step4_title':{ it: 'Consegna',             en: 'Delivery' },
    'catpage.step4_desc': { it: "Ritiro diretto o spedizione tracciata. L'oggetto arriva esattamente come l'hai immaginato.", en: 'Direct pickup or tracked shipping. The object arrives exactly as you imagined.' },
    'catpage.cta_ready':  { it: 'Pronto a Iniziare?',   en: 'Ready to Start?' },
    'catpage.cta_now':    { it: 'Prenota Ora →',        en: 'Book Now →' },

    // ── RECENSIONI ────────────────────────────────────────────────────────
    'rec.label':          { it: 'Opinioni Verificate',   en: 'Verified Reviews' },
    'rec.title1':         { it: 'Cosa dicono i',         en: 'What our' },
    'rec.title2':         { it: 'nostri clienti',        en: 'customers say' },
    'rec.title3':         { it: '.',                     en: '.' },
    'rec.sub':            { it: 'Ogni recensione è autentica. Leggi le esperienze di chi ha già stampato con noi, o condividi la tua.', en: 'Every review is authentic. Read experiences from those who have already printed with us, or share yours.' },
    'rec.consiglio':      { it: 'Consiglierebbero',      en: 'Would recommend' },
    'rec.scrivi':         { it: 'Scrivi una Recensione', en: 'Write a Review' },
    'rec.form_label':     { it: 'Lascia il tuo feedback', en: 'Leave your feedback' },
    'rec.form_title1':    { it: 'La tua',                en: 'Your' },
    'rec.form_title2':    { it: 'esperienza',            en: 'experience' },
    'rec.form_title3':    { it: 'conta.',                en: 'matters.' },
    'rec.form_sub':       { it: "— Hai già ordinato con noi? Raccontaci com'è andata.", en: '— Have you already ordered with us? Tell us how it went.' },
    'rec.voto_label':     { it: 'La tua valutazione *', en: 'Your rating *' },
    'rec.tipo_label':     { it: 'Tipo di ordine *',     en: 'Order type *' },
    'rec.tipo1':          { it: 'Oggetto Decorativo',   en: 'Decorative Object' },
    'rec.tipo2':          { it: 'Componentistica',       en: 'Components' },
    'rec.tipo3':          { it: 'Prototipo',             en: 'Prototype' },
    'rec.tipo4':          { it: 'Personalizzato',        en: 'Custom' },
    'rec.tipo5':          { it: 'Altro',                 en: 'Other' },
    'rec.nome_label':     { it: 'Nome *',               en: 'Name *' },
    'rec.email_label':    { it: 'Email',                en: 'Email' },
    'rec.email_sub':      { it: 'Non verrà mostrata pubblicamente', en: 'Will not be shown publicly' },
    'rec.titolo_label':   { it: 'Titolo *',             en: 'Title *' },
    'rec.testo_label':    { it: 'Recensione *',         en: 'Review *' },
    'rec.submit':         { it: 'Invia Recensione',     en: 'Submit Review' },
    'rec.moderation':     { it: 'Soggetta a moderazione prima<br>della pubblicazione', en: 'Subject to moderation before<br>publication' },
    'rec.success_title':  { it: 'Recensione Inviata!',  en: 'Review Submitted!' },
    'rec.success_desc':   { it: 'Grazie per il tuo feedback. Sarà pubblicata dopo la moderazione (di solito entro 24h).', en: 'Thank you for your feedback. It will be published after moderation (usually within 24h).' },
    'rec.verify_note':    { it: 'Le recensioni vengono verificate prima della pubblicazione per garantire autenticità e rispetto delle linee guida.', en: 'Reviews are verified before publication to ensure authenticity and compliance with guidelines.' },
    'rec.list_label':     { it: 'Tutte le recensioni',  en: 'All reviews' },
    'rec.list_title1':    { it: 'Voci',                 en: 'Authentic' },
    'rec.list_title2':    { it: 'autentiche',           en: 'voices' },
    'rec.sort_recent':    { it: 'Recenti',              en: 'Recent' },
    'rec.sort_best':      { it: 'Migliori',             en: 'Best' },
    'rec.sort_worst':     { it: 'Peggiori',             en: 'Worst' },
    'rec.filter_all':     { it: 'Tutte le stelle',      en: 'All stars' },
    'rec.load_more':      { it: 'Carica altre recensioni', en: 'Load more reviews' },

    // ── TOS ───────────────────────────────────────────────────────────────
    'tos.label':          { it: 'Documentazione Legale', en: 'Legal Documentation' },
    'tos.title1':         { it: 'TERMINI &amp;',         en: 'TERMS &amp;' },
    'tos.title2':         { it: 'PRIVACY',               en: 'PRIVACY' },
    'tos.version':        { it: 'Versione 1.0',          en: 'Version 1.0' },
    'tos.update':         { it: 'Ultimo aggiornamento: Aprile 2025', en: 'Last updated: April 2025' },
    'tos.lang':           { it: 'Lingua: Italiano',      en: 'Language: Italian' },
    'tos.tab1':           { it: 'Termini di Servizio',   en: 'Terms of Service' },
    'tos.tab2':           { it: 'Privacy Policy',        en: 'Privacy Policy' },
    'tos.tab3':           { it: 'Cookie Policy',         en: 'Cookie Policy' },
    'tos.contact_title':  { it: 'Domande o Richieste',   en: 'Questions or Requests' },
    'tos.contact_cta':    { it: 'Contatta il Titolare →', en: 'Contact the Owner →' },

    // ── 404 ───────────────────────────────────────────────────────────────
    '404.err':            { it: '// ERRORE DI STAMPA — STRATO NON TROVATO', en: '// PRINT ERROR — LAYER NOT FOUND' },
    '404.title':          { it: 'STRATO MANCANTE',       en: 'MISSING LAYER' },
    '404.sub':            { it: 'La pagina che cerchi non è mai stata estrusa.', en: 'The page you are looking for was never extruded.' },
    '404.desc':           { it: '— il materiale è esaurito a questo livello.', en: '— material ran out at this level.' },
    '404.home':           { it: "TORNA ALL'INIZIO",      en: 'BACK TO START' },
    '404.refresh':        { it: '↺ AGGIORNA',            en: '↺ REFRESH' },

    // ── MAINTENANCE ────────────────────────────────────────────────────────
    'maint.title':        { it: 'SISTEMA IN MANUTENZIONE', en: 'SYSTEM UNDER MAINTENANCE' },
    'maint.offline':      { it: 'SISTEMA TEMPORANEAMENTE OFFLINE', en: 'SYSTEM TEMPORARILY OFFLINE' },
    'maint.badge':        { it: 'MANUTENZIONE',          en: 'MAINTENANCE' },
    'maint.badge2':       { it: 'IN CORSO',              en: 'IN PROGRESS' },
    'maint.sub1':         { it: 'Stiamo lavorando per migliorare la vostra esperienza.', en: 'We are working to improve your experience.' },
    'maint.sub2':         { it: 'Torneremo online presto con novità.', en: 'We will be back online soon with news.' },
    'maint.countdown':    { it: 'RITORNO STIMATO TRA',   en: 'ESTIMATED RETURN IN' },
    'maint.giorni':       { it: 'GIORNI',                en: 'DAYS' },
    'maint.ore':          { it: 'ORE',                   en: 'HOURS' },
    'maint.minuti':       { it: 'MINUTI',                en: 'MINUTES' },
    'maint.secondi':      { it: 'SECONDI',               en: 'SECONDS' },
    'maint.riapertura':   { it: '● RIAPERTURA IMMINENTE — REINDIRIZZAMENTO IN CORSO…', en: '● REOPENING IMMINENT — REDIRECTING…' },
    'maint.progress':     { it: 'AVANZAMENTO LAVORI',    en: 'WORK PROGRESS' },
    'maint.desc':         { it: 'Il sito è in <span>manutenzione programmata</span>. Stiamo aggiornando i sistemi e migliorando le prestazioni. Ci scusiamo per l\'inconveniente.', en: 'The site is under <span>scheduled maintenance</span>. We are updating systems and improving performance. We apologize for the inconvenience.' },
    'maint.sito':         { it: 'SITO OFFLINE',          en: 'SITE OFFLINE' },
    'maint.attiva':       { it: 'MANUTENZIONE ATTIVA',   en: 'MAINTENANCE ACTIVE' },
  };

  // ── Engine ───────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'p3d_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'it';

  function t(key) {
    const entry = DICT[key];
    if (!entry) return null;
    return entry[currentLang] ?? entry['it'];
  }

  function applyTranslations() {
    // data-i18n → innerHTML
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (val !== null) el.innerHTML = val;
    });
    // data-i18n-placeholder → placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const val = t(key);
      if (val !== null) el.placeholder = val;
    });
    // data-i18n-title → title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      const val = t(key);
      if (val !== null) el.title = val;
    });
    // Update html lang attribute
    document.documentElement.lang = currentLang;
    // Update toggle button state (both desktop and mobile)
    ['lang-toggle', 'lang-toggle-mobile'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.setAttribute('data-lang', currentLang);
        const itEl = btn.querySelector('.lang-it');
        const enEl = btn.querySelector('.lang-en');
        if (itEl) itEl.style.opacity = currentLang === 'it' ? '1' : '0.35';
        if (enEl) enEl.style.opacity = currentLang === 'en' ? '1' : '0.35';
      }
    });
  }

  function switchLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations();
    // Dispatch custom event for pages with dynamic content
    document.dispatchEvent(new CustomEvent('p3d:langchange', { detail: { lang } }));
  }

  function toggleLang() {
    switchLang(currentLang === 'it' ? 'en' : 'it');
  }

  // ── Wire static toggle buttons (already in HTML) ─────────────────────────
  function injectToggle() {
    // Buttons are now static in HTML — just wire click events
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', toggleLang);
    }
    const mobileBtn = document.getElementById('lang-toggle-mobile');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', toggleLang);
    }
    // Apply initial state (opacity) to match currentLang from localStorage
    applyTranslations();
  }

  // ── Public API ───────────────────────────────────────────────────────────
  window.P3Di18n = {
    t,
    apply: applyTranslations,
    switch: switchLang,
    toggle: toggleLang,
    lang: () => currentLang,
    dict: DICT,
  };

  // ── Init ─────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { injectToggle(); applyTranslations(); });
  } else {
    injectToggle();
    applyTranslations();
  }

})();
