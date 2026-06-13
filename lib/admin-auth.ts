import type { NextRequest } from 'next/server'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { getServiceSupabase } from './supabase/server'

type AuthOk = { ok: true; user: User; supabase: SupabaseClient }
type AuthErr = { ok: false; status: number; error: string }

/**
 * Verifies the Supabase access token sent by a logged-in admin as a Bearer
 * header. Returns a service-role client for trusted DB work on success.
 */
export async function requireAdmin(req: NextRequest): Promise<AuthOk | AuthErr> {
  const header = req.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return { ok: false, status: 401, error: 'Не авторизовано' }

  let supabase: SupabaseClient
  try {
    supabase = getServiceSupabase()
  } catch (e: any) {
    return { ok: false, status: 500, error: e?.message ?? 'Supabase не настроен' }
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) return { ok: false, status: 401, error: 'Не авторизовано' }
  return { ok: true, user, supabase }
}
