import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingBag,
  FileText,
  Instagram,
  Facebook,
  Send,
  MessageCircle,
  Phone,
  Truck,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PHONE = '+380964249565'
const PHONE_DISPLAY = '+38 096 424 95 65'

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

type LinkButton = {
  label: string
  href: string
  Icon: typeof ShoppingBag
  external?: boolean
  track?: string
  variant?: 'primary' | 'default'
}

const BUTTONS: LinkButton[] = [
  { label: 'Перейти в каталог', href: '/catalog', Icon: ShoppingBag, variant: 'primary' },
  { label: 'Прайс-лист', href: '/pricelist?key=jlprice2026', Icon: FileText },
  { label: 'Instagram', href: 'https://instagram.com/sumki_kharkov', Icon: Instagram, external: true, track: 'instagram_click' },
  { label: 'Facebook', href: 'https://facebook.com/', Icon: Facebook, external: true, track: 'facebook_click' },
  { label: 'Telegram', href: 'https://t.me/', Icon: Send, external: true, track: 'telegram_click' },
  { label: 'Написати менеджеру', href: `tel:${PHONE}`, Icon: MessageCircle, track: 'phone_click' },
  { label: 'Подзвонити', href: `tel:${PHONE}`, Icon: Phone, track: 'phone_click' },
]

const CATEGORIES = [
  { label: 'Сумочки для телефону', href: '/catalog/phone-bags' },
  { label: 'Замшеві сумки', href: '/catalog/suede-bags' },
  { label: 'Жіночі шопери', href: '/catalog/shoppers' },
  { label: 'Рюкзаки', href: '/catalog/backpacks' },
]

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-[#f6efe6] text-neutral-900">
      <div className="mx-auto w-full max-w-md px-5 py-10 sm:py-14">

        {/* Brand */}
        <header className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="JL Bags"
              width={96}
              height={96}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="mt-5 text-2xl font-black tracking-tight">JL Bags</h1>
          <p className="mt-2 text-sm font-medium text-neutral-700">
            Жіночі сумки з доставкою по всій Україні
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">
            Сумки для телефону, шопери, рюкзаки, замшеві та шкіряні моделі.
            Замовлення приймаємо онлайн, відправка Новою поштою та Укрпоштою.
          </p>
        </header>

        {/* Link buttons */}
        <nav className="mt-8 flex flex-col gap-3" aria-label="Посилання JL Bags">
          {BUTTONS.map((b) => {
            const cls =
              b.variant === 'primary'
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-white text-neutral-900 hover:bg-neutral-50 ring-1 ring-black/5'
            const inner = (
              <>
                <b.Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
                <span className="flex-1 text-center">{b.label}</span>
                <ChevronRight className="w-4 h-4 shrink-0 opacity-40" />
              </>
            )
            const base =
              `flex items-center gap-3 w-full rounded-full px-5 py-3.5 text-sm font-semibold shadow-sm transition-colors ${cls}`

            return b.external ? (
              <a
                key={b.label}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                data-track-event={b.track}
                className={base}
              >
                {inner}
              </a>
            ) : b.href.startsWith('tel:') ? (
              <a key={b.label} href={b.href} data-track-event={b.track} className={base}>
                {inner}
              </a>
            ) : (
              <Link key={b.label} href={b.href} className={base}>
                {inner}
              </Link>
            )
          })}
        </nav>

        {/* Popular categories */}
        <section className="mt-8" aria-label="Популярні категорії">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 text-center mb-3">
            Популярні категорії
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-2xl bg-white ring-1 ring-black/5 px-4 py-3 text-[13px] font-medium text-center text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Contact block */}
        <section className="mt-8 rounded-2xl bg-white ring-1 ring-black/5 p-5 text-sm">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="text-neutral-500">Телефон:</span>
              <a href={`tel:${PHONE}`} data-track-event="phone_click" className="ml-auto font-semibold text-neutral-900 hover:underline">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="text-neutral-500">Доставка:</span>
              <span className="ml-auto font-medium text-neutral-800">Нова пошта та Укрпошта</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="text-neutral-500">Графік:</span>
              <span className="ml-auto font-medium text-neutral-800">онлайн 24/7</span>
            </li>
          </ul>
        </section>

        <footer className="mt-10 text-center">
          <Link href="/" className="text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-700 transition-colors">
            jl-bags · на сайт
          </Link>
        </footer>
      </div>
    </main>
  )
}
