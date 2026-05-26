import { m } from "@/paraglide/messages.js"

/** Messages for `src/routes/index.tsx` */
export const index = {
  description: m["index.description"],
  session: {
    heading: m["index.session.heading"],
    loading: m["index.session.loading"],
    signedIn: m["index.session.signed_in"],
    signOut: m["index.session.sign_out"],
    notSignedIn: m["index.session.not_signed_in"],
    signIn: m["index.session.sign_in"],
  },
} as const
