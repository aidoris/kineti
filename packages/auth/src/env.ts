export const getBetterAuthSecret = (): string => {
  const secret = process.env.BETTER_AUTH_SECRET

  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is required")
  }

  return secret
}

export const getBetterAuthUrl = (): string => {
  const url = process.env.BETTER_AUTH_URL

  if (!url) {
    throw new Error("BETTER_AUTH_URL is required")
  }

  return url
}
