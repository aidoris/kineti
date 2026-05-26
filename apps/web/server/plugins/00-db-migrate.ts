import { definePlugin } from "nitro"
import { runMigrations } from "@aidoris/kineti-db/migrate"

/**
 * Runs database migrations once when the Nitro server starts (TanStack Start
 * production/dev server). Concurrent instances block on `pg_advisory_lock` inside
 * `runMigrations` until the active migrator finishes.
 */
export default definePlugin((nitroApp) => {
  const migrationReady = (async () => {
    console.info("[kineti-web] applying database migrations...")
    const startedAt = performance.now()

    try {
      await runMigrations()
      console.info(
        `[kineti-web] database migrations ready (${Math.round(performance.now() - startedAt)}ms)`,
      )
    } catch (error) {
      console.error("[kineti-web] database migration failed:", error)
      throw error
    }
  })()

  nitroApp.hooks.hook("request", async () => {
    await migrationReady
  })
})
