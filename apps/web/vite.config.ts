import { cpSync, mkdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const appDir = dirname(fileURLToPath(import.meta.url))
const monorepoRoot = resolve(appDir, "../..")

const config = defineConfig({
  envDir: monorepoRoot,
  plugins: [
    nitro({
      serverDir: "./server",
      traceDeps: ["postgres"],
      modules: [
        (nitro) => {
          nitro.hooks.hook("compiled", () => {
            const src = join(monorepoRoot, "packages/db/migrations")
            const dest = join(nitro.options.output.serverDir, "migrations")
            mkdirSync(dest, { recursive: true })
            cpSync(src, dest, { recursive: true })
          })
        },
      ],
    }),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
