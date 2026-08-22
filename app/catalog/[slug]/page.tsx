import { cache } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, Check, MessageCircle, PackageCheck } from 'lucide-react'
import { getServiceSupabase } from '@/lib/supabase/server'
import { BRAND, CATEGORY_META, SITE_URL, OG_IMAGE, categorySeo } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { ProductCard } from '@/components/storefront/product-card'
import { PageViewTracker } from '@/components/analytics/PageViewTracker'
import type { Category, Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

const CATEGORY_CONTEXT: Record<string, { eyebrow: string; promise: string; guidance: string }> = {
  'phone-bags': {
    eyebrow: 'Лише необхідне',
    promise: 'Компактно зовні. Достатньо для головного.',
    guidance: 'Телефон, ключі, картки й дрібниці, коли хочеться вільних рук і мінімуму зайвого.',
  },
  'suede-bags': {
    eyebrow: 'М’яка фактура',
    promise: 'Текстура, яка робить щоденний образ цікавішим.',
    guidance: 'Для тих, кому важлива не лише форма, а й тактильність та м’якший характер образу.',
  },
  'leather-bags': {
    eyebrow: 'Практичний щоденний формат',
    promise: 'Акуратний вигляд без складного догляду.',
    guidance: 'Еко-шкіряні моделі для міста, роботи й щоденних справ. Обирайте розмір під свій набір речей.',
  },
  'crossbody-bags': {
    eyebrow: 'Місто й справи',
    promise: 'Вільні руки. Потрібне завжди поруч.',
    guidance: 'Через плече для активного дня, коли важливі швидкий доступ, зручність і компактний силует.',
  },
  shoppers: {
    eyebrow: 'Робота й документи',
    promise: 'Більше речей без відчуття громіздкої сумки.',
    guidance: 'Місткі формати для документів, покупок, роботи й довгих днів, коли “лише необхідного” вже недостатньо.',
  },
  backpacks: {
    eyebrow: 'Поїздки й активний день',
    promise: 'Розподілити вагу й залишити руки вільними.',
    guidance: 'Для поїздок, прогулянок і днів, коли з собою більше речей та потрібен комфортний спосіб носіння.',
  },
  accessories: {
    eyebrow: 'Деталі',
    promise: 'Менше дрібного хаосу всередині сумки.',
    guidance: 'Аксесуари для речей, які хочеться тримати окремо, швидко знаходити й не перекладати щоразу.',
  },
}

const fetchCategory = cache(async (slug: string): Promise<Category | null> => {
  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return data ?? null
})

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

  let dbName: string | null = null
  try {
    const category = await fetchCategory(params.slug)
    dbName = category?.name ?? null
  } catch {
    /* Database unavailable; static copy remains the fallback. */
  }

  const name = meta?.h1 ?? dbName
  const generated = name ? categorySeo(name) : null
  const title = meta?.title ?? generated?.title ?? 'Каталог жіночих сумок — JL Bags'
  const description = meta?.intro ?? generated?.description ?? 'Жіночі сумки JL Bags. Доставка по Україні.'
  const canonical = `${SITE_URL}/catalog/${params.slug}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'JL Bags',
      images: [{ url: OG_IMAGE, alt: name ?? 'JL Bags' }],
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  let category: Category | null = null
  try {
    category = await fetchCategory(params.slug)
  } catch {
    /* Database unavailable. */
  }
  if (!category) notFound()

  let products: Product[] = []
  try {
    products = await fetchProducts(category.id)
  } catch {
    /* Render a useful contact state if the product query fails. */
  }

  const meta = CATEGORY_META[params.slug]
  const h1 = meta?.h1 ?? category.name
  const intro = meta?.intro ?? categorySeo(category.name).intro
  const context = CATEGORY_CONTEXT[params.slug] ?? {
    eyebrow: 'JL Bags · щоденний формат',
    promise: `Знайдіть ${h1.toLocaleLowerCase('uk-UA')} під свій день.`,
    guidance: intro,
  }

  const photos = products
    .flatMap((product) => product.product_photos ?? [])
    .filter(Boolean)
    .slice(0, 3)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${SITE_URL}/catalog` },
      { '@type': 'ListItem', position: 3, name: h1, item: `${SITE_URL}/catalog/${params.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />
      <main className="min-h-screen bg-[#fbfaf7] text-[#171513]">
        <PageViewTracker event="category_view" params={{ category: h1, slug: params.slug }} />

        <section className="overflow-hidden border-b border-black/10 bg-[#efe8de]">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.88fr_1.12fr]">
            <div className="flex flex-col justify-between px-6 py-12 sm:px-10 sm:py-16 lg:min-h-[610px] lg:px-14 lg:py-16 xl:px-20">
              <div>
                <nav className="mb-10 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35" aria-label="Breadcrumb">
                  <Link href="/catalog" className="inline-flex items-center gap-2 transition hover:text-black">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Каталог
                  </Link>
                  <span>/</span>
                  <span>{h1}</span>
                </nav>

                <p className="text-[10px] font-semibold uppercase tracking-[0.27em] text-black/38">{context.eyebrow}</p>
                <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.88] tracking-[-0.055em] sm:text-7xl">
                  {h1}
                </h1>
                <p className="mt-5 max-w-xl text-2xl font-serif italic leading-tight text-black/72 sm:text-3xl">
                  {context.promise}
                </p>
                <p className="mt-6 max-w-xl text-sm leading-7 text-black/52 sm:text-base">{context.guidance}</p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 border-t border-black/10 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-2xl font-black">{products.length}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-black/35">моделей у категорії</p>
                </div>
                <div>
                  <p className="text-2xl font-black">1–2</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-black/35">дні на відправку</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-2xl font-black">14</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-black/35">днів на обмін</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[480px] border-t border-black/10 bg-[#d9cec0] lg:min-h-[610px] lg:border-l lg:border-t-0">
              {photos.length > 0 ? (
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2 sm:gap-3 sm:p-3">
                  <div className="relative row-span-2 overflow-hidden rounded-[2rem]">
                    <Image
                      src={photos[0].url}
                      alt={`${h1} JL Bags`}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 28vw"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-[2rem] bg-[#c8bbab]">
                    {photos[1] ? (
                      <Image
                        src={photos[1].url}
                        alt={`${h1} — реальний товар`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 28vw"
                      />
                    ) : (
                      <Image src="/hero/hero-2.jpg" alt="JL Bags" fill className="object-cover" sizes="50vw" />
                    )}
                  </div>
                  <div className="relative overflow-hidden rounded-[2rem] bg-[#1d1a17]">
                    {photos[2] ? (
                      <Image
                        src={photos[2].url}
                        alt={`${h1} — деталі`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 28vw"
                      />
                    ) : (
                      <Image src="/hero/hero-3.jpg" alt="JL Bags у повсякденному образі" fill className="object-cover" sizes="50vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-black/25 p-4 text-white backdrop-blur-md">
                      <p className="flex items-center gap-2 text-xs font-semibold">
                        <PackageCheck className="h-4 w-4" />
                        Реальні фото товару
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Image src="/hero/hero-1.jpg" alt={h1} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 56vw" />
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-[#171513] text-white">
          <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-8 gap-y-3 px-6 py-5 sm:px-10 lg:px-12">
            {['Реальний товар', 'Ціна від виробника', 'Доставка по Україні', 'Обмін 14 днів'].map((item) => (
              <span key={item} className="flex items-center gap-2 text-xs text-white/65 sm:text-sm">
                <Check className="h-3.5 w-3.5 text-[#d8c7ad]" />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">Оберіть конкретну модель</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-5xl">{h1}</h2>
              </div>
              <p className="max-w-lg text-sm leading-7 text-black/48">
                Дивіться реальні фото, ціну та доступні характеристики. Якщо важко оцінити місткість, напишіть, що носите з собою — допоможемо звузити вибір.
              </p>
            </div>

            {products.length === 0 ? (
              <div className="grid overflow-hidden rounded-[2rem] border border-black/10 bg-white lg:grid-cols-[1fr_0.9fr]">
                <div className="relative min-h-[340px]">
                  <Image src="/hero/hero-2.jpg" alt="JL Bags" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 52vw" />
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-12">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/35">Уточнимо актуальну наявність</p>
                  <h3 className="mt-4 text-3xl font-black tracking-[-0.035em]">Не залишайтеся з порожньою сторінкою.</h3>
                  <p className="mt-4 text-sm leading-7 text-black/50">Напишіть нам, і ми підкажемо актуальні моделі цієї категорії.</p>
                  <a
                    href="https://ig.me/m/sumki_kharkov"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track-event="instagram_click"
                    className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Підібрати в Instagram
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-7 rounded-[2.2rem] bg-[#d8c7ad] p-8 sm:p-10 lg:flex-row lg:items-center lg:p-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/38">Не впевнені у розмірі?</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.035em] sm:text-4xl">
                Напишіть, що має поміститися — порадимо формат.
              </h2>
            </div>
            <a
              href="https://ig.me/m/sumki_kharkov"
              target="_blank"
              rel="noopener noreferrer"
              data-track-event="instagram_click"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#171513] px-6 py-4 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Допомогти з вибором
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
