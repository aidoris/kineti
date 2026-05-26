import { createFileRoute } from "@tanstack/react-router"
import { AuthenticatedHome } from "@/components/landing/authenticated-home"
import { GuestHome } from "@/components/landing/guest-home"
import { LandingSkeleton } from "@/components/landing/landing-skeleton"
import { useAppSession } from "@/hooks/use-app-session"
import { index } from "@/i18n/index"
import { createPageHead } from "@/lib/page-head"

export const Route = createFileRoute("/")({
  head: () =>
    createPageHead(index.pageTitle(), index.metaDescription()),
  component: LandingPage,
})

function LandingPage() {
  const { session, isPending } = useAppSession()

  if (isPending) {
    return <LandingSkeleton />
  }

  if (session) {
    return (
      <AuthenticatedHome
        name={session.user.name ?? session.user.email}
        email={session.user.email}
      />
    )
  }

  return <GuestHome />
}
