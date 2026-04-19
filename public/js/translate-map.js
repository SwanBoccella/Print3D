// ============================================================
// PRINT3D STUDIO — translate-map.js
// Motore di traduzione testuale completo IT→EN
// Funziona su TUTTO il DOM senza bisogno di data-i18n
// ============================================================
(function () {
  'use strict';

  const IT_TO_EN = {
    // NAV
    'Home': 'Home',
    'Catalogo': 'Catalog',
    'Materiali': 'Materials',
    'Recensioni': 'Reviews',
    'T&C': 'T&C',
    'Contatti': 'Contact',
    'Prenota': 'Book',
    'Prenota ora': 'Book now',
    'Prenota Ora': 'Book Now',
    'Prenota Ora →': 'Book Now →',
    'Termini & Privacy': 'Terms & Privacy',
    'Termini &amp; Privacy': 'Terms &amp; Privacy',
    'Prenotazione': 'Booking',
    'Navigazione': 'Navigation',

    // HERO / INDEX
    'DAL FILE': 'FROM FILE',
    "ALL'OGGETTO": 'TO OBJECT',
    'REALE.': 'REAL.',
    'Stampa 3D su prenotazione': '3D Printing by Appointment',
    'Stampa 3D artigianale su misura — solo su prenotazione.': 'Handcrafted 3D printing — by appointment only.',
    'Realizziamo ogni idea con precisione millimetrica.': 'We bring every idea to life with millimeter precision.',
    'Inizia la Prenotazione': 'Start Booking',
    'Vedi il Catalogo': 'View Catalog',
    'Vedi il Catalogo →': 'View Catalog →',
    '⬡ STAMPA FDM': '⬡ FDM PRINTING',
    '⬡ SU PRENOTAZIONE': '⬡ BY APPOINTMENT',
    '⬡ QUALSIASI FORMA': '⬡ ANY SHAPE',
    '⬡ CONSEGNA RAPIDA': '⬡ FAST DELIVERY',
    '⬡ PLA & PLA+': '⬡ PLA & PLA+',
    '⬡ LAYER 0.1–0.3mm': '⬡ LAYER 0.1–0.3mm',

    // PROCESS SECTION
    'Come Funziona': 'How It Works',
    'Come funziona': 'How it works',
    'Tre passi verso': 'Three steps toward',
    'il tuo oggetto.': 'your object.',
    "Descrivi l'idea": 'Describe your idea',
    'Mandaci la tua idea, un file 3D o anche solo un disegno. Niente è troppo complesso.': 'Send us your idea, a 3D file or even just a sketch. Nothing is too complex.',
    'Preventivo & Stampa': 'Quote & Print',
    'Ricevi un preventivo in 24h. Approvato il costo, iniziamo la stampa con precisione millimetrica.': 'Receive a quote within 24h. Once approved, we start printing with millimeter precision.',
    'Ritiro o Spedizione': 'Pickup or Shipping',
    'Il tuo oggetto è pronto. Ritiro in zona o spedizione tracciata. Qualità garantita.': 'Your object is ready. Local pickup or tracked shipping. Quality guaranteed.',

    // CATEGORY CARDS
    'Cosa Realizziamo': 'What We Make',
    'Cosa realizziamo': 'What we make',
    'Dalla piccola': 'From small',
    'decorazione al pezzo tecnico.': 'decoration to technical part.',
    'Oggetti Decorativi': 'Decorative Objects',
    'Statue, vasi, sculture, decorazioni su misura per casa e ufficio.': 'Statues, vases, sculptures, custom decorations for home and office.',
    'Componentistica': 'Components',
    'Parti di ricambio, giunti, supporti e pezzi tecnici funzionali.': 'Spare parts, joints, supports and functional technical pieces.',
    'Prototipi': 'Prototypes',
    "Dai vita a un'invenzione o un prodotto. Rapido, preciso, economico.": 'Bring an invention or product to life. Fast, precise, affordable.',
    'Personalizzati': 'Custom Items',
    'Gadget, regali, targhette, portachiavi e molto altro — tutti unici.': 'Gadgets, gifts, nameplates, keychains and more — all unique.',
    'Esplora →': 'Explore →',

    // MATERIAL HIGHLIGHT
    'Materiale Principale': 'Main Material',
    'PLA — Il meglio': 'PLA — The best',
    'per iniziare.': 'place to start.',
    'Il PLA (Acido Polilattico) è un bioplastica derivata da amido di mais. Resistente, preciso, disponibile in decine di colori. Il nostro materiale di riferimento per la maggior parte dei progetti.': 'PLA (Polylactic Acid) is a bioplastic derived from corn starch. Durable, precise, available in dozens of colors. Our reference material for most projects.',
    'Alta precisione dimensionale': 'High dimensional accuracy',
    'Biodegradabile ed ecologico': 'Biodegradable and eco-friendly',
    '30+ colori disponibili': '30+ colors available',
    'Adatto per oggetti decorativi e funzionali': 'Suitable for decorative and functional objects',
    'Scopri tutti i materiali →': 'Discover all materials →',
    'CLICK PER CAMBIARE MODALITÀ': 'CLICK TO CHANGE MODE',

    // CTA STRIP
    "Hai un'idea?": 'Got an idea?',
    'Realizziamola insieme.': "Let's build it together.",

    // FOOTER
    'Stampa 3D artigianale': 'Handcrafted 3D printing',
    'su prenotazione': 'by appointment',
    'Risposta entro 24 ore.': 'Response within 24 hours.',
    'Disponibile Lun–Sab.': 'Available Mon–Sat.',
    'Categorie': 'Categories',
    'Oggetti Decorativi': 'Decorative Objects',
    'Prototipi': 'Prototypes',
    'Personalizzati': 'Custom Items',

    // CATALOG PAGE
    '& Ispirazioni': '& Inspirations',
    'Esempi di': 'Examples of',
    'Esempi di quello che puoi richiedere. Ogni oggetto è personalizzabile.': 'Examples of what you can request. Every object is customizable.',
    'Realizziamo qualsiasi forma. Descrivici il tuo progetto.': 'We make any shape. Describe your project to us.',
    'Tutto': 'All',
    'Decorativi': 'Decorative',
    'Gadget': 'Gadget',
    'Non trovi quello': "Can't find what",
    'che cerchi?': "you're looking for?",

    // MATERIALI PAGE
    'Materiali.': 'Materials.',
    'Specifiche tecniche': 'Technical specs',
    'Scegliamo il materiale giusto per il tuo progetto. Attualmente utilizziamo filamenti PLA di alta qualità.': 'We choose the right material for your project. We currently use high-quality PLA filaments.',
    'Scegliamo il materiale giusto per il tuo progetto. Attualmente PLA in tutte le varianti.': 'We choose the right material for your project. Currently PLA in all variants.',
    'Principale': 'Main',
    'Il punto di partenza per ogni progetto': 'The starting point for every project',
    'Il PLA (Acido Polilattico) è il materiale FDM più diffuso e versatile. Derivato da fonti rinnovabili (amido di mais), è biodegradabile, non tossico e disponibile in una vastissima gamma di colori. Ideale per oggetti decorativi, prototipi e gadget.': 'PLA (Polylactic Acid) is the most widespread and versatile FDM material. Derived from renewable sources (corn starch), it is biodegradable, non-toxic and available in a vast range of colors. Ideal for decorative objects, prototypes and gadgets.',
    'Temperatura stampa': 'Print temperature',
    'Resistenza': 'Resistance',
    'Flessibilità': 'Flexibility',
    'Colori disponibili': 'Available colors',
    'Media': 'Medium',
    'Rigido': 'Rigid',
    'Facile da stampare, alta precisione': 'Easy to print, high precision',
    'Ecologico e biodegradabile': 'Ecological and biodegradable',
    'Ottimo per decorazioni e gadget': 'Great for decorations and gadgets',
    'Non adatto per ambienti umidi prolungati': 'Not suitable for prolonged humid environments',
    'Scarsa resistenza al calore (>60°C)': 'Poor heat resistance (>60°C)',
    'Upgrade': 'Upgrade',
    'Più resistente, stessa facilità': 'More resistant, same ease',
    "+40% resistenza all'impatto vs PLA": '+40% impact resistance vs PLA',
    'Stessa facilità di stampa': 'Same ease of printing',
    'Meno fragile a basse temperature': 'Less brittle at low temperatures',
    'Componentistica, pezzi di ricambio, supporti': 'Components, spare parts, supports',
    'Estetico': 'Aesthetic',
    'Finitura satinata premium': 'Premium satin finish',
    'Filamento PLA con additivi che conferiscono una finitura simile alla seta, lucida e metallica. Perfetto per oggetti decorativi che richiedono un aspetto premium.': 'PLA filament with additives that give a silk-like, glossy and metallic finish. Perfect for decorative objects that require a premium look.',
    'Aspetto satinato/metallizzato': 'Satin/metallic appearance',
    'Effetti bicolore disponibili': 'Bicolor effects available',
    'Ottimo per decorazioni e gioielli': 'Great for decorations and jewelry',
    'Decorazioni, regali, gioielleria': 'Decorations, gifts, jewelry',
    'Finish': 'Finish',
    'Finitura opaca professionale': 'Professional matte finish',
    'PLA con finitura opaca che nasconde le righe di stampa per un aspetto più pulito e professionale. Texture piacevole al tatto.': 'PLA with matte finish that hides print lines for a cleaner, more professional look. Pleasant texture to the touch.',
    'Linee di stampa meno visibili': 'Less visible print lines',
    'Aspetto professionale': 'Professional appearance',
    'Piacevole al tatto': 'Pleasant to the touch',
    'Prototipi, modelli, presentazioni': 'Prototypes, models, presentations',
    'Hai bisogno di un materiale specifico?': 'Need a specific material?',
    'PETG, TPU, ABS, Nylon, ASA — possiamo valutare materiali alternativi su richiesta. Contattaci e troveremo la soluzione migliore per il tuo progetto.': 'PETG, TPU, ABS, Nylon, ASA — we can evaluate alternative materials on request. Contact us and we will find the best solution for your project.',
    'Chiedi informazioni →': 'Request info →',
    'Parametri di stampa': 'Print parameters',
    'Pronto a scegliere': 'Ready to choose',
    'il tuo materiale?': 'your material?',
    'Layer Height standard': 'Standard layer height',
    '0.1 – 0.3mm disponibili su richiesta': '0.1 – 0.3mm available on request',
    'Infill configurabile': 'Configurable infill',
    'Da leggero a completamente solido': 'From light to fully solid',
    'Tolleranza dimensionale': 'Dimensional tolerance',
    'Materiale standard': 'Standard material',
    'Precisione elevata su FDM standard': 'High precision on standard FDM',
    'PLA in tutte le varianti cromatiche': 'PLA in all color variants',
    'Ampia scelta colori': 'Wide color choice',
    'Prenota la tua stampa': 'Book your print',

    // CONTATTI PAGE
    'Siamo qui': "We're here",
    'Rispondiamo.': 'We respond.',
    "Hai domande? Vuoi un preventivo rapido? Siamo a un'email di distanza.": "Got questions? Want a quick quote? We're just an email away.",
    'Email principale': 'Main email',
    'Risposta entro 24 ore — Lun/Sab': 'Reply within 24 hours — Mon/Sat',
    'Disponibilità': 'Availability',
    'Lun – Sab': 'Mon – Sat',
    'Risposta entro 24h lavorative': 'Reply within 24 business hours',
    'Zona operativa': 'Operating area',
    'Italia': 'Italy',
    'Spedizione nazionale disponibile': 'National shipping available',
    'File accettati': 'Accepted files',
    'Invia via email dopo la prenotazione': 'Send via email after booking',
    'Quanto costa una stampa?': 'How much does a print cost?',
    'Il costo dipende da dimensioni, materiale, infill e complessità. Inviaci la prenotazione e riceverai un preventivo personalizzato entro 24 ore — senza impegno.': 'The cost depends on size, material, infill and complexity. Send us the booking and you will receive a personalized quote within 24 hours — no commitment.',
    'Devo avere già il file 3D?': 'Do I need to have a 3D file?',
    "No. Puoi descriverci l'oggetto a parole, inviare un disegno, o trovare un file su siti come Thingiverse/Printables. Aiutiamo anche a trovare o adattare modelli esistenti.": "No. You can describe the object to us in words, send a sketch, or find a file on sites like Thingiverse/Printables. We also help find or adapt existing models.",
    'Quanto tempo ci vuole?': 'How long does it take?',
    'La stampa in sé può richiedere da poche ore a qualche giorno a seconda della dimensione. Con tempi di lavorazione e consegna, contiamo tipicamente 3–7 giorni lavorativi.': 'Printing itself can take from a few hours to a few days depending on size. With processing and delivery times, we typically count 3–7 business days.',
    'Come avviene la consegna?': 'How is delivery handled?',
    'Spedizione postale/corriere su tutto il territorio italiano, o ritiro diretto in zona (da definire). Le spese di spedizione sono a carico del cliente e incluse nel preventivo.': 'Postal/courier shipping throughout Italy, or direct pickup in the area (to be defined). Shipping costs are borne by the customer and included in the quote.',
    'Posso chiedere colori specifici?': 'Can I request specific colors?',
    'Sì, abbiamo oltre 30 colori PLA disponibili tra cui bianco, nero, grigio, rosso, e molti altri. Se hai un colore specifico in mente, indicacelo nella prenotazione e faremo del nostro meglio.': 'Yes, we have over 30 PLA colors available including white, black, gray, red, and many others. If you have a specific color in mind, let us know in the booking and we will do our best.',
    'Domanda non trovata? Scrivici direttamente.': 'Question not found? Write to us directly.',
    "Scrivi un'email →": 'Send an email →',
    'Dove siamo': 'Where we are',
    'Zona operativa: Calenzano e dintorni — spedizione su tutta Italia': 'Operating area: Calenzano and surroundings — shipping across Italy',
    'Calenzano, 50041 FI': 'Calenzano, 50041 FI',
    'Apri in Maps ↗': 'Open in Maps ↗',
    'Firenze': 'Florence',
    'Lun–Sab · Risposta 24h': 'Mon–Sat · Reply 24h',
    'Tempi di risposta': 'Response times',

    // PRENOTAZIONE PAGE
    'la tua stampa.': 'your print.',
    'Compila il modulo — rispondiamo entro 24 ore con preventivo.': 'Fill in the form — we reply within 24 hours with a quote.',
    'Compila la prenotazione — è veloce e senza impegno fino al preventivo.': 'Fill in the booking — it is quick and non-binding until the quote.',
    'Dati personali': 'Personal data',
    'Nome e Cognome *': 'Full Name *',
    'Nome *': 'Name *',
    'Email *': 'Email *',
    'Telefono': 'Phone',
    'Specifiche oggetto': 'Object specifications',
    'Tipo di ordine *': 'Order type *',
    'Oggetto Decorativo': 'Decorative Object',
    'Prototipo': 'Prototype',
    'Personalizzato': 'Custom',
    'Altro — da definire': 'Other — to be defined',
    'Materiale': 'Material',
    'PLA Standard': 'PLA Standard',
    'PLA Matte (opaco)': 'PLA Matte (matte)',
    'PLA Silk (lucido)': 'PLA Silk (glossy)',
    'Colore preferito': 'Preferred color',
    'Indicalo nella prenotazione — se non sei sicuro, ti consigliamo noi.': 'State it in the booking — if you are not sure, we will advise you.',
    'Quantità': 'Quantity',
    'Consegna desiderata entro': 'Desired delivery by',
    'Descrizione oggetto *': 'Object description *',
    'Descrizione dettagliata, file disponibili, preferenze': 'Detailed description, available files, preferences',
    'Note aggiuntive': 'Additional notes',
    'Invia Prenotazione': 'Send Booking',
    'risposta con preventivo': 'reply with quote',
    'Oggetto pronto in 2–7gg': 'Object ready in 2–7 days',
    'Ricevi preventivo via email': 'Receive quote by email',
    'Contatto diretto': 'Direct contact',
    'PLA — disponibile in oltre 30 colori. Su richiesta è possibile valutare materiali alternativi.': 'PLA — available in over 30 colors. Other materials can be evaluated on request.',
    'Se hai file 3D (.STL, .OBJ, .3MF), inviaci tutto via email dopo la prenotazione a': 'If you have 3D files (.STL, .OBJ, .3MF), send everything by email after booking to',
    'Prenotazione Inviata!': 'Booking Sent!',
    'Abbiamo ricevuto la tua richiesta.': 'We have received your request.',
    'Riceverai risposta entro 24 ore.': 'You will receive a reply within 24 hours.',
    'Torna alla Home': 'Back to Home',
    'Richiedi un Preventivo': 'Request a Quote',

    // RECENSIONI PAGE
    'Cosa dicono': 'What they say',
    'I Nostri Lavori': 'Our Works',
    'I nostri': 'Our',
    'nostri clienti': 'customers',
    'Ogni recensione è autentica. Leggi le esperienze di chi ha già stampato con noi, o condividi la tua.': 'Every review is authentic. Read the experiences of those who have already printed with us, or share yours.',
    'Ogni recensione è autentica. Leggi le esperienze di chi ha già stampato con noi.': 'Every review is authentic. Read the experiences of those who have already printed with us.',
    'Opinioni Verificate': 'Verified Opinions',
    'Tutte le stelle': 'All stars',
    'Tutte le recensioni': 'All reviews',
    'Recenti': 'Recent',
    'Migliori': 'Best',
    'Peggiori': 'Worst',
    'Carica altre recensioni': 'Load more reviews',
    '0 recensioni': '0 reviews',
    'Consiglierebbero': 'Would recommend',
    'Voci': 'Reviews',
    'Lascia il tuo feedback': 'Leave your feedback',
    'Scrivi una Recensione': 'Write a Review',
    'esperienza': 'experience',
    "— Hai già ordinato con noi? Raccontaci com'è andata.": '— Have you already ordered with us? Tell us how it went.',
    'La tua': 'Your',
    'La tua valutazione *': 'Your rating *',
    'Titolo *': 'Title *',
    'Recensione *': 'Review *',
    'Email': 'Email',
    'Non verrà mostrata pubblicamente': 'Will not be shown publicly',
    'Invia Recensione': 'Submit Review',
    'autentiche': 'authentic',
    'Soggetta a moderazione prima': 'Subject to moderation before',
    'della pubblicazione': 'publication',
    'Grazie per il tuo feedback. Sarà pubblicata dopo la moderazione (di solito entro 24h).': 'Thank you for your feedback. It will be published after moderation (usually within 24h).',
    'Le recensioni vengono verificate prima della pubblicazione per garantire autenticità e rispetto delle linee guida.': 'Reviews are verified before publication to ensure authenticity and compliance with our guidelines.',
    'Recensione Inviata!': 'Review Submitted!',
    'Verificato': 'Verified',

    // CATEGORY PAGES (shared)
    'produzione': 'production',
    'Ogni pezzo è stampato su ordinazione. Nessun magazzino, massima qualità.': 'Every piece is printed on demand. No stock, maximum quality.',
    'Preventivo': 'Quote',
    'Ricevi un preventivo personalizzato entro 24 ore lavorative, con materiale e tempi.': 'Receive a personalized quote within 24 business hours, with material and timeline.',
    'Ricevi un preventivo personalizzato entro 24 ore lavorative, con costi, tempi e materiali.': 'Receive a personalized quote within 24 business hours, with costs, timeline and materials.',
    'Stampa': 'Print',
    'Avviamo la produzione. Ogni layer è controllato per garantire la qualità finale.': 'We start production. Every layer is monitored to ensure final quality.',
    "Avviamo la produzione. Ogni layer è controllato per garantire la massima qualità.": 'We start production. Every layer is monitored to ensure maximum quality.',
    'Consegna': 'Delivery',
    "Ritiro diretto o spedizione tracciata. L'oggetto arriva esattamente come l'hai immaginato.": 'Direct pickup or tracked shipping. The object arrives exactly as you imagined it.',
    "Mandaci il tuo file STL o descrivi l'oggetto che vuoi. Più dettagli hai, meglio è.": 'Send us your STL file or describe the object you want. The more details you give us, the better.',
    'Approvi e iniziamo': 'You approve and we start',
    'Pronto a Iniziare?': 'Ready to Start?',
    'Pronto a iniziare?': 'Ready to start?',
    'in 4 passi.': 'in 4 steps.',
    'nei dettagli.': 'in the details.',
    'conta.': 'matters.',
    'Dal concept all\'oggetto': 'From concept to object',
    'Compili il modulo': 'Fill in the form',
    'Ricevi un preventivo in 24h. Approvato il costo, iniziamo la stampa con precisione millimetrica.': 'Receive a quote within 24h. Once approved, we start printing with millimeter precision.',
    'scroll': 'scroll',

    // TOS — section titles
    'TERMINI DI SERVIZIO': 'TERMS OF SERVICE',
    'PRIVACY POLICY': 'PRIVACY POLICY',
    'COOKIE POLICY': 'COOKIE POLICY',
    'Legal': 'Legal',
    'GDPR Compliant': 'GDPR Compliant',
    'Tracking': 'Tracking',
    'Scrivici.': 'Write to us.',

    // TOS — headings
    '1.1 — Definizioni': '1.1 — Definitions',
    '1.2 — Modalità di Ordine': '1.2 — Order Process',
    '1.3 — Preventivi e Prezzi': '1.3 — Quotes and Prices',
    '1.4 — Pagamento': '1.4 — Payment',
    '1.5 — Consegna e Ritiro': '1.5 — Delivery and Pickup',
    '1.6 — Garanzia e Difetti': '1.6 — Warranty and Defects',
    '1.7 — Limitazione di Responsabilità': '1.7 — Limitation of Liability',
    '1.8 — Legge Applicabile': '1.8 — Applicable Law',
    '2.1 — Titolare del Trattamento': '2.1 — Data Controller',
    '2.2 — Dati Raccolti': '2.2 — Data Collected',
    '2.3 — Finalità e Base Giuridica': '2.3 — Purposes and Legal Basis',
    '2.4 — Comunicazione a Terzi': '2.4 — Disclosure to Third Parties',
    '2.5 — Diritti dell\'Interessato': '2.5 — Rights of the Data Subject',
    '2.6 — Sicurezza dei Dati': '2.6 — Data Security',
    '3.1 — Cosa sono i Cookie': '3.1 — What are Cookies',
    '3.2 — Tipologie di Cookie Utilizzati': '3.2 — Types of Cookies Used',
    '3.3 — Cookie Tecnici (Necessari)': '3.3 — Technical Cookies (Necessary)',
    '3.4 — Cookie Analitici': '3.4 — Analytical Cookies',
    '3.5 — Gestione e Disabilitazione': '3.5 — Management and Disabling',
    '3.6 — Aggiornamenti alla Cookie Policy': '3.6 — Cookie Policy Updates',

    // TOS 1.x — text nodes (pure text inside elements with inline <strong>/<a>)
    'Importante': 'Important',
    '«Servizio»': '«Service»',
    'si intende l\'attività di stampa 3D artigianale su prenotazione offerta da Print3D Studio, accessibile tramite il sito web': 'means the handcrafted 3D printing service offered by Print3D Studio, accessible via the website',
    'e via contatto diretto.': 'and via direct contact.',
    '«Cliente»': '«Client»',
    'indica qualsiasi persona fisica o giuridica che richiede un preventivo o effettua un ordine presso Print3D Studio.': 'means any natural or legal person who requests a quote or places an order with Print3D Studio.',
    '«Oggetto»': '«Object»',
    'indica il manufatto fisico prodotto mediante tecnologia FDM (Fused Deposition Modeling) su richiesta specifica del Cliente.': 'means the physical item produced using FDM (Fused Deposition Modeling) technology at the specific request of the Client.',
    'Il servizio è erogato esclusivamente': 'The service is provided exclusively',
    'su prenotazione': 'by appointment',
    '. Per avviare un ordine è necessario:': '. To start an order you must:',
    'Compilare il modulo di prenotazione sul sito o contattare via email': 'Fill in the booking form on the website or contact us by email',
    'Fornire un file 3D (STL, OBJ, STEP) o una descrizione dettagliata dell\'oggetto desiderato': 'Provide a 3D file (STL, OBJ, STEP) or a detailed description of the desired object',
    'Attendere il preventivo personalizzato entro 24 ore lavorative': 'Wait for a personalised quote within 24 business hours',
    'Confermare l\'ordine tramite accettazione esplicita del preventivo': 'Confirm the order via explicit acceptance of the quote',
    'L\'ordine si considera concluso solo a seguito di conferma scritta (email) da parte di Print3D Studio.': 'The order is considered finalised only upon written confirmation (email) from Print3D Studio.',
    'I preventivi hanno validità di': 'Quotes are valid for',
    '7 giorni solari': '7 calendar days',
    'dalla data di emissione. Il prezzo è determinato da: volume di stampa, materiale scelto, complessità geometrica, finiture richieste e tempi di consegna.': 'from the date of issue. The price is determined by: print volume, chosen material, geometric complexity, required finishes and delivery times.',
    'Print3D Studio si riserva il diritto di modificare i prezzi in qualsiasi momento. Ogni variazione non avrà effetto sugli ordini già confermati. I prezzi esposti sul sito sono indicativi e non vincolanti.': 'Print3D Studio reserves the right to modify prices at any time. Any change will not affect already confirmed orders. Prices shown on the website are indicative and non-binding.',
    'Il pagamento avviene secondo le modalità concordate al momento della conferma ordine (bonifico bancario, contanti al ritiro o altri metodi comunicati di volta in volta). È richiesto il pagamento integrale': 'Payment is made according to the methods agreed upon at order confirmation (bank transfer, cash on pickup or other methods communicated case by case). Full payment is required',
    'prima dell\'avvio della stampa': 'before the start of printing',
    ', salvo diverso accordo scritto.': ', unless otherwise agreed in writing.',
    'Print3D Studio offre due modalità di consegna:': 'Print3D Studio offers two delivery methods:',
    'Ritiro diretto': 'Direct pickup',
    '— il Cliente ritira l\'oggetto presso il luogo concordato': '— the Client collects the object at the agreed location',
    'Spedizione tracciata': 'Tracked shipping',
    '— a carico del Cliente, tramite corriere selezionato da Print3D Studio': '— at the Client\'s expense, via courier selected by Print3D Studio',
    'I tempi di consegna indicati sono stimati e non garantiti contrattualmente. Ritardi dovuti a problemi tecnici, rotture del filamento o cause di forza maggiore non costituiscono inadempimento.': 'Indicated delivery times are estimated and not contractually guaranteed. Delays due to technical problems, filament breaks or force majeure do not constitute a breach.',
    'Print3D Studio garantisce che gli oggetti prodotti rispettino le specifiche concordate in fase di preventivo. In caso di difetti imputabili alla produzione, il Cliente ha diritto a:': 'Print3D Studio guarantees that produced objects meet the specifications agreed at the quote stage. In case of defects attributable to production, the Client is entitled to:',
    'Ristampa gratuita dell\'oggetto difettoso entro 14 giorni dalla ricezione': 'Free reprint of the defective object within 14 days of receipt',
    'Rimborso parziale o totale, a discrezione di Print3D Studio': 'Partial or full refund, at Print3D Studio\'s discretion',
    'La garanzia non copre: danni da uso improprio, difetti derivanti da file 3D forniti dal Cliente con geometrie problematiche, variazioni cromatiche fisiologiche dei materiali PLA.': 'The warranty does not cover: damage from improper use, defects arising from 3D files provided by the Client with problematic geometries, physiological colour variations in PLA materials.',
    'Print3D Studio non è responsabile per danni indiretti, consequenziali o speciali derivanti dall\'uso degli oggetti prodotti. La responsabilità massima di Print3D Studio è limitata al valore dell\'ordine specifico.': 'Print3D Studio is not liable for indirect, consequential or special damages arising from the use of produced objects. The maximum liability of Print3D Studio is limited to the value of the specific order.',
    'Il Cliente è responsabile della legalità dei file 3D forniti e garantisce di detenere i diritti necessari per la riproduzione degli stessi. Print3D Studio si riserva il diritto di rifiutare ordini che violino diritti di terzi o normative vigenti.': 'The Client is responsible for the legality of the 3D files provided and guarantees holding the necessary rights for their reproduction. Print3D Studio reserves the right to refuse orders that violate third-party rights or applicable regulations.',
    'I presenti Termini sono disciplinati dal diritto italiano. Per qualsiasi controversia è competente il Foro di residenza del consumatore, ai sensi del Codice del Consumo (D.Lgs. 206/2005).': 'These Terms are governed by Italian law. For any dispute, jurisdiction lies with the Court of the consumer\'s place of residence, pursuant to the Consumer Code (Legislative Decree 206/2005).',

    // TOS 2.x — Privacy
    'Ai sensi del GDPR': 'Pursuant to the GDPR',
    '— Il presente documento costituisce l\'informativa sul trattamento dei dati personali ai sensi dell\'art. 13 del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.': '— This document constitutes the information notice on personal data processing pursuant to Art. 13 of EU Regulation 2016/679 (GDPR) and Legislative Decree 196/2003 as amended by Legislative Decree 101/2018.',
    'Il Titolare del trattamento dei dati personali è': 'The Data Controller for personal data is',
    ', raggiungibile all\'indirizzo email': ', reachable at the email address',
    '. Per esercitare i propri diritti o per qualsiasi richiesta relativa al trattamento dei dati, l\'utente può contattare direttamente il Titolare.': '. To exercise your rights or for any request relating to data processing, the user may contact the Controller directly.',
    'Print3D Studio raccoglie le seguenti categorie di dati personali:': 'Print3D Studio collects the following categories of personal data:',
    'Dati identificativi': 'Identification data',
    '— nome, cognome, indirizzo email, numero di telefono (forniti dal Cliente tramite moduli di contatto o prenotazione)': '— first name, last name, email address, phone number (provided by the Client via contact or booking forms)',
    'Dati di navigazione': 'Navigation data',
    '— indirizzo IP, browser, sistema operativo, pagine visitate, timestamp (raccolti automaticamente dai server)': '— IP address, browser, operating system, pages visited, timestamp (collected automatically by servers)',
    'Dati di comunicazione': 'Communication data',
    '— contenuto delle email e messaggi inviati a Print3D Studio': '— content of emails and messages sent to Print3D Studio',
    'File di progetto': 'Project files',
    '— file 3D e descrizioni tecniche forniti dal Cliente per la produzione': '— 3D files and technical descriptions provided by the Client for production',
    'Non vengono raccolti dati sensibili (salute, opinioni politiche, dati biometrici) né dati di minori di 16 anni. In caso di dubbio sull\'età dell\'utente, Print3D Studio si riserva di richiedere conferma.': 'No sensitive data (health, political opinions, biometric data) or data of minors under 16 are collected. If there is any doubt about the user\'s age, Print3D Studio reserves the right to request confirmation.',
    'I dati personali non vengono venduti né ceduti a terzi per finalità commerciali. Possono essere comunicati esclusivamente a:': 'Personal data is not sold or transferred to third parties for commercial purposes. It may be disclosed exclusively to:',
    'Corrieri e spedizionieri (per l\'evasione degli ordini)': 'Couriers and shippers (for order fulfilment)',
    'Fornitori di servizi IT (hosting, email) operanti come responsabili del trattamento': 'IT service providers (hosting, email) acting as data processors',
    'Autorità competenti, nei casi previsti dalla legge': 'Competent authorities, in cases required by law',
    'Eventuali trasferimenti di dati verso Paesi extra-UE avvengono solo in presenza di garanzie adeguate (decisione di adeguatezza o clausole contrattuali standard della Commissione Europea).': 'Any transfers of data to non-EU countries take place only in the presence of adequate safeguards (adequacy decision or standard contractual clauses of the European Commission).',
    'Ai sensi degli artt. 15–22 del GDPR, l\'utente ha diritto di:': 'Pursuant to Arts. 15–22 of the GDPR, the user has the right to:',
    'Accesso': 'Access',
    '— ottenere conferma del trattamento e copia dei dati': '— obtain confirmation of processing and a copy of the data',
    'Rettifica': 'Rectification',
    '— correggere dati inesatti o incompleti': '— correct inaccurate or incomplete data',
    'Cancellazione («diritto all\'oblio»)': 'Erasure («right to be forgotten»)',
    '— richiedere la rimozione dei dati': '— request removal of the data',
    'Limitazione': 'Restriction',
    '— limitare il trattamento in determinati casi': '— restrict processing in certain cases',
    'Portabilità': 'Portability',
    '— ricevere i dati in formato strutturato': '— receive data in a structured format',
    'Opposizione': 'Objection',
    '— opporsi al trattamento basato su interesse legittimo': '— object to processing based on legitimate interest',
    'Revoca del consenso': 'Withdrawal of consent',
    '— revocare in qualsiasi momento il consenso prestato': '— withdraw consent given at any time',
    '. Il Titolare risponderà entro 30 giorni. È possibile proporre reclamo al Garante per la Protezione dei Dati Personali (': '. The Controller will respond within 30 days. You may lodge a complaint with the Italian Data Protection Authority (',
    ').': ').',
    'Print3D Studio adotta misure tecniche e organizzative adeguate per proteggere i dati personali da accesso non autorizzato, distruzione, perdita o divulgazione. Il sito utilizza connessione HTTPS con crittografia TLS. In caso di violazione dei dati (data breach) che presenti rischi per i diritti degli interessati, verrà notificata all\'Autorità competente entro 72 ore e, ove necessario, agli interessati stessi.': 'Print3D Studio adopts adequate technical and organisational measures to protect personal data from unauthorised access, destruction, loss or disclosure. The site uses HTTPS connection with TLS encryption. In case of a data breach that poses risks to the rights of data subjects, it will be notified to the competent Authority within 72 hours and, where necessary, to the data subjects themselves.',

    // TOS 3.x — Cookie
    'Ai sensi della Direttiva ePrivacy': 'Pursuant to the ePrivacy Directive',
    '— Il presente documento descrive le tipologie di cookie utilizzati dal sito print3dstudio.it, in conformità con la normativa vigente (D.Lgs. 69/2012 e Provvedimento del Garante dell\'8 gennaio 2015).': '— This document describes the types of cookies used by the site print3dstudio.it, in accordance with current regulations (Legislative Decree 69/2012 and the Data Protection Authority Provision of 8 January 2015).',
    'I cookie sono piccoli file di testo memorizzati nel browser dell\'utente quando visita un sito web. Vengono utilizzati per migliorare l\'esperienza di navigazione, ricordare le preferenze dell\'utente e raccogliere informazioni statistiche sull\'utilizzo del sito.': 'Cookies are small text files stored in the user\'s browser when visiting a website. They are used to improve the browsing experience, remember user preferences and collect statistical information about site usage.',
    'Il sito Print3D Studio utilizza cookie in modo minimale, privilegiando la privacy dell\'utente. Non vengono utilizzati cookie di profilazione per fini pubblicitari.': 'The Print3D Studio website uses cookies minimally, prioritising user privacy. No profiling cookies are used for advertising purposes.',
    'I cookie tecnici sono': 'Technical cookies are',
    'strettamente necessari': 'strictly necessary',
    'al funzionamento del sito e non richiedono consenso preventivo. Vengono utilizzati per: gestire le sessioni di navigazione, ricordare le preferenze di consenso e garantire la sicurezza del sito.': 'for the operation of the site and do not require prior consent. They are used to: manage browsing sessions, remember consent preferences and ensure site security.',
    'I cookie analitici vengono attivati solo previo consenso dell\'utente. Se abilitati, raccolgono informazioni aggregate e anonime su: pagine visitate, durata della sessione, dispositivo e browser utilizzati. Queste informazioni vengono elaborate da Google Analytics (Google LLC, USA) nel rispetto delle garanzie previste dal GDPR.': 'Analytical cookies are activated only with the user\'s prior consent. If enabled, they collect aggregate and anonymous information on: pages visited, session duration, device and browser used. This information is processed by Google Analytics (Google LLC, USA) in compliance with GDPR guarantees.',
    'L\'utente può gestire le preferenze sui cookie in qualsiasi momento attraverso:': 'The user can manage cookie preferences at any time through:',
    'Banner cookie': 'Cookie banner',
    '— al primo accesso al sito è presente un banner che consente di accettare o rifiutare i cookie non necessari': '— on first access to the site a banner allows you to accept or refuse non-necessary cookies',
    'Impostazioni del browser': 'Browser settings',
    '— ogni browser consente di bloccare o eliminare i cookie. Si noti che la disabilitazione dei cookie tecnici potrebbe compromettere il corretto funzionamento del sito': '— every browser allows you to block or delete cookies. Note that disabling technical cookies may compromise the proper functioning of the site',
    'Email': 'Email',
    '— è possibile richiedere informazioni o la cancellazione dei dati raccolti via cookie a': '— you can request information or deletion of data collected via cookies at',
    'La presente Cookie Policy può essere aggiornata periodicamente. Le modifiche significative verranno comunicate tramite un avviso visibile sul sito. Si raccomanda di consultare regolarmente questa pagina per restare aggiornati.': 'This Cookie Policy may be updated periodically. Significant changes will be communicated via a visible notice on the site. It is recommended to consult this page regularly to stay updated.',

    // COMMON / MISC
    'Precisione': 'Precision',
    'Altro': 'Other',
    'Categoria': 'Category',
    'Inizia il processo': 'Start the process',
    'Inizia la Prenotazione': 'Start Booking',
    'Dal concept all\'oggetto': 'From concept to object',
  };

  // ── Snapshot-based engine ────────────────────────────────────────────────
  // Snapshots all translatable text nodes at init time (always IT baseline).
  // On every lang change, restores the IT snapshot first, then applies EN map.
  // This makes applyTranslation() fully idempotent and toggle-safe.

  const SKIP_TAGS = new Set(['SCRIPT','STYLE','NOSCRIPT','SVG','PATH','CANVAS','INPUT','TEXTAREA','SELECT','META','LINK','BUTTON']);

  // { node: WeakRef, originalValue: string }[]
  const snapshots = [];

  function collectSnapshots(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent) continue;
      if (SKIP_TAGS.has(parent.tagName)) continue;
      if (parent.closest('script,style,svg')) continue;
      const trimmed = node.nodeValue.trim();
      // Only snapshot nodes whose text appears in our IT→EN map
      if (trimmed && IT_TO_EN[trimmed] !== undefined) {
        snapshots.push({ node, original: node.nodeValue });
      }
    }
    // Snapshots for placeholder / title attributes
    document.querySelectorAll('[placeholder]').forEach(el => {
      const v = el.getAttribute('placeholder').trim();
      if (IT_TO_EN[v] !== undefined) {
        el._p3d_placeholder_it = el.getAttribute('placeholder');
      }
    });
    document.querySelectorAll('[title]').forEach(el => {
      const v = el.getAttribute('title').trim();
      if (IT_TO_EN[v] !== undefined) {
        el._p3d_title_it = el.getAttribute('title');
      }
    });
  }

  function applyTranslation(lang) {
    for (const snap of snapshots) {
      if (!snap.node.parentElement) continue; // node removed from DOM
      if (lang === 'en') {
        const trimmed = snap.original.trim();
        const translated = IT_TO_EN[trimmed];
        if (translated !== undefined) {
          snap.node.nodeValue = snap.node.nodeValue.replace(trimmed, translated);
        }
      } else {
        // Restore Italian original
        snap.node.nodeValue = snap.original;
      }
    }
    // Placeholders
    document.querySelectorAll('[placeholder]').forEach(el => {
      if (lang === 'en' && el._p3d_placeholder_it) {
        const en = IT_TO_EN[el._p3d_placeholder_it.trim()];
        if (en) el.setAttribute('placeholder', en);
      } else if (lang === 'it' && el._p3d_placeholder_it) {
        el.setAttribute('placeholder', el._p3d_placeholder_it);
      }
    });
    // Titles
    document.querySelectorAll('[title]').forEach(el => {
      if (lang === 'en' && el._p3d_title_it) {
        const en = IT_TO_EN[el._p3d_title_it.trim()];
        if (en) el.setAttribute('title', en);
      } else if (lang === 'it' && el._p3d_title_it) {
        el.setAttribute('title', el._p3d_title_it);
      }
    });
  }

  // Listen for language changes dispatched by i18n.js
  document.addEventListener('p3d:langchange', function(e) {
    applyTranslation(e.detail.lang);
  });

  function init() {
    collectSnapshots(document.body);
    const saved = localStorage.getItem('p3d_lang') || 'it';
    if (saved === 'en') applyTranslation('en');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
