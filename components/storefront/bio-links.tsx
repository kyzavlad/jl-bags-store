import Link from 'next/link'
import {
  ShoppingBag,
  Instagram,
  Facebook,
  Send,
  Phone,
  Heart,
} from 'lucide-react'

const PHONE_TEL = '+380985218707'
const PHONE_DISPLAY = '0985218707'
const HANDLE = '@sumki_kharkov'

const STEPS: { n: number; text: string }[] = [
  { n: 1, text: 'Натисни на три крапки' },
  { n: 2, text: 'Обери «Відкрити в браузері»' },
  { n: 3, text: 'Сторінка відкриється в браузері' },
  { n: 4, text: 'Тепер кнопки працюють' },
]

const SMALL_LINKS: {
  label: string
  href: string
  Icon: typeof Instagram
  external?: boolean
  track?: string
}[] = [
  { label: 'Instagram', href: 'https://instagram.com/sumki_kharkov', Icon: Instagram, external: true, track: 'instagram_click' },
  { label: 'Facebook', href: 'https://www.facebook.com/sumki.kharkov.julia/', Icon: Facebook, external: true, track: 'facebook_click' },
  { label: 'Telegram', href: 'https://t.me/joinchat/VGzA____Ogov8wZ_', Icon: Send, external: true, track: 'telegram_click' },
  { label: 'Подзвонити', href: `tel:${PHONE_TEL}`, Icon: Phone, track: 'phone_click' },
]

/** Shared link-in-bio body used by /sumki_kharkov and /links. */
export function BioLinks() {
  return (
    <main className="min-h-screen bg-[#f7efe7] text-[#3f3733]">
      <div className="mx-auto w-full max-w-md px-5 py-9">

        {/* Brand — real site logo (plain <img> to match the site without the
            image optimizer, which fails on the deploy host) */}
        <header className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="sumki_kharkov JL"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#2f2925]">sumki_kharkov</h1>
          <p className="mt-1.5 text-[12px] font-bold uppercase tracking-[0.32em] text-[#a9707a]">
            JL™
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
            href={`tel:${PHONE_TEL}`}
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
            ) : (
              <a key={l.label} href={l.href} data-track-event={l.track} className={base}>
                {inner}
              </a>
            )
          })}
        </section>

        {/* Contact block */}
        <section className="mt-4 rounded-2xl bg-white/70 ring-1 ring-black/5 p-4 text-[13px]">
          <ul className="space-y-2">
            <li className="flex items-center justify-between gap-3">
              <span className="text-[#8a7f77]">Телефон</span>
              <a href={`tel:${PHONE_TEL}`} data-track-event="phone_click" className="font-semibold text-[#4a423c] hover:underline">
                {PHONE_DISPLAY}
              </a>
            </li>
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
        </footer>
      </div>
    </main>
  )
}
