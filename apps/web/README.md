# @aidoris/kineti-web

Production web application for Kineti — [TanStack Start](https://tanstack.com/start), Vite 7, React 19, Tailwind CSS v4, and [Nitro](https://nitro.build) for the Node server bundle.

Depends on [`@aidoris/kineti-ui`](../packages/ui) for shared components and styles.

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

Environment:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` / `NITRO_PORT` | `3000` | HTTP listen port |

## Development (monorepo)

```bash
# from repo root
bun run dev --filter=@aidoris/kineti-web

# or from apps/web
bun run dev      # vite dev --port 3000
bun run build    # vite build (client + SSR + Nitro)
bun run preview  # vite preview
```

## Stack

- **Routing / SSR:** TanStack Router + TanStack Start
- **Bundler:** Vite + `@vitejs/plugin-react`
- **Server:** Nitro (`node-server` preset) → `.output/server/index.mjs`
- **Styling:** Tailwind v4 via `@tailwindcss/vite`

## Links

- [Monorepo root](../../README.md)
- [Repository](https://github.com/aidoris/kineti/tree/main/apps/web)
- [Issues](https://github.com/aidoris/kineti/issues)
