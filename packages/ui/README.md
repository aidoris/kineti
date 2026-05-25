# @aidoris/kineti-ui

Shared React UI library for Kineti — Tailwind CSS v4, Base UI primitives, and shadcn-style components.

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
import { cn } from "@aidoris/kineti-ui/lib/utils"
```

## Exports

| Subpath | Maps to |
| --- | --- |
| `@aidoris/kineti-ui/globals.css` | `src/styles/globals.css` |
| `@aidoris/kineti-ui/components/*` | `src/components/*.tsx` |
| `@aidoris/kineti-ui/lib/*` | `src/lib/*.ts` |
| `@aidoris/kineti-ui/hooks/*` | `src/hooks/*.ts` |

## Development

From the monorepo root:

```bash
bun run lint --filter=@aidoris/kineti-ui
bun run typecheck --filter=@aidoris/kineti-ui
```

## Links

- [Monorepo root](../../README.md)
- [Repository](https://github.com/aidoris/kineti/tree/main/packages/ui)
- [Issues](https://github.com/aidoris/kineti/issues)
