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
      <main className="min-h-screen bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-stone-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">Головна</Link>
            <span className="mx-2" aria-hidden>›</span>
            <span className="text-stone-800">{category.name}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">{h1}</h1>
          {meta?.intro && (
            <p className="text-stone-500 text-sm mb-8 max-w-2xl leading-relaxed">{meta.intro}</p>
          )}

          {products.length === 0 ? (
            <div className="py-20 text-center text-stone-400">
              <p className="text-5xl mb-4">👜</p>
              <p className="text-lg font-medium text-stone-600">Скоро тут з&apos;являться товари</p>
              <p className="text-sm mt-1">Зв&apos;яжіться з нами для уточнення наявності</p>
              <a
                href={`tel:${BRAND.phone}`}
                className="inline-block mt-5 bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 transition-colors"
              >
                📞 {BRAND.phoneDisplay}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
