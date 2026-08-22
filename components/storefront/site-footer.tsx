import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Facebook, Instagram, Send } from 'lucide-react'
import { BRAND, SOCIAL } from '@/lib/seo'

const INFO_LINKS = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Доставка та оплата', href: '/delivery-payment' },
  { label: 'Оптовикам', href: '/wholesale' },
]

const LEGAL_LINKS = [
  { label: 'Політика конфіденційності', href: '/privacy' },
  { label: 'Умови використання', href: '/terms' },
  { label: 'Контакти', href: '/contacts' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#171513] text-white">
      <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-16 sm:px-10 sm:pt-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Julia Lebedeva Collection"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full bg-white object-contain"
              />
              <div>
                <span className="block text-sm font-black tracking-[0.15em]">JL BAGS</span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-white/35">Julia Lebedeva</span>
              </div>
            </Link>
            <h2 className="mt-8 max-w-md text-3xl font-black leading-[0.98] tracking-[-0.04em] sm:text-4xl">
              Виглядає легко. Вміщує ваш день.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/45">
              Сумки для міста, роботи й поїздок від українського виробника. Обирайте формат під те,
              що носите щодня.
            </p>
            <div className="mt-7 flex items-center gap-2">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                data-track-event="instagram_click"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/65 transition hover:bg-white hover:text-black"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                data-track-event="facebook_click"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/65 transition hover:bg-white hover:text-black"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                data-track-event="telegram_click"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/65 transition hover:bg-white hover:text-black"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-white/30">Магазин</p>
            <ul className="mt-6 space-y-3 text-sm">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/58 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-white/30">Інформація</p>
            <ul className="mt-6 space-y-3 text-sm">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/58 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-white/30">Зв’язок</p>
            <a
              href={`tel:${BRAND.phone}`}
              data-track-event="phone_click"
              className="group mt-6 inline-flex items-center gap-2 text-lg font-semibold text-white"
            >
              {BRAND.phoneDisplay}
              <ArrowUpRight className="h-4 w-4 text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-sm leading-6 text-white/42">
              {BRAND.city}, {BRAND.region}<br />
              Замовлення онлайн 24/7
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Julia Lebedeva. Всі права захищено</span>
          <Link href="/admin" className="transition hover:text-white/55">Адміністрування</Link>
        </div>
      </div>
    </footer>
  )
}
