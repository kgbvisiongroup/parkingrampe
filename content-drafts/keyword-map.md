# Mapa ključnih reči (jedna reč = jedna strana)

Upisuje se komandom `npm run seo:keywords -- --apply` (bez `--apply` samo prikazuje šta bi promenio).
U CMS-u: polje **Glavna ključna reč (SEO)** u bočnoj koloni usluge/kategorije. Ista reč ne može da se sačuva na dve strane.

| Ključna reč (sr) | Strana | Napomena |
|---|---|---|
| parking rampe i motori za kapije (+ brend) | Početna `/sr` | naslov: „Parking rampe i motori za kapije – Key Automation \| KGB Automation” |
| rampe za parking (+ „rampa za zgradu” kao sekcija teksta) | `/sr/usluge/automatske-rampe` | usluga |
| automatske rampe | `/sr/proizvodi/parking-rampe` | kategorija proizvoda (ALT rampe, ruke, oprema) – da se ne bi takmičila sa uslugom |
| motori za kapije | `/sr/usluge/motori-za-kapije` | usluga |
| motori za klizne kapije | `/sr/proizvodi/motori-za-klizne-kapije` | kategorija |
| motori za krilne kapije | `/sr/proizvodi/linearni-motori-za-krilne-kapije` | ne postoji jedna kategorija za krilne kapije; linearni (RAY, STAR kompleti) su glavna ponuda. Preporuka za kasnije: nadređena kategorija „Motori za krilne kapije” sa linearnim, zglobnim i podzemnim kao potkategorijama |
| motor za garažna vrata | `/sr/proizvodi/garazna-vrata` | kategorija (sekcijska vrata su potkategorija sa svojom rečju „motori za sekcijska vrata”) |
| kontrola pristupa | `/sr/usluge/kontrola-pristupa` | usluga |
| oprema za kontrolu pristupa | `/sr/proizvodi/kontrola-pristupa` | kategorija |
| šifre proizvoda (npr. ktus4324es) | `/sr/proizvodi/<šifra>` | naslov počinje šifrom – ne dirati |
| rampe za parking Beograd, motori za kapije Beograd | `/sr/rampe-i-motori-za-kapije-beograd` | gradska strana (zadatak 7) |

## Obrasci naslova (kad SEO naslov nije ručno upisan)

- Usluga/kategorija: `<Ključna reč> – ugradnja i servis | Cena od {CENA} | KGB Automation` – deo sa cenom samo ako u „Cenovnik” tabeli postoji cena.
- Proizvod: `<ŠIFRA> Key <SERIJA> – <opis> | KGB Automation` (dodatak „| KGB Automation” otpada kad bi naslov bio duži od 70 znakova).
- H1 usluge/kategorije: `<Ključna reč> sa ugradnjom u Beogradu i okolini`, ili polje „Naslov na strani (H1)”.
- Opis: korist + područje (Beograd i okolina do 100 km) + „Cena na upit” ili cena + „Pozovite 066 510 11 50”.

Ručno upisan SEO naslov ili opis u CMS-u uvek ima prednost; vrednosti koje je CMS sam upisao (naziv, „Naziv – Key Automation”) se tretiraju kao prazne.
