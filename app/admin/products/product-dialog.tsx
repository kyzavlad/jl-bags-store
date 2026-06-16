'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Plus, Trash2, Loader2, Upload, ImageIcon } from 'lucide-react'
import type { Product, ProductVariant, ProductPhoto, Category } from '@/lib/types'
import { adminFetch } from '@/lib/admin-fetch'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'

interface Props {
  product: Product | null // null = create
  onClose: () => void
  onSaved: () => void
}

type VariantDraft = Pick<ProductVariant, 'color' | 'quantity'> & {
  source_text?: string | null
  normalized_source_key?: string | null
}
type PhotoDraft = Pick<ProductPhoto, 'url' | 'is_primary'>

export function ProductDialog({ product, onClose, onSaved }: Props) {
  const isCreate = !product
  const [code, setCode] = useState(product?.code ?? '')
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [material, setMaterial] = useState(product?.material ?? '')
  const [sizeText, setSizeText] = useState(product?.size_text ?? '')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [priceRetail, setPriceRetail] = useState(String(product?.price_retail ?? 0))
  const [priceDrop, setPriceDrop] = useState(String(product?.price_drop ?? 0))
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [variants, setVariants] = useState<VariantDraft[]>(
    (product?.product_variants ?? []).map((v) => ({
      color: v.color,
      quantity: v.quantity,
      source_text: v.source_text,
      normalized_source_key: v.normalized_source_key,
    }))
  )
  const [photos, setPhotos] = useState<PhotoDraft[]>(
    (product?.product_photos ?? []).map((p) => ({ url: p.url, is_primary: p.is_primary }))
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Categories ────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([])
  const [newCatOpen, setNewCatOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [creatingCat, setCreatingCat] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await adminFetch('/api/admin/categories?active=1')
        const json = await res.json()
        if (res.ok) {
          const list: Category[] = json.categories ?? []
          setCategories(list)
          // Backfill selection for products that only have the old text category.
          if (!product?.category_id && product?.category) {
            const match = list.find(
              (c) => c.name.trim().toLowerCase() === String(product.category).trim().toLowerCase()
            )
            if (match) setCategoryId(match.id)
          }
        }
      } catch {
        /* non-fatal: dropdown just stays empty */
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function createCategory() {
    const nm = newCatName.trim()
    if (!nm) return
    setCreatingCat(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: nm }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Не удалось создать категорию')
      const cat: Category = json.category
      setCategories((cs) => [...cs, cat].sort((a, b) => a.sort_order - b.sort_order))
      setCategoryId(cat.id)
      setNewCatName('')
      setNewCatOpen(false)
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка создания категории')
    } finally {
      setCreatingCat(false)
    }
  }

  // ── Photo upload ────────────────────────────────────────────────────────────
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await adminFetch('/api/admin/upload-photo', { method: 'POST', body: fd })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Не удалось загрузить фото')
        setPhotos((arr) => [...arr, { url: json.url, is_primary: arr.length === 0 }])
      }
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка загрузки фото')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function save() {
    setError(null)
    if (!code.trim()) {
      setError('Код обязателен')
      return
    }
    setSaving(true)
    try {
      if (isCreate) {
        // Create base product, then PATCH to attach the rest.
        const createRes = await adminFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify({ code, name, price_retail: priceRetail, price_drop: priceDrop }),
        })
        const created = await createRes.json()
        if (!createRes.ok) throw new Error(created.error ?? 'Не удалось создать')
        await patch(created.id)
      } else {
        await patch(product!.id)
      }
      onSaved()
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  async function patch(id: string) {
    const res = await adminFetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        code,
        name,
        description,
        material,
        size_text: sizeText,
        category_id: categoryId || null,
        price_retail: priceRetail,
        price_drop: priceDrop,
        is_active: isActive,
        variants,
        photos: photos.filter((p) => p.url && p.url.trim()),
      }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Не удалось сохранить')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-lg shadow-lg flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
          <h2 className="font-semibold truncate">{isCreate ? 'Новый товар' : `Товар ${product?.code}`}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 space-y-4 flex-1 overscroll-contain">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Код">
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </Field>
            <Field label="Название">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Материал">
              <Input value={material} onChange={(e) => setMaterial(e.target.value)} />
            </Field>
            <Field label="Размер">
              <Input value={sizeText} onChange={(e) => setSizeText(e.target.value)} />
            </Field>

            {/* Category dropdown spanning both columns */}
            <div className="sm:col-span-2 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Категория</label>
                <button
                  type="button"
                  onClick={() => setNewCatOpen((o) => !o)}
                  className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Создать категорию
                </button>
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Выберите категорию</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {newCatOpen && (
                <div className="flex gap-2 pt-1">
                  <Input
                    placeholder="Название новой категории"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        createCategory()
                      }
                    }}
                  />
                  <Button onClick={createCategory} disabled={creatingCat || !newCatName.trim()}>
                    {creatingCat ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Добавить'}
                  </Button>
                </div>
              )}
            </div>

            <Field label="Статус">
              <label className="flex items-center gap-2 text-sm h-[38px]">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Активен
              </label>
            </Field>
            <div className="hidden sm:block" />
            <Field label="Розничная цена">
              <Input type="number" value={priceRetail} onChange={(e) => setPriceRetail(e.target.value)} />
            </Field>
            <Field label="Дроп-цена">
              <Input type="number" value={priceDrop} onChange={(e) => setPriceDrop(e.target.value)} />
            </Field>
          </div>

          <Field label="Описание">
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>

          {/* Variants */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Варианты (цвет / остаток)</span>
              <button
                onClick={() => setVariants((v) => [...v, { color: '', quantity: 0 }])}
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Добавить
              </button>
            </div>
            {variants.map((v, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Цвет"
                  value={v.color}
                  onChange={(e) =>
                    setVariants((arr) => arr.map((x, j) => (j === i ? { ...x, color: e.target.value } : x)))
                  }
                />
                <Input
                  type="number"
                  className="w-24"
                  placeholder="Кол-во"
                  value={String(v.quantity)}
                  onChange={(e) =>
                    setVariants((arr) =>
                      arr.map((x, j) => (j === i ? { ...x, quantity: Number(e.target.value) || 0 } : x))
                    )
                  }
                />
                <button
                  onClick={() => setVariants((arr) => arr.filter((_, j) => j !== i))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {variants.length === 0 && <p className="text-xs text-gray-400">Нет вариантов</p>}
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Фото</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="text-blue-600 text-sm flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {uploading ? 'Загрузка…' : 'Загрузить фото'}
                </button>
                <button
                  onClick={() => setPhotos((p) => [...p, { url: '', is_primary: p.length === 0 }])}
                  className="text-gray-500 text-sm flex items-center gap-1 hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> URL
                </button>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <p className="text-xs text-gray-400">JPG, PNG или WebP, до 10 МБ. Можно выбрать с телефона или компьютера.</p>
            {photos.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                {p.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.url} alt="" className="h-10 w-10 rounded object-cover border shrink-0" />
                ) : (
                  <span className="h-10 w-10 rounded border bg-gray-50 grid place-items-center text-gray-300 shrink-0">
                    <ImageIcon className="h-4 w-4" />
                  </span>
                )}
                <Input
                  placeholder="https://…"
                  value={p.url}
                  onChange={(e) =>
                    setPhotos((arr) => arr.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                  }
                />
                <button
                  onClick={() => setPhotos((arr) => arr.filter((_, j) => j !== i))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {photos.length === 0 && <p className="text-xs text-gray-400">Нет фото</p>}
          </div>
        </div>

        <div
          className="border-t px-4 py-3 flex justify-end gap-2 shrink-0"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Отмена
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Сохранение…
              </>
            ) : (
              'Сохранить'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}
