import { getServiceSupabase } from '@/lib/supabase/server'
import type { Product } from '@/lib/types'
import { PricelistClient } from './pricelist-client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function loadProducts(): Promise<Product[]> {
  const supabase = getServiceSupabase()
  const pageSize = 1000
  let from = 0
  const all: Product[] = []
  for (;;) {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), product_photos(*)')
      .eq('is_active', true)
      .order('code', { ascending: true })
      .range(from, from + pageSize - 1)
    if (error) throw new Error(error.message)
    if (!data || data.length === 0) break
    all.push(...(data as Product[]))
    if (data.length < pageSize) break
    from += pageSize
  }
  return all
}

export default async function PricelistPage({
  searchParams,
}: {
  searchParams: { key?: string }
}) {
  const expectedKey = process.env.PRICELIST_KEY
  const providedKey = searchParams.key ?? ''

  if (!expectedKey) {
    return (
      <Centered>
        <h1 className="text-lg font-semibold">Прайс-лист не налаштовано</h1>
        <p className="text-sm text-gray-600 mt-1">
          Змінна середовища <code>PRICELIST_KEY</code> не задана.
        </p>
      </Centered>
    )
  }

  if (providedKey !== expectedKey) {
    return (
      <Centered>
        <h1 className="text-lg font-semibold">Доступ закрито</h1>
        <p className="text-sm text-gray-600 mt-1">
          Невірний або відсутній ключ доступу. Відкрийте посилання з параметром{' '}
          <code>?key=…</code>
        </p>
      </Centered>
    )
  }

  let products: Product[] = []
  let loadError: string | null = null
  try {
    products = await loadProducts()
  } catch (e: any) {
    loadError = e?.message ?? 'Помилка завантаження'
  }

  if (loadError) {
    return (
      <Centered>
        <h1 className="text-lg font-semibold text-red-700">Помилка завантаження прайсу</h1>
        <p className="text-sm text-gray-600 mt-1">{loadError}</p>
      </Centered>
    )
  }

  return <PricelistClient products={products} />
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">{children}</div>
    </main>
  )
}
