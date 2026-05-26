# @aidoris/kineti-ui

Shared React UI library for Kineti — Tailwind CSS v4, Base UI primitives, and shadcn-style components.

Used by [`@aidoris/kineti-web`](../../apps/web). Database, auth, and API key encryption live in [`@aidoris/kineti-db`](../db) and [`@aidoris/kineti-auth`](../auth).

## Install

```bash
bun add @aidoris/kineti-ui
# or
npm install @aidoris/kineti-ui
```

Peer setup: React 19+, Tailwind CSS v4 in the consuming app.

## Usage

Import global styles once in your app entry:

```ts
import "@aidoris/kineti-ui/globals.css"
```

Use components and utilities via package exports:

```tsx
import { Button } from "@aidoris/kineti-ui/components/button"
import { Card } from "@aidoris/kineti-ui/components/card"
import { cn } from "@aidoris/kineti-ui/lib/utils"
```

### Components

| Component | Path |
| --- | --- |
| `alert` | `@aidoris/kineti-ui/components/alert` |
| `badge` | `@aidoris/kineti-ui/components/badge` |
| `button` | `@aidoris/kineti-ui/components/button` |
| `card` | `@aidoris/kineti-ui/components/card` |
| `dropdown-menu` | `@aidoris/kineti-ui/components/dropdown-menu` |
| `field` | `@aidoris/kineti-ui/components/field` |
| `input` | `@aidoris/kineti-ui/components/input` |
| `label` | `@aidoris/kineti-ui/components/label` |
| `separator` | `@aidoris/kineti-ui/components/separator` |

## Exports

| Subpath | Maps to |
| --- | --- |
| `@aidoris/kineti-ui/globals.css` | `src/styles/globals.css` |
| `@aidoris/kineti-ui/components/*` | `src/components/*.tsx` |
| `@aidoris/kineti-ui/lib/*` | `src/lib/*.ts` |

The `hooks/*` export is reserved in `package.json` for future hooks; no hook modules are published yet.

## Development

From the monorepo root:

```bash
bun run lint --filter=@aidoris/kineti-ui
bun run typecheck --filter=@aidoris/kineti-ui
```

## Links

- [Monorepo root](../../README.md)
- [@aidoris/kineti-web](../../apps/web/README.md)
- [Repository](https://github.com/aidoris/kineti/tree/main/packages/ui)
- [Issues](https://github.com/aidoris/kineti/issues)
