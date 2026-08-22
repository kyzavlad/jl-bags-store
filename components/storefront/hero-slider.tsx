import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  MessageCircle,
  PackageCheck,
  Sparkles,
} from 'lucide-react'

const PROOFS = [
  'Власне виробництво у Харкові',
  'Реальні фото товару',
  'Відправка 1–2 робочі дні',
  'Обмін протягом 14 днів',
]

/**
 * Editorial, buyer-first hero. Kept under the historical HeroSlider export so
 * the homepage contract remains stable while the visual system can evolve.
 */
export function HeroSlider() {
  return (
    <section className="overflow-hidden bg-[#f3eee6] text-[#171513]">
      <div className="mx-auto grid min-h-[760px] max-w-[1440px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 flex flex-col justify-between px-6 pb-10 pt-14 sm:px-10 sm:pb-14 sm:pt-20 lg:px-14 lg:pb-16 lg:pt-24 xl:px-20">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] backdrop-blur-sm sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />
              JL Bags · сумки для реального дня
            </div>

            <h1 className="max-w-[720px] text-[clamp(3.35rem,7vw,7.7rem)] font-black leading-[0.82] tracking-[-0.065em]">
              Виглядає
              <span className="block font-serif font-normal italic tracking-[-0.045em]">легко.</span>
              Вміщує
              <span className="block">ваш день.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-black/62 sm:text-lg sm:leading-8">
              Для міста, роботи й поїздок. Обирайте не просто за формою, а за тим,
              що носите щодня: потрібний формат, зручні відділення, актуальний вигляд
              і ціна від виробника.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalog"
                className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-[#171513] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black"
              >
                Знайти свою сумку
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#scenario"
                className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-black/15 bg-white/45 px-7 py-4 text-sm font-semibold text-[#171513] backdrop-blur-sm transition duration-300 hover:bg-white"
              >
                Підібрати за сценарієм
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-black/10 pt-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {PROOFS.map((proof) => (
              <div key={proof} className="flex items-start gap-2 text-xs leading-5 text-black/62">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black" strokeWidth={2} />
                <span>{proof}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[640px] overflow-hidden border-t border-black/10 lg:min-h-full lg:border-l lg:border-t-0">
          <div className="absolute inset-0 bg-[#d7cbbc]" />

          <div className="absolute inset-0 grid grid-cols-2 grid-rows-[58%_42%] gap-2 p-2 sm:gap-3 sm:p-3">
            <div className="group relative col-span-2 overflow-hidden rounded-[1.7rem] sm:rounded-[2.2rem]">
              <Image
                src="/hero/hero-2.jpg"
                alt="Жіноча сумка JL Bags у повсякденному образі"
                fill
                priority
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.025]"
                sizes="(max-width: 1024px) 100vw, 54vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 max-w-[260px] rounded-2xl border border-white/25 bg-black/25 p-4 text-white backdrop-blur-md sm:bottom-7 sm:left-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">Не навмання</p>
                <p className="mt-2 text-sm font-medium leading-5">
                  Спочатку сценарій і місткість. Потім колір і деталі.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.7rem] sm:rounded-[2.2rem]">
              <Image
                src="/hero/hero-1.jpg"
                alt="Деталі жіночої сумки JL Bags"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.035]"
                sizes="(max-width: 1024px) 50vw, 27vw"
              />
            </div>

            <div className="group relative overflow-hidden rounded-[1.7rem] bg-[#1d1a17] sm:rounded-[2.2rem]">
              <Image
                src="/hero/hero-3.jpg"
                alt="Сумка JL Bags у міському образі"
                fill
                className="object-cover opacity-85 transition-transform duration-1000 group-hover:scale-[1.035]"
                sizes="(max-width: 1024px) 50vw, 27vw"
              />
              <div className="absolute inset-0 bg-black/20" />
              <a
                href="https://ig.me/m/sumki_kharkov"
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="instagram_click"
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-xs font-semibold text-black backdrop-blur transition hover:bg-white sm:bottom-5 sm:left-5 sm:right-5"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Допоможіть підібрати
                </span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-white/88 px-4 py-2.5 text-[11px] font-semibold text-black shadow-lg backdrop-blur sm:right-7 sm:top-7">
            <PackageCheck className="h-4 w-4" strokeWidth={1.8} />
            Реальний товар
          </div>
        </div>
      </div>
    </section>
  )
}
