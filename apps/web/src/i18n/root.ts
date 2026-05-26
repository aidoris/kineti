import { m } from "@/paraglide/messages.js"

/** Messages for `src/routes/__root.tsx` */
export const root = {
  appTitle: m["root.app_title"],
  nav: {
    home: m["root.nav.home"],
    login: m["root.nav.login"],
  },
  notFound: {
    title: m["root.not_found.title"],
    description: m["root.not_found.description"],
  },
} as const
