import { existsSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

import { getDatabaseUrl } from "./env"

/** Session advisory lock key so only one migration run executes at a time. */
const MIGRATION_ADVISORY_LOCK_KEY = 0x4b494442 // "KIDB"

const require = createRequire(import.meta.url)

const resolveMigrationsFolder = (override?: string): string => {
  if (override) {
    return override
  }

  try {
    return join(
      dirname(require.resolve("@aidoris/kineti-db/package.json")),
      "migrations",
    )
  } catch {
    // Nitro production bundle: SQL files are copied to `.output/server/migrations`.
    return join(dirname(fileURLToPath(import.meta.url)), "migrations")
  }
}

export type RunMigrationsOptions = {
  connectionString?: string
  migrationsFolder?: string
}

/**
 * Applies pending Drizzle migrations using a dedicated postgres.js client
 * (`max: 1`, per Drizzle postgres-js docs) and a PostgreSQL advisory lock so
 * concurrent server instances cannot migrate in parallel.
 *
 * @see https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/postgres-js/README.md
 */
export const runMigrations = async (
  options: RunMigrationsOptions = {},
): Promise<void> => {
  const migrationsFolder = resolveMigrationsFolder(options.migrationsFolder)
  const migrationJournal = join(migrationsFolder, "meta/_journal.json")

  if (!existsSync(migrationJournal)) {
    console.info("[kineti-db] no migration journal found, skipping")
    return
  }

  const connectionString = options.connectionString ?? getDatabaseUrl()
  const sql = postgres(connectionString, { max: 1 })

  try {
    await sql`select pg_advisory_lock(${MIGRATION_ADVISORY_LOCK_KEY})`

    const db = drizzle(sql)
    await migrate(db, { migrationsFolder })
  } finally {
    await sql`select pg_advisory_unlock(${MIGRATION_ADVISORY_LOCK_KEY})`
    await sql.end()
  }
}
