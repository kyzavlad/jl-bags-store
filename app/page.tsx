import type { Metadata } from 'next'
import Link from 'next/link'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, NAV_CATEGORIES, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { ProductCard } from '@/components/storefront/product-card'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'JL Bags — жіночі сумки з доставкою по Україні',
  description:
    'Жіночі сумки JL Bags з Харкова. Замшеві та шкіряні сумки, сумочки для телефону, жіночі шопери, рюкзаки, сумки через плече. Доставка Новою Поштою та Укрпоштою по всій Україні.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'JL Bags — жіночі сумки з доставкою по Україні',
    description:
      'Жіночі сумки JL Bags з Харкова. Замшеві та шкіряні сумки, сумочки для телефону, шопери, рюкзаки. Доставка Новою Поштою та Укрпоштою по всій Україні.',
    url: SITE_URL,
    type: 'website',
  },
}

/** Newest in-stock products that have at least one photo, for the homepage. */
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
    const withPhotos = ((data ?? []) as Product[]).filter(
      (p) => (p.product_photos ?? []).length > 0
    )
    return withPhotos.slice(0, 8)
  } catch {
    return []
  }
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: BRAND.name,
  url: SITE_URL,
  telephone: BRAND.phone,
  priceRange: '₴₴',
  description:
    'Жіночі сумки — замшеві, шкіряні, сумочки для телефону, шопери, рюкзаки. Доставка по всій Україні.',
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
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
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
      <main className="bg-stone-50">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 to-stone-700 text-white">
          <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-4">
              Магазин жіночих сумок · {BRAND.city}
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-5">
              Сумки, що підкреслюють стиль
            </h1>
            <p className="text-lg text-stone-300 mb-9 max-w-xl mx-auto">
              Замшеві та шкіряні сумки, сумочки для телефону, шопери та рюкзаки.
              Доставка Новою Поштою та Укрпоштою по всій Україні.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/catalog/suede-bags"
                className="inline-flex items-center justify-center rounded-full bg-white text-stone-900 font-semibold px-7 py-3.5 hover:bg-stone-100 transition-colors w-full sm:w-auto"
              >
                Перейти до каталогу
              </Link>
              <a
                href={`tel:${BRAND.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 text-white font-semibold px-7 py-3.5 hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                📞 {BRAND.phoneDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="border-b border-stone-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <Badge icon="🚚" title="Нова пошта та Укрпошта" text="Доставка по всій Україні" />
            <Badge icon="⚡" title={`Відправка до ${BRAND.orderCutoff}`} text="У день замовлення" />
            <Badge icon="💳" title="Оплата при отриманні" text="Накладений платіж" />
            <Badge icon="🌙" title="Замовлення 24/7" text="Онлайн у будь-який час" />
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-stone-900 mb-8 text-center">Категорії</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {NAV_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/catalog/${c.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-5 text-center text-sm font-medium text-stone-700 hover:border-stone-400 hover:shadow-sm transition-all"
              >
                <span className="text-3xl">{c.icon}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        {featured.length > 0 && (
          <section className="bg-white border-y border-stone-200">
            <div className="max-w-6xl mx-auto px-4 py-14">
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-2xl font-bold text-stone-900">Новинки в наявності</h2>
                <Link
                  href="/catalog/suede-bags"
                  className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Весь каталог →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About / local SEO */}
        <section className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Про магазин</h2>
          <p className="text-stone-600 leading-relaxed">
            <strong>JL Bags</strong> — інтернет-магазин жіночих сумок з {BRAND.city}.
            Пропонуємо замшеві та шкіряні сумки, сумочки для телефону, жіночі шопери та рюкзаки.
            Працюємо без публічного шоуруму — виключно доставка {BRAND.delivery.join(' та ')} по
            всій Україні. Замовлення, оформлені до {BRAND.orderCutoff}, відправляємо в день замовлення.
          </p>
          <p className="mt-5 text-sm text-stone-500">
            {BRAND.city}, {BRAND.region} · Доставка по всій Україні ·{' '}
            <a href={`tel:${BRAND.phone}`} className="text-stone-900 font-medium hover:underline">
              {BRAND.phoneDisplay}
            </a>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

function Badge({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm font-semibold text-stone-800">{title}</p>
      <p className="text-xs text-stone-500">{text}</p>
    </div>
  )
}
