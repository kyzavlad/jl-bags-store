import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND, SITE_URL } from '@/lib/seo'

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

const CATEGORIES = [
  { slug: 'phone-bags',     name: 'Сумочки для телефону', icon: '📱' },
  { slug: 'suede-bags',     name: 'Замшеві сумки',        icon: '👜' },
  { slug: 'leather-bags',   name: 'Шкіряні сумки',        icon: '💼' },
  { slug: 'crossbody-bags', name: 'Сумки через плече',    icon: '👛' },
  { slug: 'shoppers',       name: 'Жіночі шопери',        icon: '🛍️' },
  { slug: 'backpacks',      name: 'Рюкзаки',              icon: '🎒' },
  { slug: 'accessories',    name: 'Аксесуари',            icon: '✨' },
]

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
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gray-900 text-white py-14 px-4 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Магазин сумок · Харків</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">JL Bags</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
            Жіночі сумки з доставкою по всій Україні
          </p>
          <a
            href={`tel:${BRAND.phone}`}
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            📞 {BRAND.phoneDisplay}
          </a>
        </section>

        {/* Categories */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Каталог</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/catalog/${c.slug}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-white transition-colors"
              >
                <span className="text-2xl">{c.icon}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Delivery info */}
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Доставка та оплата</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoCard
                icon="🚚"
                title="Нова пошта та Укрпошта"
                text="Доставляємо по всій Україні — до відділення або кур'єром."
              />
              <InfoCard
                icon="⚡"
                title={`Відправка до ${BRAND.orderCutoff} — в той самий день`}
                text={`Замовлення, оформлені до ${BRAND.orderCutoff}, відправляємо в день замовлення.`}
              />
              <InfoCard
                icon="🌙"
                title="Приймаємо замовлення 24/7"
                text="Пишіть у будь-який час — опрацюємо ваше замовлення якнайшвидше."
              />
              <InfoCard
                icon="💳"
                title="Оплата при отриманні"
                text="Накладений платіж на відділенні Нової пошти або Укрпошти."
              />
            </div>
          </div>
        </section>

        {/* About / Local SEO block */}
        <section className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Про магазин</h2>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
            <strong>JL Bags</strong> — інтернет-магазин жіночих сумок з {BRAND.city}.
            Пропонуємо замшеві та шкіряні сумки, сумочки для телефону, жіночі шопери та рюкзаки.
            Працюємо без публічного шоуруму — виключно доставка{' '}
            {BRAND.delivery.join(' та ')} по всій Україні.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            {BRAND.city}, {BRAND.region} · Доставка по всій Україні ·{' '}
            <a href={`tel:${BRAND.phone}`} className="text-blue-600 hover:underline">
              {BRAND.phoneDisplay}
            </a>
          </p>
        </section>

        <footer className="border-t py-5 px-4 text-center">
          <Link href="/admin" className="text-xs text-gray-300 hover:text-gray-500">
            Адмін-панель
          </Link>
        </footer>
      </main>
    </>
  )
}

function InfoCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <span className="text-2xl shrink-0">{icon}</span>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        <p className="text-gray-500 text-sm mt-0.5">{text}</p>
      </div>
    </div>
  )
}
