import { LocaleSwitcher } from "@/components/locale-switcher"
import { root } from "@/i18n/root"

export const SiteFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p>{root.footer.tagline()}</p>
          <p>{root.footer.copyright({ year: String(year) })}</p>
        </div>
        <LocaleSwitcher variant="ghost" align="end" />
      </div>
    </footer>
  )
}
