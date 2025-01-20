import Link from "next/link"
import { useRouter } from "next/router"
import { useIntl } from "@/contexts/IntlContext"
import { FormattedMessage } from "react-intl"

export function Navigation() {
  const router = useRouter()
  const { locale, setLocale } = useIntl()

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value)
  }

  return (
    <nav aria-label="Main Navigation">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold" aria-label="Home">
          MusicLicense
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/tracks" className={router.pathname === "/tracks" ? "font-bold" : ""}>
              <FormattedMessage id="nav.tracks" />
            </Link>
          </li>
          <li>
            <Link href="/playlists" className={router.pathname === "/playlists" ? "font-bold" : ""}>
              <FormattedMessage id="nav.playlists" />
            </Link>
          </li>
          <li>
            <Link href="/account" className={router.pathname === "/account" ? "font-bold" : ""}>
              <FormattedMessage id="nav.account" />
            </Link>
          </li>
        </ul>
        <select
          value={locale}
          onChange={handleLanguageChange}
          aria-label="Select language"
          className="bg-white border border-gray-300 rounded px-2 py-1"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
        </select>
      </div>
    </nav>
  )
}

