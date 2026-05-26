import { m } from "@/paraglide/messages.js"

/** Messages for `src/routes/index.tsx` */
export const index = {
  pageTitle: m["index.page_title"],
  metaDescription: m["index.meta_description"],
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
    providers: {
      title: m["index.features.providers.title"],
      description: m["index.features.providers.description"],
    },
    models: {
      title: m["index.features.models.title"],
      description: m["index.features.models.description"],
    },
    chat: {
      title: m["index.features.chat.title"],
      description: m["index.features.chat.description"],
    },
  },
} as const
