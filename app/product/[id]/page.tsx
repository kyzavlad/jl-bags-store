import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, SITE_URL } from '@/lib/seo'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = { params: { id: string } }

type ProductWithCategory = Product & {
  categories: { slug: string; name: string } | null
  product_variants: { color: string; quantity: number }[]
}

async function fetchProduct(id: string): Promise<ProductWithCategory | null> {
  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from('products')
    .select('*, product_photos(*), product_variants(color, quantity), categories(slug, name)')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()
  return (data as ProductWithCategory | null) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let product: ProductWithCategory | null = null
  try {
    product = await fetchProduct(params.id)
  } catch {
    /* no-op */
  }
  if (!product) return { title: 'Товар не знайдено' }

  const title = `${product.name} — JL Bags`
  const photo = (product.product_photos ?? []).find((p) => p.is_primary) ??
    (product.product_photos ?? [])[0]

  const descParts = [
    product.name,
    product.material ? `Матеріал: ${product.material}` : null,
    product.size_text ? `Розмір: ${product.size_text}` : null,
    product.category ? `${product.category}` : null,
    `Доставка ${BRAND.delivery.join(', ')} по Україні.`,
  ]
    .filter(Boolean)
    .join('. ')

  const canonical = `${SITE_URL}/product/${product.id}`

  return {
    title,
    description: descParts,
    alternates: { canonical },
    openGraph: {
      title,
      description: descParts,
      url: canonical,
      type: 'website',
      siteName: 'JL Bags',
      ...(photo
        ? { images: [{ url: photo.url, alt: product.name, width: 800, height: 800 }] }
        : {}),
    },
  }
}

export default async function ProductPage({ params }: Props) {
  let product: ProductWithCategory | null = null
  try {
    product = await fetchProduct(params.id)
  } catch {
    /* no-op */
  }
  if (!product) notFound()

  const photos = product.product_photos ?? []
  const primaryPhoto = photos.find((p) => p.is_primary) ?? photos[0]
  const inStock = product.stock_status === 'in_stock'
  const variants = product.product_variants ?? []
  const inStockVariants = variants.filter((v) => v.quantity > 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    image: photos.map((p) => p.url),
    brand: { '@type': 'Brand', name: BRAND.name },
    sku: product.code,
    ...(product.material ? { material: product.material } : {}),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: 'UAH',
      ...(product.price_retail > 0 ? { price: product.price_retail } : {}),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: BRAND.name },
    },
  }

  const categorySlug = product.categories?.slug ?? null
  const categoryName = product.categories?.name ?? product.category ?? null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1 items-center" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">JL Bags</Link>
            {categoryName && (
              <>
                <span aria-hidden>›</span>
                {categorySlug ? (
                  <Link href={`/catalog/${categorySlug}`} className="hover:underline">
                    {categoryName}
                  </Link>
                ) : (
                  <span>{categoryName}</span>
                )}
              </>
            )}
            <span aria-hidden>›</span>
            <span className="text-gray-800 line-clamp-1">{product.name}</span>
          </nav>

          <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
            {/* Photo gallery */}
            <div>
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100 mb-3">
                {primaryPhoto ? (
                  <Image
                    src={primaryPhoto.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-7xl text-gray-300 select-none">
                    👜
                  </div>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {photos.map((p, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 relative rounded-lg overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={p.url}
                        alt={`${product!.name} — фото ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h1>

              {product.price_retail > 0 && (
                <p className="text-3xl font-bold text-gray-900">{product.price_retail} грн</p>
              )}

              <p className={`text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                {inStock ? '✓ В наявності' : 'Немає в наявності'}
              </p>

              {inStockVariants.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Кольори в наявності:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {inStockVariants.map((v, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full border border-gray-300 text-sm bg-gray-50"
                      >
                        {v.color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(product.material || product.size_text) && (
                <dl className="space-y-1 text-sm">
                  {product.material && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 w-24 shrink-0">Матеріал</dt>
                      <dd className="text-gray-900">{product.material}</dd>
                    </div>
                  )}
                  {product.size_text && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 w-24 shrink-0">Розмір</dt>
                      <dd className="text-gray-900">{product.size_text}</dd>
                    </div>
                  )}
                </dl>
              )}

              {product.description && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="border-t pt-4 space-y-3">
                <a
                  href={`tel:${BRAND.phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  📞 Замовити: {BRAND.phoneDisplay}
                </a>
                <p className="text-xs text-gray-400 text-center">
                  Доставка {BRAND.delivery.join(', ')} · {BRAND.hours} ·{' '}
                  Відправка в день замовлення до {BRAND.orderCutoff}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t pt-4 text-sm text-gray-400">
            Артикул: <span className="font-mono">{product.code}</span>
          </div>
        </div>
      </main>
    </>
  )
}
