import { getRouteApi, useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"

const rootRoute = getRouteApi("__root__")

export const useAppSession = () => {
  const router = useRouter()
  const loaderSession = rootRoute.useLoaderData()
  const { data: clientSession, isPending } = authClient.useSession()
  const session = isPending ? (clientSession ?? loaderSession) : clientSession

  const signOut = async () => {
    await authClient.signOut()
    await router.invalidate()
  }

  return { session, isPending, signOut }
}
