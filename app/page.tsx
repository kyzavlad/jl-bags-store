import type { Metadata } from 'next'
import Link from 'next/link'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, CATEGORY_META, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { ProductCard } from '@/components/storefront/product-card'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Julia Lebedeva Collection — жіночі сумки з доставкою по Україні',
  description:
    'Julia Lebedeva Collection — преміальні жіночі сумки з Харкова. Замшеві та шкіряні сумки, сумочки для телефону, шопери, рюкзаки. Доставка Новою Поштою та Укрпоштою по всій Україні.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Julia Lebedeva Collection — жіночі сумки',
    description:
      'Преміальні жіночі сумки з Харкова. Замшеві та шкіряні сумки, шопери, рюкзаки. Доставка по всій Україні.',
    url: SITE_URL,
    type: 'website',
  },
}

const CATALOG_CATEGORIES = [
  { slug: 'phone-bags',     name: 'Сумочки для телефону' },
  { slug: 'suede-bags',    name: 'Замшеві сумки' },
  { slug: 'leather-bags',  name: 'Шкіряні сумки' },
  { slug: 'crossbody-bags', name: 'Сумки через плече' },
  { slug: 'shoppers',      name: 'Шопери' },
  { slug: 'backpacks',     name: 'Рюкзаки' },
  { slug: 'accessories',   name: 'Аксесуари' },
]

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Julia Lebedeva Collection',
  url: SITE_URL,
  telephone: BRAND.phone,
  priceRange: '₴₴',
  description: 'Преміальні жіночі сумки — замшеві, шкіряні, сумочки для телефону. Доставка по всій Україні.',
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

export default async function HomePage() {
  const featured = await fetchFeatured()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <SiteHeader />

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        {/*
          Background image: place a high-resolution fashion photo at /public/hero.jpg
          and uncomment the style attribute below. Until then uses a deep gradient.
        */}
        <section
          className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-neutral-950"
          /* style={{ backgroundImage: "url('/hero.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} */
        >
          {/* Dark overlay — reduce opacity when a real photo is added */}
          <div className="absolute inset-0 bg-neutral-950/80" />

          {/* Subtle diagonal accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neutral-900/20 to-neutral-800/30 pointer-events-none" />

          {/* 3-column typographic layout */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 py-24">

            {/* Left decorative copy */}
            <div className="hidden sm:flex flex-col items-end gap-5 text-right select-none">
              {['• ПРЕМІУМ', 'ЖІНОЧІ', 'НОВА'].map((t) => (
                <span key={t} className="text-xs sm:text-sm font-light tracking-[0.35em] uppercase text-white/30">
                  {t}
                </span>
              ))}
            </div>

            {/* Center hero text */}
            <div className="text-center">
              <p className="text-[10px] sm:text-xs font-light tracking-[0.5em] uppercase text-white/50 mb-6 sm:mb-8">
                JULIA LEBEDEVA COLLECTION
              </p>

              <h1 className="font-black uppercase leading-none text-white mb-8 sm:mb-10"
                style={{ fontSize: 'clamp(3rem, 12vw, 9rem)', letterSpacing: '-0.02em' }}>
                ЖІНОЧІ<br />СУМКИ
              </h1>

              <Link
                href="/catalog"
                className="inline-block border border-white/60 text-white text-xs sm:text-sm font-medium tracking-[0.3em] uppercase px-8 sm:px-12 py-3.5 hover:bg-white hover:text-black transition-all duration-300"
              >
                ПЕРЕГЛЯНУТИ КОЛЕКЦІЮ
              </Link>
            </div>

            {/* Right decorative copy */}
            <div className="hidden sm:flex flex-col items-start gap-5 select-none">
              {['ЯКІСТЬ •', 'СУМКИ', 'КОЛЕКЦІЯ'].map((t) => (
                <span key={t} className="text-xs sm:text-sm font-light tracking-[0.35em] uppercase text-white/30">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 select-none">
            <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
            <span className="text-lg">↓</span>
          </div>
        </section>

        {/* ── DELIVERY TRUST BAR ───────────────────────────────────────────── */}
        <section id="delivery" className="border-b border-neutral-200 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-neutral-200">
              {[
                { icon: '🚚', title: 'Нова пошта та Укрпошта', sub: 'Доставка по всій Україні' },
                { icon: '⚡', title: `До ${BRAND.orderCutoff} — відправка сьогодні`, sub: 'У день замовлення' },
                { icon: '💳', title: 'Оплата при отриманні', sub: 'Накладений платіж' },
                { icon: '🌙', title: 'Замовлення 24/7', sub: 'Онлайн у будь-який час' },
              ].map((b) => (
                <div key={b.title} className="py-6 px-5 text-center">
                  <p className="text-xl mb-2">{b.icon}</p>
                  <p className="text-xs font-semibold tracking-wide text-neutral-800 uppercase">{b.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATALOG SECTION ──────────────────────────────────────────────── */}
        <section className="bg-white py-20" id="catalog">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-3">Асортимент</p>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
                Каталог
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-200">
              {CATALOG_CATEGORIES.map((c) => {
                const meta = CATEGORY_META[c.slug]
                return (
                  <Link
                    key={c.slug}
                    href={`/catalog/${c.slug}`}
                    className="group bg-white p-8 flex flex-col items-center justify-center text-center gap-3 hover:bg-neutral-950 transition-colors duration-300 min-h-[140px]"
                  >
                    <p className="text-sm font-medium tracking-wider uppercase text-neutral-800 group-hover:text-white transition-colors">
                      {c.name}
                    </p>
                    {meta?.intro && (
                      <p className="text-xs text-neutral-400 line-clamp-2 group-hover:text-neutral-300 transition-colors hidden sm:block">
                        {meta.intro.split('.')[0]}
                      </p>
                    )}
                    <span className="text-xs tracking-widest uppercase text-neutral-300 group-hover:text-white/60 transition-colors mt-1">
                      Переглянути →
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
        {featured.length > 0 && (
          <section className="bg-neutral-50 py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-2">В наявності</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900">Нові надходження</h2>
                </div>
                <Link
                  href="/catalog"
                  className="hidden sm:inline-block text-xs tracking-widest uppercase text-neutral-500 hover:text-black border-b border-neutral-300 hover:border-black pb-0.5 transition-colors"
                >
                  Весь каталог
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="text-center mt-12 sm:hidden">
                <Link href="/catalog"
                  className="inline-block border border-black text-black text-xs tracking-widest uppercase px-8 py-3 hover:bg-black hover:text-white transition-all">
                  Весь каталог
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── ABOUT / LOCAL SEO ────────────────────────────────────────────── */}
        <section id="contacts" className="bg-white py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-4">Про магазин</p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-8">
              Julia Lebedeva Collection
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Преміальні жіночі сумки від дизайнера з {BRAND.city}. Пропонуємо замшеві та шкіряні сумки,
              сумочки для телефону, шопери та рюкзаки. Виключно доставка{' '}
              {BRAND.delivery.join(' та ')} по всій Україні — без публічного шоуруму.
              Замовлення до {BRAND.orderCutoff} відправляємо в той самий день.
            </p>
            <a
              href={`tel:${BRAND.phone}`}
              className="inline-flex items-center gap-3 border border-black text-black text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-black hover:text-white transition-all"
            >
              <span>📞</span> {BRAND.phoneDisplay}
            </a>
            <p className="mt-5 text-xs text-neutral-400 tracking-wider">
              {BRAND.city}, {BRAND.region} · Доставка по всій Україні
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
