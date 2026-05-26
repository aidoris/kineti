import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { getDatabaseUrl } from "./env"
import * as schema from "./schema/index"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

export type DbSchema = typeof schema
export type Db = PostgresJsDatabase<DbSchema>

export type CreateDbOptions = {
  connectionString?: string
  max?: number
}

export type DbConnection = {
  db: Db
  sql: postgres.Sql
}

export const createDb = (options: CreateDbOptions = {}): DbConnection => {
  const connectionString = options.connectionString ?? getDatabaseUrl()
  const sql = postgres(connectionString, { max: options.max ?? 10 })
  const db = drizzle(sql, { schema })

  return { db, sql }
}
