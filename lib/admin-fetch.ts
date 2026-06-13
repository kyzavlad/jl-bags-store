'use client'

import { supabase } from './supabase/client'

/** Authenticated fetch that attaches the current admin's Supabase access token. */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  if (!supabase) throw new Error('Supabase не настроен')
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error('Сессия истекла. Войдите снова.')

  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  return fetch(input, { ...init, headers })
}
