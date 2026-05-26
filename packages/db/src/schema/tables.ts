import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

/**
 * PostgreSQL table definitions for Drizzle ORM.
 * Add `pgTable(...)` exports here, then run `bun run db:generate` in @aidoris/kineti-db.
 */
export const dummy = pgTable("dummy", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
