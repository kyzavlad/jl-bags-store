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
  // Only default to JSON for non-FormData bodies — FormData needs the browser
  // to set its own multipart boundary, so we must not override Content-Type.
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData
  if (init.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(input, { ...init, headers })
}
