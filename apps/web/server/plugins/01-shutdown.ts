import { definePlugin } from "nitro"
import { closeAuthDb } from "@/lib/auth"

/**
 * srvx closes the HTTP server on SIGINT but does not end open DB pools, so Node
 * keeps running. Close Postgres and exit once resources are released.
 */
export default definePlugin(() => {
  let isShuttingDown = false

  const shutdown = async () => {
    if (isShuttingDown) {
      return
    }
    isShuttingDown = true

    try {
      await closeAuthDb()
    } catch (error) {
      console.error("[kineti-web] error closing database pool:", error)
    }

    process.exit(0)
  }

  process.once("SIGINT", shutdown)
  process.once("SIGTERM", shutdown)
})
