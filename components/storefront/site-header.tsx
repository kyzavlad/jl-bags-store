import Link from 'next/link'
import { BRAND, NAV_CATEGORIES } from '@/lib/seo'

/**
 * Public storefront header. Server component (no client JS): brand wordmark,
 * a horizontally-scrollable category nav, and a click-to-call phone button.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-baseline gap-1.5 shrink-0">
            <span className="text-2xl font-bold tracking-tight text-stone-900">JL</span>
            <span className="text-2xl font-light tracking-tight text-stone-500">Bags</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/catalog/${c.slug}`}
                className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <a
            href={`tel:${BRAND.phone}`}
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-stone-900 text-white text-sm font-semibold px-4 py-2 hover:bg-stone-700 transition-colors"
          >
            <span aria-hidden>📞</span>
            <span className="hidden sm:inline">{BRAND.phoneDisplay}</span>
            <span className="sm:hidden">Подзвонити</span>
          </a>
        </div>

        {/* Mobile / tablet category strip */}
        <nav className="lg:hidden flex items-center gap-1 overflow-x-auto scrollbar-hide pb-2 -mt-1">
          {NAV_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog/${c.slug}`}
              className="shrink-0 px-3 py-1.5 rounded-full bg-stone-100 text-xs font-medium text-stone-700 whitespace-nowrap hover:bg-stone-200 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
