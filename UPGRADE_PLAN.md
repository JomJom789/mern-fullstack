# Portfolio Upgrade Plan

Audit date: 2026-11-14. This document records what existed before the upgrade and how each
piece maps onto the new architecture.

---

## 1. Current stack (before upgrade)

### client/ — Create React App (JavaScript)

| Package | Version |
| --- | --- |
| react / react-dom | ^18.2.0 |
| react-scripts (CRA) | 5.0.1 |
| react-router-dom | ^6.6.1 |
| @reduxjs/toolkit / react-redux / redux-persist | ^1.9.5 / ^8.0.5 / ^6.0.0 |
| @mui/material + @emotion | ^5.11 |
| tailwindcss | ^3.2.4 |
| framer-motion / react-spring / lottie-react | ^10.9 / ^9.6 / ^2.4 |
| formik / yup | ^2.2.9 / ^1.0.2 |
| socket.io-client | ^4.7.2 |
| @emailjs/browser | ^3.10.0 (contact form) |
| @react-oauth/google, react-google-recaptcha, jwt-decode | — |

Env keys: `REACT_APP_NAME`, `REACT_APP_DOMAIN_URL`, `REACT_APP_BASE_URL`,
`REACT_APP_GOOGLE_CLIENT_ID`, `REACT_APP_GOOGLE_CLIENT_SECRET` (a secret in a frontend bundle —
removed), `REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY`, `REACT_APP_GOOGLE_RECAPTCHA_SECRET_KEY` (a secret
in a frontend bundle — removed).

### server/ — Express 4 (JavaScript, ESM)

| Package | Version |
| --- | --- |
| express | ^4.18.2 |
| mongoose | ^7.0.2 |
| jsonwebtoken / bcrypt / passport-google-oauth20 | ^9 / ^5 / ^2 |
| socket.io | ^4.7.2 |
| multer / multer-gridfs-storage / sharp | ^1.4 / ^5 / ^0.32 |
| nodemailer + handlebars | ^6.9 |
| helmet / cors / morgan / joi | ^6 / ^2.8 / ^1.10 / ^17 |

Env keys: `PORT`, `DOMAIN_URL`, `BASE_URL`, `MONGO_URL`, `JWT_SECRET`, `AUTH_PASSWORD`,
`JWTPRIVATEKEY`, `HOST`, `SERVICE`, `EMAIL_PORT`, `SECURE`, `USER`, `PASS`.

No root package.json, no workspaces, no Dockerfiles, no CI, no Render/Vercel config.

---

## 2. MongoDB models

| Model | Fields |
| --- | --- |
| **User** | firstName, lastName, email (unique), password (bcrypt), role (default "admin"), picturePath, type, activated, activeStatus, fields[], followers[], following[], timestamps |
| **Web** | userId, title, description, category, type, imgCover, images[], features[], url, genres[], timestamps |
| **Mobile** | userId, title, description, category, imgCover, images[], features[], url, genres[], timestamps |
| **Chat** | chatName, isGroupChat, users[→User], latestMessage(→Message), groupAdmin(→User), timestamps |
| **Message** | sender(→User), content, chat(→Chat), readBy[→User], timestamps |
| **Token** | userId(→User, unique), token, createdAt (TTL 1h) — email verification |
| **ForgetPasswordToken** | userId(→User, unique), token, createdAt (TTL 1h) |

## 3. API routes (before)

| Prefix | Routes |
| --- | --- |
| `/auth` | POST `/register` (multipart), POST `/login`, PATCH `/logout/:id`, POST `/google`, GET `/:id/verify/:token`, POST `/forgot-password`, PATCH `/reset-password`, PATCH `/active-status/:id/:online` |
| `/users` | GET `/`, `/chats`, `/contacts`, `/:id`, `/group-chat/:id/:search`; PATCH `/:id/update`; DELETE `/:id/delete` |
| `/webs` | GET `/`, `/:id`, `/:userId/webs`; POST `/webs` (multipart); PATCH `/:id/update`; DELETE `/:id/delete`, `/:userId/delete-all` |
| `/mobiles` | same shape as `/webs` |
| `/follows` | GET `/:id`; PATCH `/:id/:userId`, `/update/viewed/:id`, `/confirm/:id/:userId`, `/remove/:id/:userId` |
| `/chat` | GET `/:id`; POST `/user/:id/:userId`, `/group/:id/:groupChatId`, `/group`; PUT `/groupadd`, `/rename`, `/groupremove`; DELETE `/delete/:chatId` |
| `/message` | GET `/:chatId`; POST `/send/:id`; DELETE `/delete/:id/:chatId/:messageId` |
| static | `/profile`, `/websites`, `/mobiles` (disk uploads) |
| socket.io | setup, follow, confirm-follow, remove-follow, active-status, join chat, typing, new message, message-delete |

## 4. Pages and sections (before)

Routes: `/`, `/home`, `/skills`, `/projects/:project`, `/projects/:project/:id`, `/contacts`,
`/login`, `/users/:id/verify/:token`, `/forgot-password`, `/users/:id/reset-password/:token`,
`/admin`, `/admin/dashboard`, `/admin/websites(/:id)`, `/admin/mobiles(/:id)`, `/admin/users(/:id)`, `*` (404).

Home page sections and their content (preserved below, verbatim, as the source for the new copy):

- **Banner** — "WEBSITE / MOBILE APP — Frontend & Backend DEVELOPER", CTA "Visit Projects".
- **Website Development** — "I'm a Full Stack Developer and Experienced mainly on freelance job."
  Design: HTML, CSS, Tailwind, Material UI. Frontend: React + Redux / RTK Query.
  Backend: Express.js or Django REST with SQL, MySQL, PostgreSQL, MongoDB; Firebase.
- **MERN Tech Stack Specialist** — fully functional websites on a widely recognised stack; React
  frontend; Express.js with JWT authentication; Socket.IO real-time features; MongoDB.
- **Mobile App Development** — Flutter (Android, iOS), Bloc state management, Dart.
- **Skills** (Design / Frontend / Backend / Database / App) — HTML, CSS, Tailwind, Material UI, Figma;
  React, Redux; Express, Node, Django, Firebase, REST API; MongoDB, MySQL, PostgreSQL, SQL; Flutter, Bloc.
- **Mobile App Projects** — Android with Java + Eclipse/Android Studio (MVP/MVVM) 2015–2017;
  moved to Kotlin in 2017; then Flutter + Dart with SQFLite/ObjectBox and Bloc; consumes REST APIs.
- **Website Projects** — "my latest projects from the last 2 years".
- **Contacts** — "I developed software that helps small businesses in minimum cost with maximum
  result". Phone **+63 919 8844 655**, email **dumaranjomel789@gmail.com**,
  GitHub **https://github.com/JomJom789**. "Feel free to contact me, Thank You." EmailJS form.
- **Footer** — © Copyright; Freepik / Icons8 attributions (those illustrations are no longer used).

Project data in `client/src/data/*.js` was placeholder only (repeated "EC Torres Medical Clinic" and
"MiBu Essential" demo entries with "List 1…" features). The Mongo `public/mobiles` uploads are demo
anime screenshots, not real work.

---

## 5. Target architecture and mapping

```
/                    npm workspaces root (frontend, backend, packages/shared)
├─ frontend/         Vite + React 19 + TS (strict)  ← client/ (git mv)
├─ backend/          Express 5 + TS ESM            ← server/ (git mv)
├─ packages/shared/  Zod schemas + inferred types shared by both apps
└─ docker-compose.yml, .nvmrc, eslint.config.js, .prettierrc
```

Toolchain: Node **26.13.1 LTS** (`.nvmrc`, `engines`), Vite 8, React 19.3, Express 5.3,
Tailwind 4.3, Motion 14, GSAP 3.15, Lenis 1.3, TanStack Query 5, React Router 8, Zod 4,
Supabase JS 2.119.

> **TypeScript: 6.0.3, not 7.0.2.** `npm view typescript version` returns 7.0.2, but the latest
> `typescript-eslint` (8.72.2) declares `typescript >=4.8.4 <6.1.0`. Pinning 7 would break typed
> linting, so the repo uses the newest version the linter supports. Bump it once typescript-eslint
> adds TS 7 support.

### Data mapping (Mongo → Supabase)

| Mongo | Supabase | Mapping |
| --- | --- | --- |
| Web | `public.projects` | title→title, slug=slugify(title), description→description (sanitized), category: `type` "static"/"dynamics" → `Web App`, url→live_url (https only, else null), genres[]→tech_stack, imgCover→image_path (only if the file exists locally), status=`draft`, featured=false |
| Mobile | `public.projects` | as Web, category → `Mobile App` |
| User | Supabase Auth (manual) | **Not migrated.** Single-owner auth: the owner account is created by hand in the dashboard. |
| Chat, Message, Token, ForgetPasswordToken | — | **Dropped.** The social/chat/admin-users system is replaced by a single-owner CMS. |
| (new) | `public.contact_messages` | Stores contact form submissions (admin-read only). |

Migrated Mongo documents are inserted as **drafts**, so placeholder data never reaches the public
site unless the owner publishes it.

### Feature mapping

| Before | After |
| --- | --- |
| Banner | Preloader + Hero with flowing ribbons |
| Website Dev, MERN, Mobile Dev, Skills ×5 | About (bio + journey + counters) and Expertise bento grid |
| Website/Mobile Projects, `/projects/:project` | Selected Work + All Projects explorer (`/#work`), `/work/:slug` detail |
| `/contacts` + EmailJS | Contact section, `POST /api/contact` (rate limited, honeypot, stored + optional Resend email) |
| `/login`, JWT, Google OAuth, email verify/reset | Supabase Auth password + TOTP MFA (aal2) on a hidden `VITE_ADMIN_PATH` |
| `/admin/*` (websites, mobiles, users, chat, followers) | Lazy-loaded admin: project table, editor drawer, uploads, reorder |
| multer disk uploads | Signed uploads to the Supabase bucket `project-images` |
| socket.io | Removed (no real-time features remain) |

### New API

Public: `GET /api/health`, `GET /api/projects`, `GET /api/projects/meta`, `GET /api/projects/:slug`,
`POST /api/contact`.
Admin (requireAdmin → 404 on failure): `GET/POST /api/admin/projects`,
`PATCH /api/admin/projects/reorder`, `PATCH/DELETE /api/admin/projects/:id`,
`POST /api/admin/uploads/sign`, `GET /api/admin/session` (probe used by the dashboard).

---

## 6. Status (2026-11-14)

Phases 0–4 implemented, plus Phase 5 SEO (per-page meta via React 19, JSON-LD, OG image, generated
sitemap.xml/robots.txt, canonical URLs). Verified: `npm run typecheck`, `npm run lint` (0 errors),
`npm run build`, `prettier --check`, API smoke tests (validation, 404 masking, CORS, body limit,
honeypot, no stack leaks), and headless-Chrome screenshots at 1440px and 390px (no console errors,
no horizontal overflow).

Deviations, and why:

- **TypeScript 6.0.3** instead of 7.0.2. typescript-eslint does not support TS 7 yet (see §5).
- **Frontend runtime image** is `nginx-unprivileged` (non-root) rather than Node. Node alpine is
  used for the build stage; serving static files with Node would add nothing.
- **Public API responses are typed, not Zod-parsed, in the browser.** This keeps Zod (~60 kB gz) out
  of the main bundle. Types still come from `@jomel/shared`; the admin chunk parses with the Zod
  schemas.
- **Contact form** stores messages in `public.contact_messages` and emails them through Resend only
  when `RESEND_API_KEY` is set (the original EmailJS keys were browser-side).
- **Duplicate query params** (`?sort=a&sort=b`) are rejected with 400 rather than "last wins". Express
  5 re-parses `req.query` on each access, so hpp cannot rewrite it; strict validation catches it.
