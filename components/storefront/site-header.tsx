import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Instagram, Phone } from 'lucide-react'
import { BRAND, SOCIAL } from '@/lib/seo'

const NAV = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Доставка й оплата', href: '/delivery-payment' },
  { label: 'Оптовикам', href: '/wholesale' },
  { label: 'Контакти', href: '/contacts' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fbfaf7]/95 text-[#171513] backdrop-blur-xl">
      <div className="border-b border-black/5 bg-[#171513] px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.19em] text-white/75 sm:text-[11px]">
        Власне виробництво у Харкові · Відправка 1–2 дні · Обмін 14 днів
      </div>

      <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="JL Bags — на головну"
        >
          <Image
            src="/logo.png"
            alt="Julia Lebedeva Collection"
            width={44}
            height={44}
            priority
            className="h-10 w-10 object-contain sm:h-11 sm:w-11"
          />
          <div className="hidden leading-none sm:block">
            <span className="block text-[13px] font-black tracking-[0.16em]">JL BAGS</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-black/40">
              Julia Lebedeva
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-semibold text-black/62 transition-colors hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={SOCIAL.instagram}
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            data-track-event="instagram_click"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-black/10 transition hover:bg-black hover:text-white sm:flex"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={`tel:${BRAND.phone}`}
            aria-label={BRAND.phoneDisplay}
            data-track-event="phone_click"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-black/10 transition hover:bg-black hover:text-white md:flex"
          >
            <Phone className="h-4 w-4" />
          </a>
          <Link
            href="/catalog"
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-[#171513] px-4 text-xs font-semibold text-white transition hover:bg-black sm:px-5"
          >
            Каталог
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <nav className="border-t border-black/5 lg:hidden">
        <div className="mx-auto flex max-w-[1440px] overflow-x-auto px-3 sm:px-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 px-3 py-2.5 text-[11px] font-semibold text-black/55 transition-colors hover:text-black sm:px-4"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
