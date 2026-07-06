import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShoppingBag,
  FileText,
  Instagram,
  Facebook,
  Send,
  Phone,
  MoreHorizontal,
  Globe,
  Sparkles,
  Check,
  Heart,
} from 'lucide-react'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PHONE = '+380964249565'
const PHONE_DISPLAY = '+38 096 424 95 65'
const HANDLE = '@sumki_kharkov'

export const metadata: Metadata = {
  title: { absolute: 'JL Bags | Посилання' },
  description: 'Каталог, Instagram, Facebook, Telegram та контакти JL Bags',
  alternates: { canonical: `${SITE_URL}/links` },
  openGraph: {
    title: 'JL Bags | Посилання',
    description: 'Каталог, Instagram, Facebook, Telegram та контакти JL Bags',
    url: `${SITE_URL}/links`,
    type: 'website',
    siteName: 'JL Bags',
    images: [{ url: OG_IMAGE, width: 1339, height: 1339, alt: 'JL Bags' }],
  },
  robots: { index: true, follow: true },
}

const STEPS: { n: number; text: string; Icon: typeof MoreHorizontal }[] = [
  { n: 1, text: 'Натисни на три крапки', Icon: MoreHorizontal },
  { n: 2, text: 'Обери «Відкрити в браузері»', Icon: Globe },
  { n: 3, text: 'Сторінка відкриється в браузері', Icon: Sparkles },
  { n: 4, text: 'Тепер кнопки працюють', Icon: Check },
]

// Real, git-tracked assets in /public. Rendered as CSS background-image so a
// fetch failure degrades to the labeled cream card instead of a broken <img>.
const CARDS = [
  { src: '/hero/hero-1.jpg', label: 'Сумочки для телефону', href: '/catalog/phone-bags' },
  { src: '/hero/hero-2.jpg', label: 'Замшеві сумки', href: '/catalog/suede-bags' },
  { src: '/hero/hero-3.jpg', label: 'Жіночі шопери', href: '/catalog/shoppers' },
  { src: '/about.jpg', label: 'Рюкзаки', href: '/catalog/backpacks' },
]

const SMALL_LINKS: {
  label: string
  href: string
  Icon: typeof Instagram
  external?: boolean
  track?: string
}[] = [
  { label: 'Instagram', href: 'https://instagram.com/sumki_kharkov', Icon: Instagram, external: true, track: 'instagram_click' },
  { label: 'Facebook', href: 'https://facebook.com/', Icon: Facebook, external: true, track: 'facebook_click' },
  { label: 'Telegram', href: 'https://t.me/', Icon: Send, external: true, track: 'telegram_click' },
  { label: 'Прайс-лист', href: '/pricelist?key=jlprice2026', Icon: FileText },
  { label: 'Подзвонити', href: `tel:${PHONE}`, Icon: Phone, track: 'phone_click' },
]

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-[#f7efe7] text-[#3f3733]">
      <div className="mx-auto w-full max-w-md px-5 py-9">

        {/* Brand — pure CSS JL monogram, never a broken image */}
        <header className="flex flex-col items-center text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-sm ring-1 ring-[#d8c3b8] bg-gradient-to-br from-[#f3e7dd] to-[#e6d0c3]"
            aria-hidden
          >
            <span className="font-serif text-3xl font-black tracking-tight text-[#a24d5e]">JL</span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#2f2925]">JL Bags</h1>
          <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a9707a]">
            Жіночі сумки
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-[#6f645d] max-w-[19rem]">
            Жіночі сумки з доставкою по всій Україні
          </p>
          <Heart className="mt-3 w-4 h-4 text-[#c98a94]" fill="currentColor" />
        </header>

        {/* How to open in browser */}
        <section className="mt-6" aria-label="Як відкрити в браузері">
          <h2 className="text-center text-lg font-bold text-[#2f2925]">Як відкрити в браузері?</h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex items-center gap-2.5 rounded-2xl bg-white/70 ring-1 ring-black/5 px-3 py-3"
              >
                <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-[#e7d3d3] text-[#a9505f] text-xs font-bold">
                  {s.n}
                </span>
                <span className="text-[12px] leading-tight text-[#5c534d]">{s.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Style grid — real images via background-image with labeled fallback */}
        <section className="mt-8" aria-label="Твій стиль щодня">
          <h2 className="text-center text-xl font-black text-[#2f2925]">Твій стиль щодня</h2>
          <p className="mt-1 text-center text-[12px] font-semibold text-[#a9707a]">
            Новинки · Обери свою сумку
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {CARDS.map((c) => (
              <Link
                key={c.src}
                href={c.href}
                aria-label={c.label}
                className="relative block aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-[#e0d0c5] bg-gradient-to-br from-[#efe2d7] to-[#e2cebf] bg-cover bg-center"
                style={{ backgroundImage: `url('${c.src}')` }}
              >
                {/* Bottom scrim + label — doubles as the fallback if the image is absent */}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-2.5 pt-8">
                  <span className="block text-[12px] font-bold leading-tight text-white drop-shadow-sm">
                    {c.label}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Primary + secondary buttons */}
        <section className="mt-7 space-y-3">
          <Link
            href="/catalog"
            className="flex items-center gap-3 w-full rounded-2xl px-5 py-4 shadow-sm bg-gradient-to-r from-[#b3596a] to-[#a24d5e] text-white hover:from-[#a24d5e] hover:to-[#8f4152] transition-colors"
          >
            <ShoppingBag className="w-6 h-6 shrink-0" strokeWidth={1.75} />
            <span className="flex-1 text-center">
              <span className="block text-base font-black tracking-wide">ПЕРЕЙТИ В КАТАЛОГ</span>
              <span className="block text-[11px] font-medium text-white/80">Всі моделі та ціни</span>
            </span>
            <Send className="w-5 h-5 shrink-0" strokeWidth={1.75} />
          </Link>

          <a
            href={`tel:${PHONE}`}
            data-track-event="phone_click"
            className="flex items-center gap-3 w-full rounded-2xl px-5 py-4 shadow-sm bg-gradient-to-r from-[#c3ab9c] to-[#b39a8a] text-white hover:from-[#b39a8a] hover:to-[#a3897a] transition-colors"
          >
            <Phone className="w-6 h-6 shrink-0" strokeWidth={1.75} />
            <span className="flex-1 text-center">
              <span className="block text-base font-black tracking-wide">НАПИСАТИ МЕНЕДЖЕРУ</span>
              <span className="block text-[12px] font-semibold text-white/90">{PHONE_DISPLAY}</span>
            </span>
          </a>
        </section>

        {/* Smaller links */}
        <section className="mt-4 grid grid-cols-2 gap-2.5" aria-label="Інші посилання">
          {SMALL_LINKS.map((l) => {
            const base =
              'flex items-center gap-2.5 rounded-2xl bg-white ring-1 ring-black/5 px-4 py-3 text-sm font-semibold text-[#4a423c] hover:bg-[#faf5f0] transition-colors'
            const inner = (
              <>
                <l.Icon className="w-4 h-4 shrink-0 text-[#a9707a]" strokeWidth={1.75} />
                <span>{l.label}</span>
              </>
            )
            return l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                data-track-event={l.track}
                className={base}
              >
                {inner}
              </a>
            ) : l.href.startsWith('tel:') ? (
              <a key={l.label} href={l.href} data-track-event={l.track} className={base}>
                {inner}
              </a>
            ) : (
              <Link key={l.label} href={l.href} className={base}>
                {inner}
              </Link>
            )
          })}
        </section>

        {/* Contact block */}
        <section className="mt-4 rounded-2xl bg-white/70 ring-1 ring-black/5 p-4 text-[13px]">
          <ul className="space-y-2">
            <li className="flex items-center justify-between gap-3">
              <span className="text-[#8a7f77]">Доставка</span>
              <span className="font-medium text-[#4a423c]">Нова пошта · Укрпошта</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-[#8a7f77]">Графік</span>
              <span className="font-medium text-[#4a423c]">онлайн 24/7</span>
            </li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col items-center gap-1 text-center">
          <p className="flex items-center gap-1.5 text-[13px] text-[#6f645d]">
            <Heart className="w-3.5 h-3.5 text-[#c98a94]" fill="currentColor" />
            Дякуємо, що обираєте нас!
          </p>
          <p className="text-[12px] font-semibold text-[#a9707a]">{HANDLE}</p>
          <Link
            href="/"
            className="mt-2 text-[10px] tracking-[0.3em] uppercase text-[#b3a89f] hover:text-[#6f645d] transition-colors"
          >
            jl-bags · на сайт
          </Link>
        </footer>
      </div>
    </main>
  )
}
