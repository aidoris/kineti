import { createKinetiAuthClient } from "@aidoris/kineti-auth/client"

export const authClient = createKinetiAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
})
