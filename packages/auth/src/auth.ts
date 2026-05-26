import { createDb } from "@aidoris/kineti-db"
import * as authSchema from "@aidoris/kineti-db/schema/auth"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { betterAuth } from "better-auth"
import { getBetterAuthSecret, getBetterAuthUrl } from "./env"
import type { BetterAuthOptions } from "better-auth"

import type { Db } from "@aidoris/kineti-db"

export type CreateAuthOptions = {
  db?: Db
  baseURL?: string
  secret?: string
  trustedOrigins?: Array<string>
  config?: Omit<
    BetterAuthOptions,
    "database" | "secret" | "baseURL" | "trustedOrigins"
  >
}

export const createAuth = (options: CreateAuthOptions = {}) => {
  const { db } = options.db ? { db: options.db } : createDb()

  return betterAuth({
    secret: options.secret ?? getBetterAuthSecret(),
    baseURL: options.baseURL ?? getBetterAuthUrl(),
    trustedOrigins: options.trustedOrigins,
    emailAndPassword: {
      enabled: true,
    },
    ...options.config,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: authSchema,
    }),
  })
}

export type Auth = ReturnType<typeof createAuth>
export type Session = Auth["$Infer"]["Session"]
