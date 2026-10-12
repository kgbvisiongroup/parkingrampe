/**
 * Starting content, taken from the current parkingrampe.rs site and translated to English.
 * Run once with `npm run seed`. After that, everything is edited in the CMS at /admin.
 */

export class L<T = string> {
  constructor(
    public sr: T,
    public en: T,
  ) {}
}
export const l = <T = string>(sr: T, en: T) => new L<T>(sr, en)

const UP = 'https://parkingrampe.rs/wp-content/uploads'

/** Images from the current site. The seed downloads them; key = name used below. */
export const images: Record<string, { url: string; alt: L }> = {
  logo: { url: `${UP}/2024/03/logo_copy.png`, alt: l('KGB Automation logo', 'KGB Automation logo') },
  favicon: { url: `${UP}/2024/04/favico.png`, alt: l('KGB ikonica', 'KGB icon') },
  heroGate: {
    url: `${UP}/2025/04/Dettaglio_storm_001-min-scaled-e1744314628763.avif`,
    alt: l('Motor za kliznu kapiju ispred drvene ograde', 'Sliding gate motor in front of a wooden fence'),
  },
  heroBarrier: {
    url: `${UP}/2025/04/Ingresso_Camion_001-min-scaled.avif`,
    alt: l('Parking rampa na ulazu za kamione', 'Parking barrier at a truck entrance'),
  },
  heroAccess: {
    url: `${UP}/2025/04/ingresso_pedonale_002-min-scaled.avif`,
    alt: l('Pešački ulaz sa kontrolom pristupa', 'Pedestrian entrance with access control'),
  },
  quality: {
    url: `${UP}/2025/04/Dettaglio_storm_001-min-1-scaled.avif`,
    alt: l('Detalj motora za kapiju Key Automation', 'Detail of a Key Automation gate motor'),
  },
  turbo: { url: `${UP}/2025/04/Dettaglio_turbo_s_001-1024x724.avif`, alt: l('Key Turbo motor za kapiju', 'Key Turbo gate motor') },
  gateView: { url: `${UP}/2024/03/View_14-1024x570.jpg`, alt: l('Automatska klizna kapija', 'Automatic sliding gate') },
  accessView: { url: `${UP}/2024/04/View_15-1024x569.webp`, alt: l('Kontrola pristupa na ulazu u objekat', 'Access control at a building entrance') },
  accessEgo: { url: `${UP}/2024/04/AAAego-view-13-copia-1024x537.webp`, alt: l('Stubić sa čitačem kartica', 'Card reader column') },
  barrierInstall1: { url: `${UP}/2024/04/9logo-768x1024.jpg`, alt: l('Ugrađena parking rampa', 'Installed parking barrier') },
  barrierInstall2: { url: `${UP}/2024/04/4log-768x1024.jpg`, alt: l('Parking rampa sa LED osvetljenjem', 'Parking barrier with LED lighting') },
  barrierInstall3: { url: `${UP}/2024/04/6d991639-b481-4a7b-82a5-f2387bffe101-1-768x499.jpg`, alt: l('Parking rampa na ulazu u parking', 'Barrier at a car park entrance') },
  alt424: { url: `${UP}/2024/04/900ALT424K_image-min-e1713287463292.png`, alt: l('Key ALT parking rampa', 'Key ALT barrier') },
  alt462: { url: `${UP}/2024/04/150403164080_alt462_390x390-jpg.webp`, alt: l('Key ALT – LED osvetljenje', 'Key ALT – LED lighting') },
  alt461: { url: `${UP}/2024/04/150403163870_alt461_390x390-jpg.webp`, alt: l('Key ALT mehanizam', 'Key ALT mechanism') },
  kube: { url: `${UP}/2024/04/900KUBEPRO_WEB-1024x768.png`, alt: l('Key Kube Pro', 'Key Kube Pro') },
  sun: { url: `${UP}/2024/04/900KUND2ES_WEB-1024x768.png`, alt: l('Key Sun motor za kapiju', 'Key Sun gate motor') },
  ray: { url: `${UP}/2024/04/900RAY2524_WEB-1024x768.png`, alt: l('Key Ray motor za krilnu kapiju', 'Key Ray swing gate motor') },
  revo: { url: `${UP}/2024/04/900REP2024S_WEB-1024x768.png`, alt: l('Key Revo+ motor za kapiju', 'Key Revo+ gate motor') },
  gateInstall1: { url: `${UP}/2024/04/IMG_8625-1024x1024.webp`, alt: l('Ugrađen motor za kapiju', 'Installed gate motor') },
  gateInstall2: { url: `${UP}/2024/04/IMG_8626-1024x1024.webp`, alt: l('Motor na kliznoj kapiji', 'Motor on a sliding gate') },
  gateInstall3: { url: `${UP}/2024/04/IMG_8627-1024x1024.webp`, alt: l('Automatizovana kapija', 'Automated gate') },
  keypad: {
    url: `${UP}/elementor/thumbs/IMG_2420-scaled-e1713089893627-qmzadf63jc2p059r31y8y4yutxd669hdq9i7rpy9hk.webp`,
    alt: l('Šifrator sa čitačem Mifare kartica', 'Keypad with Mifare card reader'),
  },
  uhf: {
    url: `${UP}/elementor/thumbs/1-a-scaled-e1713090021536-qmzad5rpmzpts1nelxvz97c8w2ni1ag2cyzcyyc77s.webp`,
    alt: l('UHF čitač kartica za vozila', 'UHF card reader for vehicles'),
  },
  anpr: {
    url: `${UP}/elementor/thumbs/Apnr-kamera-1-scaled-e1713091679596-qn18qm7q1ntu3xnv01ieow7s93kegm3e0f2khdyglk.webp`,
    alt: l('Kamera za prepoznavanje tablica', 'Licence plate recognition camera'),
  },
  turnstile: {
    url: `${UP}/elementor/thumbs/Turniket-1-scaled-qmzacm13ngyt08g2t7ctaubkezcsjn9pa9a5w55gug.webp`,
    alt: l('Turniket za pešački prolaz', 'Pedestrian turnstile'),
  },
  intercom: {
    url: `${UP}/elementor/thumbs/Interfonski-sistem-1-scaled-e1713092642520-qmzaci9qw4tnpsljf5qb0v9q1fvbouurxqo7z1b1jc.webp`,
    alt: l('Interfonski sistem', 'Intercom system'),
  },
  p1: { url: `${UP}/2024/03/View_01.jpg`, alt: l('Ugrađena automatika na ulazu', 'Automation installed at an entrance') },
  p2: { url: `${UP}/2024/03/View_03-jpg.webp`, alt: l('Parking rampa na ulazu', 'Barrier at an entrance') },
  p3: { url: `${UP}/2024/03/View_04.jpg`, alt: l('Automatska kapija', 'Automatic gate') },
  p4: { url: `${UP}/2024/03/View_06.jpg`, alt: l('Kontrola pristupa', 'Access control') },
  p5: { url: `${UP}/2024/03/View_07.jpg`, alt: l('Parking rampa', 'Parking barrier') },
  p6: { url: `${UP}/2024/03/View_08.jpg`, alt: l('Klizna kapija sa motorom', 'Sliding gate with motor') },
  p7: { url: `${UP}/2024/03/View_09.jpg`, alt: l('Ulaz u poslovni objekat', 'Business premises entrance') },
  p8: { url: `${UP}/2024/03/1View_03.jpg`, alt: l('Rampa na izlazu sa parkinga', 'Barrier at a car park exit') },
  p9: { url: `${UP}/2024/03/1View_04.jpg`, alt: l('Krilna kapija sa motorom', 'Swing gate with motor') },
  p10: { url: `${UP}/2024/03/1View_05.jpg`, alt: l('Kontrola pristupa vozila', 'Vehicle access control') },
  c1: { url: `${UP}/2024/03/logo-cir-300x132.webp`, alt: l('Logo klijenta', 'Client logo') },
  c2: { url: `${UP}/2024/03/bw-logo-1-300x169.webp`, alt: l('Logo klijenta', 'Client logo') },
  c3: { url: `${UP}/2024/03/mts-logo-FDAB97445E-seeklogo.com_-1-1.webp`, alt: l('mts logo', 'mts logo') },
  c4: { url: `${UP}/2024/03/pionir-logo.webp`, alt: l('Pionir logo', 'Pionir logo') },
  c5: { url: `${UP}/2024/03/download-e1695678551488.webp`, alt: l('Logo klijenta', 'Client logo') },
  c6: { url: `${UP}/2024/03/eps_logo_1100x500-300x136.webp`, alt: l('EPS logo', 'EPS logo') },
  c7: { url: `${UP}/2024/03/sluzbeni_glasnik_logo_2019-300x132.webp`, alt: l('Službeni glasnik logo', 'Službeni glasnik logo') },
}

export type ImageKey = keyof typeof images

/** Rich text block types for the seed: p = paragraph, h = heading, ul = list. */
export type Block = { p: string } | { h: string } | { ul: string[] }
export const rt = (sr: Block[], en: Block[]) => l<Block[]>(sr, en)

export const faqs = [
  {
    q: l('Koji tipovi automatskih kapija postoje?', 'What types of automatic gates are there?'),
    a: l(
      'Postoje klizne, krilne i segmentne kapije, a izbor zavisi od prostora i potreba korisnika.',
      'There are sliding, swing and sectional gates. The right choice depends on the available space and how the gate is used.',
    ),
  },
  {
    q: l('Da li automatske kapije rade i kada nestane struje?', 'Do automatic gates work during a power cut?'),
    a: l(
      'Da, uz dodatak baterijskog napajanja ili mehanizam za ručno otključavanje, kapija se može koristiti i bez struje.',
      'Yes. With a backup battery or a manual release mechanism, the gate can be used without mains power.',
    ),
  },
  {
    q: l('Koliko traje ugradnja parking rampe?', 'How long does a barrier installation take?'),
    a: l(
      'Ugradnja obično traje jedan dan, uz prethodnu pripremu terena i priključaka.',
      'Installation usually takes one day, once the ground and power connections are prepared.',
    ),
  },
  {
    q: l('Da li parking rampe imaju zaštitu od udara?', 'Do parking barriers protect against hitting vehicles?'),
    a: l(
      'Da, većina modela ima senzore koji sprečavaju spuštanje rampe kada je vozilo ispod.',
      'Yes. Most models have sensors that stop the arm from lowering while a vehicle is underneath.',
    ),
  },
  {
    q: l(
      'Može li se sistem kontrole pristupa povezati sa postojećim softverom?',
      'Can the access control system connect to existing software?',
    ),
    a: l(
      'U većini slučajeva – da. Naši sistemi su kompatibilni sa standardnim softverima i bazama podataka.',
      'In most cases, yes. Our systems work with standard software and databases.',
    ),
  },
  {
    q: l('Šta ako korisnik izgubi karticu za pristup?', 'What if someone loses their access card?'),
    a: l(
      'Karticu je moguće deaktivirati i izdati novu bez kompromitovanja sistema.',
      'The card can be deactivated and a new one issued without compromising the system.',
    ),
  },
  {
    q: l(
      'Da li je moguće upravljati kapijom ili rampom preko mobilnog telefona?',
      'Can I control the gate or barrier from my phone?',
    ),
    a: l(
      'Da, nudimo rešenja sa WiFi/GSM kontrolom za daljinsko upravljanje putem aplikacije.',
      'Yes. We offer WiFi/GSM solutions for remote control through a mobile app.',
    ),
  },
  {
    q: l('Koliko često je potrebno servisirati opremu?', 'How often does the equipment need servicing?'),
    a: l(
      'Preporučuje se redovan servis na 3 godine radi optimalnog rada i produženja veka trajanja uređaja.',
      'We recommend a service every 3 years to keep everything running well and extend the life of the equipment.',
    ),
  },
]

const keyAutomationIntro = rt(
  [
    {
      p: 'Nakon dugogodišnjeg iskustva i montiranja motora raznih proizvođača, odlučili smo da radimo sa samo jednim proizvođačem – Key Automation, za koji tvrdimo da je jedan od boljih i pouzdanijih u svetu.',
    },
  ],
  [
    {
      p: 'After years of installing motors from many manufacturers, we chose to work with just one – Key Automation, which we consider one of the best and most reliable in the world.',
    },
  ],
)

export const services = [
  {
    key: 'barriers',
    category: 'Parking rampe',
    order: 1,
    title: l('Rampe za parking', 'Parking barriers'),
    slug: l('automatske-rampe', 'automatic-barriers'),
    tagline: l(
      'Ugrađujemo automatske Key Automation rampe za parking sa otvaranjem na daljinski ili preko telefona i sigurnosnim senzorima, širom Srbije.',
      'We install Key Automation parking barriers that open by remote or phone, with safety sensors, anywhere in Serbia.',
    ),
    heroImage: 'heroBarrier' as ImageKey,
    introHeading: l('Šta su automatske rampe za parking?', 'What is an automatic parking barrier?'),
    intro: rt(
      [
        {
          p: 'Automatska rampa za parking je uređaj koji kontroliše ulaz i izlaz vozila sa parkinga, dvorišta firme ili garaže zgrade. Rampa se podiže na daljinski upravljač ili preko telefona, a spušta se automatski kada vozilo prođe.',
        },
        {
          p: 'Rampe se koriste na parkiralištima stambenih zgrada, firmi, magacina i poslovnih centara – svuda gde je potrebno da samo ovlašćena vozila imaju pristup.',
        },
        {
          ul: [
            'Otvaranje na daljinski ili preko telefona',
            'Sigurnosni senzori za vozila i pešake ispod rampe',
            'Automatsko spuštanje nakon prolaska vozila',
            'Evidencija ulaza i izlaza vozila',
            'Pouzdan rad u svim vremenskim uslovima',
            'Prepoznavanje registarskih tablica',
          ],
        },
      ],
      [
        {
          p: 'An automatic parking barrier controls vehicles entering and leaving a car park, a company yard or a building garage. It opens by remote control or phone and closes automatically once the vehicle has passed.',
        },
        {
          p: 'Barriers are used at residential buildings, companies, warehouses and business centres – anywhere only authorised vehicles should get in.',
        },
        {
          ul: [
            'Opens by remote or phone',
            'Safety sensors for vehicles and people under the arm',
            'Closes automatically after the vehicle passes',
            'Record of vehicle entries and exits',
            'Reliable in all weather',
            'Licence plate recognition',
          ],
        },
      ],
    ),
    features: [
      { icon: 'car', title: l('Besplatan izlazak na teren', 'Free site visit'), text: l('Obilazimo lokaciju pre ponude.', 'We visit the site before quoting.') },
      { icon: 'timer', title: l('Ponuda za 48h', 'Quote within 48h'), text: l('Ponuda sa tačnom cenom opreme i ugradnje.', 'An exact price for equipment and installation.') },
      { icon: 'shield', title: l('Garancija i servis', 'Warranty and service'), text: l('Garancija na opremu i ugradnju, servis širom Srbije.', 'Warranty on equipment and installation, service across Serbia.') },
      { icon: 'smartphone', title: l('Upravljanje telefonom', 'Phone control'), text: l('Key Automation aplikacija za rampe i kapije.', 'One Key Automation app for barriers and gates.') },
    ],
    whyHeading: l('Zašto ugradnja rampe sa KGB Vision Group?', 'Why choose KGB Vision Group?'),
    why: rt(
      [
        {
          p: 'Automatska rampa je jedno od najefikasnijih rešenja za kontrolu pristupa vozila na privatnim i poslovnim parkinzima. Smanjuje rizik od neovlašćenog ulaza, sprečava zauzimanje mesta i olakšava svakodnevni ulaz i izlaz stanarima i zaposlenima.',
        },
        {
          p: 'Key Automation rampe izrađene su od materijala otpornih na koroziju i projektovane za pouzdan rad na visokim temperaturama, kiši, snegu i prašini. Cena zavisi od dužine rampe, intenziteta korišćenja i dodatne opreme – nakon besplatnog obilaska lokacije za 48h šaljemo ponudu sa tačnom cenom. Posle ugradnje dajemo garanciju i nudimo redovan servis.',
        },
      ],
      [
        {
          p: 'An automatic barrier is one of the most effective ways to control vehicle access to private and business car parks. It reduces unauthorised entry, keeps spaces free and makes daily access easier for residents and staff.',
        },
        {
          p: 'Key Automation barriers are made of corrosion-resistant materials and built to work reliably in heat, rain, snow and dust. The price depends on arm length, usage and accessories – after a free site visit we send an exact quote within 48 hours. After installation we provide a warranty and regular servicing.',
        },
      ],
    ),
    whyImage: 'barrierInstall3' as ImageKey,
    gallery: ['barrierInstall1', 'barrierInstall2', 'barrierInstall3'] as ImageKey[],
    faqIdx: [2, 3, 6, 7],
    meta: {
      title: l('Rampe za parking – ugradnja i servis', 'Parking barriers – installation and service'),
      description: l(
        'Ugradnja automatskih rampi za parking na daljinski za zgrade, firme i parkirališta. Key Automation oprema, upravljanje telefonom i besplatna ponuda za 48h.',
        'Automatic parking barriers with remote control for buildings, companies and car parks. Key Automation equipment, phone control, free quote within 48h.',
      ),
    },
  },
  {
    key: 'gates',
    category: 'Kapije i rampe',
    order: 2,
    title: l('Motori za kapije', 'Gate motors'),
    slug: l('motori-za-kapije', 'gate-motors'),
    tagline: l(
      'Ugrađujemo Key Automation motore za klizne i krilne kapije, sa otvaranjem na daljinski ili preko telefona, širom Srbije.',
      'We install Key Automation motors for sliding and swing gates, opening by remote or phone, anywhere in Serbia.',
    ),
    heroImage: 'heroGate' as ImageKey,
    introHeading: l('Šta je motor za kapiju i kako radi?', 'What is a gate motor and how does it work?'),
    intro: rt(
      [
        {
          p: 'Motor za kapiju omogućava da se kapija otvara i zatvara na daljinski, preko telefona ili automatski, u zavisnosti od podešavanja. Motor za kliznu kapiju pokreće kapiju pomoću zupčaste letve postavljene duž kapije, dok se kod krilnih kapija motor ugrađuje na svako krilo.',
        },
        {
          p: 'Nekada rezervisana za luksuzne objekte, automatska kapija je danas, zahvaljujući nižim cenama i jednostavnijoj ugradnji, standard na većini kuća, zgrada i firmi.',
        },
        {
          ul: [
            'Brzo i jednostavno otvaranje kapije',
            'Otvaranje na daljinski ili preko telefona',
            'Fotoćelije za bezbedno zatvaranje',
            'Ručna deblokada pri nestanku struje',
            'Pouzdan rad u svim vremenskim uslovima',
          ],
        },
      ],
      [
        {
          p: 'A gate motor opens and closes the gate by remote, by phone or automatically, depending on the settings. A sliding gate motor drives the gate with a gear rack along the gate, while swing gates get a motor on each leaf.',
        },
        {
          p: 'Once reserved for luxury properties, automatic gates are now standard on most houses, buildings and companies thanks to lower prices and simpler installation.',
        },
        {
          ul: [
            'Fast, easy gate opening',
            'Opens by remote or phone',
            'Photocells for safe closing',
            'Manual release during power cuts',
            'Reliable in all weather',
          ],
        },
      ],
    ),
    features: [
      { icon: 'gauge', title: l('Motor prema težini kapije', 'Sized to your gate'), text: l('Biramo motor prema tipu, težini i dimenzijama.', 'Chosen by gate type, weight and size.') },
      { icon: 'car', title: l('Besplatan izlazak na teren', 'Free site visit'), text: l('Procenjujemo kapiju na licu mesta.', 'We assess the gate on site.') },
      { icon: 'timer', title: l('Ponuda za 48h', 'Quote within 48h'), text: l('Tačna cena motora i ugradnje.', 'Exact price for motor and installation.') },
      { icon: 'battery', title: l('Rad bez struje', 'Works in a power cut'), text: l('Baterijsko napajanje ili ručna deblokada.', 'Backup battery or manual release.') },
    ],
    whyHeading: l('Klizna ili krilna kapija – šta izabrati?', 'Sliding or swing gate – which to choose?'),
    why: rt(
      [
        {
          p: 'Motor za kliznu kapiju je čest izbor jer klizna kapija ne zahteva prostor za otvaranje ispred ili iza kapije. Motor se bira prema težini kapije, a kapiju pokreće preko zupčaste letve.',
        },
        {
          p: 'Motori za krilne kapije ugrađuju se na svako krilo posebno i dobar su izbor kada postoji dovoljno prostora za otvaranje krila. Cena zavisi od težine i dužine kapije, intenziteta korišćenja i dodatne opreme kao što su fotoćelije, daljinski upravljači i zupčasta letva. Nakon besplatnog obilaska za 48h šaljemo ponudu, a posle ugradnje dajemo garanciju i nudimo servis.',
        },
      ],
      [
        {
          p: 'Sliding gate motors are a popular choice because a sliding gate needs no space to swing open. The motor is chosen by gate weight and drives the gate through a gear rack.',
        },
        {
          p: 'Swing gate motors are fitted to each leaf and suit sites with enough room for the leaves to open. The price depends on gate weight and length, usage and accessories such as photocells, remotes and gear racks. After a free site visit we send a quote within 48 hours, and after installation we provide a warranty and service.',
        },
      ],
    ),
    whyImage: 'gateView' as ImageKey,
    gallery: ['gateInstall1', 'gateInstall2', 'gateInstall3'] as ImageKey[],
    faqIdx: [0, 1, 6, 7],
    meta: {
      title: l('Motori za klizne i krilne kapije sa ugradnjom', 'Sliding and swing gate motors, installed'),
      description: l(
        'Prodaja i ugradnja motora za klizne i krilne kapije Key Automation, sa otvaranjem na daljinski i preko telefona. Garancija i servis i ponuda za 48h.',
        'Key Automation motors for sliding and swing gates, sold and installed, with remote and phone control. Free quote within 48h.',
      ),
    },
  },
  {
    key: 'access',
    category: 'Kontrola pristupa',
    order: 3,
    title: l('Kontrola pristupa', 'Access control'),
    slug: l('kontrola-pristupa', 'access-control'),
    tagline: l(
      'Evidencija ulaza i izlaza zaposlenih, posetilaca i vozila pomoću kartica, PIN koda, otiska prsta i mobilnog telefona, širom Srbije.',
      'Record entries and exits of staff, visitors and vehicles with cards, PIN, fingerprint or phone, anywhere in Serbia.',
    ),
    heroImage: 'heroAccess' as ImageKey,
    introHeading: l('Šta je kontrola pristupa?', 'What is access control?'),
    intro: rt(
      [
        {
          p: 'Kontrola pristupa je sistem koji određuje ko, kada i na koja vrata može da uđe u objekat. Osobe se identifikuju čip karticom ili privescima, PIN kodom na tastaturi, otiskom prsta ili prepoznavanjem lica, a vozila prepoznavanjem registarskih tablica ili čipom u vozilu.',
        },
        {
          p: 'Svi ulazi i izlazi beleže se u aplikaciji kojoj možete pristupiti i preko mobilnog telefona, a sistem vam može slati obaveštenja u unapred definisanim situacijama.',
        },
        {
          ul: [
            'Ulaz karticom, privescima ili PIN kodom',
            'Otisak prsta i prepoznavanje lica',
            'Prepoznavanje registarskih tablica vozila (ANPR)',
            'Evidencija radnog vremena zaposlenih',
            'Pristupna prava po vremenu, odeljenju ili korisniku',
            'Pregled i obaveštenja preko telefona',
          ],
        },
      ],
      [
        {
          p: 'Access control decides who can enter which door and when. People identify themselves with a chip card or fob, a PIN, a fingerprint or face recognition; vehicles by licence plate recognition or an in-car tag.',
        },
        {
          p: 'Every entry and exit is logged in an app you can also open on your phone, and the system can alert you in situations you define.',
        },
        {
          ul: [
            'Entry by card, fob or PIN',
            'Fingerprint and face recognition',
            'Licence plate recognition (ANPR)',
            'Staff time and attendance',
            'Access rights by time, department or user',
            'Overview and alerts on your phone',
          ],
        },
      ],
    ),
    features: [
      { icon: 'credit-card', title: l('Kartice i PIN', 'Cards and PIN'), text: l('Čitači kartica i PIN tastature.', 'Card readers and PIN keypads.') },
      { icon: 'fingerprint', title: l('Biometrija', 'Biometrics'), text: l('Otisak prsta i prepoznavanje lica.', 'Fingerprint and face recognition.') },
      { icon: 'camera', title: l('ANPR kamere', 'ANPR cameras'), text: l('Prepoznavanje tablica i evidencija vozila.', 'Plate recognition and vehicle log.') },
      { icon: 'timer', title: l('Radno vreme', 'Time and attendance'), text: l('Izveštaji za obračun zarada.', 'Reports for payroll.') },
    ],
    whyHeading: l('Evidencija radnog vremena i cena sistema', 'Time and attendance, and pricing'),
    why: rt(
      [
        {
          p: 'Sistem za evidenciju radnog vremena beleži dolazak i odlazak svakog zaposlenog, bez papirnih lista i ručnog unosa. Podaci se mogu povezati sa softverom za obračun zarada, što pojednostavljuje administraciju i smanjuje mogućnost grešaka.',
        },
        {
          p: 'Cena zavisi od broja vrata i ulaza, broja zaposlenih, načina identifikacije i potrebnog softvera. Nakon besplatnog obilaska objekta, za 48h šaljemo ponudu sa tačnom cenom opreme, softvera i ugradnje. Posle ugradnje obučavamo vaše zaposlene, dajemo garanciju i nudimo servis.',
        },
      ],
      [
        {
          p: 'A time and attendance system records when each employee arrives and leaves, with no paper lists or manual entry. The data can feed payroll software, which simplifies administration and reduces errors.',
        },
        {
          p: 'The price depends on the number of doors, staff, identification methods and software. After a free site visit we send an exact quote within 48 hours. After installation we train your staff, provide a warranty and offer service.',
        },
      ],
    ),
    whyImage: 'accessEgo' as ImageKey,
    gallery: ['accessView', 'accessEgo'] as ImageKey[],
    faqIdx: [4, 5, 6],
    badge: l('Novo', 'New'),
    meta: {
      title: l('Kontrola pristupa i evidencija radnog vremena', 'Access control and time attendance'),
      description: l(
        'Ugradnja sistema za kontrolu pristupa i evidenciju radnog vremena zaposlenih – kartice, PIN kod, otisak prsta i telefon. Garancija i servis, ponuda za 48h.',
        'Access control and staff time attendance systems – cards, PIN, fingerprint and phone. Free quote within 48h.',
      ),
    },
  },
]

/** Portfolio items: titles are general – rename them in the CMS with the real project names and locations. */
export const projects = [
  { image: 'p5', service: 'barriers', title: l('Parking rampa', 'Parking barrier'), summary: l('Rampa za ulaz u poslovni objekat.', 'Barrier at a business entrance.') },
  { image: 'p3', service: 'gates', title: l('Klizna kapija', 'Sliding gate'), summary: l('Automatizacija klizne kapije.', 'Sliding gate automation.') },
  { image: 'p4', service: 'access', title: l('Kontrola pristupa', 'Access control'), summary: l('Kontrola pristupa na ulazu u objekat.', 'Access control at a building entrance.') },
  { image: 'p2', service: 'barriers', title: l('Ulaz u parking', 'Car park entrance'), summary: l('Rampa na ulazu u parking.', 'Barrier at a car park entrance.') },
  { image: 'p6', service: 'gates', title: l('Motor za kapiju', 'Gate motor'), summary: l('Motor za kliznu kapiju.', 'Sliding gate motor.') },
  { image: 'p8', service: 'barriers', title: l('Izlaz sa parkinga', 'Car park exit'), summary: l('Rampa na izlazu sa parkinga.', 'Barrier at a car park exit.') },
  { image: 'p9', service: 'gates', title: l('Krilna kapija', 'Swing gate'), summary: l('Krilna kapija sa motorom.', 'Swing gate with motor.') },
  { image: 'p10', service: 'access', title: l('Ulaz za vozila', 'Vehicle entrance'), summary: l('Kontrola pristupa vozila.', 'Vehicle access control.') },
  { image: 'p1', service: 'barriers', title: l('Rampa i semafor', 'Barrier and light'), summary: l('Ulaz sa rampom i semaforom.', 'Entrance with barrier and traffic light.') },
] as { image: ImageKey; service: string; title: L; summary: L }[]

/** KGB's own category (access control). The Key Automation catalogue is imported from scripts/catalog. */
export const categories = [
  {
    key: 'access',
    title: l('Kontrola pristupa', 'Access control'),
    slug: l('kontrola-pristupa', 'access-control'),
    image: 'heroAccess' as ImageKey,
    order: 2.5,
    description: l('Čitači kartica, šifratori, kamere za tablice, turniketi i interfoni.', 'Card readers, keypads, plate cameras, turnstiles and intercoms.'),
  },
] as { key: string; parent?: string; title: L; slug: L; image: ImageKey; order: number; description: L }[]

/** Images for the main categories created by the catalogue import (Serbian title → image key). */
export const categoryImages: Record<string, ImageKey> = {
  'Kapije i rampe': 'heroGate',
  'Dodatna oprema': 'kube',
}

export const categoryDescriptions: Record<string, L> = {
  'Kapije i rampe': l('Motori za klizne i krilne kapije i parking rampe Key Automation.', 'Key Automation sliding and swing gate motors and road barriers.'),
  'Garažna vrata': l('Motori i vodilice za sekcijska garažna vrata.', 'Motors and rails for sectional garage doors.'),
  'Dodatna oprema': l('Upravljačke jedinice, daljinski, fotoćelije, svetla, baterije i IoT moduli.', 'Control units, remotes, photocells, lights, batteries and IoT modules.'),
  'Spoljna LED rasveta': l('LED svetiljke za dvorište i baštu.', 'LED lights for yards and gardens.'),
}

/** Featured on the home page (product codes). */
export const featuredCodes = ['KSUN5024EK', 'ALT4K', 'KRAY2524EK', 'HA8SS', 'KUBEW', 'FT43']

export const products = [
  {
    category: 'access',
    title: l('Šifrator sa Mifare čitačem', 'Keypad with Mifare reader'),
    slug: l('sifrator-mifare', 'keypad-mifare'),
    images: ['keypad'],
    excerpt: l('Pristup PIN kodom ili Mifare karticom.', 'Entry by PIN code or Mifare card.'),
    highlights: [l('PIN kod ili kartica', 'PIN code or card'), l('Za vrata, kapije i rampe', 'For doors, gates and barriers')],
    specs: [],
  },
  {
    category: 'access',
    title: l('UHF čitač kartica', 'UHF card reader'),
    slug: l('uhf-citac', 'uhf-reader'),
    images: ['uhf'],
    excerpt: l('Ulaz automobilom bez spuštanja prozora – čitač prepoznaje karticu u vozilu.', 'Drive in without opening the window – the reader detects the tag in the car.'),
    highlights: [l('Čitanje sa veće udaljenosti', 'Long-range reading'), l('Za ulaze vozila', 'For vehicle entrances')],
    specs: [],
  },
  {
    category: 'access',
    title: l('ANPR kamera', 'ANPR camera'),
    slug: l('anpr-kamera', 'anpr-camera'),
    images: ['anpr'],
    excerpt: l('Kamera prepoznaje registarske tablice, otvara rampu i beleži svaki prolaz.', 'The camera reads licence plates, opens the barrier and logs every pass.'),
    highlights: [l('Prepoznavanje tablica', 'Licence plate recognition'), l('Evidencija prolazaka', 'Log of every pass'), l('Rad sa rampom ili kapijom', 'Works with a barrier or gate')],
    specs: [],
  },
  {
    category: 'access',
    title: l('Turniket', 'Turnstile'),
    slug: l('turniket', 'turnstile'),
    images: ['turnstile'],
    excerpt: l('Kontrolisan pešački prolaz za fabrike, poslovne zgrade i sportske objekte.', 'Controlled pedestrian entry for factories, offices and sports venues.'),
    highlights: [l('Pešački prolaz', 'Pedestrian entry'), l('Rad sa karticama', 'Works with cards')],
    specs: [],
  },
  {
    category: 'access',
    title: l('Interfonski sistem', 'Intercom system'),
    slug: l('interfonski-sistem', 'intercom-system'),
    images: ['intercom'],
    excerpt: l('Video interfon sa otvaranjem vrata i kapije.', 'Video intercom with door and gate release.'),
    highlights: [l('Video poziv', 'Video call'), l('Otvaranje vrata i kapije', 'Door and gate release')],
    specs: [],
  },
] as {
  category: string
  featured?: boolean
  title: L
  slug: L
  images: ImageKey[]
  excerpt: L
  highlights: L[]
  specs: [L, L][]
}[]

export const clients = [
  { name: 'CIR', logo: 'c1' },
  { name: 'BW', logo: 'c2' },
  { name: 'mts', logo: 'c3' },
  { name: 'Pionir', logo: 'c4' },
  { name: 'Partner', logo: 'c5' },
  { name: 'EPS', logo: 'c6' },
  { name: 'Službeni glasnik', logo: 'c7' },
] as { name: string; logo: ImageKey }[]
