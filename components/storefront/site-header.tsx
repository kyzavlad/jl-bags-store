import Link from 'next/link'
import Image from 'next/image'
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

        {/* Logo — real circular JL monogram, matches old approved screenshots */}
        <Link href="/" className="shrink-0 flex items-center" aria-label="Julia Lebedeva Collection — на головну">
          <Image
            src="/logo.png"
            alt="Julia Lebedeva Collection"
            width={44}
            height={44}
            priority
            className="w-11 h-11 object-contain"
          />
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
            data-track-event="instagram_click"
            className="text-neutral-500 hover:text-black transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={SOCIAL.facebook}
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            data-track-event="facebook_click"
            className="text-neutral-500 hover:text-black transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href={`tel:${BRAND.phone}`}
            aria-label={BRAND.phoneDisplay}
            data-track-event="phone_click"
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
