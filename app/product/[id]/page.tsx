import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Factory,
  MessageCircle,
  PackageCheck,
  Palette,
  Phone,
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { PageViewTracker } from '@/components/analytics/PageViewTracker'
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
    /* Database unavailable; return a safe fallback below. */
  }

  if (!product) {
    return {
      title: { absolute: 'Товар — JL Bags' },
      description: 'Жіночі сумки JL Bags з доставкою по Україні.',
      robots: { index: false, follow: false },
    }
  }

  const categoryName = product.categories?.name ?? product.category ?? null
  const colors = (product.product_variants ?? [])
    .filter((variant) => variant.quantity > 0)
    .map((variant) => variant.color)
    .filter(Boolean)
  const colorText = colors.length > 0 ? `Кольори: ${colors.slice(0, 6).join(', ')}` : null
  const descParts = [
    product.name,
    categoryName,
    product.material ? `Матеріал: ${product.material}` : null,
    product.size_text ? `Розмір: ${product.size_text}` : null,
    colorText,
    product.price_retail > 0 ? `Ціна: ${product.price_retail} грн` : null,
    `Доставка ${BRAND.delivery.join(', ')} по Україні.`,
  ]
    .filter(Boolean)
    .join('. ')

  const canonical = `${SITE_URL}/product/${product.id}`
  const photos = [...(product.product_photos ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
  )
  const image = photos[0]?.url

  return {
    title: { absolute: `${product.name} — купити в JL Bags` },
    description: descParts,
    alternates: { canonical },
    openGraph: {
      title: `${product.name} — купити в JL Bags`,
      description: descParts,
      url: canonical,
      type: 'website',
      siteName: 'JL Bags',
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: product.name,
                width: 800,
                height: 800,
              },
            ],
          }
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

  const photos = [...(product.product_photos ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
  )
  const heroPhotos = photos.slice(0, 3)
  const detailPhotos = photos.slice(3)
  const inStockVariants = Array.from(
    new Map(
      (product.product_variants ?? [])
        .filter((variant) => variant.quantity > 0 && variant.color)
        .map((variant) => [variant.color, variant]),
    ).values(),
  )
  const inStock = product.stock_status === 'in_stock'
  const categorySlug = product.categories?.slug ?? null
  const categoryName = product.categories?.name ?? product.category ?? null
  const productUrl = `${SITE_URL}/product/${product.id}`
  const colorList = inStockVariants.map((variant) => variant.color)

  const productJsonLd = {
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    image: photos.map((photo) => photo.url),
    brand: { '@type': 'Brand', name: 'JL Bags' },
    sku: product.code,
    mpn: product.code,
    ...(product.material ? { material: product.material } : {}),
    ...(colorList.length > 0 ? { color: colorList.join(', ') } : {}),
    ...(categoryName ? { category: categoryName } : {}),
    itemCondition: 'https://schema.org/NewCondition',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'UAH',
      price: product.price_retail,
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'JL Bags' },
    },
  }

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${SITE_URL}/catalog` },
    ...(categorySlug && categoryName
      ? [
          {
            '@type': 'ListItem',
            position: 3,
            name: categoryName,
            item: `${SITE_URL}/catalog/${categorySlug}`,
          },
        ]
      : []),
    {
      '@type': 'ListItem',
      position: categorySlug && categoryName ? 4 : 3,
      name: product.name,
      item: productUrl,
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      productJsonLd,
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      },
    ],
  }

  const deliveryText = BRAND.delivery.join(' · ')
  const orderLabel = inStock ? 'Замовити цю модель' : 'Уточнити наступне надходження'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="min-h-screen bg-[#fbfaf7] text-[#171513]">
        <PageViewTracker
          event="product_view"
          params={{ product_id: product.id, product_name: product.name }}
        />

        <section className="border-b border-black/10 bg-[#efe8de]">
          <div className="mx-auto max-w-[1440px]">
            <nav
              className="flex flex-wrap items-center gap-2 px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35 sm:px-10 lg:px-12"
              aria-label="Breadcrumb"
            >
              <Link href="/catalog" className="inline-flex items-center gap-2 transition hover:text-black">
                <ArrowLeft className="h-3.5 w-3.5" />
                Каталог
              </Link>
              {categorySlug && categoryName ? (
                <>
                  <span>/</span>
                  <Link href={`/catalog/${categorySlug}`} className="transition hover:text-black">
                    {categoryName}
                  </Link>
                </>
              ) : null}
              <span>/</span>
              <span className="normal-case text-black/55">{product.name}</span>
            </nav>

            <div className="grid border-t border-black/10 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="min-w-0 border-b border-black/10 p-3 sm:p-4 lg:border-b-0 lg:border-r">
                {heroPhotos.length > 0 ? (
                  <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0">
                    {heroPhotos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className={`relative aspect-[4/5] min-w-[88%] snap-center overflow-hidden rounded-[2rem] bg-[#d8cfc3] sm:min-w-[72%] lg:min-w-0 ${
                          index === 0 ? 'lg:col-span-2 lg:aspect-[16/13]' : 'lg:aspect-[4/5]'
                        }`}
                      >
                        <Image
                          src={photo.url}
                          alt={`${product.name} — фото ${index + 1}`}
                          fill
                          priority={index === 0}
                          className="object-cover"
                          sizes={
                            index === 0
                              ? '(max-width: 1024px) 88vw, 56vw'
                              : '(max-width: 1024px) 72vw, 28vw'
                          }
                        />
                        {index === 0 ? (
                          <div className="absolute bottom-4 left-4 rounded-full border border-white/25 bg-black/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                            Реальне фото товару
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-[#ddd3c7] text-center sm:aspect-[16/13]">
                    <div>
                      <p className="text-5xl">👜</p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
                        Фото готується
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        inStock
                          ? 'bg-[#dbe7d5] text-[#31472b]'
                          : 'bg-black/5 text-black/50'
                      }`}
                    >
                      {inStock ? 'В наявності' : 'Немає в наявності'}
                    </span>
                    <span className="rounded-full border border-black/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/38">
                      Артикул {product.code}
                    </span>
                  </div>

                  <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
                    {categoryName ?? 'JL Bags'}
                  </p>
                  <h1 className="mt-3 max-w-xl text-4xl font-black leading-[0.94] tracking-[-0.05em] sm:text-5xl xl:text-6xl">
                    {product.name}
                  </h1>

                  {product.price_retail > 0 ? (
                    <p className="mt-6 text-3xl font-black tracking-[-0.035em]">
                      {product.price_retail} грн
                    </p>
                  ) : (
                    <p className="mt-6 text-lg font-semibold text-black/55">Ціна за запитом</p>
                  )}

                  <p className="mt-5 max-w-xl text-sm leading-7 text-black/50">
                    Перевірте розмір, матеріал і доступний колір нижче. Якщо хочете зрозуміти, чи
                    підійде модель під ваш щоденний набір речей, напишіть нам перед замовленням.
                  </p>

                  {inStockVariants.length > 0 ? (
                    <div className="mt-8 border-t border-black/10 pt-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                        Доступні варіанти
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {inStockVariants.map((variant) => (
                          <span
                            key={variant.color}
                            className="rounded-full border border-black/12 bg-white/55 px-3 py-2 text-xs text-black/65"
                          >
                            {variant.color}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                    {product.material ? (
                      <div className="rounded-[1.4rem] border border-black/10 bg-white/45 p-4">
                        <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-black/35">
                          <Palette className="h-3.5 w-3.5" />
                          Матеріал
                        </dt>
                        <dd className="mt-2 text-sm leading-6 text-black/72">{product.material}</dd>
                      </div>
                    ) : null}

                    {product.size_text ? (
                      <div className="rounded-[1.4rem] border border-black/10 bg-white/45 p-4">
                        <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-black/35">
                          <Ruler className="h-3.5 w-3.5" />
                          Розмір
                        </dt>
                        <dd className="mt-2 text-sm leading-6 text-black/72">{product.size_text}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>

                <div className="mt-10 border-t border-black/10 pt-7">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <a
                      href={`tel:${BRAND.phone}`}
                      data-track-event="phone_click"
                      className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#171513] px-5 py-4 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      <Phone className="h-4 w-4" />
                      {orderLabel}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                    <a
                      href="https://ig.me/m/sumki_kharkov"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track-event="instagram_click"
                      className="inline-flex items-center justify-center gap-3 rounded-full border border-black/15 bg-white/45 px-5 py-4 text-sm font-semibold text-[#171513] transition hover:bg-white"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Уточнити в Instagram
                    </a>
                  </div>
                  <p className="mt-4 text-center text-[11px] leading-5 text-black/38">
                    {BRAND.phoneDisplay} · {deliveryText} · {BRAND.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-[#171513] text-white">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
            {[
              { icon: PackageCheck, title: 'Реальні фото', text: 'Дивитесь саме на товар' },
              { icon: Factory, title: 'Власне виробництво', text: 'JL Bags · Харків' },
              { icon: Truck, title: 'Відправка 1–2 дні', text: deliveryText },
              { icon: ShieldCheck, title: 'Обмін 14 днів', text: 'Спокійніше приміряти вибір' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-5 sm:p-6 lg:p-8">
                <Icon className="h-5 w-5 text-[#d8c7ad]" />
                <p className="mt-4 text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs leading-5 text-white/42">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-6 sm:px-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
                Перед замовленням
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                Перевірте три речі, щоб сумка підійшла під ваш день.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  number: '01',
                  title: 'Розмір',
                  text: product.size_text
                    ? `Зіставте ${product.size_text} з речами, які носите щодня.`
                    : 'Напишіть, що має поміститися, і ми допоможемо оцінити формат.',
                },
                {
                  number: '02',
                  title: 'Матеріал',
                  text: product.material
                    ? product.material
                    : 'Уточніть матеріал перед замовленням, якщо це важливо для догляду та фактури.',
                },
                {
                  number: '03',
                  title: 'Колір',
                  text:
                    colorList.length > 0
                      ? `Зараз доступно: ${colorList.slice(0, 4).join(', ')}${colorList.length > 4 ? '…' : ''}`
                      : 'Актуальний колір і наявність можна швидко уточнити у менеджера.',
                },
              ].map((item) => (
                <div key={item.number} className="rounded-[1.8rem] border border-black/10 bg-white p-6">
                  <p className="text-[10px] font-black tracking-[0.2em] text-black/25">{item.number}</p>
                  <h3 className="mt-7 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-black/48">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {product.description ? (
          <section className="border-y border-black/10 bg-[#eee7dd] py-16 sm:py-20">
            <div className="mx-auto grid max-w-[1440px] gap-8 px-6 sm:px-10 lg:grid-cols-[0.78fr_1.22fr] lg:px-12">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
                  Деталі моделі
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  Що вже відомо про цю сумку.
                </h2>
              </div>
              <p className="whitespace-pre-line text-base leading-8 text-black/62">
                {product.description}
              </p>
            </div>
          </section>
        ) : null}

        {detailPhotos.length > 0 ? (
          <section className="py-16 sm:py-24">
            <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
              <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
                    Більше ракурсів
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                    Подивіться деталі до замовлення.
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-7 text-black/45">
                  Усі фото на сторінці прив’язані до цієї товарної позиції.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {detailPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-[#efeae2]"
                  >
                    <Image
                      src={photo.url}
                      alt={`${product.name} — додаткове фото ${index + 4}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-[2.2rem] bg-[#d8c7ad] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/38">
                Залишився сумнів?
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Напишіть, що носите з собою. Допоможемо перевірити формат до замовлення.
              </h2>
            </div>
            <div className="flex flex-col justify-center gap-3 border-t border-black/10 p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <a
                href="https://ig.me/m/sumki_kharkov"
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="instagram_click"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#171513] px-6 py-4 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Допомогти з вибором
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href={categorySlug ? `/catalog/${categorySlug}` : '/catalog'}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-black/15 bg-white/35 px-6 py-4 text-sm font-semibold"
              >
                Повернутися до схожих моделей
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
