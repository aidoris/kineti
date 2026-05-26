import { Link } from "@tanstack/react-router"
import { Button, buttonVariants } from "@aidoris/kineti-ui/components/button"
import { cn } from "@aidoris/kineti-ui/lib/utils"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { useAppSession } from "@/hooks/use-app-session"
import { root } from "@/i18n/root"

const navLinkClass =
  "text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"

export const SiteHeader = () => {
  const { session, isPending, signOut } = useAppSession()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            to="/"
            className="font-heading text-sm font-semibold tracking-tight"
          >
            {root.appTitle()}
          </Link>
          <nav
            className="hidden items-center gap-1 sm:flex"
            aria-label="Main"
          >
            <Link
              to="/"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: true }}
              className={navLinkClass}
            >
              {root.nav.home()}
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          {isPending ? null : session ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={signOut}
            >
              {root.nav.signOut()}
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                {root.nav.login()}
              </Link>
              <Link
                to="/signup"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                {root.nav.signup()}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
