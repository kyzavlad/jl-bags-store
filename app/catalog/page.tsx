import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'
import { fetchActiveCategories, FALLBACK_CATEGORIES, iconForCategory } from '@/lib/categories'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { PageViewTracker } from '@/components/analytics/PageViewTracker'

export const dynamic = 'force-dynamic'

const canonical = `${SITE_URL}/catalog`

export const metadata: Metadata = {
  title: { absolute: 'Каталог жіночих сумок JL Bags — оберіть формат під свій день' },
  description:
    'Каталог JL Bags: компактні та місткі жіночі сумки, сумки через плече, шопери, рюкзаки й аксесуари від українського виробника. Доставка по Україні.',
  alternates: { canonical },
  openGraph: {
    title: 'Каталог JL Bags — сумка під ваш день',
    description: 'Оберіть формат під місто, роботу, необхідний мінімум або поїздки.',
    url: canonical,
    type: 'website',
    siteName: 'JL Bags',
    images: [{ url: OG_IMAGE, alt: 'JL Bags — каталог жіночих сумок' }],
  },
}

const CATEGORY_META: Record<string, { title: string; use: string }> = {
  'phone-bags': {
    title: 'Сумочки для телефону',
    use: 'Коли хочеться взяти лише необхідне',
  },
  'suede-bags': {
    title: 'Замшеві сумки',
    use: 'М’яка фактура для щоденних образів',
  },
  'leather-bags': {
    title: 'Сумки з еко-шкіри',
    use: 'Практичний формат на кожен день',
  },
  'crossbody-bags': {
    title: 'Сумки через плече',
    use: 'Місто, справи та вільні руки',
  },
  shoppers: {
    title: 'Шопери',
    use: 'Робота, документи й більше речей',
  },
  backpacks: {
    title: 'Рюкзаки',
    use: 'Поїздки та активний день',
  },
  accessories: {
    title: 'Аксесуари',
    use: 'Деталі, які доповнюють щоденний набір',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Каталог', item: canonical },
  ],
}

export default async function CatalogPage() {
  const dbCategories = await fetchActiveCategories()
  const categories = dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />
      <main className="min-h-screen bg-[#fbfaf7] text-[#171513]">
        <PageViewTracker event="catalog_view" />

        <section className="overflow-hidden border-b border-black/10 bg-[#efe8de]">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24 xl:px-20">
              <p className="text-[10px] font-semibold uppercase tracking-[0.27em] text-black/38">
                Каталог JL Bags
              </p>
              <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.88] tracking-[-0.055em] sm:text-7xl">
                Не “яка сумка?”.
                <span className="mt-2 block font-serif font-normal italic tracking-[-0.04em]">Для якого дня?</span>
              </h1>
              <p className="mt-7 max-w-xl text-sm leading-7 text-black/55 sm:text-base">
                Почніть із того, що носите з собою і куди йдете. Так простіше знайти формат,
                який буде і виглядати доречно, і реально працювати щодня.
              </p>
              <a
                href="https://ig.me/m/sumki_kharkov"
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="instagram_click"
                className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Допомогти з вибором
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="relative min-h-[420px] border-t border-black/10 lg:min-h-[620px] lg:border-l lg:border-t-0">
              <Image
                src="/hero/hero-1.jpg"
                alt="Сумки JL Bags"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/20 bg-black/25 p-5 text-white backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-white/55">Швидкий орієнтир</p>
                <p className="mt-3 text-lg font-semibold leading-6">
                  Компактно · містко · через плече · для документів · для поїздок
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
            <div className="mb-10 grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
                  01 · Оберіть сценарій
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Формати під реальне життя</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-black/50 lg:justify-self-end">
                Категорії залишаються знайомими, але підказка починається з вашої задачі —
                щоб не відкривати десятки моделей, які від початку не підходять за місткістю або способом носіння.
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="rounded-[2rem] border border-black/10 bg-white p-10 text-center sm:p-16">
                <p className="text-sm text-black/45">Категорії тимчасово недоступні.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => {
                  const meta = CATEGORY_META[category.slug] ?? {
                    title: category.name,
                    use: 'Оберіть актуальні моделі цієї категорії',
                  }
                  const Icon = iconForCategory(category.name)
                  return (
                    <Link
                      key={`${category.slug}-${index}`}
                      href={`/catalog/${category.slug}`}
                      className="group flex min-h-[285px] flex-col justify-between rounded-[2rem] border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_22px_70px_rgba(28,22,17,0.08)] sm:p-8"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-black/25">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3eee6] transition group-hover:bg-black group-hover:text-white">
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </span>
                      </div>
                      <div className="mt-10">
                        <p className="text-xs leading-5 text-black/42">{meta.use}</p>
                        <h3 className="mt-2 text-2xl font-black tracking-[-0.03em]">{meta.title}</h3>
                        <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-black/60">
                          Переглянути
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-7 rounded-[2.2rem] bg-[#171513] p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:p-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">Не хочете перебирати все?</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.035em] sm:text-4xl">
                Напишіть, що носите щодня — звузимо вибір до потрібного формату.
              </h2>
            </div>
            <a
              href="https://ig.me/m/sumki_kharkov"
              target="_blank"
              rel="noopener noreferrer"
              data-track-event="instagram_click"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black"
            >
              Підібрати в Instagram
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
