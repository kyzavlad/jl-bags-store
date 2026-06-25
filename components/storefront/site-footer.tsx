import Link from 'next/link'
import { Instagram, Facebook, Send } from 'lucide-react'
import { BRAND, SOCIAL } from '@/lib/seo'

const INFO_LINKS = [
  { label: 'Каталог',            href: '/catalog' },
  { label: 'Доставка та оплата', href: '/delivery-payment' },
  { label: 'Оптовикам',          href: '/wholesale' },
]

const LEGAL_LINKS = [
  { label: 'Політика конфіденційності', href: '/privacy' },
  { label: 'Умови використання',        href: '/terms' },
  { label: 'Контакти',                  href: '/contacts' },
]

/** Julia Lebedeva Collection footer — white, minimal, premium. */
export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-neutral-200 text-neutral-600">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-black shrink-0">
                <span className="text-[11px] font-black tracking-tighter text-black">JL</span>
              </span>
              <span className="text-neutral-900 text-sm font-semibold tracking-wide">
                Julia Lebedeva
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500">
              Преміальні жіночі сумки та аксесуари. Натуральні матеріали, бездоганна якість.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                aria-label="Instagram" className="text-neutral-500 hover:text-black transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                aria-label="Facebook" className="text-neutral-500 hover:text-black transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer"
                aria-label="Telegram" className="text-neutral-500 hover:text-black transition-colors">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Information */}
          <div>
            <p className="text-xs tracking-widest uppercase text-neutral-900 mb-5">Інформація</p>
            <ul className="space-y-3 text-sm">
              {INFO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-black transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs tracking-widest uppercase text-neutral-900 mb-5">Юридична інформація</p>
            <ul className="space-y-3 text-sm">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-black transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-xs tracking-widest uppercase text-neutral-900 mb-5">Контакти</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${BRAND.phone}`} className="hover:text-black transition-colors text-base font-medium text-neutral-900">
                  {BRAND.phoneDisplay}
                </a>
              </li>
              <li className="text-neutral-500">{BRAND.city}, {BRAND.region}</li>
              <li className="text-neutral-500">Замовлення онлайн 24/7</li>
            </ul>
            <div className="flex items-center gap-4 mt-5">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                aria-label="Instagram" className="text-neutral-500 hover:text-black transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                aria-label="Facebook" className="text-neutral-500 hover:text-black transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer"
                aria-label="Telegram" className="text-neutral-500 hover:text-black transition-colors">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <span>© {new Date().getFullYear()} Julia Lebedeva. Всі права захищено</span>
          <Link href="/admin" className="hover:text-neutral-700 transition-colors">
            Адміністрування
          </Link>
        </div>
      </div>
    </footer>
  )
}
