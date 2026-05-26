import { createFileRoute, Link } from "@tanstack/react-router"
import { Button, buttonVariants } from "@aidoris/kineti-ui/components/button"
import { cn } from "@aidoris/kineti-ui/lib/utils"
import { index } from "@/i18n/index"
import { root } from "@/i18n/root"
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
          <h1 className="font-medium">{root.appTitle()}</h1>
          <p>{index.description()}</p>
        </div>

        <section className="flex flex-col gap-2 rounded-lg border p-4">
          <h2 className="font-medium">{index.session.heading()}</h2>
          {isPending ? (
            <p className="text-muted-foreground">{index.session.loading()}</p>
          ) : session ? (
            <div className="flex flex-col gap-2">
              <p>
                {index.session.signedIn({ email: session.user.email })}
              </p>
              <Button type="button" variant="outline" onClick={handleSignOut}>
                {index.session.signOut()}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground">{index.session.notSignedIn()}</p>
              <Link to="/login" className={cn(buttonVariants())}>
                {index.session.signIn()}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
