import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, CATEGORY_META, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { ProductCard } from '@/components/storefront/product-card'
import type { Category, Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

async function fetchCategory(slug: string): Promise<Category | null> {
  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return data ?? null
}

async function fetchProducts(categoryId: string): Promise<Product[]> {
  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from('products')
    .select('*, product_photos(*)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('code', { ascending: true })
    .limit(200)
  return (data ?? []) as Product[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CATEGORY_META[params.slug]
  const title = meta?.title ?? 'Каталог — JL Bags'
  const description = meta?.intro ?? 'Жіночі сумки JL Bags. Доставка по Україні.'
  const canonical = `${SITE_URL}/catalog/${params.slug}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website', siteName: 'JL Bags' },
  }
}

export default async function CategoryPage({ params }: Props) {
  let category: Category | null = null
  try {
    category = await fetchCategory(params.slug)
  } catch {
    // DB unavailable: treat as not found
  }
  if (!category) notFound()

  let products: Product[] = []
  try {
    products = await fetchProducts(category.id)
  } catch {
    // Show empty state on DB error
  }

  const meta = CATEGORY_META[params.slug]
  const h1 = meta?.h1 ?? category.name

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        {/* Page header */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <nav className="text-xs text-neutral-400 mb-4 flex items-center gap-2 tracking-wider uppercase" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-black transition-colors">Головна</Link>
              <span aria-hidden>›</span>
              <Link href="/catalog" className="hover:text-black transition-colors">Каталог</Link>
              <span aria-hidden>›</span>
              <span className="text-neutral-700">{category.name}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 mb-3">{h1}</h1>
            {meta?.intro && (
              <p className="text-neutral-500 text-sm max-w-2xl leading-relaxed">{meta.intro}</p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm tracking-widest uppercase text-neutral-400 mb-6">Скоро тут з&apos;являться товари</p>
              <p className="text-xs text-neutral-400 mb-8">Зв&apos;яжіться з нами для уточнення наявності</p>
              <a
                href={`tel:${BRAND.phone}`}
                className="inline-flex items-center gap-3 border border-black text-black text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-black hover:text-white transition-all"
              >
                <span>📞</span> {BRAND.phoneDisplay}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
