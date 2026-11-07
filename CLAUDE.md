# TaskFlow

Full-stack web aplikacija za upravljanje projektima i resursima (diplomski rad). Centralni deo je upravljanje resursima: praćenje angažovanja zaposlenih po projektima i upozorenja o preopterećenju.

- Kompletna specifikacija: `docs/kontekst-projekta.md`. Pre rada na nekom modulu pročitaj njegovu sekciju.
- UI dizajn: `docs/design/` (`00-overview.png` i `screens/01-login.png` … `screens/09-settings.png`). Pre izrade ekrana pogledaj njegovu sliku. Dizajn je glavna referenca za izgled.

## Jezik
- Sa mnom komuniciraj na srpskom (latinica). Tehnički termini mogu na engleskom.
- Kod, nazivi fajlova, komentari u kodu i commit poruke su na engleskom.
- Tekstovi u interfejsu aplikacije su na engleskom (kao u dizajnu).

## Struktura repoa (monorepo)
```
taskflow/
├── apps/
│   ├── web/          # React + Vite frontend       ← trenutno radimo ovde
│   ├── api/          # NestJS backend              (kasnije)
│   └── analytics/    # ASP.NET Core servis (C#)    (kasnije)
├── packages/
│   └── shared/       # zajednički TS tipovi        (kasnije)
├── docs/
└── docker-compose.yml                              (kasnije)
```

## Stack
- **Frontend:** Vite + React + TypeScript (SPA), React Router, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form + Zod, dnd-kit, Recharts, Socket.IO Client, lucide-react ikone.
- **Glavni backend:** NestJS, Prisma, PostgreSQL, REST + Swagger, Socket.IO, JWT + refresh tokeni.
- **Sekundarni servis:** ASP.NET Core Web API (C#) za proračune resursa i analitiku; poziva ga samo NestJS.
- **Infrastruktura:** Docker Compose, Redis.

## Arhitektonska pravila
- Frontend nikada ne pristupa bazi direktno; sve ide kroz NestJS API.
- .NET servis nije dostupan frontendu; poziva ga samo NestJS.
- Dok backend ne postoji, frontend koristi mock podatke kroz `src/services/`. Komponente ne smeju da znaju da li su podaci mock ili sa API-ja, pa prelazak na pravi API menja samo servisni sloj.
- Ne dupliraj poslovnu logiku između servisa.

## Frontend konvencije (`apps/web`)
- Struktura: `src/routes` (definicija ruta i stranice), `src/components/ui` (shadcn), `src/components/layout` (sidebar, header), `src/components/shared`, `src/features/<modul>/` (komponente, hooks i tipovi jednog modula), `src/hooks`, `src/lib`, `src/services`, `src/types`, `src/providers`.
- Folder praviš tek kad u njega ide nešto; bez praznih foldera i placeholder fajlova.
- SPA bez server-side renderinga: rute su u React Router-u, a zaštićene rute rade preko route guard-a (prijavljen korisnik + uloga). Stvarna provera prava je uvek na backendu.
- Alias `@/` pokazuje na `src/`. Env promenljive za frontend imaju prefiks `VITE_` i ne sadrže tajne, jer završavaju u build-u.
- Boje, radijusi i senke dolaze isključivo iz teme (CSS varijable / Tailwind tokeni). U komponentama nema hardkodovanih hex vrednosti.
- Isti status uvek ima isti bedž i boju (Completed, In Progress, Planning, On Hold, Active, Available, Overallocated).
- Forme: React Hook Form + Zod.
- Svaki prikaz podataka obrađuje loading, error i empty stanje.
- Strogo tipiziranje: bez `any`, deljeni tipovi su u `src/types` (kasnije u `packages/shared`).
- Komponente drži male i višekratno upotrebljive; bez preuranjenih apstrakcija.
- Layout mora da radi i na mobilnom (sidebar se skuplja, kartice prelaze u jednu kolonu).

## Dizajn tokeni (sa dizajna, približno)
| Token | Boja | Upotreba |
|---|---|---|
| primary | `#1D5EEE` | dugmad, aktivni meni, In Progress |
| sidebar | `#152231` | tamni bočni meni |
| success | `#15A872` | završeno, aktivno, naplativo |
| warning | `#F59E0B` | planiranje, bliski rokovi |
| danger | `#DD314C` | kašnjenje, preopterećenje |
| accent | `#7C3AED` | ikonice i oznake |

Svetla radna površina, tamni sidebar, kartice sa zaobljenim ivicama i suptilnim senkama. Font: Inter (lokalno preko `@fontsource`, ne sa CDN-a).

## Git
- `main` uvek mora da se build-uje.
- Novi rad ide na grane: `feature/<naziv>`, `fix/<naziv>`, `chore/<naziv>`.
- Commit poruke po Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `style:`, `docs:`, `test:`.
- Commit-ovi su mali i logični, jedna celina po commit-u.
- Pre commit-a pokreni lint i build za `apps/web`.
- Ne push-uj, ne merge-uj i ne briši grane bez moje potvrde.
- Repo je javan: nikada ne commit-uj `.env` fajlove, ključeve ni lozinke.

## Način rada
- Radimo korak po korak. Uradi samo ono što je traženo u koraku, bez dodatnih funkcionalnosti na svoju ruku.
- Pre većih odluka (nova biblioteka, promena strukture, promena arhitekture) pitaj me.
- Na kraju koraka napiši kratak rezime: šta je urađeno, koji fajlovi su bitni i kako da proverim.

## Komande
Iz root-a repoa (npm workspaces):
- `npm install` – instalira zavisnosti svih workspace-ova
- `npm run dev` – dev server za `apps/web` (http://localhost:5173)
- `npm run lint` – ESLint za `apps/web`
- `npm run build` – type-check (`tsc -b`) i production build za `apps/web`
- `npm i <paket> -w @taskflow/web` – dodavanje zavisnosti u frontend
- `npx shadcn@latest add <komponenta>` – nova shadcn komponenta (pokreće se iz `apps/web`)

Napomene: TypeScript je namerno na 6.0.x jer typescript-eslint još ne podržava TS 7. React Router je na v7 (v8 traži Node ≥ 22.22). U temi je shadcn `accent` neutralna hover pozadina, a ljubičasti brend akcent je token `highlight`; `danger` je isto što i shadcn `destructive`.
