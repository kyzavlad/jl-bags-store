import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND, CATEGORY_META, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'

export const dynamic = 'force-dynamic'

const CATALOG_CATEGORIES = [
  { slug: 'phone-bags',     name: 'Сумочки для телефону' },
  { slug: 'suede-bags',    name: 'Замшеві сумки' },
  { slug: 'leather-bags',  name: 'Шкіряні сумки' },
  { slug: 'crossbody-bags', name: 'Сумки через плече' },
  { slug: 'shoppers',      name: 'Шопери' },
  { slug: 'backpacks',     name: 'Рюкзаки' },
  { slug: 'accessories',   name: 'Аксесуари' },
]

const canonical = `${SITE_URL}/catalog`

export const metadata: Metadata = {
  title: 'Каталог жіночих сумок — Julia Lebedeva Collection',
  description: 'Каталог жіночих сумок Julia Lebedeva Collection: замшеві, шкіряні, сумочки для телефону, шопери, рюкзаки. Доставка Новою Поштою та Укрпоштою по всій Україні.',
  alternates: { canonical },
  openGraph: {
    title: 'Каталог — Julia Lebedeva Collection',
    description: 'Жіночі сумки з доставкою по всій Україні.',
    url: canonical,
    type: 'website',
  },
}

export default function CatalogPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        {/* Page header */}
        <div className="border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-3">Асортимент</p>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
              Каталог
            </h1>
          </div>
        </div>

        {/* Categories grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-200">
            {CATALOG_CATEGORIES.map((c) => {
              const meta = CATEGORY_META[c.slug]
              return (
                <Link
                  key={c.slug}
                  href={`/catalog/${c.slug}`}
                  className="group bg-white p-8 flex flex-col items-center justify-center text-center gap-3 hover:bg-neutral-950 transition-colors duration-300 min-h-[160px]"
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
              <span>📞</span> {BRAND.phoneDisplay}
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
