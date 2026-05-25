# @aidoris/kineti-cli

Command-line interface for Kineti. Installs the `kineti` binary globally or per-project.

## Install

```bash
bun add -g @aidoris/kineti-cli
# or
npm install -g @aidoris/kineti-cli
```

## Usage

```bash
kineti --help
kineti --version
kineti hello
kineti hello Kineti
```

### Commands

| Command | Description |
| --- | --- |
| `hello [name]` | Print a greeting (default name: `world`) |

## Development (monorepo)

```bash
# from repo root
bun run build --filter=@aidoris/kineti-cli
bun run dev --filter=@aidoris/kineti-cli

# or from apps/cli
bun run build   # tsup → dist/
bun run dev     # bun run src/index.ts
```

Built entry: `dist/index.js` (see `bin.kineti` in `package.json`).

## Links

- [Monorepo root](../../README.md)
- [Repository](https://github.com/aidoris/kineti/tree/main/apps/cli)
- [Issues](https://github.com/aidoris/kineti/issues)
