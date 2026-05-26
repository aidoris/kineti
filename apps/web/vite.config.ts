import { cpSync, mkdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
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
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
      urlPatterns: [
        {
          pattern: "/",
          localized: [
            ["en", "/en"],
            ["de", "/de"],
          ],
        },
        {
          pattern: "/login",
          localized: [
            ["en", "/en/login"],
            ["de", "/de/login"],
          ],
        },
      ],
    }),
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
