import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  Check,
  Factory,
  MapPin,
  MessageCircle,
  PackageCheck,
  Plane,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Truck,
} from 'lucide-react'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, SITE_URL, SAME_AS, OG_IMAGE } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { ProductCard } from '@/components/storefront/product-card'
import { ReviewsCarousel } from '@/components/storefront/reviews-carousel'
import { FaqAccordion } from '@/components/storefront/faq-accordion'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'JL Bags — жіночі сумки для міста, роботи й поїздок' },
  description:
    'JL Bags — сумки для реального дня: місткі моделі, зручні формати, актуальні кольори та ціна від українського виробника. Реальні фото, доставка по Україні.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'JL Bags — виглядає легко, вміщує ваш день',
    description:
      'Сумки для міста, роботи й поїздок: реальний товар, зручні формати та ціна від виробника.',
    url: SITE_URL,
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1339, height: 1339, alt: 'JL Bags — жіночі сумки' }],
  },
}

const MARKET_VOICE = [
  'Легка й містка',
  'Зручний розмір',
  'Усе має своє місце',
  'Відповідає фото',
  'Виглядає акуратно',
]

const SCENARIOS = [
  {
    Icon: BriefcaseBusiness,
    number: '01',
    title: 'На роботу й документи',
    text: 'Коли потрібні місткість, порядок усередині й акуратний силует на щодень.',
    href: '/catalog/shoppers',
    cta: 'Дивитися місткі формати',
  },
  {
    Icon: ShoppingBag,
    number: '02',
    title: 'Місто й справи',
    text: 'Телефон, гаманець, ключі, косметика та інші дрібниці без відчуття громіздкої сумки.',
    href: '/catalog/crossbody-bags',
    cta: 'Дивитися сумки через плече',
  },
  {
    Icon: Smartphone,
    number: '03',
    title: 'Лише необхідне',
    text: 'Компактний формат для прогулянки, подорожі або дня, коли хочеться бути без зайвого.',
    href: '/catalog/phone-bags',
    cta: 'Дивитися компактні',
  },
  {
    Icon: Plane,
    number: '04',
    title: 'Поїздки й довгі дні',
    text: 'Коли речей більше, але все одно хочеться зручного формату та вільних рук.',
    href: '/catalog/backpacks',
    cta: 'Дивитися для поїздок',
  },
]

const CERTAINTY = [
  {
    Icon: Camera,
    label: 'Побачити',
    title: 'Не купувати “по картинці”',
    text: 'Використовуємо реальні фото товару, щоб форма, колір і деталі були зрозумілі до замовлення.',
  },
  {
    Icon: ShoppingBag,
    label: 'Зрозуміти',
    title: 'Чи підійде під ваш день',
    text: 'Обирайте від сценарію: компактно, містко, через плече, для документів або поїздок.',
  },
  {
    Icon: PackageCheck,
    label: 'Не ризикувати',
    title: 'Спокійно замовити онлайн',
    text: 'Швидка відправка по Україні та можливість обміну протягом 14 днів.',
  },
]

const TRUST = [
  { Icon: Factory, title: 'Власне виробництво', text: 'Харків, Україна' },
  { Icon: Truck, title: 'Швидка відправка', text: 'Зазвичай 1–2 робочі дні' },
  { Icon: ShieldCheck, title: 'Обмін', text: 'Протягом 14 днів' },
  { Icon: MapPin, title: 'По всій Україні', text: 'Нова Пошта та Укрпошта' },
]

const HOMEPAGE_MEDIA_FALLBACK = [
  'https://jupgxgcnuafzyxmsoaeq.supabase.co/storage/v1/object/public/product-photos/products/1782466182321-rbdccq.jpg',
  'https://jupgxgcnuafzyxmsoaeq.supabase.co/storage/v1/object/public/product-photos/products/1782466401846-2plkae.jpg',
  'https://jupgxgcnuafzyxmsoaeq.supabase.co/storage/v1/object/public/product-photos/products/1782466710469-7ybuzh.jpg',
  'https://jupgxgcnuafzyxmsoaeq.supabase.co/storage/v1/object/public/product-photos/products/1782466303277-jtlzz8.jpg',
]

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Store',
      '@id': `${SITE_URL}/#store`,
      name: BRAND.name,
      alternateName: BRAND.collection,
      image: `${SITE_URL}/logo.png`,
      logo: `${SITE_URL}/logo.png`,
      url: SITE_URL,
      telephone: BRAND.phone,
      priceRange: '₴₴',
      description:
        'Жіночі сумки для міста, роботи й поїздок від українського виробника JL Bags.',
      areaServed: { '@type': 'Country', name: 'Ukraine' },
      address: {
        '@type': 'PostalAddress',
        addressLocality: BRAND.city,
        addressRegion: BRAND.region,
        addressCountry: 'UA',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: BRAND.phone,
        contactType: 'customer service',
        areaServed: 'UA',
        availableLanguage: ['uk', 'ru'],
      },
      sameAs: SAME_AS,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND.name,
      inLanguage: 'uk-UA',
      publisher: { '@id': `${SITE_URL}/#store` },
    },
  ],
}

async function fetchFeatured(): Promise<Product[]> {
  try {
    const supabase = getServiceSupabase()
    const { data } = await supabase
      .from('products')
      .select('*, product_photos(*)')
      .eq('is_active', true)
      .eq('stock_status', 'in_stock')
      .order('created_at', { ascending: false })
      .limit(40)

    return ((data ?? []) as Product[])
      .filter((p) => (p.product_photos ?? []).length > 0)
      .slice(0, 8)
  } catch {
    return []
  }
}

function collectHomepageMedia(products: Product[]): string[] {
  const sortedPhotos = products.map((product) =>
    [...(product.product_photos ?? [])].sort(
      (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
    ),
  )

  const primaryPhotos = sortedPhotos.map((photos) => photos[0]?.url).filter(Boolean) as string[]
  const detailPhotos = sortedPhotos.flatMap((photos) => photos.slice(1).map((photo) => photo.url)).filter(Boolean)

  return Array.from(new Set([...primaryPhotos, ...detailPhotos, ...HOMEPAGE_MEDIA_FALLBACK])).slice(0, 8)
}

function HomeHero({ imageSrc }: { imageSrc: string }) {
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
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-black/10 pt-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {[
              'Власне виробництво у Харкові',
              'Реальні фото товару',
              'Відправка 1–2 робочі дні',
              'Обмін протягом 14 днів',
            ].map((proof) => (
              <div key={proof} className="flex items-start gap-2 text-xs leading-5 text-black/62">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black" strokeWidth={2} />
                <span>{proof}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[560px] overflow-hidden border-t border-black/10 bg-[#d7cbbc] p-3 sm:min-h-[640px] sm:p-4 lg:min-h-full lg:border-l lg:border-t-0">
          <div className="group relative h-full min-h-[536px] overflow-hidden rounded-[2rem] sm:min-h-[608px] sm:rounded-[2.4rem] lg:min-h-[730px]">
            <Image
              src={imageSrc}
              alt="Реальна жіноча сумка JL Bags"
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/5 to-transparent" />

            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-white/90 px-4 py-2.5 text-[11px] font-semibold text-black shadow-lg backdrop-blur sm:left-7 sm:top-7">
              <PackageCheck className="h-4 w-4" strokeWidth={1.8} />
              Реальний товар
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 sm:bottom-7 sm:left-7 sm:right-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-sm rounded-2xl border border-white/20 bg-black/32 p-4 text-white backdrop-blur-md sm:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">Не навмання</p>
                <p className="mt-2 text-sm font-medium leading-5 sm:text-base sm:leading-6">
                  Спочатку сценарій і місткість. Потім колір і деталі.
                </p>
              </div>

              <a
                href="https://ig.me/m/sumki_kharkov"
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="instagram_click"
                className="inline-flex shrink-0 items-center justify-between gap-3 rounded-full border border-white/20 bg-white/92 px-5 py-3.5 text-xs font-semibold text-black backdrop-blur transition hover:bg-white"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Допоможіть підібрати
                </span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function HomePage() {
  const featured = await fetchFeatured()
  const homepageMedia = collectHomepageMedia(featured)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <SiteHeader />

      <main className="bg-[#fbfaf7] text-[#171513]">
        <HomeHero imageSrc={homepageMedia[0]} />

        <section className="border-y border-black/10 bg-[#171513] text-white" aria-label="Що важливо у щоденній сумці">
          <div className="mx-auto max-w-[1440px] px-6 py-5 sm:px-10 lg:px-12">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Що реально важливо у щоденній сумці
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-8">
                {MARKET_VOICE.map((item) => (
                  <span key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="h-3.5 w-3.5 text-[#d8c7ad]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="scenario" className="scroll-mt-32 bg-[#fbfaf7] py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div className="lg:sticky lg:top-36 lg:self-start">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-black/40">
                  Почніть не з категорії
                </p>
                <h2 className="mt-4 max-w-lg text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl">
                  Який у вас сьогодні день?
                </h2>
                <p className="mt-6 max-w-md text-sm leading-7 text-black/55 sm:text-base">
                  Люди рідко шукають просто “сумку”. Вони шукають формат, який не заважає жити:
                  поміщає потрібне, пасує до образу й не змушує перекладати речі по десять разів.
                </p>
                <Link
                  href="/catalog"
                  className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold underline decoration-black/25 underline-offset-4 transition hover:decoration-black"
                >
                  Відкрити весь каталог
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {SCENARIOS.map(({ Icon, number, title, text, href, cta }) => (
                  <Link
                    key={number}
                    href={href}
                    className="group flex min-h-[310px] flex-col justify-between rounded-[2rem] border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_22px_70px_rgba(28,22,17,0.08)] sm:p-8"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[11px] font-semibold tracking-[0.22em] text-black/30">{number}</span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3eee6] transition group-hover:bg-[#171513] group-hover:text-white">
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                    </div>
                    <div className="mt-12">
                      <h3 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">{title}</h3>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-black/55">{text}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-black/70">
                        {cta}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#efe8de] py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
            <div className="grid items-end gap-8 border-b border-black/10 pb-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-black/40">
                  Не лише красиво на фото
                </p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl">
                  Спочатку впевненість. Потім замовлення.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-black/55">
                Головне питання онлайн-покупки не “подобається чи ні”, а “чи буде вона такою ж зручною в житті?”.
                Тому шлях до покупки будуємо навколо реального товару, сценарію використання й зрозумілих умов.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {CERTAINTY.map(({ Icon, label, title, text }, index) => (
                <article
                  key={title}
                  className={`relative overflow-hidden rounded-[2rem] border border-black/10 p-7 sm:p-8 ${
                    index === 1 ? 'bg-[#171513] text-white' : 'bg-[#fbfaf7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${index === 1 ? 'text-white/40' : 'text-black/35'}`}>
                      {label}
                    </span>
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-16 max-w-xs text-2xl font-black leading-tight tracking-[-0.03em]">{title}</h3>
                  <p className={`mt-4 max-w-sm text-sm leading-6 ${index === 1 ? 'text-white/58' : 'text-black/52'}`}>
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fbfaf7] py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
            <div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-black/40">
                  Можна замовити зараз
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                  Нові моделі та хіти
                </h2>
              </div>
              <Link
                href="/catalog"
                className="group inline-flex w-fit items-center gap-3 rounded-full border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
              >
                Увесь каталог
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {featured.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid overflow-hidden rounded-[2.2rem] border border-black/10 bg-white lg:grid-cols-[1fr_1fr]">
                <div className="relative min-h-[360px] lg:min-h-[480px]">
                  <Image
                    src={homepageMedia[1]}
                    alt="Сумки JL Bags"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
                    Увесь асортимент
                  </p>
                  <h3 className="mt-4 max-w-md text-3xl font-black leading-tight tracking-[-0.035em] sm:text-4xl">
                    Обирайте за тим, що має поміститися у ваш день.
                  </h3>
                  <p className="mt-5 max-w-md text-sm leading-7 text-black/55">
                    Від компактних сумочок до містких форматів для роботи й поїздок. У каталозі зібрані актуальні категорії та моделі.
                  </p>
                  <Link
                    href="/catalog"
                    className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white"
                  >
                    Перейти в каталог
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="overflow-hidden bg-[#171513] py-20 text-white sm:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/40">
                Ціна без зайвого ланцюжка
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.94] tracking-[-0.045em] sm:text-6xl">
                Від виробництва до вашого образу.
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
                JL Bags виробляє сумки у Харкові. Це дозволяє будувати пропозицію не навколо гучного “преміум”,
                а навколо того, що відчувається щодня: зручного формату, акуратного вигляду та зрозумілої ціни.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {TRUST.map(({ Icon, title, text }) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <Icon className="h-4 w-4 text-[#dac8ad]" strokeWidth={1.6} />
                    <p className="mt-4 text-xs font-semibold">{title}</p>
                    <p className="mt-1 text-[11px] leading-4 text-white/40">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[500px] overflow-hidden rounded-[2.5rem] border border-white/10 sm:min-h-[620px]">
              <Image
                src={homepageMedia[2]}
                alt="Сумка JL Bags у повсякденному використанні"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/15 bg-black/25 p-5 backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-sm sm:p-6">
                <Sparkles className="h-5 w-5 text-[#e4d5bf]" />
                <p className="mt-4 text-lg font-semibold leading-6">
                  Не обирайте між “гарна” і “зручна”. Шукайте ту, що робить обидва завдання.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fbfaf7] py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
            <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-black/40">
                  Доказ замість обіцянки
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Відгуки клієнтів</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-black/50">
                Перед онлайн-замовленням важливо бачити не рекламну фразу, а досвід людей, які вже отримали товар.
              </p>
            </div>
            <ReviewsCarousel />
          </div>
        </section>

        <section className="bg-[#d8c7ad] px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-[2.3rem] bg-[#fbfaf7] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-20">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-black/35">
                Важко вибрати з каталогу?
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl">
                Напишіть 3 речі, які носите щодня.
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-7 text-black/55 sm:text-base">
                Підкажемо, який формат подивитися: компактний, місткий, для документів, через плече або для поїздок.
              </p>
              <a
                href="https://ig.me/m/sumki_kharkov"
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="instagram_click"
                className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-black px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Підібрати в Instagram
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            <div className="relative min-h-[420px] lg:min-h-[620px]">
              <Image
                src={homepageMedia[3]}
                alt="Жіноча сумка JL Bags"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 52vw"
              />
            </div>
          </div>
        </section>

        <section className="bg-[#fbfaf7] py-20 sm:py-28">
          <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
            <div className="mb-10 text-center sm:mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-black/35">
                Перед замовленням
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Відповіді без дрібного шрифту
              </h2>
            </div>
            <FaqAccordion />
          </div>
        </section>

        <section className="border-t border-black/10 bg-[#efe8de] py-10" aria-label="Інформація про магазин">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-3 px-6 sm:px-10 lg:grid-cols-4 lg:px-12">
            {TRUST.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white/65 p-5">
                <Icon className="h-4 w-4" strokeWidth={1.6} />
                <p className="mt-4 text-sm font-bold">{title}</p>
                <p className="mt-1 text-xs leading-5 text-black/45">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
