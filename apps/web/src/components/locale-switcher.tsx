import { CaretDownIcon, GlobeIcon } from "@phosphor-icons/react"
import { Button } from "@aidoris/kineti-ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@aidoris/kineti-ui/components/dropdown-menu"
import { cn } from "@aidoris/kineti-ui/lib/utils"
import { getLocale, locales, setLocale } from "@/paraglide/runtime.js"

type Locale = (typeof locales)[number]

const localeLabels: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
}

type LocaleSwitcherProps = {
  align?: "start" | "center" | "end"
  className?: string
  variant?: "outline" | "ghost"
  size?: "sm" | "default"
}

export const LocaleSwitcher = ({
  align = "end",
  className,
  variant = "outline",
  size = "sm",
}: LocaleSwitcherProps) => {
  const activeLocale = getLocale()

  const handleLocaleChange = (value: string | null) => {
    if (!value || value === activeLocale) {
      return
    }

    setLocale(value as Locale)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={variant}
            size={size}
            className={cn("gap-1.5 uppercase", className)}
            aria-label="Language"
          />
        }
      >
        <GlobeIcon aria-hidden />
        <span>{localeLabels[activeLocale]}</span>
        <CaretDownIcon className="size-3 opacity-60" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-36">
        <DropdownMenuRadioGroup
          value={activeLocale}
          onValueChange={handleLocaleChange}
        >
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          {locales.map((locale) => (
            <DropdownMenuRadioItem key={locale} value={locale}>
              {localeLabels[locale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
