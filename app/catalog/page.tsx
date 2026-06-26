import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { BRAND, SITE_URL, OG_IMAGE } from '@/lib/seo'
import { fetchActiveCategories, FALLBACK_CATEGORIES, iconForCategory } from '@/lib/categories'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'

export const dynamic = 'force-dynamic'

const canonical = `${SITE_URL}/catalog`

export const metadata: Metadata = {
  title: { absolute: 'Каталог жіночих сумок — купити в JL Bags з доставкою по Україні' },
  description:
    'Каталог жіночих сумок JL Bags від виробника: замшеві та еко-шкіряні сумки, сумочки для телефону, шопери, рюкзаки, гаманці. Доставка Новою Поштою та Укрпоштою по всій Україні.',
  alternates: { canonical },
  openGraph: {
    title: 'Каталог жіночих сумок — JL Bags',
    description: 'Жіночі сумки від виробника з доставкою по всій Україні.',
    url: canonical,
    type: 'website',
    siteName: 'JL Bags',
    images: [{ url: OG_IMAGE, alt: 'JL Bags — каталог жіночих сумок' }],
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
  const usingDb = dbCategories.length > 0
  const categories = usingDb
    ? dbCategories.map((c) => ({ name: c.name, slug: c.slug }))
    : FALLBACK_CATEGORIES

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />
      <main className="min-h-screen bg-white">
        {/* Page header */}
        <div className="border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-3">Асортимент</p>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
              Каталог
            </h1>
            <p className="mt-4 text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
              Оберіть категорію — жіночі сумки, сумочки для телефону, шопери, рюкзаки та аксесуари
              з доставкою по всій Україні.
            </p>
          </div>
        </div>

        {/* Categories grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {categories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm tracking-widest uppercase text-neutral-400 mb-6">
                Категорії скоро з&apos;являться
              </p>
              <a
                href={`tel:${BRAND.phone}`}
                className="inline-flex items-center gap-3 border border-black text-black text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-black hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" /> {BRAND.phoneDisplay}
              </a>
            </div>
          ) : (
            /* Flex-wrap + justify-center centers the final row, so 7 (or any
               count of) categories stay visually balanced — no lonely card. */
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {categories.map((c, i) => {
                const Icon = iconForCategory(c.name)
                const href = usingDb ? `/catalog/${c.slug}` : '/catalog'
                return (
                  <Link
                    key={`${c.slug}-${i}`}
                    href={href}
                    className="group relative flex flex-col items-center justify-center gap-5 rounded-2xl border border-neutral-200 bg-white p-8 min-h-[200px] basis-[calc(50%_-_0.5rem)] sm:basis-[calc(33.333%_-_1rem)] lg:basis-[calc(25%_-_1.125rem)] max-w-[300px] hover:border-black hover:shadow-sm transition-all"
                  >
                    <span className="flex items-center justify-center w-14 h-14 rounded-full bg-neutral-50 group-hover:bg-black transition-colors">
                      <Icon className="w-7 h-7 text-neutral-900 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </span>
                    <span className="text-sm font-semibold text-center text-neutral-900">{c.name}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] tracking-widest uppercase text-neutral-400 group-hover:text-black transition-colors">
                      Переглянути <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Contact strip */}
        <div className="border-t border-neutral-200 bg-neutral-50 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs tracking-widest uppercase text-neutral-400 mb-4">
              Потрібна допомога з вибором?
            </p>
            <a
              href={`tel:${BRAND.phone}`}
              className="inline-flex items-center gap-3 border border-black text-black text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-black hover:text-white transition-all"
            >
              <Phone className="w-4 h-4" /> {BRAND.phoneDisplay}
            </a>
            <p className="mt-4 text-xs text-neutral-400">
              {BRAND.city} · Доставка по всій Україні
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
