import { createAuthClient } from "better-auth/react"

export type CreateAuthClientOptions = {
  baseURL?: string
}

export const createKinetiAuthClient = (options: CreateAuthClientOptions = {}) =>
  createAuthClient({
    baseURL: options.baseURL,
  })

export type KinetiAuthClient = ReturnType<typeof createKinetiAuthClient>
