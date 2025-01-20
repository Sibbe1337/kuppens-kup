import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { IntlProvider } from "react-intl"
import { useRouter } from "next/router"

// Import all language files
import en from "@/locales/en.json"
import es from "@/locales/es.json"
import de from "@/locales/de.json"
import ja from "@/locales/ja.json"

const languages = { en, es, de, ja }

const IntlContext = createContext<{
  locale: string
  setLocale: (locale: string) => void
}>({
  locale: "en",
  setLocale: () => {},
})

export const useIntl = () => useContext(IntlContext)

export const IntlContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const [locale, setLocale] = useState(router.locale || "en")

  useEffect(() => {
    if (router.locale !== locale) {
      router.push(router.pathname, router.asPath, { locale })
    }
  }, [locale, router])

  return (
    <IntlContext.Provider value={{ locale, setLocale }}>
      <IntlProvider messages={languages[locale]} locale={locale} defaultLocale="en">
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  )
}

