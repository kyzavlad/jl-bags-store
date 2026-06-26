import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Package, Truck, ShieldCheck, Headphones, Sparkles,
  ArrowRight, Phone, Camera, Handshake, Factory,
  MapPin, Clock,
} from 'lucide-react'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, SITE_URL, SAME_AS, OG_IMAGE } from '@/lib/seo'
import { fetchActiveCategories, FALLBACK_CATEGORIES, iconForCategory } from '@/lib/categories'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { ProductCard } from '@/components/storefront/product-card'
import { HeroSlider } from '@/components/storefront/hero-slider'
import { ReviewsCarousel } from '@/components/storefront/reviews-carousel'
import { FaqAccordion } from '@/components/storefront/faq-accordion'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  // `absolute` so the root template doesn't append a second "| JL Bags".
  title: { absolute: 'JL Bags — жіночі сумки від виробника з доставкою по Україні' },
  description:
    'JL Bags — жіночі сумки від українського виробника з Харкова: сумочки для телефону, замшеві та еко-шкіряні сумки, шопери, рюкзаки, аксесуари. Доставка Новою Поштою та Укрпоштою по всій Україні.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'JL Bags — жіночі сумки від виробника',
    description:
      'Жіночі сумки від виробника з Харкова: сумочки для телефону, замшеві та еко-шкіряні моделі, шопери, рюкзаки. Доставка по всій Україні.',
    url: SITE_URL,
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1339, height: 1339, alt: 'JL Bags — жіночі сумки' }],
  },
}

const WHY_US = [
  { Icon: Sparkles,    title: 'Преміум якість',  text: 'Натуральні матеріали та бездоганне виконання' },
  { Icon: Truck,       title: 'Швидка доставка', text: 'Відправка протягом 1–2 робочих днів' },
  { Icon: ShieldCheck, title: 'Гарантія',        text: 'Обмін та повернення протягом 14 днів' },
  { Icon: Headphones,  title: 'Підтримка 24/7',  text: 'Завжди готові відповісти на ваші питання' },
]

const ABOUT_FEATURES: { Icon: typeof Factory; label: string; text: string }[] = [
  { Icon: Factory,     label: 'Власне виробництво', text: 'Ми самі виробляємо моделі JL Bags, тому контролюємо якість на кожному етапі.' },
  { Icon: ShieldCheck, label: 'Контроль якості',    text: 'Працюємо лише з практичними та перевіреними матеріалами, які добре носяться.' },
  { Icon: Package,     label: 'Стабільна наявність', text: 'Тримаємо складські залишки, щоб партнери не втрачали продажі через відсутність товару.' },
  { Icon: Camera,      label: 'Контент для продажів', text: 'Надаємо фото та відео моделей для каталогу, сторіс, реклами та маркетплейсів.' },
  { Icon: Truck,       label: 'Швидкі відправки',   text: 'Оперативно пакуємо та відправляємо замовлення по Україні щодня.' },
  { Icon: Handshake,   label: 'Опт і дропшипінг',   text: 'Працюємо з бізнесами різного масштабу від малих сторінок до великих магазинів.' },
]

const STATS = [
  { value: '100+',   label: 'Актуальних моделей' },
  { value: '1 день', label: 'Відправка замовлень' },
  { value: 'B2B',    label: 'Партнерство для бізнесу' },
  { value: '100%',   label: 'Контроль якості' },
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
        'Жіночі сумки від українського виробника з Харкова: сумочки для телефону, замшеві та еко-шкіряні моделі, шопери, рюкзаки, аксесуари. Доставка по всій Україні.',
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
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      ],
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

export default async function HomePage() {
  const [featured, dbCategories] = await Promise.all([fetchFeatured(), fetchActiveCategories()])

  const usingDbCats = dbCategories.length > 0
  const popularCategories = (
    usingDbCats ? dbCategories.map((c) => ({ name: c.name, slug: c.slug })) : FALLBACK_CATEGORIES
  ).slice(0, 12)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <SiteHeader />

      <main>
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <HeroSlider />

        {/* ── POPULAR CATEGORIES ────────────────────────────────────────────── */}
        <section className="bg-neutral-50 py-20" id="catalog">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl sm:text-5xl font-black text-center text-neutral-900 mb-14">
              Популярні категорії
            </h2>
            {/* Flex-wrap + justify-center keeps the final row centered, so 7
                categories never leave a lonely card stranded on the left. */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {popularCategories.map((c, i) => {
                const Icon = iconForCategory(c.name)
                const href = usingDbCats ? `/catalog/${c.slug}` : '/catalog'
                return (
                  <Link
                    key={`${c.slug}-${i}`}
                    href={href}
                    className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 aspect-square basis-[calc(50%_-_0.5rem)] sm:basis-[calc(33.333%_-_1rem)] lg:basis-[calc(25%_-_1.125rem)] max-w-[260px] hover:border-black hover:shadow-sm transition-all"
                  >
                    <Icon className="w-9 h-9 text-neutral-900" strokeWidth={1.5} />
                    <span className="text-xs sm:text-sm font-semibold text-center text-neutral-800">
                      {c.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── NEW ARRIVALS / HITS (from DB) ─────────────────────────────────── */}
        <section className="bg-neutral-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between gap-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900">
                Нові надходження та хіти
              </h2>
              <Link
                href="/catalog"
                className="shrink-0 inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-black hover:text-white hover:border-black transition-colors"
              >
                Дивитись все <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {featured.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-200 bg-white py-24 text-center">
                <p className="text-neutral-400">Товари скоро з&apos;являться</p>
              </div>
            )}
          </div>
        </section>

        {/* ── WHY CHOOSE US (dark) ──────────────────────────────────────────── */}
        <section className="bg-neutral-950 text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-14">Чому обирають нас</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {WHY_US.map((w) => (
                <div key={w.title} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-white/20 flex items-center justify-center">
                    <w.Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{w.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
        <section className="bg-neutral-50 py-20" id="about">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Прямий український виробник
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-5">Про нас</h2>
              <p className="text-neutral-600 leading-relaxed">
                JL Bags — це виробник сумок та рюкзаків. Власне виробництво, контроль якості,
                стабільна наявність та швидкі відправки по Україні.
              </p>
            </div>

            {/* Image + feature cards */}
            <div className="grid lg:grid-cols-[1fr_minmax(280px,340px)_1fr] gap-6 items-start mb-14">
              {/* left features */}
              <div className="flex flex-col gap-4 order-2 lg:order-1">
                {ABOUT_FEATURES.slice(0, 3).map((f) => (
                  <div key={f.label} className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-4">
                    <f.Icon className="w-5 h-5 shrink-0 mt-0.5 text-neutral-700" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{f.label}</p>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* center image */}
              <div
                role="img"
                aria-label="Власне виробництво Julia Lebedeva Collection"
                className="order-1 lg:order-2 relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200 bg-cover bg-center"
                style={{ backgroundImage: "url('/about.jpg')" }}
              />

              {/* right features */}
              <div className="flex flex-col gap-4 order-3">
                {ABOUT_FEATURES.slice(3, 6).map((f) => (
                  <div key={f.label} className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-4">
                    <f.Icon className="w-5 h-5 shrink-0 mt-0.5 text-neutral-700" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{f.label}</p>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
                  <p className="text-2xl sm:text-3xl font-black text-neutral-900">{s.value}</p>
                  <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-neutral-800 transition-colors"
              >
                Дивитись каталог <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-7 py-3.5 text-sm font-medium text-neutral-800 hover:border-black transition-colors"
              >
                Опт і дропшипінг
              </Link>
            </div>
          </div>
        </section>

        {/* ── REVIEWS ───────────────────────────────────────────────────────── */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">Відгуки клієнтів</h2>
              <p className="text-neutral-500">Реальні відгуки наших клієнтів</p>
            </div>
            <ReviewsCarousel />
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section className="bg-neutral-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">Часті запитання</h2>
              <p className="text-neutral-500">Коротко зібрали основні відповіді перед замовленням</p>
            </div>
            <FaqAccordion />
          </div>
        </section>

        {/* ── WHOLESALE CTA ─────────────────────────────────────────────────── */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-3xl bg-neutral-950 text-white px-8 sm:px-16 py-16 text-center">
              <h2 className="text-2xl sm:text-4xl font-black mb-4">Оптові продажі та дропшипінг</h2>
              <p className="text-neutral-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                Вигідні умови співпраці для оптовиків та дропшиперів.
                Персональний підхід до кожного партнера.
              </p>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors"
              >
                Дізнатись більше <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-8 text-sm text-neutral-400">
                <a href={`tel:${BRAND.phone}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" /> {BRAND.phoneDisplay}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ── LOCAL INFO / TRUST (Google Business Profile support) ───────────── */}
        <section className="bg-neutral-50 border-t border-neutral-200 py-12" aria-label="Інформація про магазин">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
              <div className="flex items-start gap-3 justify-center sm:justify-start">
                <MapPin className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-bold text-neutral-900">JL Bags</p>
                  <p className="text-sm text-neutral-500 mt-0.5">{BRAND.city} · {BRAND.serviceArea}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 justify-center sm:justify-start">
                <Truck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-bold text-neutral-900">Доставка</p>
                  <p className="text-sm text-neutral-500 mt-0.5">{BRAND.delivery.join(' · ')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 justify-center sm:justify-start">
                <Clock className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-bold text-neutral-900">Графік</p>
                  <p className="text-sm text-neutral-500 mt-0.5">Замовлення онлайн 24/7</p>
                </div>
              </div>
              <div className="flex items-start gap-3 justify-center sm:justify-start">
                <Phone className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-bold text-neutral-900">Телефон</p>
                  <a href={`tel:${BRAND.phone}`} className="text-sm text-neutral-500 mt-0.5 hover:text-black transition-colors">
                    {BRAND.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
