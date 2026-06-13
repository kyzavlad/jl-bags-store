'use client'

import { useEffect, useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { adminFetch } from '@/lib/admin-fetch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [currency, setCurrency] = useState('грн')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await adminFetch('/api/admin/settings')
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Ошибка')
        const s = json.settings ?? {}
        setStoreName(s.store_name ?? '')
        setEmail(s.contact_email ?? '')
        setPhone(s.contact_phone ?? '')
        setCurrency(s.currency ?? 'грн')
      } catch (e: any) {
        setError(e?.message ?? 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function save() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          store_name: storeName,
          contact_email: email,
          contact_phone: phone,
          currency,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка')
      setSaved(true)
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Загрузка…
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl sm:text-3xl font-bold">Настройки</h1>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Название магазина</label>
          <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Контактный email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Контактный телефон</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Валюта</label>
          <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Сохранение…
              </>
            ) : (
              'Сохранить'
            )}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" /> Сохранено
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
