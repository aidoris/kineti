# @aidoris/kineti-web

Production web application for Kineti — [TanStack Start](https://tanstack.com/start), Vite 7, React 19, Tailwind CSS v4, and [Nitro](https://nitro.build) for the Node server bundle.

## Dependencies

| Package | Role |
| --- | --- |
| [`@aidoris/kineti-ui`](../packages/ui) | Shared components and styles |
| [`@aidoris/kineti-db`](../packages/db) | PostgreSQL via Drizzle ORM |

## Database migrations

On server start, [`server/plugins/00-db-migrate.ts`](./server/plugins/00-db-migrate.ts) calls `runMigrations()` from `@aidoris/kineti-db/migrate`:

- Uses the [postgres.js migrator](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/postgres-js/README.md) (`max: 1` + advisory lock)
- Blocks incoming requests until migrations finish
- Logs `[kineti-web] applying database migrations...` and completion timing

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

Set `DATABASE_URL` in the environment. For a local `.env` file:

```bash
node --env-file=../../.env .output/server/index.mjs
```

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | — | PostgreSQL connection string (required) |
| `PORT` / `NITRO_PORT` | `3000` | HTTP listen port |

In the monorepo, Vite `envDir` points at the repo root so `vite dev` loads [`.env`](../../.env) automatically.

## Development (monorepo)

```bash
# from repo root — start Postgres first
docker compose up -d
cp .env.example .env   # if needed

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
- **Database:** Drizzle ORM + postgres.js via `@aidoris/kineti-db`

## Server layout

```
apps/web/
├── server/
│   └── plugins/
│       └── 00-db-migrate.ts   # runtime migrations
├── src/                       # TanStack Start app
└── vite.config.ts
```

## Links

- [Monorepo root](../../README.md)
- [@aidoris/kineti-db](../../packages/db/README.md)
- [Repository](https://github.com/aidoris/kineti/tree/main/apps/web)
- [Issues](https://github.com/aidoris/kineti/issues)
