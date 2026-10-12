# KGB Automation – sajt sa CMS-om

Sajt za parkingrampe.rs u stilu Key Automation sajta. Napravljen je na **Next.js 16 + Payload CMS 3**, na srpskom i engleskom, sa SEO podešavanjima za svaku stranicu i live chatom.

- Sajt: `/sr` i `/en`
- Admin panel (CMS): `/admin`

## Šta se uređuje u CMS-u

| Šta | Gde u admin panelu |
|---|---|
| Početna strana – sekcije, redosled, tekstovi, slike | **Početna strana** |
| Glavni meni, istaknuto dugme, kolone u futeru | **Meni i futer** |
| Kategorije i potkategorije proizvoda (prikazuju se u velikom meniju „Proizvodi”) | **Kategorije proizvoda** |
| Proizvodi: slike, opis, prednosti, tehničke karakteristike, PDF, „izdvojen” | **Proizvodi** |
| Usluge (rampe, kapije, kontrola pristupa) | **Usluge** |
| Ugrađeni projekti | **Portfolio** |
| O nama, Kontakt, Katalog, Usluge, nove stranice – sa dodatnim sekcijama | **Stranice** |
| Česta pitanja, logotipi klijenata | **Česta pitanja**, **Klijenti** |
| Telefon, adresa, društvene mreže, PIB, logo, **boje sajta**, **chat**, Google kodovi | **Podešavanja sajta** |
| **Chat poruke** sa sajta (odgovarate direktno iz admina) | **Chat poruke** |
| Upiti sa kontakt forme | **Upiti sa sajta** |

### Kako dodati proizvod

1. U admin panelu otvorite **Proizvodi → Napravi novi**.
2. Popunite tabove:
   - **Osnovno:** naziv, kratak opis, slike (prva je glavna, redosled menjate prevlačenjem) i glavne prednosti.
   - **Opis:** detaljan opis sa naslovima, listama i linkovima. Može i YouTube link, koji se prikaže kao video.
   - **Specifikacija:** redovi „karakteristika – vrednost” (npr. *Napajanje – 230 V AC*) i PDF dokumenti za preuzimanje.
   - **Cena i dostupnost:** cena u RSD (prazno = „Cena na upit”), napomena uz cenu, dostupnost i garancija.
   - **SEO:** naslov i opis za Google.
3. Desno izaberite **kategoriju**. Po želji štiklirajte **Izdvojen proizvod**, upišite šifru i proizvođača i izaberite povezane proizvode.
4. Kliknite **Sačuvaj**, pa gore desno prebacite jezik na **English** i unesite engleski prevod.

Proizvod se odmah pojavljuje u katalogu, u meniju „Proizvodi” i u pretrazi.

### Uvoz proizvoda iz Excela

U admin panelu otvorite **Proizvodi → Uvoz iz Excela** (link je i u levom meniju, adresa `/admin/uvoz-proizvoda`).

1. Izaberite Excel (.xlsx). Potrebne su kolone **Šifra** i **Naziv**, a po želji i **Kategorija**, **Podkategorija**, **Slika** i **Cena**. EAN i ostale kolone se preskaču. Prazan šablon se preuzima na istoj strani.
2. Izaberite ZIP sa slikama (ili više slika odjednom). Ime slike mora da bude kao u koloni „Slika” ili kao šifra, npr. `KSUN5024EK.jpg`.
3. Izaberite kako se raspoređuju kategorije:
   - **iz kolona** – Key Automation kategorije (GATES AND ROAD BARRIERS, SLIDING GATES…) se same prevode na srpski i prave se potkategorije;
   - **sve u jednu kategoriju**;
   - **„Nerazvrstano”** – proizvode posle sami rasporedite.
4. Proizvodi koji već postoje prepoznaju se po šifri i ažuriraju. Ista slika se ne ubacuje dvaput.

Više proizvoda odjednom premeštate u kategoriju ovako: u listi **Proizvodi** ih štiklirajte, kliknite **Izmeni**, izaberite polje **Kategorija** i sačuvajte.

Uz sajt je već uvezen vaš Key Automation katalog: 100 proizvoda sa slikama u 21 kategoriji i potkategoriji. Fajlovi su u `scripts/catalog`.

### Datasheet

Na proizvodu, u tabu **Specifikacija**, je polje **Datasheet (PDF)**. Kada ga dodate, na strani proizvoda se pojavi dugme „Preuzmite datasheet (PDF)”. Ako ga nema, dugme se ne prikazuje.

### Pretraga

Pretraga u zaglavlju prikazuje rezultate dok kucate. Traži po šifri (sa crticom ili bez nje), nazivu, opisu i kategoriji. Ne razlikuje velika i mala slova ni č/ć/š/ž/đ. Razume i padeže: „fotoćelije” nalazi „fotoćelija”, a „rampa” nalazi „rampe”.

### SEO proizvoda

Svaki proizvod i kategorija automatski dobija SEO naslov, opis i sliku za deljenje, ako ih sami ne upišete u tabu **SEO**. Proizvod ima i Google strukturirane podatke (šifra, proizvođač, slike, kategorija; cena ako je unesena). Svi proizvodi su u `sitemap.xml`.

### Logo i ikonica

Logo (providan) i favicon su u `scripts/seed-images`. Setup ih sam ubacuje u CMS. Kasnije ih menjate u **Podešavanja sajta → Osnovno**.

### Sekcije (blokovi)

Početna strana, svaka stranica i svaka usluga mogu se slagati od sekcija. Sekciju dodajete, menjate joj redosled prevlačenjem ili je brišete. Na raspolaganju su:
- **Slajder sa slikama**
- **Traka sa tekstom i dugmetom**
- **Kategorije proizvoda**
- **Izdvojeni proizvodi**
- **Mreža fotografija**
- **Veliki baner**
- **Poziv na akciju**
- **Usluge**
- **Portfolio projekti**
- **Tekst i slika**
- **Tekst**
- **Česta pitanja**
- **Logotipi klijenata**
- **Kontakt forma**
- **Mapa (gde smo)**

### Jezici

U gornjem desnom uglu admin panela birate jezik sadržaja (Srpski / English). Ako engleski prevod nedostaje, prikazuje se srpski.

### SEO

Svaka stranica, usluga, kategorija, proizvod, projekat i početna imaju tab **SEO** sa:
- naslovom i opisom za Google (uz brojač karaktera i pregled kako izgleda u pretrazi),
- slikom za deljenje na mrežama,
- opcijom noindex i kanonskim URL-om.

Slike imaju polje **Alternativni tekst (SEO)**, a URL (slug) je poseban za srpski i engleski.

Sajt sam pravi:
- `sitemap.xml` sa oba jezika,
- `robots.txt`,
- hreflang oznake,
- Open Graph kartice,
- Google strukturirane podatke: firma, proizvodi, usluge, česta pitanja i mrvice (breadcrumbs).

Stare adrese sa WordPress sajta trajno se preusmeravaju (301) na nove (`next.config.ts`).

**Napomena:** kategorija i proizvod ne smeju imati isti URL (slug), jer dele adresu `/sr/proizvodi/…`.

### Chat

Posetilac klikne ikonicu u donjem desnom uglu, upiše ime (i po želji telefon ili e-mail) i pošalje poruku. Poruka stiže u admin panel:
- U levom meniju je brojač **Nove chat poruke**, a uz njega se oglasi kratak zvuk i broj se pojavi u naslovu taba.
- Na kontrolnoj tabli je kartica sa brojem nepročitanih poruka.
- U **Chat poruke** otvorite razgovor i odgovorite. Posetilac vidi odgovor za par sekundi, a razgovor ostaje sačuvan u njegovom pregledaču.

U **Podešavanja sajta → Chat** podešavate:
- ime i sliku (avatar),
- pozdravnu poruku,
- WhatsApp i Viber,
- e-mail na koji stiže obaveštenje o novom chatu (potreban je SMTP),
- uključivanje i isključivanje chata.

Dugme **„Pitajte nas u chatu”** na stranama proizvoda i usluga otvara isti chat.

### Boje

U **Podešavanja sajta → Izgled** podešavate:
- boju istaknutog dugmeta (sada zelena, kao vaš logo; za crvenu kao na Key sajtu upišite npr. `#e30613`),
- tamnu boju,
- sivu boju traka.

## Pokretanje na računaru

Potrebno: Node.js 20 ili noviji.

```bash
npm install
cp .env.example .env        # upišite PAYLOAD_SECRET (dugačak nasumičan tekst)
npm run setup               # pravi bazu i ubacuje sadržaj i slike sa parkingrampe.rs
npm run dev                 # http://localhost:3000
```

Podaci za prijavu u admin su u fajlu `.admin-login.txt`. Posle prijave promenite lozinku i obrišite fajl.

Seed preuzima slike sa trenutnog sajta. Ako želite svoje fotografije od starta, stavite ih u folder kao `<ključ>.jpg` (ključevi su u `scripts/seed-data.ts`, npr. `heroGate.jpg`, `heroBarrier.jpg`) i pokrenite:

```bash
SEED_IMAGE_DIR=./moje-slike npm run seed -- --force
```

## Postavljanje na server (VPS)

Baza je SQLite fajl (`kgb.db`), a slike su u folderu `media/`.

```bash
npm ci
cp .env.example .env   # NEXT_PUBLIC_SITE_URL=https://parkingrampe.rs, PAYLOAD_SECRET=…
npm run setup          # samo prvi put
npm run build
npx pm2 start "npm start" --name kgb
```

Ispred aplikacije stavite nginx ili Caddy sa HTTPS-om, usmeren na port 3000.

**Bekap** je kopija fajla `kgb.db` i foldera `media/`.

Za Vercel su potrebni:
- eksterna baza (Turso: `DATABASE_URL=libsql://…` i `DATABASE_AUTH_TOKEN`),
- skladište za slike (`@payloadcms/storage-vercel-blob`).

## E-mail obaveštenja

Upiti sa kontakt forme i obaveštenja o novom chatu šalju se na **office@kgb.co.rs**. Za slanje je potreban SMTP nalog za vaš mejl: podatke (server, port, korisnik, lozinka) dobijate od hosting/mejl provajdera i upisujete ih u `.env`. Bez SMTP-a poruke se i dalje čuvaju u admin panelu.

Upiti i chat su uvek u admin panelu. Da stižu i na e-mail, popunite SMTP u `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL_TO`).

## Posle prelaska na novi sajt

1. U Google Search Console pošaljite `https://parkingrampe.rs/sitemap.xml`. Verifikacioni kodovi su preneti.
2. Proverite u CMS-u stvari koje su unete okvirno:
   - nazive i opise proizvoda (pre svega Key Kube Pro i ALT varijante),
   - nazive i lokacije projekata,
   - nazive tri klijenta (CIR, BW, Partner),
   - radno vreme.
3. Dodajte sliku za chat (avatar), na primer fotografiju osobe koja odgovara.

## Za programera

| Šta | Gde |
|---|---|
| Polja (kolekcije, globali, blokovi) | `src/collections`, `src/globals`, `src/blocks/config.ts` |
| Prikaz blokova | `src/blocks/RenderBlocks.tsx` |
| Chat API | `src/endpoints/chat.ts` |
| Chat u adminu | `src/components/admin` |
| Dizajn | `src/app/(frontend)/globals.css`, `src/components` |
| Fiksni tekstovi interfejsa | `src/lib/i18n.ts` |

Posle izmene polja:

```bash
npm run migrate:create naziv-izmene
npm run generate:types
npm run generate:importmap
```
