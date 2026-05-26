# Kineti

Monorepo for **Kineti** — a Bun + Turborepo workspace with a TanStack Start web app, shared UI and database packages, and a CLI.

| Package | Path | Description |
| --- | --- | --- |
| `@aidoris/kineti-base` | `.` | Workspace root (not published) |
| `@aidoris/kineti-db` | [`packages/db`](./packages/db) | Drizzle ORM schema, migrations, PostgreSQL client |
| `@aidoris/kineti-ui` | [`packages/ui`](./packages/ui) | Shared React UI components |
| `@aidoris/kineti-web` | [`apps/web`](./apps/web) | TanStack Start + Nitro production app |
| `@aidoris/kineti-cli` | [`apps/cli`](./apps/cli) | `kineti` command-line tool |

## Requirements

- [Bun](https://bun.sh) 1.3+
- Node.js 20+
- [Docker](https://www.docker.com/) (optional, for local PostgreSQL)

## Quick start

```bash
cp .env.example .env
docker compose up -d
bun install
bun run build
bun run dev --filter=@aidoris/kineti-web
```

The web app loads `.env` from the monorepo root and applies database migrations on server start. See [`packages/db`](./packages/db) for schema changes and [`apps/web`](./apps/web) for server details.

## Environment

Copy [`.env.example`](./.env.example) to `.env` at the repo root:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (used by `@aidoris/kineti-db` and `@aidoris/kineti-web`) |

Default local URL (matches [`docker-compose.yml`](./docker-compose.yml)):

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kineti
```

## Local PostgreSQL

Start Postgres with Docker Compose:

```bash
docker compose up -d
docker compose ps   # wait for healthy
```

Stop and remove containers (data kept in volume):

```bash
docker compose down
```

## Scripts

| Script | Description |
| --- | --- |
| `bun run build` | Build all workspace packages (Turbo) |
| `bun run dev` | Start dev servers (Turbo) |
| `bun run lint` | Lint all packages |
| `bun run format` | Format with Prettier |
| `bun run typecheck` | Typecheck all packages |

Package-specific scripts (e.g. Drizzle Kit) live in each package README.

Git hooks under `.githooks/` run `bun run build` on pre-commit and are installed automatically via `postinstall`.

## Workspace layout

```
.
├── apps/
│   ├── cli/          # @aidoris/kineti-cli
│   └── web/          # @aidoris/kineti-web (Nitro server + runtime migrations)
├── packages/
│   ├── db/           # @aidoris/kineti-db
│   └── ui/           # @aidoris/kineti-ui
├── docker-compose.yml
├── .env.example
└── package.json
```

## Database workflow

1. Define tables in [`packages/db/src/schema/`](./packages/db/src/schema/) and export from `index.ts`.
2. Generate migrations: `cd packages/db && bun run db:generate`
3. Start the web app — pending migrations apply automatically via [`apps/web/server/plugins/00-db-migrate.ts`](./apps/web/server/plugins/00-db-migrate.ts).

For manual migration runs or Drizzle Studio, see [`packages/db/README.md`](./packages/db/README.md).

## Publishing

Scoped `@aidoris/*` packages publish to [GitHub Packages](https://npm.pkg.github.com) (`publishConfig.registry`). Authenticate for `npm.pkg.github.com` when publishing (see [`.npmrc`](./.npmrc)).

## License

See repository license. Packages are published under the `@aidoris` scope.

## Links

- [Repository](https://github.com/aidoris/kineti)
- [Issues](https://github.com/aidoris/kineti/issues)
