# @aidoris/kineti-web

Production web app for **Kineti** — configure multiple AI providers, then chat with any registered model or model alias. Built with [TanStack Start](https://tanstack.com/start), Vite 7, React 19, Tailwind CSS v4, and [Nitro](https://nitro.build) for the Node server bundle.

## Dependencies

| Package | Role |
| --- | --- |
| [`@aidoris/kineti-ui`](../packages/ui) | Shared components and styles |
| [`@aidoris/kineti-db`](../packages/db) | PostgreSQL via Drizzle ORM |
| [`@aidoris/kineti-auth`](../packages/auth) | Better Auth, TanStack Start cookies, AI provider API key encryption |

## Database migrations

On server start, [`server/plugins/00-db-migrate.ts`](./server/plugins/00-db-migrate.ts) calls `runMigrations()` from `@aidoris/kineti-db/migrate`:

- Uses the [postgres.js migrator](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/postgres-js/README.md) (`max: 1` + advisory lock)
- Blocks incoming requests until migrations finish
- Logs `[kineti-web] applying database migrations...` then `[kineti-web] database migrations ready (<ms>)`

Production builds copy `packages/db/migrations` into `.output/server/migrations` during the Nitro `compiled` hook (see [`vite.config.ts`](./vite.config.ts)).

## Install

```bash
bun add @aidoris/kineti-web
# or
npm install @aidoris/kineti-web
```

The published tarball includes the Nitro `.output` build and the `kineti-web` binary (after `vite build`).

## Run (from npm package)

After install, start the production server (requires a prior build in the published artifact):

```bash
npx kineti-web
# or
PORT=8080 npx kineti-web
```

Set required environment variables (see [Environment](#environment)). For a local `.env` file:

```bash
node --env-file=../../.env .output/server/index.mjs
```

## Environment

Copy [`.env.example`](../../.env.example) to `.env` at the repo root. In the monorepo, Vite `envDir` points at the repo root so `vite dev` loads [`.env`](../../.env) automatically.

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | — | PostgreSQL connection string (required) |
| `BETTER_AUTH_SECRET` | — | Better Auth signing secret (32+ chars, `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | — | Public app URL (e.g. `http://localhost:3000`) |
| `VITE_BETTER_AUTH_URL` | — | Same as `BETTER_AUTH_URL` for the browser client |
| `AI_PROVIDER_SECRETS_ACTIVE_KEY_ID` | — | Active key id for encrypted provider API keys (required when persisting provider keys) |
| `AI_PROVIDER_SECRETS_KEYS` | — | JSON key ring (`{"v1":"<base64-32-bytes>"}`) — see [`packages/auth`](../packages/auth) |
| `PORT` / `NITRO_PORT` | `3000` | HTTP listen port |

`AI_PROVIDER_SECRETS_*` is used by `@aidoris/kineti-auth/secrets` when storing or reading `ai_provider_configuration.api_key_ciphertext`.

## Development (monorepo)

```bash
# from repo root — start Postgres first
docker compose up -d
cp .env.example .env   # set BETTER_AUTH_SECRET and AI_PROVIDER_SECRETS_KEYS

bun run dev --filter=@aidoris/kineti-web

# or from apps/web
bun run dev      # vite dev --port 3000
bun run build    # vite build (client + SSR + Nitro)
bun run preview  # vite preview
```

After changing the schema in `@aidoris/kineti-db`, run `bun run db:generate` in `packages/db`, then restart the dev server to apply migrations.

## Stack

- **Routing / SSR:** TanStack Router + TanStack Start
- **Bundler:** Vite + `@vitejs/plugin-react`
- **Server:** Nitro (`node-server` preset) → `.output/server/index.mjs`
- **Styling:** Tailwind v4 via `@tailwindcss/vite`
- **i18n:** Paraglide JS (`project.inlang/`, compiled to `src/paraglide/`)
- **Database:** Drizzle ORM + postgres.js via `@aidoris/kineti-db`
- **Auth:** Better Auth via `@aidoris/kineti-auth`

## Server layout

```
apps/web/
├── server/
│   └── plugins/
│       └── 00-db-migrate.ts   # runtime migrations
├── src/                       # TanStack Start app
├── project.inlang/            # inlang / Paraglide project (source)
└── vite.config.ts
```

## Links

- [Monorepo root](../../README.md)
- [@aidoris/kineti-auth](../../packages/auth/README.md)
- [@aidoris/kineti-db](../../packages/db/README.md)
- [Repository](https://github.com/aidoris/kineti/tree/main/apps/web)
- [Issues](https://github.com/aidoris/kineti/issues)
