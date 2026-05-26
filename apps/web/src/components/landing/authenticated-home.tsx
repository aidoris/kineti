import { Badge } from "@aidoris/kineti-ui/components/badge"
import { FeaturesSection } from "@/components/landing/features-section"
import { index } from "@/i18n/index"

type AuthenticatedHomeProps = {
  name: string
  email: string
}

export const AuthenticatedHome = ({ name, email }: AuthenticatedHomeProps) => {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-primary)/15,transparent)]"
          aria-hidden
        />
        <div className="container relative mx-auto flex flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
          <Badge variant="secondary">{index.hero.authenticated.badge()}</Badge>
          <div className="flex max-w-2xl flex-col gap-4">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {index.hero.authenticated.title({ name })}
            </h1>
            <p className="text-sm/relaxed text-muted-foreground text-pretty md:text-base/relaxed">
              {index.hero.authenticated.subtitle({ email })}
            </p>
          </div>
        </div>
      </section>
      <FeaturesSection />
    </>
  )
}
