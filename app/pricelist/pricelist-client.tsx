'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Product } from '@/lib/types'

type Avail = 'all' | 'in' | 'out'

interface Row {
  code: string
  name: string
  color: string
  retail: number
  drop: number
  stock: number
  status: string
  category: string
}

function flatten(products: Product[]): Row[] {
  const rows: Row[] = []
  for (const p of products) {
    const variants = p.product_variants ?? []
    if (variants.length === 0) {
      rows.push({
        code: p.code,
        name: p.name,
        color: '—',
        retail: p.price_retail,
        drop: p.price_drop,
        stock: 0,
        status: p.stock_status === 'in_stock' ? 'В наличии' : 'Нет в наличии',
        category: p.category ?? '',
      })
      continue
    }
    for (const v of variants) {
      const available = Math.max(0, (v.quantity ?? 0) - (v.reserved_quantity ?? 0))
      rows.push({
        code: p.code,
        name: p.name,
        color: v.color,
        retail: p.price_retail,
        drop: p.price_drop,
        stock: available,
        status: available > 0 ? 'В наличии' : 'Нет в наличии',
        category: p.category ?? '',
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
                placeholder="Поиск по коду, названию, цвету…"
                className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="flex gap-1">
              {([
                ['all', 'Все'],
                ['in', 'В наличии'],
                ['out', 'Нет'],
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

          <p className="text-xs text-gray-500">Показано позиций: {rows.length}</p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-left text-gray-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Код</th>
                <th className="px-3 py-2 font-semibold">Название</th>
                <th className="px-3 py-2 font-semibold">Цвет/вариант</th>
                <th className="px-3 py-2 font-semibold">Категория</th>
                <th className="px-3 py-2 font-semibold text-right">Розница</th>
                <th className="px-3 py-2 font-semibold text-right">Дроп</th>
                <th className="px-3 py-2 font-semibold text-right">Остаток</th>
                <th className="px-3 py-2 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
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
                  <td colSpan={8} className="px-3 py-8 text-center text-gray-400">
                    Ничего не найдено
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
                  <span className="text-gray-400 block">Розница</span>
                  {r.retail > 0 ? `${r.retail} грн` : '—'}
                </div>
                <div>
                  <span className="text-gray-400 block">Дроп</span>
                  {r.drop > 0 ? `${r.drop} грн` : '—'}
                </div>
                <div>
                  <span className="text-gray-400 block">Остаток</span>
                  {r.stock}
                </div>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-center text-gray-400 py-8">Ничего не найдено</p>
          )}
        </div>
      </div>
    </main>
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
      {inStock ? 'В наличии' : 'Нет в наличии'}
    </span>
  )
}
