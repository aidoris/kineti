import { m } from "@/paraglide/messages.js"

/** Messages for `src/routes/login.tsx` */
export const login = {
  signInTitle: m["login.sign_in_title"],
  signUpTitle: m["login.sign_up_title"],
  description: m["login.description"],
  nameLabel: m["login.name_label"],
  emailLabel: m["login.email_label"],
  passwordLabel: m["login.password_label"],
  submit: {
    wait: m["login.submit.wait"],
    signIn: m["login.submit.sign_in"],
    signUp: m["login.submit.sign_up"],
  },
  noAccount: m["login.no_account"],
  signUpLink: m["login.sign_up_link"],
  hasAccount: m["login.has_account"],
  signInLink: m["login.sign_in_link"],
  backHome: m["login.back_home"],
} as const
