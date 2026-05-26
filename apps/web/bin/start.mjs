#!/usr/bin/env node
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const outputDir = join(root, ".output")
const serverEntry = join(outputDir, "server/index.mjs")

if (!existsSync(serverEntry)) {
  console.error(
    "Kineti web build not found. Run `vite build` in @aidoris/kineti-web first."
  )
  process.exit(1)
}

const port = process.env.PORT ?? process.env.NITRO_PORT ?? "3000"

const child = spawn(process.execPath, [serverEntry], {
  cwd: outputDir,
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: port,
    NITRO_PORT: port,
  },
})

let forceKillTimer
let isShuttingDown = false

const clearForceKill = () => {
  if (forceKillTimer) {
    clearTimeout(forceKillTimer)
    forceKillTimer = undefined
  }
}

child.on("exit", (code) => {
  clearForceKill()
  process.exit(code ?? 0)
})

const handleSignal = (signal) => {
  if (isShuttingDown) {
    child.kill("SIGKILL")
    process.exit(1)
    return
  }

  isShuttingDown = true
  child.kill(signal)

  forceKillTimer = setTimeout(() => {
    child.kill("SIGKILL")
    process.exit(1)
  }, 10_000)
}

process.on("SIGINT", () => handleSignal("SIGINT"))
process.on("SIGTERM", () => handleSignal("SIGTERM"))
