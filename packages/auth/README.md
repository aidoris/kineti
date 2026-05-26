# @aidoris/kineti-auth

Shared [Better Auth](https://www.better-auth.com) configuration for Kineti — Drizzle adapter wired to [`@aidoris/kineti-db`](../db). Also provides **AES-256-GCM** encryption for AI provider API keys at rest.

## Requirements

- PostgreSQL with auth tables migrated (see [Database schema](#database-schema))
- Root `.env` variables (see [`.env.example`](../../.env.example)):
  - `DATABASE_URL`
  - `BETTER_AUTH_SECRET` — at least 32 characters (`openssl rand -base64 32`)
  - `BETTER_AUTH_URL` — public app URL (e.g. `http://localhost:3000`)
  - `VITE_BETTER_AUTH_URL` — usually matches `BETTER_AUTH_URL` (browser client)
  - `AI_PROVIDER_SECRETS_ACTIVE_KEY_ID` — active encryption key id for provider API keys at rest
  - `AI_PROVIDER_SECRETS_KEYS` — JSON map of key id → base64-encoded 32-byte AES key (see [AI provider API key encryption](#ai-provider-api-key-encryption))

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

## AI provider API key encryption

Provider API keys are stored as **AES-256-GCM** ciphertext in `ai_provider_configuration.api_key_ciphertext` (see [`packages/db/src/schema/ai-provider.ts`](../db/src/schema/ai-provider.ts)). Use `@aidoris/kineti-auth/secrets` on the server only — never in the browser bundle.

```ts
import {
  encryptApiKeyForPersistence,
  readStoredApiKey,
} from "@aidoris/kineti-auth/secrets"

// On create/update
const { apiKeyCiphertext, encryptionKeyId } =
  encryptApiKeyForPersistence(plainApiKey)

// On read (decrypt + lazy re-encrypt when active key rotated)
const { plaintext, persistence } = readStoredApiKey({
  apiKeyCiphertext: row.apiKeyCiphertext,
  encryptionKeyId: row.encryptionKeyId,
})
if (persistence) {
  await db.update(aiProviderConfiguration).set(persistence).where(...)
}
```

Ciphertext format: `kineti-secrets:v1:<keyId>:<iv>:<payload>`. Legacy plaintext rows are still readable until re-encrypted.

### Key rotation

1. Add the new key to `AI_PROVIDER_SECRETS_KEYS` (keep the old id).
2. Set `AI_PROVIDER_SECRETS_ACTIVE_KEY_ID` to the new id and deploy.
3. Re-encrypt rows lazily via `readStoredApiKey` or run a batch job with `reencryptApiKeyIfNeeded`.
4. Remove the retired key from `AI_PROVIDER_SECRETS_KEYS` only after no rows reference its id.

Generate a key: `openssl rand -base64 32`

## Exports

| Subpath | Maps to |
| --- | --- |
| `@aidoris/kineti-auth` | `createAuth`, Better Auth client, env helpers, secrets API (re-exported) |
| `@aidoris/kineti-auth/auth` | Server auth factory |
| `@aidoris/kineti-auth/client` | React auth client factory |
| `@aidoris/kineti-auth/env` | `getBetterAuthSecret`, `getBetterAuthUrl` |
| `@aidoris/kineti-auth/secrets` | API key encrypt/decrypt, `getAiProviderSecretsConfig`, types |

### Secrets API (`@aidoris/kineti-auth/secrets`)

| Export | Description |
| --- | --- |
| `encryptApiKeyForPersistence` | Returns `{ apiKeyCiphertext, encryptionKeyId }` for DB writes |
| `decryptStoredApiKey` | Decrypt a row for provider API requests |
| `readStoredApiKey` | Decrypt + optional lazy re-encrypt on key rotation |
| `reencryptApiKeyIfNeeded` | Batch rotation helper |
| `encryptApiKey` / `decryptApiKey` | Lower-level encrypt/decrypt |
| `getAiProviderSecretsConfig` | Load `AI_PROVIDER_SECRETS_*` env (key ring + active id) |
| `isEncryptedApiKeyBlob` | Detect encrypted vs legacy plaintext |

Env vars read by `getAiProviderSecretsConfig`: `AI_PROVIDER_SECRETS_ACTIVE_KEY_ID`, `AI_PROVIDER_SECRETS_KEYS`.

## Development

```bash
bun run typecheck --filter=@aidoris/kineti-auth
bun run lint --filter=@aidoris/kineti-auth
bun run test --filter=@aidoris/kineti-auth
```

## Links

- [Monorepo root](../../README.md)
- [@aidoris/kineti-db](../db/README.md)
- [Better Auth docs](https://www.better-auth.com/docs)
