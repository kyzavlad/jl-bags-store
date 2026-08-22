import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Camera,
  Clock,
  Factory,
  MapPin,
  MessageCircle,
  Package,
  Truck,
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
  title: { absolute: 'JL Bags — жіночі сумки на щодень від українського виробника' },
  description:
    'JL Bags — стильні та місткі жіночі сумки на щодень від українського виробника. Сумочки для телефону, замшеві та еко-шкіряні моделі, шопери й рюкзаки. Доставка Новою Поштою та Укрпоштою по Україні.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'JL Bags — стиль, місткість і чесна ціна від виробника',
    description:
      'Жіночі сумки на щодень: реальні фото, актуальні кольори, швидка відправка по Україні.',
    url: SITE_URL,
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1339, height: 1339, alt: 'JL Bags — жіночі сумки' }],
  },
}

const WHY_US = [
  {
    Icon: Camera,
    title: 'Реальний товар',
    text: 'Показуємо моделі на реальних фото й відео, щоб Ви розуміли розмір, форму та деталі до замовлення.',
  },
  {
    Icon: Package,
    title: 'Зручно щодня',
    text: 'Є формати під місто, роботу, документи, короткі поїздки та щоденні справи.',
  },
  {
    Icon: Factory,
    title: 'Ціна від виробника',
    text: 'Власне виробництво допомагає тримати доступну ціну без зайвого ланцюжка посередників.',
  },
  {
    Icon: Truck,
    title: 'Швидка відправка',
    text: 'Відправляємо Новою Поштою та Укрпоштою по Україні, зазвичай протягом 1–2 робочих днів.',
  },
]

const CATEGORY_UA: Record<string, string> = {
  'phone-bags': 'Сумочки для телефону',
  'suede-bags': 'Замшеві сумки',
  'leather-bags': 'Шкіряні сумки',
  'crossbody-bags': 'Сумки через плече',
  shoppers: 'Шопери',
  backpacks: 'Рюкзаки',
  accessories: 'Аксесуари',
}

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
        'Жіночі сумки на щодень від українського виробника: сумочки для телефону, замшеві та еко-шкіряні моделі, шопери, рюкзаки й аксесуари.',
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
    usingDbCats
      ? dbCategories.map((c) => ({
          name: c.name,
          displayName: CATEGORY_UA[c.slug] ?? c.name,
          slug: c.slug,
        }))
      : FALLBACK_CATEGORIES.map((c) => ({
          ...c,
          displayName: CATEGORY_UA[c.slug] ?? c.name,
        }))
  ).slice(0, 12)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <SiteHeader />

      <main>
        <HeroSlider />

        <section className="bg-neutral-50 py-16 sm:py-20" id="catalog">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                Оберіть формат під свій день
              </p>
              <h2 className="mt-3 text-3xl font-black text-neutral-900 sm:text-5xl">
                З чого почнемо?
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {popularCategories.map((c, i) => {
                const Icon = iconForCategory(c.name)
                const href = usingDbCats ? `/catalog/${c.slug}` : '/catalog'
                return (
                  <Link
                    key={`${c.slug}-${i}`}
                    href={href}
                    className="group flex aspect-square basis-[calc(50%_-_0.5rem)] flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-black hover:shadow-sm sm:basis-[calc(33.333%_-_1rem)] lg:basis-[calc(25%_-_1.125rem)] max-w-[260px]"
                  >
                    <Icon className="h-9 w-9 text-neutral-900" strokeWidth={1.5} />
                    <span className="text-center text-xs font-semibold text-neutral-800 sm:text-sm">
                      {c.displayName}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between gap-4 sm:mb-12">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                  Можна замовити зараз
                </p>
                <h2 className="mt-3 text-3xl font-black text-neutral-900 sm:text-4xl">
                  Нові моделі та хіти
                </h2>
              </div>
              <Link
                href="/catalog"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                Весь каталог <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {featured.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-4">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 py-24 text-center">
                <p className="text-neutral-400">Актуальні моделі вже в каталозі</p>
                <Link
                  href="/catalog"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
                >
                  Перейти в каталог <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="bg-neutral-950 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                Менше сумнівів перед замовленням
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Чому JL Bags</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {WHY_US.map((w) => (
                <article key={w.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15">
                    <w.Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{w.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f4ef] py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                Не хочете обирати навмання?
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl">
                Напишіть, що носите з собою — допоможемо підібрати формат.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                Підкажемо по розміру, відділеннях, кольорах і актуальній наявності без довгого пошуку по каталогу.
              </p>
              <a
                href="https://ig.me/m/sumki_kharkov"
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="instagram_click"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800"
              >
                <MessageCircle className="h-4 w-4" />
                Написати в Instagram
              </a>
            </div>

            <div
              role="img"
              aria-label="Жіноча сумка JL Bags у щоденному образі"
              className="aspect-[4/3] rounded-3xl bg-neutral-200 bg-cover bg-center lg:aspect-square"
              style={{ backgroundImage: "url('/about.jpg')" }}
            />
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-black text-neutral-900 sm:text-4xl">Відгуки клієнтів</h2>
              <p className="mt-3 text-neutral-500">Реальний досвід після отримання замовлення</p>
            </div>
            <ReviewsCarousel />
          </div>
        </section>

        <section className="bg-neutral-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-black text-neutral-900 sm:text-4xl">Перед замовленням</h2>
              <p className="mt-3 text-neutral-500">Коротко про доставку, оплату та обмін</p>
            </div>
            <FaqAccordion />
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-white py-12" aria-label="Інформація про магазин">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">
              <div className="flex items-start justify-center gap-3 sm:justify-start">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neutral-900" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-bold text-neutral-900">JL Bags</p>
                  <p className="mt-0.5 text-sm text-neutral-500">{BRAND.city} · вся Україна</p>
                </div>
              </div>
              <div className="flex items-start justify-center gap-3 sm:justify-start">
                <Factory className="mt-0.5 h-5 w-5 shrink-0 text-neutral-900" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-bold text-neutral-900">Виробництво</p>
                  <p className="mt-0.5 text-sm text-neutral-500">Власні моделі JL Bags</p>
                </div>
              </div>
              <div className="flex items-start justify-center gap-3 sm:justify-start">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-neutral-900" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-bold text-neutral-900">Доставка</p>
                  <p className="mt-0.5 text-sm text-neutral-500">Нова пошта · Укрпошта</p>
                </div>
              </div>
              <div className="flex items-start justify-center gap-3 sm:justify-start">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-neutral-900" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-bold text-neutral-900">Замовлення</p>
                  <p className="mt-0.5 text-sm text-neutral-500">онлайн 24/7</p>
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
