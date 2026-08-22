import Link from 'next/link'
import {
  ArrowRight,
  Camera,
  Factory,
  MessageCircle,
  Package,
  Truck,
} from 'lucide-react'

const PROOFS = [
  { Icon: Factory, label: 'Власне виробництво' },
  { Icon: Camera, label: 'Реальні фото товару' },
  { Icon: Truck, label: 'Швидка відправка' },
  { Icon: Package, label: 'Обмін протягом 14 днів' },
]

const BUYING_REASONS = [
  {
    eyebrow: 'ВИГЛЯД',
    title: 'Акуратно й сучасно',
    text: 'Моделі та кольори, які легко вписати у щоденний образ без зайвої складності.',
  },
  {
    eyebrow: 'ЗРУЧНІСТЬ',
    title: 'Під Ваш реальний день',
    text: 'Компактні, місткі, для документів, міста або поїздок — обирайте формат під свій сценарій.',
  },
  {
    eyebrow: 'ЦІННІСТЬ',
    title: 'Чесна ціна від виробника',
    text: 'Власне виробництво допомагає тримати доступну ціну без зайвого ланцюжка посередників.',
  },
]

/**
 * Conversion-first hero kept under the historical HeroSlider export so the
 * homepage contract stays stable. The old scroll-heavy carousel led with
 * generic category language; this version leads with the buyer outcome and
 * gives one obvious purchase path plus a low-friction assisted path.
 */
export function HeroSlider() {
  return (
    <>
      <section className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-neutral-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/about.jpg')" }}
        />
        <div aria-hidden className="absolute inset-0 bg-black/55" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/20"
        />

        <div className="relative mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-7xl flex-col justify-end px-6 pb-10 pt-24 sm:px-10 sm:pb-14 lg:px-12 lg:pb-16">
          <div className="max-w-3xl">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-white/70 sm:text-xs">
              JL Bags · власне українське виробництво
            </p>

            <h1 className="text-balance text-4xl font-black leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              Сумка на щодень, у якій зійшлися стиль, місткість і чесна ціна.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/78 sm:text-lg">
              Акуратні моделі для роботи, міста й поїздок. Реальні фото, актуальні кольори та швидка відправка по Україні.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalog"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200"
              >
                Обрати свою сумку
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://ig.me/m/sumki_kharkov"
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="instagram_click"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/20 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Допоможіть підібрати
              </a>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-2.5 sm:mt-12 sm:grid-cols-4 sm:gap-3">
            {PROOFS.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 backdrop-blur-md"
              >
                <Icon className="h-4 w-4 shrink-0 text-white/85" strokeWidth={1.6} />
                <span className="text-xs font-medium leading-snug text-white/85">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-[#f7f4ef] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-500">
              Сумка має працювати на Вас
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
              Не обирайте між красивою, зручною та доступною.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
              Ми зібрали колекцію навколо трьох речей, які важливі у щоденному користуванні: як сумка виглядає, як вона організовує Ваші речі та чи виправдовує свою ціну.
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {BUYING_REASONS.map((item) => (
              <article key={item.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
                <p className="text-[10px] font-bold tracking-[0.28em] text-neutral-400">{item.eyebrow}</p>
                <h3 className="mt-3 text-lg font-bold text-neutral-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
