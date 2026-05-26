import { redirect } from "@tanstack/react-router"
import { getSession } from "@/lib/auth.functions"

export const redirectIfAuthenticated = async () => {
  const session = await getSession()

  if (session) {
    throw redirect({ to: "/" })
  }
}
