# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository context

FlowSync is a course exercise repo (LIDR AI4Devs, module 1): a TypeScript monorepo with two independent npm projects, `backend/` (AdonisJS 7 API) and `frontend/` (React 19 + Vite). There is no root `package.json`; run commands inside each folder. The root `README.md` is generated from the course lesson — do not edit it by hand. `prompts.md` is a template the student fills with the prompts they launched.

**The backend already exists and is not to be modified in this exercise.** Frontend work consumes it. Requires Node.js 24+ (Node 20 fails with `Unknown file extension ".ts"`).

## Commands

Backend (`backend/`, serves on http://localhost:3333):

```bash
npm install
cp .env.example .env && node ace generate:key   # first time only
node ace migration:run                          # SQLite at backend/tmp/db.sqlite3
npm run dev          # node ace serve --hmr
npm test             # node ace test (Japa); suites: unit, functional
node ace test functional                      # one suite
node ace test --files=tests/functional/foo.spec.ts   # one file
node ace test --tests="test title"            # one test by title
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run format       # prettier (@adonisjs/prettier-config)
```

Test files go in `tests/unit/**/*.spec.ts` or `tests/functional/**/*.spec.ts` (none exist yet). `.env.test` uses `SESSION_DRIVER=memory`.

Frontend (`frontend/`, serves on http://localhost:5173):

```bash
npm install
npm run dev          # vite
npm run build        # tsc -b && vite build
npm run lint         # oxlint
```

The frontend has no formatter, test runner, router, Tailwind or shadcn/ui installed yet — it is still the Vite starter (`src/App.tsx`). No Vite proxy is configured; CORS in dev allows any origin, so call the backend at `http://localhost:3333` directly.

## Backend architecture

AdonisJS layering: `start/routes.ts` → controller (`app/controllers`) → VineJS validator (`app/validators`) → Lucid model (`app/models`) → transformer (`app/transformers`) shapes the response. Schema changes only via new migrations in `database/migrations`; `database/schema.ts` is generated from them (Lucid schema generation) and models extend it (`User extends compose(UserSchema, ...)`).

- **Imports** use Node subpath aliases from `package.json` `imports` (`#models/*`, `#validators/*`, `#controllers/*`, …), not relative paths.
- **Generated code** lives in `.adonisjs/` (controllers index, Tuyau client registry) and is produced by `adonisrc.ts` init hooks when the dev server/ace runs. Routes reference controllers via `controllers.X` from `#generated/controllers`.
- **Responses**: `providers/api_provider.ts` adds `ctx.serialize()`, which wraps every payload in `{ data: ... }`. `force_json_response_middleware` forces JSON for all requests, so errors come back as JSON too.
- **Auth**: default guard is `api` (access tokens, `oat_` prefix) sent as `Authorization: Bearer <token>`. A `web` session guard is also configured but unused by the API routes.

### API (prefix `/api/v1`)

| Method | Path | Auth | Body / notes |
|---|---|---|---|
| POST | `/auth/signup` | – | `fullName` (nullable), `email` (unique, ≤254), `password` (8–32), **`passwordConfirmation` (must equal `password`)** |
| POST | `/auth/login` | – | `email`, `password` |
| GET | `/account/profile` | Bearer | returns user |
| POST | `/account/logout` | Bearer | deletes current token |

Signup and login both return `{ data: { user, token } }`; `user` is `{ id, fullName, email, createdAt, updatedAt, initials }` (see `app/transformers/user_transformer.ts`). The validators in `app/validators/user.ts` are the source of truth for request shapes — check them rather than trusting a ticket's description.

## Reglas de proceso
- Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca
commitear directo en `main`/`s1/start`.
- Al cerrar la tarea: usar la skill `/commit`, luego `gh pr create` con una descripción
completa de los cambios en el cuerpo del PR.
- Después de abrir el PR: usar el subagente `adversarial-reviewer` sobre él, antes de
darlo por terminado.
- No repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo
con la URL del PR.
