import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Alert, AlertDescription } from "@aidoris/kineti-ui/components/alert"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@aidoris/kineti-ui/components/field"
import { Input } from "@aidoris/kineti-ui/components/input"
import { SubmitButton } from "@/components/auth/submit-button"
import { AuthPageLayout } from "@/components/auth-page-layout"
import { login } from "@/i18n/login"
import { root } from "@/i18n/root"
import { authClient } from "@/lib/auth-client"
import { createPageHead } from "@/lib/page-head"
import { redirectIfAuthenticated } from "@/lib/redirect-if-authenticated"

export const Route = createFileRoute("/login")({
  beforeLoad: redirectIfAuthenticated,
  head: () =>
    createPageHead(
      root.documentTitle({ page: login.pageTitle() }),
      login.metaDescription(),
    ),
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      const result = await authClient.signIn.email({ email, password })

      if (result.error) {
        setError(result.error.message ?? "Sign in failed")
        return
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
    <AuthPageLayout
      title={login.signInTitle()}
      description={login.description()}
      backLabel={login.backHome()}
      footer={
        <>
          {login.noAccount()}{" "}
          <Link
            to="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {login.signUpLink()}
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <fieldset
          disabled={isPending}
          className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="login-email">{login.emailLabel()}</FieldLabel>
              <Input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={error ? true : undefined}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="login-password">{login.passwordLabel()}</FieldLabel>
              <Input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={error ? true : undefined}
              />
            </Field>

            {error ? (
              <Alert variant="destructive">
                <WarningCircleIcon aria-hidden />
                <AlertDescription>
                  <FieldError>{error}</FieldError>
                </AlertDescription>
              </Alert>
            ) : null}

            <SubmitButton
              isPending={isPending}
              label={login.submit.signIn()}
              pendingLabel={login.submit.wait()}
            />
          </FieldGroup>
        </fieldset>
      </form>
    </AuthPageLayout>
  )
}
