'use client'

import { useCallback, useEffect, useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react'
import type { Product, ProductStats, ProductFilter } from '@/lib/types'
import { adminFetch } from '@/lib/admin-fetch'
import { Button } from '@/components/ui/button'
import { ProductDialog } from './product-dialog'

const FILTERS: { value: ProductFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'in_stock', label: 'В наличии' },
  { value: 'out_of_stock', label: 'Нет в наличии' },
  { value: 'no_photo', label: 'Без фото' },
  { value: 'no_description', label: 'Без описания' },
  { value: 'no_retail', label: 'Без розн. цены' },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [filter, setFilter] = useState<ProductFilter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ search: debounced, filter, page: String(page) })
      const res = await adminFetch(`/api/admin/products?${params}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка загрузки')
      setProducts(json.products)
      setTotal(json.total)
      setStats(json.stats)
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка')
    } finally {
      setLoading(false)
    }
  }, [debounced, filter, page])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [debounced, filter])

  const pageCount = Math.max(1, Math.ceil(total / 50))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl sm:text-3xl font-bold">Товары</h1>
        <Button onClick={() => setCreating(true)} className="shrink-0">
          <Plus className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Добавить</span>
        </Button>
      </div>

      {stats && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md bg-white border px-3 py-2 text-xs text-gray-600">
          <span>
            <span className="font-semibold text-gray-900">{stats.total}</span> всего
          </span>
          <span>
            <span className="font-semibold text-green-700">{stats.inStock}</span> в наличии
          </span>
          <span>
            <span className="font-semibold text-red-600">{stats.outOfStock}</span> нет в наличии
          </span>
          <span>
            <span className="font-semibold text-gray-900">{stats.active}</span> активных
          </span>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по коду, названию, материалу…"
          className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={[
              'px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap',
              filter === f.value ? 'bg-primary text-primary-foreground' : 'bg-white border border-gray-300 text-gray-700',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Загрузка…
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-left text-gray-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Код</th>
                <th className="px-3 py-2 font-semibold">Название</th>
                <th className="px-3 py-2 font-semibold">Варианты</th>
                <th className="px-3 py-2 font-semibold">Фото</th>
                <th className="px-3 py-2 font-semibold text-right">Цены</th>
                <th className="px-3 py-2 font-semibold">Статус</th>
                <th className="px-3 py-2 font-semibold text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => {
                const variants = p.product_variants ?? []
                const photos = p.product_photos ?? []
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono font-semibold">{p.code}</td>
                    <td className="px-3 py-2 max-w-[200px] truncate">{p.name}</td>
                    <td className="px-3 py-2 text-gray-500">{variants.length}</td>
                    <td className="px-3 py-2">
                      {photos.length > 0 ? (
                        <span className="text-green-600">{photos.length} фото</span>
                      ) : (
                        <span className="text-amber-600">Нет фото</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <span className={p.price_retail > 0 ? '' : 'text-amber-600'}>
                        {p.price_retail > 0 ? `${p.price_retail}` : '—'}
                      </span>
                      <span className="text-gray-400"> / </span>
                      <span>{p.price_drop > 0 ? `${p.price_drop}` : '—'}</span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge inStock={p.stock_status === 'in_stock'} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => setEditing(p)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Изменить
                      </button>
                    </td>
                  </tr>
                )
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-400">
                    Ничего не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Стр. {page} из {pageCount} · всего {total}
        </span>
        <div className="flex gap-1">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {(editing || creating) && (
        <ProductDialog
          product={editing}
          onClose={() => {
            setEditing(null)
            setCreating(false)
          }}
          onSaved={() => {
            setEditing(null)
            setCreating(false)
            load()
          }}
        />
      )}
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
      {inStock ? 'В наличии' : 'Нет в наличии'}
    </span>
  )
}
