import Link from 'next/link'
import { Instagram, Facebook, Phone } from 'lucide-react'
import { BRAND, SOCIAL } from '@/lib/seo'

const NAV = [
  { label: 'Каталог',            href: '/catalog' },
  { label: 'Доставка та оплата', href: '/delivery-payment' },
  { label: 'Оптовикам',          href: '/wholesale' },
  { label: 'Контакти',           href: '/contacts' },
]

/**
 * Julia Lebedeva Collection boutique header.
 * White sticky background, circular JL monogram, centered nav, social + phone on right.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo — circular monogram */}
        <Link href="/" className="shrink-0 flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-black select-none">
            <span className="text-[11px] font-black tracking-tighter leading-none text-black">JL</span>
          </span>
          <span className="hidden sm:block text-xs font-light tracking-[0.25em] uppercase text-neutral-600">
            Julia Lebedeva
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium tracking-widest uppercase text-neutral-700 hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: social icons + phone + language */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href={SOCIAL.instagram}
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-black transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={SOCIAL.facebook}
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-black transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href={`tel:${BRAND.phone}`}
            aria-label={BRAND.phoneDisplay}
            className="text-neutral-500 hover:text-black transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
          <span className="text-xs font-semibold tracking-widest text-neutral-400 cursor-default select-none">RU</span>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden border-t border-neutral-100 overflow-x-auto scrollbar-hide">
        <div className="flex px-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 px-4 py-2.5 text-xs font-medium tracking-widest uppercase text-neutral-600 hover:text-black whitespace-nowrap transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
