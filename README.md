# Jomel — Portfolio

Full-Stack Web & Mobile App Developer portfolio: an animated "quiet luxury" landing page, a
searchable project archive, and a hidden single-owner admin studio.

| Layer | Stack |
| --- | --- |
| Frontend | Vite 8 · React 19 · TypeScript (strict) · Tailwind CSS 4 · Motion · GSAP ScrollTrigger · Lenis · TanStack Query · React Router 8 · React Hook Form + Zod |
| Backend | Node 26 LTS · Express 5 (ESM, TypeScript) · Zod · Supabase (Postgres, Auth, Storage, RLS) · pino · helmet · express-rate-limit (+ optional Redis) |
| Shared | `@jomel/shared` — Zod schemas and inferred types used by both apps |
| Tooling | npm workspaces · ESLint (flat config) · Prettier · Docker · GitHub Actions · Render Blueprint |

## Repository layout

```
frontend/                  Vite + React app (lazy-loaded admin under VITE_ADMIN_PATH)
backend/
  src/                     Express API (config, middleware, modules/{projects,uploads,contact,health})
  supabase/migrations/     SQL: tables, indexes, RLS, storage bucket + policies
  seed/                    seed.ts + images/ (featured projects)
  scripts/                 migrate-from-mongo.ts (one-off)
packages/shared/           Zod schemas + types (main entry) and zod-free constants (/constants)
docker-compose.yml         Local stack: api + web + redis
render.yaml                Render Blueprint (API as Docker web service, frontend as static site)
UPGRADE_PLAN.md            Audit of the previous MERN version and the migration mapping
```

## Getting started

```bash
nvm use                      # Node 26.13.1 (see .nvmrc)
npm install
cp backend/.env.example backend/.env       # fill in Supabase + ADMIN_EMAIL + CORS_ORIGINS
cp frontend/.env.example frontend/.env     # fill in public values + a random VITE_ADMIN_PATH
npm run dev                  # shared (watch) + API on :4000 + web on :5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Runs shared, backend and frontend together |
| `npm run build` | Builds shared → backend → frontend |
| `npm run typecheck` / `lint` / `format` | Quality gates (`npm run check` runs typecheck + lint + build) |
| `npm run seed` | Upserts the featured projects and uploads their images (safe to re-run) |
| `npm run migrate:mongo` | Dry run of the legacy MongoDB import (`-- --confirm` to write) |

## Supabase setup

1. Create a project, then apply `backend/supabase/migrations/*.sql` (Supabase CLI `supabase db push`,
   or paste into the SQL editor).
2. **Authentication → Sign In / Providers**: disable "Allow new users to sign up".
3. **Authentication → Users → Add user**: create the owner account (the `ADMIN_EMAIL`) with a strong
   password and "Auto confirm".
4. **Authentication → Multi-Factor**: enable TOTP. The first sign-in to the studio walks you through
   scanning the QR code.
5. Register the owner as the admin (SQL editor):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
   on conflict do nothing;
   ```

6. Optional: **Authentication → Attack Protection → Captcha** with Cloudflare Turnstile, then set
   `VITE_TURNSTILE_SITE_KEY`.
7. `npm run seed`.

## Security model

- The service-role key lives only in the backend. The browser uses the anon key for **auth only**;
  all data goes through the API.
- Every request is validated with strict Zod schemas (unknown keys rejected). Sorting uses a
  whitelist, tags must match `^[\w .+#-]{1,40}$`, search uses `websearch` full-text, and no SQL or
  PostgREST filter strings are ever built from user input.
- `requireAdmin` verifies the JWT with `auth.getUser`, then checks the email, confirmation, the
  `public.admins` row and `aal2`. Every failure is a generic 404.
- RLS on every table; storage writes require `public.is_admin()`. Uploads use server-named signed URLs
  (MIME + 5 MB checks in both the API and the bucket).
- helmet (strict CSP), CORS allowlist, hpp, 100 kb JSON limit, rate limits
  (global / projects / admin / uploads / contact), request IDs, redacted pino logs, and no stack
  traces in production.
- The admin route is a random path, not linked anywhere, not in the sitemap or robots.txt,
  `noindex`, and code-split out of the public bundle. Sessions live in `sessionStorage` (closing the
  tab signs out), with a 30-minute idle timeout.

## Deployment

- **Render**: `render.yaml` defines `portfolio-api` (Docker, health check `/api/health`) and
  `portfolio-web` (static site with SPA rewrite and security headers). Enter secrets in the
  dashboard. The URLs are preset (web: `https://jomel-portfolio.onrender.com`, API: `https://jomel-portfolio-api.onrender.com`); paste `backend/.env.render` and `frontend/.env.render` into each service after adding the Supabase keys.
- **Docker**: `docker compose up --build` runs the API, web (nginx-unprivileged on :8080) and Redis.
  Both Dockerfiles are multi-stage, run as non-root, and build from the repository root.
