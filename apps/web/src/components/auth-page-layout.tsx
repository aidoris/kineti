import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@aidoris/kineti-ui/components/card"

type AuthPageLayoutProps = {
  title: string
  description: string
  backLabel: string
  children: ReactNode
  footer: ReactNode
}

export const AuthPageLayout = ({
  title,
  description,
  backLabel,
  children,
  footer,
}: AuthPageLayoutProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {children}
            <p className="text-center text-xs/relaxed text-muted-foreground">
              {footer}
            </p>
          </CardContent>
        </Card>
        <Link
          to="/"
          className="mt-6 block text-center text-xs/relaxed text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
