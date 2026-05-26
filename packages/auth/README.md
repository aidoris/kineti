# @aidoris/kineti-auth

Shared [Better Auth](https://www.better-auth.com) configuration for Kineti — Drizzle adapter wired to [`@aidoris/kineti-db`](../db).

## Requirements

- PostgreSQL with auth tables migrated (see [Database schema](#database-schema))
- Root `.env` variables (see [`.env.example`](../../.env.example)):
  - `DATABASE_URL`
  - `BETTER_AUTH_SECRET` — at least 32 characters (`openssl rand -base64 32`)
  - `BETTER_AUTH_URL` — public app URL (e.g. `http://localhost:3000`)

## Install

```json
"@aidoris/kineti-auth": "workspace:*"
```

```bash
bun install
```

## Usage

### Server

```ts
import { createAuth } from "@aidoris/kineti-auth"

export const auth = createAuth()

// TanStack Start / Nitro API route
export const handler = auth.handler
```

`createAuth` includes the [`tanstackStartCookies`](https://www.better-auth.com/docs/integrations/tanstack) plugin (always last) so session cookies work in TanStack Start.

Pass an existing DB client when the app already owns the connection:

```ts
import { createDb } from "@aidoris/kineti-db"
import { createAuth } from "@aidoris/kineti-auth"

const { db } = createDb()
export const auth = createAuth({ db })
```

### Client (React)

```ts
import { createKinetiAuthClient } from "@aidoris/kineti-auth/client"

export const authClient = createKinetiAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
})
```

## Database schema

Auth tables (`user`, `session`, `account`, `verification`) live in [`packages/db/src/schema/auth.ts`](../db/src/schema/auth.ts).

Regenerate after changing plugins or auth options:

```bash
cd packages/auth
bun run auth:generate-schema
cd ../db
bun run db:generate
bun run db:migrate
```

Migrations run automatically when starting [`@aidoris/kineti-web`](../../apps/web).

## Exports

| Subpath | Maps to |
| --- | --- |
| `@aidoris/kineti-auth` | `createAuth`, env helpers, types |
| `@aidoris/kineti-auth/auth` | Server auth factory |
| `@aidoris/kineti-auth/client` | React auth client factory |
| `@aidoris/kineti-auth/env` | `getBetterAuthSecret`, `getBetterAuthUrl` |

## Development

```bash
bun run typecheck --filter=@aidoris/kineti-auth
bun run lint --filter=@aidoris/kineti-auth
```

## Links

- [Monorepo root](../../README.md)
- [@aidoris/kineti-db](../db/README.md)
- [Better Auth docs](https://www.better-auth.com/docs)
