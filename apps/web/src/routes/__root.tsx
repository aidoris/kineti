import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router"

import appCss from "@aidoris/kineti-ui/globals.css?url"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { root } from "@/i18n/root"
import { getSession } from "@/lib/auth.functions"
import { getLocale } from "@/paraglide/runtime.js"

export const Route = createRootRoute({
  loader: () => getSession(),
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: root.appTitle(),
      },
      {
        name: "description",
        content: root.appDescription(),
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function NotFoundPage() {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="font-heading text-4xl font-semibold">{root.notFound.title()}</p>
      <p className="max-w-md text-muted-foreground">{root.notFound.description()}</p>
      <Link
        to="/"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {root.nav.home()}
      </Link>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body className="font-mono antialiased">
        <div className="flex min-h-svh flex-col">
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </div>
        <Scripts />
      </body>
    </html>
  )
}
