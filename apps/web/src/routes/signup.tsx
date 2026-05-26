import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Alert, AlertDescription } from "@aidoris/kineti-ui/components/alert"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@aidoris/kineti-ui/components/field"
import { Input } from "@aidoris/kineti-ui/components/input"
import { SubmitButton } from "@/components/auth/submit-button"
import { AuthPageLayout } from "@/components/auth-page-layout"
import { signup } from "@/i18n/signup"
import { authClient } from "@/lib/auth-client"
import { redirectIfAuthenticated } from "@/lib/redirect-if-authenticated"

export const Route = createFileRoute("/signup")({
  beforeLoad: redirectIfAuthenticated,
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
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
      const result = await authClient.signUp.email({ name, email, password })

      if (result.error) {
        setError(result.error.message ?? "Sign up failed")
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
      title={signup.signUpTitle()}
      description={signup.description()}
      backLabel={signup.backHome()}
      footer={
        <>
          {signup.hasAccount()}{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {signup.signInLink()}
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
              <FieldLabel htmlFor="signup-name">{signup.nameLabel()}</FieldLabel>
              <Input
                id="signup-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={error ? true : undefined}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="signup-email">{signup.emailLabel()}</FieldLabel>
              <Input
                id="signup-email"
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
              <FieldLabel htmlFor="signup-password">{signup.passwordLabel()}</FieldLabel>
              <Input
                id="signup-password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={error ? true : undefined}
              />
              <FieldDescription>{signup.passwordHint()}</FieldDescription>
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
              label={signup.submit.signUp()}
              pendingLabel={signup.submit.wait()}
            />
          </FieldGroup>
        </fieldset>
      </form>
    </AuthPageLayout>
  )
}
