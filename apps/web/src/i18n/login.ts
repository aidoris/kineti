import { m } from "@/paraglide/messages.js"

/** Messages for `src/routes/login.tsx` */
export const login = {
  pageTitle: m["login.page_title"],
  metaDescription: m["login.meta_description"],
  signInTitle: m["login.sign_in_title"],
  description: m["login.description"],
  emailLabel: m["login.email_label"],
  passwordLabel: m["login.password_label"],
  submit: {
    wait: m["login.submit.wait"],
    signIn: m["login.submit.sign_in"],
  },
  noAccount: m["login.no_account"],
  signUpLink: m["login.sign_up_link"],
  backHome: m["login.back_home"],
} as const
