# TaskFlow – roadmap

Plan rada po koracima i status svakog koraka. Specifikacija je u `docs/kontekst-projekta.md`, a pravila rada u `CLAUDE.md`.

**Kako se koristi**
- Jedan korak = jedna komponenta (ili jedna mala celina) = jedan commit.
- Kad je korak gotov, u istom commit-u se ovde označi kao urađen (✓) i upiše se commit poruka.
- Podela ekrana na korake je okvirna. Pre početka ekrana može se doraditi.
- Sve što se usput primeti za kasnije ide u odeljak „Za kasnije“ na dnu.

**Legenda:** ✓ urađeno · ▶ sledeće · ☐ planirano

---

## Faza 0 – Postavka ✓

| Korak | Status | Commit |
|---|---|---|
| Specifikacija, dizajn i CLAUDE.md | ✓ | `docs: add project spec and design` |
| Monorepo (npm workspaces), Next.js, Tailwind, shadcn/ui, tema iz dizajna | ✓ | `chore: replace Vite with Next.js` |
| LF kraj redova za sve fajlove | ✓ | `chore: enforce LF line endings with .gitattributes` |
| TanStack Query i Recharts | ✓ | `chore: set up TanStack Query and charts` |
| Pravila rada u CLAUDE.md | ✓ | `docs: add working rules` |
| Prettier (+ sortiranje Tailwind klasa), provera u lint-u, formatiran ceo kod | ✓ | `chore: add prettier and format code` |

---

## Faza 1 – Frontend sa mock podacima

Svi ekrani se prave sa mock podacima kroz `src/services/`. Kad stigne backend, menja se samo servisni sloj.

### 1.1 Layout i Dashboard ✓
Grana `feature/app-layout`, spojena u `main`.

| # | Korak | Status | Commit |
|---|---|---|---|
| 1 | App layout: sidebar, header, mobilni meni | ✓ | `feat: add app layout with sidebar and header` |
| 2 | Dashboard: pozdrav, KPI kartice, grafikoni, nedavne aktivnosti, rokovi | ✓ | `feat: add dashboard with mock data` |

### 1.2 Projects – lista projekata ✓
Grana `feature/projects-list`, spojena u `main` (PR #1) · dizajn `03-projects.png`

| # | Korak | Status | Commit |
|---|---|---|---|
| 1 | Podaci: tip `Project`, mock servis sa 6 projekata, `useProjects` | ✓ | `feat(projects): add project types and mock service` |
| 2 | `PageHeader` i strana `/projects` | ✓ | `feat(projects): add projects page header` |
| 3 | `StatusBadge` (statusi projekta) | ✓ | `feat(shared): add status badge` |
| 4 | `ProjectCard` (+ `AvatarGroup`, shadcn `Progress`) | ✓ | `feat(projects): add project card` |
| 5 | `ProjectsGrid`: mreža 3/2/1 kolone, skeleton, prazno stanje, greška | ✓ | `feat(projects): add projects grid` |
| 6 | `ProjectsToolbar`: pretraga, filter po statusu, sortiranje (stanje u URL-u) | ✓ | `feat(projects): add projects toolbar` |
| 7 | Završetak: pull request i merge u `main` | ✓ | PR #1 |

### 1.3 Detalji projekta ✓
Grana `feature/project-details`, spojena u `main` (PR #2) · dizajn `05-project-detail.png` · ruta `/projects/[projectId]`

| # | Korak | Status | Commit |
|---|---|---|---|
| 1 | Podaci: `getProject(id)`, milestone-ovi, brzi linkovi, tehnologije; `useProject` | ✓ | `feat(projects): add project details data` |
| 2 | Layout projekta: breadcrumb, ikonica, naziv, opis, dugme Edit Project, tabovi | ✓ | `feat(projects): add project layout with tabs` |
| 3 | `ProjectSummaryCard`: progres, članovi, period trajanja | ✓ | `feat(projects): add project summary card` |
| 4 | `ProjectDescriptionCard`: opis i tehnologije kao tagovi | ✓ | `feat(projects): add project description card` |
| 5 | `MilestonesCard`: lista sa statusom i rokom | ✓ | `feat(projects): add milestones card` |
| 6 | `QuickLinksCard`: GitHub, Figma, API dokumentacija, Live Preview | ✓ | `feat(projects): add quick links card` |
| 7 | Povezivanje: klik na `ProjectCard` (stretched link) i „View details“ vode na detalje. Nepostojeći projekat je već rešen u `ProjectShell` („Project not found“) | ✓ | `feat(projects): link project cards to details` |
| 8 | Završetak: pull request i merge u `main` | ✓ | PR #2 |

### 1.4 Kanban tabla ✓
Grana `feature/kanban-board`, spojena u `main` (PR #3) · dizajn `04-kanban.png` · ruta `/projects/[projectId]/board`

| # | Korak | Status | Commit |
|---|---|---|---|
| 1 | Podaci: tip `Task` (labele, izvršilac, rok, prioritet, pozicija), mock po projektu, `useProjectTasks` | ✓ | `feat(tasks): add task types and mock service` |
| 2 | `TaskCard`: naslov, labela, rok (crveno ako kasni), avatar izvršioca, prioritet | ✓ | `feat(tasks): add task card` |
| 3 | `KanbanColumn`: naslov sa brojem zadataka, lista kartica, „+ Add task“ | ✓ | `feat(tasks): add kanban column` |
| 4 | `KanbanBoard`: 4 kolone, horizontalni skrol na mobilnom | ✓ | `feat(tasks): add kanban board layout` |
| 5 | Drag & drop (dnd-kit): između kolona i redosled u koloni, optimistic update preko `useMutation` | ✓ | `feat(tasks): add drag and drop to kanban board` |
| 6 | `BoardToolbar`: pretraga i filteri (član, labela, rok) | ✓ | `feat(tasks): add board toolbar` |
| 7 | `TaskDetailsSheet`: klik na karticu otvara panel sa detaljima i komentarima (samo čitanje) | ✓ | `feat(tasks): add task details sheet` |
| 8 | `AddTaskDialog`: forma (React Hook Form + Zod) | ✓ | `feat(tasks): add task dialog` |
| 9 | Izmena zadatka u panelu: dugme Edit prebacuje panel u formu (zajednički `TaskForm` sa `AddTaskDialog`) | ✓ | `feat(tasks): edit task in details panel` |
| 10 | Dodavanje komentara: forma ispod liste, optimistic update, Ctrl/Cmd+Enter | ✓ | `feat(tasks): add task comments` |
| 11 | Prikazi List i Timeline (opciono), odloženo, posle osnovnih ekrana | ☐ | |
| 12 | Završetak: pull request i merge u `main` | ✓ | PR #3 |

### 1.5 Team Members ✓
Grana `feature/team-members`, spojena u `main` (PR #4) · dizajn `08-team.png` · ruta `/team`

| # | Korak | Status | Commit |
|---|---|---|---|
| 1 | Podaci: zajednički mock korisnici (`services/mock/users.ts`) prošireni na pun tip `User` (e-mail, pozicija, uloga, status, nedeljni kapacitet) i jedan pozvani korisnik; `auth-service` koristi istog korisnika; `getTeamMembers({ q, role })` sa brojem projekata; `useTeamMembers` | ✓ | `feat(team): add team members data` |
| 2 | `RoleBadge` za sistemske uloge (Admin, Project Manager, Team Member) i statusi korisnika u `StatusBadge`; strana `/team` sa zaglavljem | ✓ | `feat(team): add role badge` |
| 3 | `TeamMembersTable`: ime i avatar, e-mail, uloga, pozicija, broj projekata, status, izmena | ✓ | `feat(team): add team members table` |
| 4 | `TeamToolbar`: pretraga, filter po ulozi, dugme Invite Member (stanje u URL-u) | ✓ | `feat(team): add team toolbar` |
| 5 | `InviteMemberDialog`: forma za pozivnicu (React Hook Form + Zod), greška 409 ispod polja Email | ✓ | `feat(team): add invite member mutation`, `feat(team): add invite member dialog` |
| 6 | `EditMemberDialog`: uloga, pozicija i kapacitet, deaktivacija uz potvrdu i ponovno aktiviranje (samo Admin) | ✓ | `feat(team): add update member mutations`, `feat(team): add edit member dialog` |
| 7 | Timovi i vođe timova (`/team/teams`), odloženo, posle osnovnih ekrana | ☐ | |
| 8 | Završetak: pull request i merge u `main` | ✓ | PR #4 |

### 1.6 Resources – upravljanje resursima ▶
Grana `feature/resources` · dizajn `06-resources.png` · ruta `/resources` · najvažniji deo aplikacije

| # | Korak | Status | Commit |
|---|---|---|---|
| 1 | Podaci: tip `Allocation` i mock alokacije (svaki član projekta, bar jedan preopterećen i jedan dostupan), obračun zauzetosti po nedeljama u `lib/utilization.ts`; `getResourceOverview({ period })` i `useResourceOverview` | ✓ | `feat(resources): add allocation data and utilization logic`, `fix(resources): calculate allocation by weeks`, `feat(resources): add resource overview service` |
| 2 | Statusi zauzetosti u `StatusBadge`: Available, Active, Overallocated | ✓ | `feat(resources): add utilization status badges` |
| 3 | `StatCard` iz Dashboard-a premestiti u `components/shared`; kartice Total, Utilization, Overallocated, Available | ✓ | `feat(resources): add resource summary cards` |
| 4 | `TeamViewTable`: član, uloga, alokacija (progres bar), broj projekata, status | ✓ | `feat(resources): add team allocation table` |
| 5 | `ProjectViewTable`: projekti i članovi sa procentima; tabovi Team View / Project View (`?view=`) | ✓ | `feat(resources): add project allocation table and view tabs` |
| 6 | `PeriodSelect`: ova nedelja, ovaj mesec, kvartal (u URL-u) | ✓ | `feat(resources): add period select` |
| 7 | `AllocationDialog`: dodela člana projektu sa procentom i preventivnim upozorenjem kad ukupno prelazi 100% | ☐ | |

### 1.7 Timesheets ☐
Dizajn `07-timesheets.png` · ruta `/timesheets`

| # | Korak | Status |
|---|---|---|
| 1 | Podaci: tip `TimeEntry`, mock po nedeljama, `useTimeEntries` | ☐ |
| 2 | `WeekPicker`: izbor nedelje (u URL-u) | ☐ |
| 3 | Kartice: Total Hours, Billable, Non-billable, Entries | ☐ |
| 4 | Bedž Billable / Non-billable (preko `StatusBadge` tonova) | ☐ |
| 5 | `TimeEntriesTable` (My Entries) sa izmenom i brisanjem | ☐ |
| 6 | `TimeEntryDialog`: dodavanje i izmena, validacija (najviše 24 h dnevno, samo projekti na kojima je član) | ☐ |
| 7 | Tab Team Overview za project managera | ☐ |

### 1.8 Settings ☐
Dizajn `09-settings.png` · ruta `/settings`

| # | Korak | Status |
|---|---|---|
| 1 | Layout podešavanja: bočni meni (Profile, Account, Notifications, Appearance, Security, Integrations) | ☐ |
| 2 | `ProfileForm` (React Hook Form + Zod) i Upload Photo | ☐ |
| 3 | Ostali tabovi, po jedan u koraku | ☐ |
| 4 | Organization (samo admin): pragovi za statuse zauzetosti, uključivanje registracije | ☐ |

### 1.9 Prijava i auth strane ☐
Dizajn `01-login.png` · rute u grupi `(auth)`

| # | Korak | Status |
|---|---|---|
| 1 | `(auth)` layout: podeljen ekran sa slikom i porukom | ☐ |
| 2 | `LoginForm`: e-mail, lozinka, Forgot password, dugmad Google i Microsoft (bez akcije) | ☐ |
| 3 | Strane Register, Forgot password, Reset password i Invite | ☐ |

### 1.10 Ostali ekrani ☐

| Korak | Status |
|---|---|
| Tasks: moji zadaci iz svih projekata | ☐ |
| Notifications: centar notifikacija | ☐ |
| Calendar: rokovi zadataka i milestone-ova | ☐ |
| Reports: izveštaji i filteri | ☐ |
| `not-found` strana za celu aplikaciju | ☐ |

---

## Faza 2 – Backend (NestJS)
Razbija se na korake kad dođemo do nje.

- ☐ Postavka `apps/api`, PostgreSQL u Docker-u, Prisma šema, migracije i seed
- ☐ Auth: prijava, JWT, refresh token, uloge i guard-ovi, pozivnice
- ☐ Moduli: Projects, Tasks i komentari, članovi i alokacije, Timesheets, Notifications
- ☐ Swagger dokumentacija

## Faza 3 – Servis za resurse i analitiku (ASP.NET Core)
- ☐ Postavka `apps/analytics`
- ☐ Obračun iskorišćenosti i detekcija preopterećenja
- ☐ Analitika: napredak, procenjeni i stvarni sati, statistika zadataka
- ☐ Integracija sa NestJS-om

## Faza 4 – Povezivanje frontenda sa backendom
- ☐ `api-client` i auth tok (prijava, refresh, zaštićene rute preko `proxy.ts`)
- ☐ Zamena mock servisa pravim API-jem, modul po modul

## Faza 5 – Real-time
- ☐ Socket.IO gateway, sobe `user:{id}` i `project:{id}`
- ☐ Događaji za zadatke i komentare, notifikacije i upozorenja o preopterećenju

## Faza 6 – Infrastruktura i završetak
- ☐ Docker Compose za ceo sistem (web, api, analytics, db, redis)
- ☐ Testovi (Jest, Supertest, unit testovi .NET servisa)
- ☐ Seed sa demo podacima, README, priprema za odbranu

---

## Odluke o nedoslednostima u dizajnu

- **Projects:** „In Progress“ je na E-commerce kartici zelen, a na ostalima plav. Pravilo je da je In Progress uvek plav (primary).
- **Resources:** Ana sa 100% je označena kao Overallocated. Po specifikaciji, preopterećen je samo onaj ko je iznad 100%, pa mock podaci treba da imaju npr. 120%.
- **Resources:** kartice sa brojevima na dizajnu nemaju ikonice, a vrednost je obojena. Koristi se zajednički `StatCard` kao na Dashboard-u (ikonica u boji tona). Kartica Available je plava (`info`), kao bedž Available, iako je na dizajnu zelena.
- **Team:** kolona Role meša sistemsku ulogu (Admin) i poziciju (Frontend Developer). Sistemska uloga ide kao bedž, a pozicija se prikazuje odvojeno.
- **Detalji projekta i Kanban:** imaju različite tabove. Koristi se jedan zajednički set: Overview, Board, List, Timeline, Team, Files, Settings.
- **Detalji projekta:** kartica sa progresom ima dva reda avatara, a drugi deluje kao duplikat. Prikazuje se samo jedan red članova.
- **Kanban:** na dizajnu je tabla projekta „Website Redesign“, kog nema u listi projekata. Zadaci sa dizajna su u mock-u vezani za E-commerce Platform.
- **Kanban:** dizajn za istu vrstu posla koristi labele „dev“ i „development“. Koristi se samo „development“.
- **Team:** broj projekata na dizajnu (npr. Bogdan 5) ne odgovara mock projektima. Broj se računa iz članstva u projektima (bez arhiviranih), pa se razlikuje od dizajna. Ivan (Project Manager) i pozvani korisnik nisu na dizajnu, a u mock-u jesu.

## Za kasnije

- `DashboardGreeting` ponavlja HTML naslova; može da koristi `PageHeader`.
- Polja projekta `icon` i `color` ne postoje u modelu iz specifikacije. Treba ih dodati u Prisma šemu.
- `NewProjectButton` još nema akciju. Treba ga povezati kad bude postojalo kreiranje projekta (dijalog ili strana).
- Polje `createdAt` je dodato projektu zbog sortiranja „Newest“. Treba ga imati i u Prisma šemi.
- Filtriranje i sortiranje projekata trenutno radi mock servis. API treba da podrži iste parametre (`q`, `status`, `sort`), a bez `status` da ne vraća arhivirane projekte.
- `ApiError` (status + poruka) je zajednički oblik greške servisnog sloja. Pravi `api-client` (faza 4) treba svaki neuspešan HTTP odgovor da pretvori u `ApiError` sa statusom odgovora.
- Nepostojeći projekat (`/projects/xyz`) prikazuje „Project not found“, ali HTTP status je 200, jer se projekat učitava u browseru. Pravi 404 status traži učitavanje na serveru (kad stigne API).
- Sadržaj taba projekta se prikazuje tek kad se učita projekat (zaglavlje). Ako tab bude imao svoje podatke (npr. zadaci za Board), oni počinju da se učitavaju posle projekta; po potrebi ih učitavati paralelno.
- Lucide nema brand ikonice, pa GitHub i Figma linkovi imaju neutralne ikonice (kod i dizajn). Ako zatrebaju prave, može se dodati mali SVG ili biblioteka (uz dogovor).
- Kad linkovi projekta budu mogli da se unose kroz formu, dozvoliti samo http(s) adrese (validacija i na frontendu i na backendu), da se ne bi mogao ubaciti `javascript:` link.
- Backend mora da proverava da je izvršilac zadatka član projekta.
- Ista pravila validacije iz Zod šeme (title 3–120 znakova, opis do 2000, procena 0.5–200 sati, izvršilac je član projekta, labele…) moraju da postoje i u NestJS DTO-u, jer se frontend validaciji ne može verovati.
- Zatvaranje panela zadatka (ili prelazak na drugi zadatak) dok je forma za izmenu otvorena odbacuje nesačuvane izmene bez upozorenja. Po potrebi dodati potvrdu.
- U formi zadatka labele se biraju samo od onih koje već postoje na tabli; nove labele zasad ne mogu da se dodaju.
- Komentarisanje: mock korisnik je Admin, pa mock servis ne proverava prava. Backend mora da proveri da korisnik sme da komentariše na projektu (Admin svuda, Project Manager na svojim projektima, Team Member samo na projektima na kojima je član) i da sadržaj nije prazan i da ima najviše 1000 znakova.
- Lista članova tima: API treba da podrži iste parametre (`q` po imenu i e-mailu, `role`) i da vrati broj projekata bez arhiviranih. Članovi su zasad u redosledu kreiranja, bez sortiranja.
- `Project` nema polje za project managera (`managerId`), a treba za prava pristupa (PM upravlja samo svojim projektima) i za Resources.
- Pozivanje člana: mock samo dodaje korisnika sa statusom INVITED. Backend treba da pošalje e-mail sa jednokratnim tokenom (sa rokom važenja) za prihvatanje pozivnice, i da dozvoli pozivanje samo Admin-u. E-mail mora da bude jedinstven (409), bez obzira na velika i mala slova.
- Izmenu članova (uloga, pozicija, kapacitet, deaktivacija) sme samo Admin. Kad stignu prava pristupa, dugme za izmenu u tabeli treba sakriti ostalim ulogama, a backend mora da proverava ulogu i pravila (ne menja se sopstvena uloga i ne deaktivira sopstveni nalog, ostaje bar jedan aktivan Admin, kapacitet 1–60 h).
- Deaktivirani korisnici ne treba da se nude kao izvršioci zadataka (i članovi projekta).
- Obračun zauzetosti na backendu radi ASP.NET Core servis. `lib/utilization.ts` ga samo oponaša (pragovi, nedeljni obračun sa vrhom opterećenja, samo projekti u statusu PLANNING i IN_PROGRESS) i dobar je kandidat za unit testove, i na frontendu i u .NET servisu.
- Kartica Utilization Rate za sada prikazuje prosečnu planiranu alokaciju. Kad stignu Timesheets, treba da prikazuje stvarnu iskorišćenost (evidentirani sati ÷ kapacitet).
- Pragovi statusa zauzetosti su zasad podrazumevani (50% i 100%). Treba ih čitati iz podešavanja organizacije (korak 1.8/4).
