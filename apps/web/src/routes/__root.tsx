import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router"

import appCss from "@aidoris/kineti-ui/globals.css?url"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { root } from "@/i18n/root"
import { getLocale } from "@/paraglide/runtime.js"

export const Route = createRootRoute({
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
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>{root.notFound.title()}</h1>
      <p>{root.notFound.description()}</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="flex items-center justify-between gap-4 border-b p-4">
          <nav className="flex gap-4 text-sm">
            <Link
              to="/"
              activeProps={{ className: "font-medium" }}
              activeOptions={{ exact: true }}
            >
              {root.nav.home()}
            </Link>
            <Link to="/login" activeProps={{ className: "font-medium" }}>
              {root.nav.login()}
            </Link>
          </nav>
          <LocaleSwitcher />
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
