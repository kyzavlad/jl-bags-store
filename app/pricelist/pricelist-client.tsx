'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Product, ProductPhoto } from '@/lib/types'

type Avail = 'all' | 'in' | 'out'

interface Row {
  code: string
  name: string
  color: string
  material: string
  retail: number
  drop: number
  stock: number
  status: string
  category: string
  photo: string | null
}

/** First photo for a product: primary → lowest sort_order → first available. */
function firstPhoto(photos: ProductPhoto[] | undefined): string | null {
  if (!photos || photos.length === 0) return null
  const primary = photos.find((p) => p.is_primary)
  if (primary) return primary.url
  const sorted = [...photos].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  return sorted[0]?.url ?? null
}

function flatten(products: Product[]): Row[] {
  const rows: Row[] = []
  for (const p of products) {
    const photo = firstPhoto(p.product_photos)
    const material = p.material ?? ''
    const variants = p.product_variants ?? []
    if (variants.length === 0) {
      rows.push({
        code: p.code,
        name: p.name,
        color: '—',
        material,
        retail: p.price_retail,
        drop: p.price_drop,
        stock: 0,
        status: p.stock_status === 'in_stock' ? 'В наявності' : 'Немає в наявності',
        category: p.category ?? '',
        photo,
      })
      continue
    }
    for (const v of variants) {
      const available = Math.max(0, (v.quantity ?? 0) - (v.reserved_quantity ?? 0))
      rows.push({
        code: p.code,
        name: p.name,
        color: v.color,
        material,
        retail: p.price_retail,
        drop: p.price_drop,
        stock: available,
        status: available > 0 ? 'В наявності' : 'Немає в наявності',
        category: p.category ?? '',
        photo,
      })
    }
  }
  return rows
}

export function PricelistClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const [avail, setAvail] = useState<Avail>('all')

  const allRows = useMemo(() => flatten(products), [products])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allRows.filter((r) => {
      if (avail === 'in' && r.stock <= 0) return false
      if (avail === 'out' && r.stock > 0) return false
      if (!q) return true
      return (
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.material.toLowerCase().includes(q) ||
        r.color.toLowerCase().includes(q)
      )
    })
  }, [allRows, query, avail])

  return (
    <main className="min-h-screen">
      <div className="container py-4 sm:py-6">
        <div className="flex flex-col gap-3 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">Прайс-лист JL Bags</h1>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Пошук за кодом, назвою, матеріалом, кольором…"
                className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="flex gap-1">
              {([
                ['all', 'Усі'],
                ['in', 'В наявності'],
                ['out', 'Немає'],
              ] as [Avail, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setAvail(val)}
                  className={[
                    'px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap',
                    avail === val ? 'bg-primary text-primary-foreground' : 'bg-white border border-gray-300 text-gray-700',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500">Показано позицій: {rows.length}</p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-left text-gray-500">
              <tr>
                <th className="px-3 py-2 font-semibold w-16">Фото</th>
                <th className="px-3 py-2 font-semibold">Код</th>
                <th className="px-3 py-2 font-semibold">Назва</th>
                <th className="px-3 py-2 font-semibold">Колір/варіант</th>
                <th className="px-3 py-2 font-semibold">Категорія</th>
                <th className="px-3 py-2 font-semibold text-right">Роздріб</th>
                <th className="px-3 py-2 font-semibold text-right">Дроп</th>
                <th className="px-3 py-2 font-semibold text-right">Залишок</th>
                <th className="px-3 py-2 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <Thumb src={r.photo} alt={r.name} className="w-12 h-12" />
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold">{r.code}</td>
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.color}</td>
                  <td className="px-3 py-2 text-gray-500">{r.category || '—'}</td>
                  <td className="px-3 py-2 text-right">{r.retail > 0 ? `${r.retail} грн` : '—'}</td>
                  <td className="px-3 py-2 text-right">{r.drop > 0 ? `${r.drop} грн` : '—'}</td>
                  <td className="px-3 py-2 text-right">{r.stock}</td>
                  <td className="px-3 py-2">
                    <StatusBadge inStock={r.stock > 0} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-gray-400">
                    Нічого не знайдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="rounded-lg border bg-white p-3">
              <div className="flex items-start gap-3">
                <Thumb src={r.photo} alt={r.name} className="w-20 h-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono font-semibold text-sm">{r.code}</p>
                      <p className="text-sm truncate">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.color}</p>
                    </div>
                    <StatusBadge inStock={r.stock > 0} />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">Роздріб</span>
                      {r.retail > 0 ? `${r.retail} грн` : '—'}
                    </div>
                    <div>
                      <span className="text-gray-400 block">Дроп</span>
                      {r.drop > 0 ? `${r.drop} грн` : '—'}
                    </div>
                    <div>
                      <span className="text-gray-400 block">Залишок</span>
                      {r.stock}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-center text-gray-400 py-8">Нічого не знайдено</p>
          )}
        </div>
      </div>
    </main>
  )
}

/** Compact product thumbnail with stable aspect ratio, or a clean placeholder. */
function Thumb({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  const base = `rounded-md overflow-hidden bg-gray-100 shrink-0 ${className ?? ''}`
  if (!src) {
    return (
      <div className={`${base} flex items-center justify-center border border-gray-200`}>
        <span className="text-[10px] leading-tight text-gray-400 text-center px-1">Фото немає</span>
      </div>
    )
  }
  return (
    <div className={base}>
      {/* Native img + lazy loading keeps a dense pricelist fast across many rows. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function StatusBadge({ inStock }: { inStock: boolean }) {
  return (
    <span
      className={[
        'inline-block rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        inStock ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600',
      ].join(' ')}
    >
      {inStock ? 'В наявності' : 'Немає в наявності'}
    </span>
  )
}
