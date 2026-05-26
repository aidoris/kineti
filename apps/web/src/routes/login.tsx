import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@aidoris/kineti-ui/components/button"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/login")({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      if (mode === "sign-up") {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
        })

        if (result.error) {
          setError(result.error.message ?? "Sign up failed")
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })

        if (result.error) {
          setError(result.error.message ?? "Sign in failed")
          return
        }
      }

      await navigate({ to: "/" })
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong",
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="container mx-auto flex min-h-svh max-w-md flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-medium">
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-muted-foreground text-sm">
          Email and password auth via Better Auth.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {mode === "sign-up" ? (
          <label className="flex flex-col gap-1.5 text-sm">
            <span>Name</span>
            <input
              className="border-input bg-background ring-offset-background focus-visible:ring-ring rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
              type="text"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1.5 text-sm">
          <span>Email</span>
          <input
            className="border-input bg-background ring-offset-background focus-visible:ring-ring rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span>Password</span>
          <input
            className="border-input bg-background ring-offset-background focus-visible:ring-ring rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
            type="password"
            name="password"
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Please wait…"
            : mode === "sign-in"
              ? "Sign in"
              : "Sign up"}
        </Button>
      </form>

      <p className="text-muted-foreground text-sm">
        {mode === "sign-in" ? (
          <>
            No account?{" "}
            <button
              type="button"
              className="text-foreground underline"
              onClick={() => setMode("sign-up")}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="text-foreground underline"
              onClick={() => setMode("sign-in")}
            >
              Sign in
            </button>
          </>
        )}
      </p>

      <Link to="/" className="text-muted-foreground text-sm underline">
        Back to home
      </Link>
    </main>
  )
}
