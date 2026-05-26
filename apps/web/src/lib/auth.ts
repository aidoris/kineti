import { createAuth } from "@aidoris/kineti-auth"
import { createDb, type DbConnection } from "@aidoris/kineti-db"

const globalForDb = globalThis as typeof globalThis & {
  __kinetiDb?: DbConnection
}

const connection =
  globalForDb.__kinetiDb ?? (globalForDb.__kinetiDb = createDb())

export const auth = createAuth({ db: connection.db })

/** Close the shared Postgres pool so the process can exit after Ctrl+C. */
export const closeAuthDb = () => connection.sql.end({ timeout: 5 })
