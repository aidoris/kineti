import { m } from "@/paraglide/messages.js"

/** Messages for `src/routes/__root.tsx` */
export const root = {
  appTitle: m["root.app_title"],
  appDescription: m["root.app_description"],
  documentTitle: m["root.document_title"],
  nav: {
    home: m["root.nav.home"],
    login: m["root.nav.login"],
    signup: m["root.nav.signup"],
    signOut: m["root.nav.sign_out"],
  },
  footer: {
    tagline: m["root.footer.tagline"],
    copyright: m["root.footer.copyright"],
  },
  profile: {
    menuLabel: m["root.profile.menu_label"],
  },
  notFound: {
    title: m["root.not_found.title"],
    description: m["root.not_found.description"],
  },
} as const
