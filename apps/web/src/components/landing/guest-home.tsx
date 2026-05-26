import { ArrowRightIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { Badge } from "@aidoris/kineti-ui/components/badge"
import { buttonVariants } from "@aidoris/kineti-ui/components/button"
import { cn } from "@aidoris/kineti-ui/lib/utils"
import { FeaturesSection } from "@/components/landing/features-section"
import { index } from "@/i18n/index"

export const GuestHome = () => {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-primary)/15,transparent)]"
          aria-hidden
        />
        <div className="container relative mx-auto flex flex-col items-center gap-8 px-4 py-20 text-center md:py-28">
          <Badge variant="secondary">{index.hero.badge()}</Badge>
          <div className="flex max-w-2xl flex-col gap-4">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {index.hero.title()}
            </h1>
            <p className="text-sm/relaxed text-muted-foreground text-pretty md:text-base/relaxed">
              {index.hero.subtitle()}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}
            >
              {index.hero.cta.primary()}
              <ArrowRightIcon aria-hidden />
            </Link>
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              {index.hero.cta.secondary()}
            </Link>
          </div>
        </div>
      </section>
      <FeaturesSection />
    </>
  )
}
