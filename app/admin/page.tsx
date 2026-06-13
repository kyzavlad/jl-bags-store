'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function authErrorToMessage(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Неверный email или пароль.'
  if (m.includes('email not confirmed')) return 'Email не подтверждён. Проверьте почту.'
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Слишком много попыток. Подождите минуту и попробуйте снова.'
  if (m.includes('network') || m.includes('fetch'))
    return 'Нет связи с сервером авторизации. Проверьте интернет и повторите.'
  return 'Не удалось войти. Попробуйте ещё раз или обратитесь к администратору.'
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Введите email и пароль.')
      return
    }
    if (!supabase) {
      setError('Конфигурация сервера недоступна (Supabase не настроен). Сообщите администратору.')
      return
    }

    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (authError) {
        setError(authErrorToMessage(authError.message))
        return
      }
      if (!data?.session) {
        setError('Сессия не создана. Проверьте доступ к этому аккаунту.')
        return
      }
      router.replace('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(authErrorToMessage(err?.message ?? ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">Вход в админку</h1>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Пароль</label>
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Вход…
            </>
          ) : (
            'Войти'
          )}
        </Button>
      </form>
    </div>
  )
}
