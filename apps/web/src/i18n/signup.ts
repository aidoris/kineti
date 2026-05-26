import { m } from "@/paraglide/messages.js"

/** Messages for `src/routes/signup.tsx` */
export const signup = {
  signUpTitle: m["signup.sign_up_title"],
  description: m["signup.description"],
  nameLabel: m["signup.name_label"],
  emailLabel: m["signup.email_label"],
  passwordLabel: m["signup.password_label"],
  passwordHint: m["signup.password_hint"],
  submit: {
    wait: m["signup.submit.wait"],
    signUp: m["signup.submit.sign_up"],
  },
  hasAccount: m["signup.has_account"],
  signInLink: m["signup.sign_in_link"],
  backHome: m["signup.back_home"],
} as const
