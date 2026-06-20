import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
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
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <nav className="text-xs text-neutral-400 mb-8 flex flex-wrap gap-2 items-center tracking-wider uppercase" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-black transition-colors">Головна</Link>
            <span aria-hidden>›</span>
            <Link href="/catalog" className="hover:text-black transition-colors">Каталог</Link>
            {categoryName && (
              <>
                <span aria-hidden>›</span>
                {categorySlug ? (
                  <Link href={`/catalog/${categorySlug}`} className="hover:text-black transition-colors">
                    {categoryName}
                  </Link>
                ) : (
                  <span>{categoryName}</span>
                )}
              </>
            )}
            <span aria-hidden>›</span>
            <span className="text-neutral-700 line-clamp-1 normal-case">{product.name}</span>
          </nav>

          <div className="grid sm:grid-cols-2 gap-10 lg:gap-16">
            {/* Photo gallery */}
            <div>
              <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100 mb-3">
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
                  <div className="flex items-center justify-center h-full text-neutral-300 text-6xl select-none">
                    👜
                  </div>
                )}
                {!inStock && (
                  <div className="absolute inset-0 bg-white/50 flex items-end p-4">
                    <span className="text-xs tracking-widest uppercase text-neutral-600">Немає в наявності</span>
                  </div>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {photos.map((p, i) => (
                    <div
                      key={i}
                      className="w-16 h-20 relative overflow-hidden border border-neutral-200"
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
            <div className="space-y-5">
              <div>
                <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-2">
                  {categoryName ?? 'Julia Lebedeva Collection'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 leading-snug">
                  {product.name}
                </h1>
              </div>

              {product.price_retail > 0 && (
                <p className="text-2xl font-bold text-neutral-900">{product.price_retail} грн</p>
              )}

              <p className={`text-xs tracking-widest uppercase font-medium ${inStock ? 'text-green-700' : 'text-neutral-400'}`}>
                {inStock ? '✓ В наявності' : 'Немає в наявності'}
              </p>

              {inStockVariants.length > 0 && (
                <div>
                  <p className="text-xs tracking-widest uppercase text-neutral-500 mb-3">
                    Кольори в наявності
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {inStockVariants.map((v, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 border border-neutral-300 text-xs text-neutral-700 tracking-wide"
                      >
                        {v.color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(product.material || product.size_text) && (
                <dl className="space-y-2 text-sm border-t border-neutral-100 pt-4">
                  {product.material && (
                    <div className="flex gap-3">
                      <dt className="text-neutral-400 w-24 shrink-0 text-xs uppercase tracking-wider">Матеріал</dt>
                      <dd className="text-neutral-800">{product.material}</dd>
                    </div>
                  )}
                  {product.size_text && (
                    <div className="flex gap-3">
                      <dt className="text-neutral-400 w-24 shrink-0 text-xs uppercase tracking-wider">Розмір</dt>
                      <dd className="text-neutral-800">{product.size_text}</dd>
                    </div>
                  )}
                </dl>
              )}

              {product.description && (
                <div className="border-t border-neutral-100 pt-4">
                  <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="border-t border-neutral-200 pt-5 space-y-3">
                <a
                  href={`tel:${BRAND.phone}`}
                  className="flex items-center justify-center gap-3 w-full bg-neutral-950 text-white text-xs font-medium tracking-[0.2em] uppercase py-4 hover:bg-neutral-800 transition-colors"
                >
                  <span>📞</span> Замовити: {BRAND.phoneDisplay}
                </a>
                <p className="text-xs text-neutral-400 text-center tracking-wide">
                  Доставка {BRAND.delivery.join(', ')} · {BRAND.hours} ·{' '}
                  Відправка в день замовлення до {BRAND.orderCutoff}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-neutral-100 pt-4 text-xs text-neutral-400 tracking-wider">
            Артикул: <span className="font-mono">{product.code}</span>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
