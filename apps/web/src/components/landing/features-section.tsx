import { GlobeIcon, LightningIcon, ShieldCheckIcon } from "@phosphor-icons/react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@aidoris/kineti-ui/components/card"
import { index } from "@/i18n/index"

const features = [
  {
    icon: ShieldCheckIcon,
    title: () => index.features.auth.title(),
    description: () => index.features.auth.description(),
  },
  {
    icon: GlobeIcon,
    title: () => index.features.i18n.title(),
    description: () => index.features.i18n.description(),
  },
  {
    icon: LightningIcon,
    title: () => index.features.ui.title(),
    description: () => index.features.ui.description(),
  },
] as const

export const FeaturesSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <h2 className="mb-8 text-center font-heading text-lg font-semibold">
        {index.features.heading()}
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title()} size="sm">
            <CardHeader>
              <div className="mb-1 flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </div>
              <CardTitle>{title()}</CardTitle>
              <CardDescription>{description()}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
