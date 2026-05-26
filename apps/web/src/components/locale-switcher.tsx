import { getLocale, locales, setLocale } from "@/paraglide/runtime.js"

export const LocaleSwitcher = () => {
  const activeLocale = getLocale()

  return (
    <div className="flex gap-2" role="group" aria-label="Language">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => setLocale(locale)}
          data-active-locale={locale === activeLocale}
          aria-pressed={locale === activeLocale}
          className="border-input cursor-pointer rounded-md border px-2 py-1 text-sm uppercase data-[active-locale=true]:bg-primary data-[active-locale=true]:text-primary-foreground"
        >
          {locale}
        </button>
      ))}
    </div>
  )
}
