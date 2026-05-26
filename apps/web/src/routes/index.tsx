import { createFileRoute, Link } from "@tanstack/react-router"
import { Button, buttonVariants } from "@aidoris/kineti-ui/components/button"
import { cn } from "@aidoris/kineti-ui/lib/utils"
import { authClient } from "@/lib/auth-client"
import { getSession } from "@/lib/auth.functions"

export const Route = createFileRoute("/")({
  loader: () => getSession(),
  component: App,
})

function App() {
  const loaderSession = Route.useLoaderData()
  const { data: clientSession, isPending } = authClient.useSession()
  const session = clientSession ?? loaderSession

  const handleSignOut = async () => {
    await authClient.signOut()
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Kineti</h1>
          <p>TanStack Start + Better Auth via @aidoris/kineti-auth.</p>
        </div>

        <section className="flex flex-col gap-2 rounded-lg border p-4">
          <h2 className="font-medium">Session</h2>
          {isPending ? (
            <p className="text-muted-foreground">Loading session…</p>
          ) : session ? (
            <div className="flex flex-col gap-2">
              <p>
                Signed in as <span className="font-medium">{session.user.email}</span>
              </p>
              <Button type="button" variant="outline" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground">Not signed in.</p>
              <Link to="/login" className={cn(buttonVariants())}>
                Sign in
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
