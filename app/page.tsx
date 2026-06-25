import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Backpack, ShoppingBag, Wallet, GraduationCap, Tag, Package,
  Truck, ShieldCheck, Headphones, Sparkles, Factory, Check,
  ArrowRight, Phone,
} from 'lucide-react'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { ProductCard } from '@/components/storefront/product-card'
import { HeroSlider } from '@/components/storefront/hero-slider'
import { ReviewsCarousel } from '@/components/storefront/reviews-carousel'
import { FaqAccordion } from '@/components/storefront/faq-accordion'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Julia Lebedeva Collection — жіночі сумки з доставкою по Україні',
  description:
    'Julia Lebedeva Collection — преміальні жіночі сумки та рюкзаки власного виробництва. Замшеві та шкіряні сумки, сумочки для телефону, шопери, рюкзаки. Доставка Новою Поштою та Укрпоштою по всій Україні.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Julia Lebedeva Collection — жіночі сумки',
    description:
      'Преміальні жіночі сумки та рюкзаки власного виробництва. Доставка по всій Україні.',
    url: SITE_URL,
    type: 'website',
  },
}

/* ── Popular categories (designed grid, screenshots as source of truth) ─────────
   Each card carries a best-effort `slug`. At render we only link to
   /catalog/<slug> when that category slug is actually active in the DB —
   otherwise the card falls back to the catalog index (never a 404). */
const POPULAR_CATEGORIES: { name: string; slug: string; Icon: typeof Backpack }[] = [
  { name: 'Рюкзак екошкіра',    slug: 'backpacks',      Icon: Backpack },
  { name: 'Рюкзак текстиль',    slug: 'backpacks',      Icon: Backpack },
  { name: 'Шкільний рюкзак',    slug: 'backpacks',      Icon: GraduationCap },
  { name: 'Клатч кросбоді',     slug: 'crossbody-bags', Icon: ShoppingBag },
  { name: 'Сумка екошкіра',     slug: 'leather-bags',   Icon: ShoppingBag },
  { name: 'Сумка стьобана',     slug: 'suede-bags',     Icon: ShoppingBag },
  { name: 'Бананка',            slug: 'crossbody-bags', Icon: Package },
  { name: 'Сумка текстиль',     slug: 'shoppers',       Icon: ShoppingBag },
  { name: 'Розпродаж',          slug: 'sale',           Icon: Tag },
  { name: 'Чоловіча сумка',     slug: 'mens-bags',      Icon: ShoppingBag },
  { name: 'Гаманець жіночий',   slug: 'accessories',    Icon: Wallet },
  { name: 'Гаманець чоловічий', slug: 'accessories',    Icon: Wallet },
]

const WHY_US = [
  { Icon: Sparkles,    title: 'Преміум якість',  text: 'Натуральні матеріали та бездоганне виконання' },
  { Icon: Truck,       title: 'Швидка доставка', text: 'Відправка протягом 1–2 робочих днів' },
  { Icon: ShieldCheck, title: 'Гарантія',        text: 'Обмін та повернення протягом 14 днів' },
  { Icon: Headphones,  title: 'Підтримка 24/7',  text: 'Завжди готові відповісти на ваші питання' },
]

const ABOUT_FEATURES = [
  'Власне виробництво',
  'Контроль якості',
  'Стабільна наявність',
  'Контент для продажів',
  'Швидкі відправки',
  'Опт і дропшипінг',
]

const STATS = [
  { value: '100+',   label: 'Актуальних моделей' },
  { value: '1 день', label: 'Відправка замовлень' },
  { value: 'B2B',    label: 'Партнерство для бізнесу' },
  { value: '100%',   label: 'Контроль якості' },
]

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Julia Lebedeva Collection',
  url: SITE_URL,
  telephone: BRAND.phone,
  priceRange: '₴₴',
  description: 'Преміальні жіночі сумки та рюкзаки власного виробництва. Доставка по всій Україні.',
  areaServed: { '@type': 'Country', name: 'Ukraine' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: BRAND.city,
    addressRegion: BRAND.region,
    addressCountry: 'UA',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '00:00',
      closes: '23:59',
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

async function fetchActiveSlugs(): Promise<Set<string>> {
  try {
    const supabase = getServiceSupabase()
    const { data } = await supabase
      .from('categories')
      .select('slug')
      .eq('is_active', true)
    return new Set((data ?? []).map((c: { slug: string }) => c.slug))
  } catch {
    return new Set()
  }
}

export default async function HomePage() {
  const [featured, activeSlugs] = await Promise.all([fetchFeatured(), fetchActiveSlugs()])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <SiteHeader />

      <main>
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <HeroSlider />

        {/* ── POPULAR CATEGORIES ────────────────────────────────────────────── */}
        <section className="bg-white py-20" id="catalog">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-center text-neutral-900 mb-14">
              Популярні категорії
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {POPULAR_CATEGORIES.map((c, i) => {
                const href = activeSlugs.has(c.slug) ? `/catalog/${c.slug}` : '/catalog'
                return (
                  <Link
                    key={`${c.name}-${i}`}
                    href={href}
                    className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 aspect-square hover:border-black transition-colors"
                  >
                    <c.Icon className="w-9 h-9 text-neutral-900" strokeWidth={1.5} />
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
            <div className="grid lg:grid-cols-[1fr_minmax(280px,360px)_1fr] gap-6 items-center mb-14">
              {/* left features */}
              <div className="flex flex-col gap-4 order-2 lg:order-1">
                {ABOUT_FEATURES.slice(0, 3).map((f) => (
                  <div key={f} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-4">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-black text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium text-neutral-800">{f}</span>
                  </div>
                ))}
              </div>

              {/* center image — CSS background so a missing placeholder degrades cleanly.
                  Drop a real portrait photo at /public/about.jpg */}
              <div
                role="img"
                aria-label="Власне виробництво Julia Lebedeva Collection"
                className="order-1 lg:order-2 relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200 bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/about.jpg')" }}
              >
                <Factory className="w-12 h-12 text-neutral-400" strokeWidth={1} />
              </div>

              {/* right features */}
              <div className="flex flex-col gap-4 order-3">
                {ABOUT_FEATURES.slice(3, 6).map((f) => (
                  <div key={f} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-4">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-black text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium text-neutral-800">{f}</span>
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
      </main>

      <SiteFooter />
    </>
  )
}
