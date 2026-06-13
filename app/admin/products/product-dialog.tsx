'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Loader2 } from 'lucide-react'
import type { Product, ProductVariant, ProductPhoto } from '@/lib/types'
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
  const [category, setCategory] = useState(product?.category ?? '')
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

  async function save() {
    setError(null)
    if (!code.trim()) {
      setError('Код обязателен')
      return
    }
    setSaving(true)
    try {
      if (isCreate) {
        // Create base product, then PATCH to attach variants/photos
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
        category,
        price_retail: priceRetail,
        price_drop: priceDrop,
        is_active: isActive,
        variants,
        photos,
      }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Не удалось сохранить')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-white w-full h-[calc(100svh-0px)] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-lg shadow-lg flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
          <h2 className="font-semibold">{isCreate ? 'Новый товар' : `Товар ${product?.code}`}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 space-y-4 flex-1">
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
            <Field label="Категория">
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </Field>
            <Field label="Статус">
              <label className="flex items-center gap-2 text-sm h-[38px]">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Активен
              </label>
            </Field>
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
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
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
              <span className="text-sm font-medium text-gray-700">Фото (URL)</span>
              <button
                onClick={() => setPhotos((p) => [...p, { url: '', is_primary: p.length === 0 }])}
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Добавить
              </button>
            </div>
            {photos.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="https://…"
                  value={p.url}
                  onChange={(e) =>
                    setPhotos((arr) => arr.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                  }
                />
                <button
                  onClick={() => setPhotos((arr) => arr.filter((_, j) => j !== i))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {photos.length === 0 && <p className="text-xs text-gray-400">Нет фото</p>}
          </div>
        </div>

        <div className="border-t px-4 py-3 flex justify-end gap-2 shrink-0">
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
