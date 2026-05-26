/**
 * Minimal Better Auth config used only by `bun run auth:generate-schema`.
 * Do not import this from application code.
 */
import { drizzle } from "drizzle-orm/postgres-js"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { betterAuth } from "better-auth"
import postgres from "postgres"

const sql = postgres(
  process.env.DATABASE_URL ?? "postgresql://localhost:5432/kineti",
  {
    max: 1,
  }
)
const db = drizzle(sql)

export const auth = betterAuth({
  secret: "generate-schema-placeholder",
  baseURL: "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
})
