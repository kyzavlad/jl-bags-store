'use client'

import { useEffect, useState } from 'react'
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Check, X } from 'lucide-react'
import type { Category } from '@/lib/types'
import { adminFetch } from '@/lib/admin-fetch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/categories')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка загрузки')
      setCategories(json.categories ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function create() {
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Не удалось создать')
      setNewName('')
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка')
    } finally {
      setCreating(false)
    }
  }

  async function patch(id: string, body: Record<string, any>) {
    setBusyId(id)
    setError(null)
    try {
      const res = await adminFetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка')
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка')
    } finally {
      setBusyId(null)
    }
  }

  async function remove(id: string) {
    if (!confirm('Удалить категорию?')) return
    setBusyId(id)
    setError(null)
    try {
      const res = await adminFetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error ?? 'Не удалось удалить')
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка')
    } finally {
      setBusyId(null)
    }
  }

  // Swap sort_order with the neighbour to move a category up/down.
  async function move(index: number, dir: -1 | 1) {
    const a = categories[index]
    const b = categories[index + dir]
    if (!a || !b) return
    setBusyId(a.id)
    setError(null)
    try {
      await Promise.all([
        adminFetch(`/api/admin/categories/${a.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ sort_order: b.sort_order }),
        }),
        adminFetch(`/api/admin/categories/${b.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ sort_order: a.sort_order }),
        }),
      ])
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl sm:text-3xl font-bold">Категории</h1>
      <p className="text-sm text-gray-500">
        Категории доступны в выпадающем списке при редактировании товара. Синхронизация остатков их не меняет.
      </p>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {/* Create */}
      <div className="flex gap-2">
        <Input
          placeholder="Новая категория"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              create()
            }
          }}
        />
        <Button onClick={create} disabled={creating || !newName.trim()} className="shrink-0">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 sm:mr-1.5" />}
          <span className="hidden sm:inline">Добавить</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Загрузка…
        </div>
      ) : (
        <div className="rounded-lg border bg-white divide-y">
          {categories.map((c, i) => {
            const busy = busyId === c.id
            return (
              <div key={c.id} className="flex items-center gap-2 px-3 py-2">
                <div className="flex flex-col">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0 || busy}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === categories.length - 1 || busy}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {editingId === c.id ? (
                  <Input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        patch(c.id, { name: editingName }).then(() => setEditingId(null))
                      }
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(c.id)
                      setEditingName(c.name)
                    }}
                    className="flex-1 text-left text-sm font-medium hover:underline"
                    title="Переименовать"
                  >
                    {c.name}
                    {!c.is_active && <span className="ml-2 text-xs text-gray-400">(отключена)</span>}
                  </button>
                )}

                <span className="text-xs text-gray-400 shrink-0">{c.product_count ?? 0} тов.</span>

                {editingId === c.id ? (
                  <>
                    <button
                      onClick={() => patch(c.id, { name: editingName }).then(() => setEditingId(null))}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <label className="flex items-center gap-1 text-xs text-gray-600 shrink-0">
                      <input
                        type="checkbox"
                        checked={c.is_active}
                        disabled={busy}
                        onChange={(e) => patch(c.id, { is_active: e.target.checked })}
                      />
                      Активна
                    </label>
                    <button
                      onClick={() => remove(c.id)}
                      disabled={busy}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded disabled:opacity-40"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            )
          })}
          {categories.length === 0 && (
            <div className="px-3 py-8 text-center text-gray-400 text-sm">Категорий пока нет</div>
          )}
        </div>
      )}
    </div>
  )
}
