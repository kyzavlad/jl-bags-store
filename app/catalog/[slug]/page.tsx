import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, CATEGORY_META, SITE_URL } from '@/lib/seo'
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
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">JL Bags</Link>
          <span className="mx-2" aria-hidden>›</span>
          <span className="text-gray-800">{category.name}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{h1}</h1>
        {meta?.intro && (
          <p className="text-gray-500 text-sm mb-8 max-w-2xl leading-relaxed">{meta.intro}</p>
        )}

        {products.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-5xl mb-4">👜</p>
            <p className="text-lg font-medium text-gray-600">Скоро тут з'являться товари</p>
            <p className="text-sm mt-1">Зв'яжіться з нами для уточнення наявності</p>
            <a
              href={`tel:${BRAND.phone}`}
              className="inline-block mt-5 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
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

        <div className="mt-10 border-t pt-6 text-sm text-gray-400 text-center">
          Доставка {BRAND.delivery.join(' та ')} по всій Україні ·{' '}
          <a href={`tel:${BRAND.phone}`} className="text-blue-600 hover:underline">
            {BRAND.phoneDisplay}
          </a>
        </div>
      </div>
    </main>
  )
}

function ProductCard({ product }: { product: Product }) {
  const photos = product.product_photos ?? []
  const photo = photos.find((p) => p.is_primary) ?? photos[0]
  const inStock = product.stock_status === 'in_stock'

  return (
    <Link
      href={`/product/${product.id}`}
      className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {photo ? (
          <Image
            src={photo.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-4xl select-none">
            👜
          </div>
        )}
        {!inStock && (
          <span className="absolute top-2 left-2 bg-gray-800/75 text-white text-xs px-2 py-0.5 rounded">
            Немає
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </p>
        {product.price_retail > 0 ? (
          <p className="text-base font-bold text-gray-900 mt-1">{product.price_retail} грн</p>
        ) : (
          <p className="text-sm text-gray-400 mt-1">Ціна за запитом</p>
        )}
      </div>
    </Link>
  )
}
