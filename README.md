# Kineti

Monorepo for **Kineti** — a Bun + Turborepo workspace with a TanStack Start web app, shared UI package, and CLI.

| Package | Path | npm |
| --- | --- | --- |
| `@aidoris/kineti-base` | `.` | Workspace root (not published) |
| `@aidoris/kineti-ui` | [`packages/ui`](./packages/ui) | Shared React UI components |
| `@aidoris/kineti-web` | [`apps/web`](./apps/web) | TanStack Start + Nitro production app |
| `@aidoris/kineti-cli` | [`apps/cli`](./apps/cli) | `kineti` command-line tool |

## Requirements

- [Bun](https://bun.sh) 1.3+
- Node.js 20+

## Quick start

```bash
bun install
bun run build
bun run dev
```

## Scripts

| Script | Description |
| --- | --- |
| `bun run build` | Build all workspace packages (Turbo) |
| `bun run dev` | Start dev servers (Turbo) |
| `bun run lint` | Lint all packages |
| `bun run format` | Format with Prettier |
| `bun run typecheck` | Typecheck all packages |

Git hooks under `.githooks/` run `bun run build` on pre-commit and are installed automatically via `postinstall`.

## Workspace layout

```
.
├── apps/
│   ├── cli/     # @aidoris/kineti-cli
│   └── web/     # @aidoris/kineti-web
├── packages/
│   └── ui/      # @aidoris/kineti-ui
└── package.json
```

## Publishing

Scoped `@aidoris/*` packages publish to [GitHub Packages](https://npm.pkg.github.com) (`publishConfig.registry`). Copy [`.env.example`](./.env.example) to `.env` and set `NPM_TOKEN` to a GitHub PAT with `write:packages` (or run `NPM_TOKEN=$(gh auth token)` if `gh` is logged in).

## License

See repository license. Packages are published under the `@aidoris` scope.

## Links

- [Repository](https://github.com/aidoris/kineti)
- [Issues](https://github.com/aidoris/kineti/issues)
