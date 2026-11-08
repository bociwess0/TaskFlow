# TaskFlow – specifikacija projekta

Sistem za upravljanje projektima i resursima. Ovo je referentni dokument: čitaj sekciju koja se tiče modula na kom radiš. Pravila rada i konvencije su u `CLAUDE.md`.

## 1. Pregled projekta

Razvijamo **TaskFlow** – full-stack web aplikaciju za upravljanje projektima i resursima.

Aplikacija je namenjena malim i srednjim kompanijama koje istovremeno vode više projekata i timova (softverske firme, digitalne i marketinške agencije, konsultantski i dizajn studiji – tipično od desetak do stotinak zaposlenih, gde isti ljudi često rade na više projekata istovremeno). Njena svrha je da na jednom mestu objedini upravljanje projektima, organizaciju zadataka, saradnju unutar timova, raspodelu resursa, evidenciju radnog vremena i analitiku projekata.

**Ključna ideja:** TaskFlow ne odgovara samo na pitanje „šta treba uraditi“, već i na pitanje „ko ima kapaciteta da to uradi“. Upravljanje resursima i upozorenja o preopterećenju su u središtu aplikacije, a ne dodatak.

Cilj je da napravimo modernu aplikaciju u SaaS stilu, sa profesionalnim UI/UX-om, responzivnim dizajnom i skalabilnom arhitekturom.

**Trenutno stanje:** napisan je predlog projekta i završen je UI dizajn 9 ključnih ekrana (sekcija 9, slike u `docs/design/`). Implementacija kreće od frontenda.

## 2. Tehnološki stack

Projekat će koristiti sledeće tehnologije:

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query za upravljanje serverskim stanjem
- React Hook Form
- Zod za validaciju formi
- dnd-kit za drag-and-drop na Kanban tabli
- Recharts za grafikone i analitiku
- Socket.IO Client za komunikaciju u realnom vremenu

### Backend – glavni API
- Node.js
- NestJS
- TypeScript
- Prisma ORM
- REST API, dokumentovan kroz Swagger (OpenAPI)
- Socket.IO za događaje u realnom vremenu
- JWT autentifikacija i refresh tokeni (Passport)
- class-validator za validaciju ulaznih podataka (DTO)

NestJS će biti glavni backend, odgovoran za osnovnu poslovnu logiku aplikacije.

### Backend – sekundarni servis
- C#
- ASP.NET Core Web API

ASP.NET Core će pokrivati poseban servis za upravljanje resursima i analitiku (Resource Management & Analytics).

Njegove odgovornosti uključuju:
- Izračunavanje iskorišćenosti zaposlenih
- Analizu opterećenja timova
- Detekciju prekomerne alokacije (over-allocation)
- Metrike učinka projekata
- Agregiranu statistiku projekata
- Analizu procenjenih u odnosu na stvarne radne sate

.NET servis će komunicirati sa NestJS backendom putem HTTP REST API poziva.

NestJS ostaje primarni vlasnik podataka aplikacije. .NET servis će prvenstveno preuzimati relevantne podatke o projektima, zaposlenima, zadacima i timesheet unosima kako bi izvršio proračune i vratio analitičke rezultate.

### Baza podataka
- PostgreSQL
- Prisma ORM (koristi ga NestJS)

### Infrastruktura
- Docker
- Docker Compose
- Redis

Docker Compose će se koristiti za upravljanje infrastrukturom i servisima aplikacije.

Redis će se u početku koristiti za keširanje, a po potrebi može da podrži i dodatne zahteve infrastrukture za rad u realnom vremenu (npr. Redis adapter za Socket.IO pri skaliranju na više instanci).

### Testiranje
- Jest (unit testovi) i Supertest (integracioni/e2e testovi API-ja) za NestJS
- Unit testovi proračuna u .NET servisu (npr. xUnit)
- Playwright (opciono) za end-to-end testove ključnih korisničkih tokova

## 3. Arhitektura sistema

Aplikacija će se sastojati od tri glavna aplikativna sloja:

1. Next.js – frontend aplikacija.
2. NestJS – glavni backend API i poslovna logika.
3. ASP.NET Core – servis za upravljanje resursima i analitiku.

PostgreSQL će biti primarna relaciona baza podataka.

Tok komunikacije:

Next.js → NestJS → PostgreSQL

Za analitiku resursa:

Next.js → NestJS → ASP.NET Core → analitički rezultati → NestJS → Next.js

Frontend nikada ne sme direktno da komunicira sa PostgreSQL-om ili Prismom.

Sve poslovne operacije i pristup podacima moraju ići kroz backend API-je.

Dodatno:
- .NET servis nije dostupan frontendu niti javno – poziva ga isključivo NestJS, unutar Docker mreže.
- Real-time događaje emituje isključivo NestJS (Socket.IO gateway), i to tek nakon uspešnog upisa u bazu.

### Organizacija NestJS backenda
Backend je modularan – svaka poslovna celina je poseban NestJS modul: Auth, Users, Teams, Projects, Tasks, Resources, Timesheets, Notifications, Analytics i Realtime.

Unutar modula važi slojevita podela:
- Controller – prima HTTP zahteve i validira ulaz preko DTO klasa.
- Service – sadrži poslovnu logiku.
- Prisma – jedini put do baze.

Kontrola pristupa se radi kroz NestJS guard-ove (sekcija 7).

### Organizacija repozitorijuma (monorepo, okvirno)
```
taskflow/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # NestJS backend (src/modules, prisma/)
│   └── analytics/    # ASP.NET Core servis (Resource Management & Analytics)
├── packages/
│   └── shared/       # zajednički TypeScript tipovi (web + api)
└── docker-compose.yml
```
Konačnu strukturu potvrđujemo u fazi postavke projekta.

## 4. Korisničke uloge

Aplikacija će imati tri osnovne korisničke uloge.

### Administrator
- Upravlja korisnicima (poziva nove korisnike e-mailom, menja uloge, deaktivira naloge).
- Upravlja timovima.
- Upravlja ulogama i dozvolama.
- Upravlja podešavanjima organizacije (npr. pragovi za statuse zauzetosti).
- Ima pristup informacijama na nivou celog sistema.

### Projektni menadžer (Project Manager)
- Kreira projekte i upravlja njima.
- Dodaje i uklanja članove projekta.
- Članovima projekta određuje ulogu na projektu i procenat angažovanja (alokaciju).
- Kreira i dodeljuje zadatke.
- Upravlja rokovima i prioritetima.
- Prati napredak projekta.
- Prati opterećenje zaposlenih i dobija upozorenja o preopterećenju.
- Ima pristup analitici i izveštajima projekata.

### Član tima (Team Member)
- Vidi projekte na koje je raspoređen.
- Vidi zadatke koji su mu dodeljeni i upravlja njima.
- Ažurira statuse zadataka.
- Dodaje komentare.
- Evidentira radne sate.
- Vidi sopstvenu zauzetost.
- Prima notifikacije.

### Dva nivoa kontrole pristupa
Uloga se dodeljuje na nivou sistema, a dodatno se uvek proverava i članstvo u konkretnom projektu:
- Project manager upravlja samo projektima koje vodi.
- Član tima vidi i menja samo podatke projekata na kojima je član.
- Iste provere važe i za REST API i za WebSocket konekcije.

### Matrica prava pristupa

| Funkcionalnost | Administrator | Project manager | Team member |
|---|---|---|---|
| Upravljanje korisnicima i ulogama | ✓ | – | – |
| Podešavanja organizacije | ✓ | – | – |
| Kreiranje projekata | ✓ | ✓ | – |
| Izmena, arhiviranje i brisanje projekta | ✓ | ✓¹ | – |
| Dodavanje članova i alokacija resursa | ✓ | ✓¹ | – |
| Kreiranje zadataka | ✓ | ✓¹ | ✓² |
| Dodela zadataka članovima tima | ✓ | ✓¹ | – |
| Pomeranje zadataka na Kanban tabli i komentari | ✓ | ✓¹ | ✓² |
| Evidencija sopstvenog radnog vremena | ✓ | ✓ | ✓ |
| Pregled evidencije vremena tima | ✓ | ✓¹ | – |
| Pregled resursa i opterećenja | ✓ | ✓ | samo lično |
| Analitika i izveštaji | cela organizacija | svoji projekti | lični pregled |

¹ samo za projekte kojima rukovodi  ² samo na projektima na kojima je član

Frontend mora da prilagodi navigaciju i dostupne akcije ulozi i dozvolama prijavljenog korisnika.

## 5. Glavni moduli aplikacije

### Autentifikacija
- Prijava e-mailom i lozinkom
- Registracija (ako je administrator omogući) i prihvatanje pozivnice koju administrator šalje e-mailom (jednokratni token)
- Reset zaboravljene lozinke putem e-maila
- Odjava
- JWT autentifikacija
- Rukovanje refresh tokenima
- Zaštićene rute
- Pristup zasnovan na ulogama
- Opciono: prijava preko Google i Microsoft naloga (OAuth) – dugmad već postoje u dizajnu

### Dashboard
Dashboard treba da pruži pregled relevantnih informacija. Sadržaj zavisi od uloge.

Za administratora:
- Isti pokazatelji kao za projektnog menadžera, ali za celu organizaciju

Za projektne menadžere:
- Ukupan broj projekata
- Aktivni projekti
- Završeni projekti
- Zadaci kojima je istekao rok
- Iskorišćenost tima
- Nedavne aktivnosti
- Grafikoni napretka projekata

Za članove tima:
- Moji zadaci
- Moji aktivni projekti
- Predstojeći rokovi
- Nedavno dodeljeni zadaci
- Evidentirani radni sati

Prema dizajnu: kartice sa ključnim pokazateljima i trendom u odnosu na prethodni period (npr. aktivni projekti, otvoreni zadaci, članovi tima, sati ove nedelje), grafikon napretka projekata po mesecima, raspodela zadataka po statusima, nedavne aktivnosti i predstojeći rokovi.

### Upravljanje projektima
- Kreiranje projekata (naziv, opis, period trajanja, status, tehnologije)
- Izmena projekata
- Arhiviranje projekata
- Definisanje rokova projekta
- Dodela projektnih menadžera
- Dodavanje članova projekta, uz ulogu na projektu (npr. „Frontend Developer“) i procenat angažovanja za određeni period
- Praćenje statusa projekta
- Praćenje napretka projekta – računa se automatski na osnovu završenih zadataka
- Milestone-ovi (ključne faze) sa rokom i statusom
- Brzi linkovi ka spoljnim resursima (GitHub repozitorijum, Figma dizajn, API dokumentacija, produkciona verzija)
- Lista projekata sa pretragom, filtriranjem po statusu i sortiranjem

Statusi projekta:
- PLANNING
- IN_PROGRESS
- ON_HOLD
- COMPLETED
- ARCHIVED

### Upravljanje zadacima
- Kreiranje i izmena zadataka
- Dodela zadataka članovima tima
- Postavljanje prioriteta (LOW, MEDIUM, HIGH, URGENT)
- Postavljanje rokova
- Procena potrebnog vremena (estimate) – osnova za analizu procenjenih u odnosu na stvarne sate
- Dodavanje opisa i labela (npr. design, development, backend)
- Dodavanje komentara
- Prilaganje fajlova
- Praćenje statusa zadatka
- Pored Kanban table: prikaz liste i vremenske linije (timeline)
- Rokovi zadataka i milestone-ova prikazuju se i u kalendaru

Statusi zadatka:
- TODO
- IN_PROGRESS
- REVIEW
- DONE

### Kanban tabla
Vizuelna Kanban tabla na kojoj korisnici upravljaju zadacima prevlačenjem (drag-and-drop).

Tabla treba da podržava:
- Premeštanje zadataka između kolona
- Promenu redosleda unutar kolone – redosled se trajno čuva u bazi
- Broj zadataka u svakoj koloni
- Filtriranje zadataka (po članu, labeli i roku)
- Pretragu zadataka
- Dodelu korisnika
- Prikaz prioriteta i rokova

### Upravljanje timovima
- Kreiranje timova
- Dodavanje i uklanjanje članova tima
- Određivanje vođe tima
- Pregled članova tima (ime, e-mail, uloga, broj projekata, status), uz pretragu i filter po ulozi
- Pregled opterećenja zaposlenih
- Slanje pozivnice novom članu (administrator)

### Upravljanje resursima
Ovo je jedna od najvažnijih funkcionalnosti aplikacije.

Sistem treba da prati koliko je svaki zaposleni angažovan na različitim projektima.

Primer:

Zaposleni: Marko

- Projekat A: 70%
- Projekat B: 50%
- Ukupna alokacija: 120%

Sistem treba da prepozna zaposlene čija ukupna alokacija prelazi 100%.

Treba da prikazuje:
- Iskorišćenost zaposlenih
- Alokaciju po projektima
- Raspoloživi kapacitet
- Upozorenja o prekomernoj alokaciji
- Raspodelu opterećenja u timu

#### Alokacija i kapacitet
- Svaki zaposleni ima nedeljni kapacitet (podrazumevano 40 sati).
- Alokacija je procenat radnog vremena koji zaposleni posvećuje projektu u određenom periodu (početak – kraj). Primer: 50% na projektu A od 1.10. do 31.12. i 30% na projektu B samo tokom oktobra.
- Ukupna alokacija = zbir alokacija na svim aktivnim projektima (PLANNING, IN_PROGRESS) čiji se period preklapa sa posmatranim periodom. Obračun se radi po nedeljama, kako bi se ispravno obradila delimična preklapanja.
- Planirani sati = nedeljni kapacitet × ukupna alokacija.
- Iskorišćenost = evidentirani sati ÷ raspoloživi kapacitet × 100%.
- Alokacija je plan, a iskorišćenost stvarnost (iz timesheet-a). Njihovo poređenje otkriva i skriveno preopterećenje – npr. zaposleni je alociran 80%, a nedeljama evidentira prekovremene sate.

#### Statusi zauzetosti

| Status | Ukupna alokacija | Bedž u UI |
|---|---|---|
| Dostupan | ispod 50% | Available |
| Aktivan | od 50% do 100% | Active |
| Preopterećen | iznad 100% | Overallocated |

Granične vrednosti su podrazumevane i administrator ih može promeniti u podešavanjima organizacije.

#### Upozorenja o preopterećenju
- **Preventivno – pri dodeli ili izmeni alokacije.** Pre čuvanja se računa nova ukupna zauzetost. Ako bi prešla prag, project manager vidi upozorenje sa pregledom trenutnog angažovanja zaposlenog po projektima i može da smanji alokaciju, izabere drugog člana ili svesno potvrdi raspored.
- **Kontinuirano – pri svakoj promeni.** Kada se promeni alokacija, period ili status projekta, ponovo se računa zauzetost svih pogođenih zaposlenih. Ako neko postane preopterećen, project manageri njegovih projekata i administrator dobijaju notifikaciju u realnom vremenu.

Primer: Marko je angažovan 50% na projektu E-commerce Platform i 30% na projektu Mobile App (ukupno 80%, status Aktivan). Ako ga PM doda na projekat CRM System sa 40%, ukupno bi bilo 120% – upozorenje se prikazuje pre nego što se promena sačuva.

#### Prikazi
- Team View – za svakog zaposlenog: uloga, trenutna alokacija (progres bar), broj projekata i status.
- Project View – ko je angažovan na kom projektu i sa kolikim procentom.
- Zbirni pokazatelji iznad tabele: ukupan broj članova, prosečna iskorišćenost, broj preopterećenih i broj dostupnih zaposlenih.
- Filter perioda: ova nedelja, ovaj mesec, kvartal.

Proračune i analitičku obradu radiće ASP.NET Core servis. NestJS čuva alokacije, a na osnovu rezultata proračuna kreira notifikacije i emituje real-time događaje.

### Timesheet (evidencija radnog vremena)
Zaposleni treba da mogu da evidentiraju radne sate.

Svaki unos treba da sadrži:
- Zaposlenog
- Projekat
- Zadatak (opciono)
- Datum
- Broj sati
- Tip rada: naplativ (billable) ili nenaplativ (non-billable)
- Opis

Dodatno:
- Pregled po nedeljama, sa zbirom: ukupno sati, naplativi sati, nenaplativi sati i broj unosa
- Izmena i brisanje sopstvenih unosa
- Team Overview – project manager vidi evidenciju celog tima na svojim projektima
- Validacija: vreme se može evidentirati samo na projektima na kojima je korisnik član, a ukupno trajanje u jednom danu ne može preći 24 sata

Sistem treba da obezbedi agregiranu statistiku po projektima i zaposlenima.

### Notifikacije
Korisnici treba da dobijaju notifikacije za:
- Dodelu novog zadatka
- Izmene zadataka
- Nove komentare
- Predstojeće rokove
- Aktivnosti vezane za projekat
- Preopterećenje člana tima (za project managera i administratora)

Notifikacije se prikazuju u centru notifikacija sa brojačem nepročitanih (i u bočnom meniju) i mogu se označiti kao pročitane.

### Analitika i izveštaji
Aplikacija treba da pruži:
- Napredak projekata
- Statistiku završenih zadataka
- Raspodelu zadataka po statusima i članovima
- Iskorišćenost tima
- Ukupno utrošene sate
- Odnos naplativih i nenaplativih sati
- Procenjene u odnosu na stvarne sate
- Statistiku zadataka kojima je istekao rok

Izveštaji se filtriraju po periodu i projektu. Opseg zavisi od uloge: administrator vidi celu organizaciju, project manager svoje projekte, a član tima lični pregled. Opciono: izvoz u CSV.

Glavne analitičke proračune radiće ASP.NET Core servis.

### Podešavanja
- Profil (ime, pozicija, kratka biografija, fotografija)
- Nalog
- Notifikacije
- Izgled
- Bezbednost
- Integracije (za kasnija proširenja)
- Za administratora: podešavanja organizacije (pragovi za statuse zauzetosti, omogućavanje registracije)

## 6. Komunikacija u realnom vremenu

Za funkcionalnosti u realnom vremenu koristićemo Socket.IO.

Primeri:
- Kada jedan korisnik kreira zadatak, ostali članovi projekta treba da ga vide bez osvežavanja stranice.
- Kada se promeni status zadatka, ostali korisnici koji gledaju projekat treba da dobiju ažuriranje.
- Novi komentari treba da se pojave odmah.
- Notifikacije treba da stižu u realnom vremenu.

Planiramo da koristimo Socket.IO sobe (rooms) kako bismo komunikaciju razdvojili po projektima.

Na primer:

Projekat A:
- Marko
- Ana
- Nikola

Projekat B:
- Sara
- Ivan

Izmena u Projektu A treba da se emituje samo ovlašćenim korisnicima koji učestvuju u Projektu A.

### Način rada
- Pri povezivanju klijent šalje JWT; gateway ga proverava.
- Korisnik se uključuje u ličnu sobu `user:{id}` (notifikacije) i u sobu `project:{id}` za svaki projekat na kome je član.
- Sve izmene podataka i dalje idu kroz REST API (validacija i provera prava pristupa); baza je jedini izvor istine. Događaj se emituje tek nakon uspešnog upisa.
- Klijent koji je napravio izmenu odmah ažurira prikaz (optimistic update), a ostali klijenti primaju događaj i ažuriraju TanStack Query keš.
- Posle prekida veze Socket.IO se automatski ponovo povezuje, a klijent ponovo učitava podatke kako bi nadoknadio propuštene događaje.

### Događaji

| Događaj | Soba | Kada se emituje |
|---|---|---|
| `task:created` | `project:{id}` | Kreiran je novi zadatak |
| `task:updated` | `project:{id}` | Izmenjeni su podaci zadatka (naslov, rok, izvršilac…) |
| `task:moved` | `project:{id}` | Zadatak je premešten u drugu kolonu ili mu je promenjen redosled |
| `comment:created` | `project:{id}` | Dodat je komentar na zadatak |
| `notification:new` | `user:{id}` | Korisnik je dobio novu notifikaciju |
| `allocation:warning` | `user:{id}` | Član tima je postao preopterećen (šalje se project manageru) |
| `presence:update` | `project:{id}` | Ko trenutno gleda projekat (opciono) |

## 7. Autentifikacija, autorizacija i bezbednost

- Lozinke se čuvaju isključivo kao heš (bcrypt ili argon2).
- Access token (JWT) je kratkotrajan (npr. 15 minuta). Refresh token se čuva u httpOnly kolačiću, a u bazi u heširanom obliku – to omogućava odjavu i poništavanje sesija.
- Autorizacija na dva nivoa: `@Roles()` + `RolesGuard` za sistemsku ulogu, i `ProjectAccessGuard` za članstvo u projektu, odnosno vođenje projekta.
- Validacija svih ulaza: DTO + class-validator na backendu, Zod na frontendu.
- Prisma parametrizovani upiti (zaštita od SQL injection-a).
- Rate limiting na prijavi, CORS podešavanja i sigurnosna HTTP zaglavlja (Helmet).
- Tajni ključevi i konfiguracija isključivo u promenljivim okruženja, van izvornog koda.

## 8. Model podataka (okvirno)

Ovo je orijentacija za razumevanje domena, a ne konačna šema – šemu baze pravimo u posebnom koraku.

| Entitet | Opis |
|---|---|
| User | Ime, e-mail, heš lozinke, sistemska uloga, pozicija, nedeljni kapacitet, status naloga |
| Team / TeamMember | Tim, njegovi članovi i vođa tima |
| Project | Naziv, opis, status, period trajanja, tehnologije, project manager |
| ProjectMember | Veza User–Project (N:M): uloga na projektu, alokacija (%), period (startDate, endDate). Isti korisnik ne može dva puta biti na istom projektu. Osnova za upravljanje resursima i kontrolu pristupa |
| Milestone | Ključna faza projekta sa rokom i statusom |
| Task | Naslov, opis, status, prioritet, labele, rok, procena, izvršilac, pozicija na tabli |
| Comment | Komentar na zadatku |
| Attachment | Fajl priložen zadatku |
| TimeEntry | Korisnik, projekat, zadatak (opciono), datum, trajanje, tip (billable / non-billable), opis |
| Notification | Tip, sadržaj, vreme čitanja |
| ActivityLog | Ko je, šta i kada uradio – za prikaz nedavnih aktivnosti |
| RefreshToken | Heš refresh tokena sa rokom važenja |

Enumeracije: Role (ADMIN, PROJECT_MANAGER, TEAM_MEMBER), ProjectStatus, TaskStatus, Priority, TimeEntryType (BILLABLE, NON_BILLABLE).

Indeksi za česte upite (zadaci po projektu i statusu, unosi vremena po korisniku i datumu); transakcije za operacije koje menjaju više tabela.

## 9. Smernice za dizajn frontenda

### Postojeći UI dizajn (TaskFlow)
UI dizajn je već izrađen i on je glavna referenca za izgled aplikacije. Aplikacije iz liste inspiracija ispod su sekundarne. Slike su u `docs/design/`: `00-overview.png` (svi ekrani) i `screens/01-login.png` … `screens/09-settings.png`. Pre izrade nekog ekrana pogledaj njegovu sliku.

Dizajnirani ekrani:
1. Login
2. Dashboard
3. Projects (lista projekata)
4. Kanban tabla projekta
5. Detalji projekta
6. Resource Management
7. Timesheets
8. Team Members
9. Settings

Vizuelni jezik:
- Tamni bočni meni (sidebar) sa modulima, brojačem nepročitanih notifikacija i profilom korisnika na dnu.
- Stavke menija prema dizajnu: Dashboard, Projects, Tasks, Timesheets, Resources, Team, Reports, Calendar, Notifications, Settings.
- Gornja traka sa pretragom i notifikacijama.
- Svetla radna površina sa karticama.
- Jedan zajednički layout i biblioteka komponenti: dugmad, kartice, tabele, bedževi statusa, progres barovi.
- Tekstovi u interfejsu su na engleskom jeziku.

Paleta boja (približne vrednosti očitane sa dizajna):

| Uloga | Boja | Upotreba |
|---|---|---|
| Primarna | `#1D5EEE` | dugmad, aktivni meni, „In Progress“ |
| Navigacija | `#152231` | bočni meni |
| Uspeh | `#15A872` | završeno, aktivno, naplativo |
| Upozorenje | `#F59E0B` | planiranje, bliski rokovi |
| Opasnost | `#DD314C` | kašnjenje, preopterećenje |
| Akcent | `#7C3AED` | ikonice i oznake |

Bedževi statusa (Completed, In Progress, Planning, On Hold, Active, Available, Overallocated) koriste svuda istu boju za isto značenje.

### Inspiracija
Aplikacija treba da izgleda i da se ponaša kao moderna SaaS platforma za upravljanje projektima.

- Linear
- Asana
- Monday.com
- ClickUp
- Jira (moderni interfejs)

### Opšti principi dizajna
- Čist i moderan interfejs.
- Profesionalni SaaS dashboard.
- Dosledni razmaci (spacing) i tipografija.
- Jasna vizuelna hijerarhija.
- Zaobljene kartice i suptilne senke.
- Intuitivna navigacija.
- Responzivni rasporedi.
- Pristupačne (accessible) komponente.
- Svetla tema (svetla radna površina, tamni sidebar) kao početna podrazumevana.
- Tamna tema može da se razmotri kasnije.

### Glavni raspored (layout)

Desktop:
- Bočna navigacija (sidebar).
- Gornja navigacija / header.
- Glavna oblast sa sadržajem.
- Dashboard kartice i grafikoni.
- Kontekstualne akcije.

Mobilni uređaji:
- Responzivni rasporedi (sidebar se skuplja, kartice i tabele prelaze u jednu kolonu).
- Donja navigacija gde ima smisla.
- Upravljanje zadacima prilagođeno mobilnim uređajima.
- Prilagođeno Kanban iskustvo.
- Kontrole pogodne za dodir.

Desktop i mobilno iskustvo treba da budu osmišljeni kao delovi istog proizvoda.

## 10. Očekivanja od arhitekture frontenda

Koristićemo Next.js App Router.

Frontend treba da bude organizovan po funkcionalnostima (features) i odgovornostima.

Moguća struktura:

- app/
- components/
- features/
- hooks/
- lib/
- services/
- types/
- providers/

Treba razdvojiti:
- UI komponente
- Komunikaciju sa API-jem
- Poslovnu logiku na frontendu
- Validaciju formi
- Deljene tipove
- Logiku autentifikacije

Dosledno koristiti TypeScript.

Izbegavati nepotrebnu složenost i preuranjene apstrakcije.

## 11. Kvalitet, testiranje i pokretanje

### Nefunkcionalni zahtevi
- Performanse: paginacija lista, indeksi nad čestim upitima, keširanje (TanStack Query na klijentu, Redis na serveru); tipični zahtevi se obrađuju u delu sekunde.
- Pouzdanost: transakcije za operacije koje menjaju više tabela, integritet kroz strane ključeve i ograničenja.
- Upotrebljivost: konzistentan interfejs prema dizajnu, jasne poruke o greškama i uspešnim akcijama.
- Održivost: modularna arhitektura, dokumentovan API.
- Prenosivost: Docker kontejneri, konfiguracija kroz promenljive okruženja.

### Testiranje
- Prioritet imaju delovi najosetljiviji na greške: obračun alokacije i detekcija preopterećenja, prava pristupa i validacija evidencije vremena.
- NestJS: unit testovi (Jest) i integracioni testovi API-ja (Supertest) nad test bazom.
- .NET servis: unit testovi proračuna.
- Opciono: Playwright za ključne tokove (prijava, kreiranje projekta, rad na Kanban tabli).
- Seed skripta sa demo podacima za prezentaciju.

### Pokretanje
- `docker-compose.yml` sa servisima: web (Next.js), api (NestJS), analytics (ASP.NET Core), db (PostgreSQL) i redis.
- Prisma migracije se automatski primenjuju pri pokretanju api servisa.
- Ceo sistem se pokreće komandom `docker compose up`, bez ručne instalacije zavisnosti.

## 12. Van obima prve verzije

Ovo su moguća proširenja i za sada ih ne planiramo:
- Gantt prikaz sa zavisnostima između zadataka
- Integracija sa GitHub-om (povezivanje commit-ova i pull request-ova sa zadacima)
- Sinhronizacija rokova sa Google kalendarom
- Izvoz izveštaja u PDF i Excel
- Mobilna verzija aplikacije (PWA)
- Predlog optimalne raspodele resursa na osnovu slobodnog kapaciteta i veština
- Tamna tema

## 13. Okvirni plan iz predloga projekta

| Faza | Aktivnosti | Trajanje |
|---|---|---|
| 1. Analiza i dizajn | Specifikacija zahteva, UI dizajn (✓ završeno), model podataka | 2 nedelje |
| 2. Postavka projekta | Monorepo, Docker okruženje, Prisma šema i migracije, osnovna struktura frontenda i backenda | 1 nedelja |
| 3. Autentifikacija i korisnici | Prijava, JWT, uloge i guard-ovi, pozivnice, profil i podešavanja | 2 nedelje |
| 4. Projekti i zadaci | Projekti, članovi, milestone-ovi, Kanban tabla sa drag-and-drop, komentari | 3 nedelje |
| 5. Upravljanje resursima | Alokacije, obračun zauzetosti, statusi, upozorenja, Team View i Project View | 2 nedelje |
| 6. Evidencija vremena i analitika | Unos i pregled sati, zbirni izveštaji, dashboard i grafikoni | 2 nedelje |
| 7. Real-time i notifikacije | Socket.IO gateway, sobe, događaji, centar notifikacija | 1–2 nedelje |
| 8. Testiranje i finalizacija | Testovi, ispravke, seed podaci, dokumentacija, priprema za prezentaciju | 2 nedelje |

Ukupno okvirno: 15–16 nedelja.

Plan je nastao pre odluke da deo backenda bude u C#; ASP.NET Core servis (postavka, integracija sa NestJS-om, proračuni resursa i analitike) treba uklopiti u njega. Implementacija kreće od frontenda, sa mock podacima.

## 14. Principi razvoja

Tokom celog razvoja:

- Pratiti principe čistog koda.
- Koristiti komponente koje mogu ponovo da se upotrebe.
- Držati komponente razumno malim.
- Koristiti dosledne konvencije imenovanja.
- Održavati strogo TypeScript tipiziranje.
- Obraditi stanja učitavanja, greške i prazna stanja.
- Implementirati ispravnu validaciju formi.
- Držati komunikaciju sa API-jem centralizovanom.
- Štititi rute koje zahtevaju autentifikaciju.
- Poštovati dozvole korisnika.
- Izbegavati dupliranje poslovne logike između servisa.
- Držati frontend nezavisnim od detalja implementacije baze podataka.
