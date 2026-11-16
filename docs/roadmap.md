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

### 1.4 Kanban tabla ☐
Dizajn `04-kanban.png` · ruta `/projects/[projectId]/board`

| # | Korak | Status |
|---|---|---|
| 1 | Podaci: tip `Task` (labele, izvršilac, rok, prioritet, pozicija), mock po projektu, `useProjectTasks` | ☐ |
| 2 | `TaskCard`: naslov, labela, rok (crveno ako kasni), avatar izvršioca, prioritet | ☐ |
| 3 | `KanbanColumn`: naslov sa brojem zadataka, lista kartica, „+ Add task“ | ☐ |
| 4 | `KanbanBoard`: 4 kolone, horizontalni skrol na mobilnom | ☐ |
| 5 | Drag & drop (dnd-kit): između kolona i redosled u koloni, optimistic update preko `useMutation` | ☐ |
| 6 | `BoardToolbar`: pretraga i filteri (član, labela, rok) | ☐ |
| 7 | `TaskDetailsSheet`: klik na karticu otvara panel sa detaljima i komentarima | ☐ |
| 8 | `AddTaskDialog`: forma (React Hook Form + Zod) | ☐ |
| 9 | Prikazi List i Timeline (opciono, posle osnovnih ekrana) | ☐ |

### 1.5 Team Members ☐
Dizajn `08-team.png` · ruta `/team`

| # | Korak | Status |
|---|---|---|
| 1 | Mock korisnici: proširiti `services/mock/users.ts` (e-mail, uloga, pozicija) i koristiti ga i u `auth-service`; `getTeamMembers` | ☐ |
| 2 | `RoleBadge` za sistemske uloge (Admin, Project Manager, Team Member) | ☐ |
| 3 | `TeamMembersTable`: ime i avatar, e-mail, uloga, pozicija, broj projekata, status, izmena | ☐ |
| 4 | `TeamToolbar`: pretraga, filter po ulozi, dugme Invite Member | ☐ |
| 5 | `InviteMemberDialog`: forma za pozivnicu | ☐ |
| 6 | Timovi i vođe timova (`/team/teams`) | ☐ |

### 1.6 Resources – upravljanje resursima ☐
Dizajn `06-resources.png` · ruta `/resources` · najvažniji deo aplikacije

| # | Korak | Status |
|---|---|---|
| 1 | Podaci: alokacije po članu i projektu (procenat, period), mock sa preopterećenim članovima, `useResources` | ☐ |
| 2 | Statusi zauzetosti u `StatusBadge`: Available, Active, Overallocated | ☐ |
| 3 | `StatCard` iz Dashboard-a premestiti u `components/shared`; kartice Total, Utilization, Overallocated, Available | ☐ |
| 4 | `TeamViewTable`: član, uloga, alokacija (progres bar), broj projekata, status | ☐ |
| 5 | `ProjectViewTable`: projekti i članovi sa procentima | ☐ |
| 6 | `PeriodSelect`: ova nedelja, ovaj mesec, kvartal (u URL-u) | ☐ |
| 7 | `AllocationDialog`: dodela člana projektu sa procentom i preventivnim upozorenjem kad ukupno prelazi 100% | ☐ |

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
- **Team:** kolona Role meša sistemsku ulogu (Admin) i poziciju (Frontend Developer). Sistemska uloga ide kao bedž, a pozicija se prikazuje odvojeno.
- **Detalji projekta i Kanban:** imaju različite tabove. Koristi se jedan zajednički set: Overview, Board, List, Timeline, Team, Files, Settings.
- **Detalji projekta:** kartica sa progresom ima dva reda avatara, a drugi deluje kao duplikat. Prikazuje se samo jedan red članova.

## Za kasnije

- `DashboardGreeting` ponavlja HTML naslova; može da koristi `PageHeader`.
- `StatCard` je u `features/dashboard`, a treba i drugim ekranima (korak 1.6/3).
- Polja projekta `icon` i `color` ne postoje u modelu iz specifikacije. Treba ih dodati u Prisma šemu.
- `NewProjectButton` još nema akciju. Treba ga povezati kad bude postojalo kreiranje projekta (dijalog ili strana).
- Polje `createdAt` je dodato projektu zbog sortiranja „Newest“. Treba ga imati i u Prisma šemi.
- Filtriranje i sortiranje projekata trenutno radi mock servis. API treba da podrži iste parametre (`q`, `status`, `sort`), a bez `status` da ne vraća arhivirane projekte.
- `ApiError` (status + poruka) je zajednički oblik greške servisnog sloja. Pravi `api-client` (faza 4) treba svaki neuspešan HTTP odgovor da pretvori u `ApiError` sa statusom odgovora.
- Nepostojeći projekat (`/projects/xyz`) prikazuje „Project not found“, ali HTTP status je 200, jer se projekat učitava u browseru. Pravi 404 status traži učitavanje na serveru (kad stigne API).
- Sadržaj taba projekta se prikazuje tek kad se učita projekat (zaglavlje). Ako tab bude imao svoje podatke (npr. zadaci za Board), oni počinju da se učitavaju posle projekta; po potrebi ih učitavati paralelno.
- Lucide nema brand ikonice, pa GitHub i Figma linkovi imaju neutralne ikonice (kod i dizajn). Ako zatrebaju prave, može se dodati mali SVG ili biblioteka (uz dogovor).
- Kad linkovi projekta budu mogli da se unose kroz formu, dozvoliti samo http(s) adrese (validacija i na frontendu i na backendu), da se ne bi mogao ubaciti `javascript:` link.
