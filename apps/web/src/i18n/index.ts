import { m } from "@/paraglide/messages.js"

/** Messages for `src/routes/index.tsx` */
export const index = {
  loading: m["index.loading"],
  hero: {
    badge: m["index.hero.badge"],
    title: m["index.hero.title"],
    subtitle: m["index.hero.subtitle"],
    cta: {
      primary: m["index.hero.cta.primary"],
      secondary: m["index.hero.cta.secondary"],
    },
    authenticated: {
      badge: m["index.hero.authenticated.badge"],
      title: m["index.hero.authenticated.title"],
      subtitle: m["index.hero.authenticated.subtitle"],
    },
  },
  features: {
    heading: m["index.features.heading"],
    auth: {
      title: m["index.features.auth.title"],
      description: m["index.features.auth.description"],
    },
    i18n: {
      title: m["index.features.i18n.title"],
      description: m["index.features.i18n.description"],
    },
    ui: {
      title: m["index.features.ui.title"],
      description: m["index.features.ui.description"],
    },
  },
} as const
