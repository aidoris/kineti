# @aidoris/kineti-db

Shared PostgreSQL database layer for Kineti — [Drizzle ORM](https://orm.drizzle.team) schema, migrations, and a typed client built on [postgres.js](https://github.com/porsager/postgres).

## Requirements

- PostgreSQL
- `DATABASE_URL` in the monorepo root `.env` (see [`.env.example`](../../.env.example))

Local database via Docker from the repo root:

```bash
docker compose up -d
```

## Install

In the monorepo, add a workspace dependency:

```json
"@aidoris/kineti-db": "workspace:*"
```

```bash
bun install
```

## Usage

Create a client:

```ts
import { createDb } from "@aidoris/kineti-db"

const { db, sql } = createDb()

// query with Drizzle...
await sql.end()
```

Run migrations from a script or at app startup:

```ts
import { runMigrations } from "@aidoris/kineti-db/migrate"

await runMigrations()
```

`runMigrations`:

- Uses a dedicated postgres.js client with `max: 1` ([Drizzle postgres-js migrations](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/postgres-js/README.md))
- Acquires a PostgreSQL advisory lock so only one instance migrates at a time
- Skips when `migrations/meta/_journal.json` is missing (no generated migrations yet)

[`@aidoris/kineti-web`](../../apps/web) runs migrations automatically on server start via a Nitro plugin.

Import schema types and table definitions:

```ts
import { user, session, aiProvider, aiProviderConfiguration } from "@aidoris/kineti-db/schema"
// or per-module
import { aiChatSession } from "@aidoris/kineti-db/schema/ai-chat"
// or barrel
import * as schema from "@aidoris/kineti-db/schema"
```

## Schema

| Module | File | Contents |
| --- | --- | --- |
| Auth (Better Auth) | [`src/schema/auth.ts`](./src/schema/auth.ts) | `user`, `session`, `account`, `verification` |
| AI providers | [`src/schema/ai-provider.ts`](./src/schema/ai-provider.ts) | Providers, configurations (`api_key_ciphertext`), models, costs, usage |
| AI chat | [`src/schema/ai-chat.ts`](./src/schema/ai-chat.ts) | Presets, sessions, messages, attachments |

Regenerate auth tables from [`@aidoris/kineti-auth`](../auth) with `bun run auth:generate-schema` in `packages/auth`, then run `db:generate` here.

Add new app tables in `src/schema/` (e.g. `src/schema/foo.ts`) and re-export from [`src/schema/index.ts`](./src/schema/index.ts).

Provider API keys are stored encrypted — encryption/decryption is handled by [`@aidoris/kineti-auth/secrets`](../auth) (not in this package).

## Schema and migrations

1. Add or edit table definitions under [`src/schema/`](./src/schema/) with `pgTable` from `drizzle-orm/pg-core`.
2. Generate SQL migrations (requires `DATABASE_URL`):

   ```bash
   cd packages/db
   bun run db:generate
   ```

3. Apply migrations — either:
   - Start [`@aidoris/kineti-web`](../../apps/web) (runtime migrator), or
   - Run manually:

     ```bash
     bun run db:migrate
     ```

Current migrations in [`migrations/`](./migrations/):

| Tag | Description |
| --- | --- |
| `0000_initial` | Auth tables |
| `0001_ai_provider` | AI provider tables |
| `0002_ai_chat` | AI chat tables |
| `0003_api_key_ciphertext` | Rename `api_key` → `api_key_ciphertext`, add `encryption_key_id` |

### Drizzle Kit scripts

| Script | Description |
| --- | --- |
| `bun run db:generate` | Generate migration files from schema changes |
| `bun run db:migrate` | Apply pending migrations (CLI) |
| `bun run db:push` | Push schema directly to the database (dev only) |
| `bun run db:studio` | Open Drizzle Studio |

Configuration: [`drizzle.config.ts`](./drizzle.config.ts) (`dialect: "postgresql"`).

Generated files: [`migrations/`](./migrations/) (SQL + `meta/_journal.json`).

## Exports

| Subpath | Maps to |
| --- | --- |
| `@aidoris/kineti-db` | `createDb`, `getDatabaseUrl`, `runMigrations`, schema re-exports |
| `@aidoris/kineti-db/client` | `createDb` and types |
| `@aidoris/kineti-db/migrate` | `runMigrations` |
| `@aidoris/kineti-db/schema` | All table definitions (`auth`, `ai-provider`, `ai-chat`) |
| `@aidoris/kineti-db/schema/auth` | Better Auth tables |
| `@aidoris/kineti-db/schema/ai-provider` | AI provider tables |
| `@aidoris/kineti-db/schema/ai-chat` | AI chat tables |
| `@aidoris/kineti-db/schema/*` | Individual schema modules |

## Development

From the monorepo root:

```bash
bun run lint --filter=@aidoris/kineti-db
bun run typecheck --filter=@aidoris/kineti-db
```

From this package:

```bash
bun run typecheck
bun run db:studio
```

## Links

- [Monorepo root](../../README.md)
- [@aidoris/kineti-auth](../auth/README.md)
- [@aidoris/kineti-web](../../apps/web/README.md)
- [Repository](https://github.com/aidoris/kineti/tree/main/packages/db)
- [Issues](https://github.com/aidoris/kineti/issues)
