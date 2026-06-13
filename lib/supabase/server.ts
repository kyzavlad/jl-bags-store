import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

/**
 * Server-side Supabase client using the service-role key. Bypasses RLS for
 * trusted admin/server operations. Never import this into client components.
 */
export function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Supabase server env is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).'
    )
  }
  if (!cached) {
    cached = createClient(url, key, { auth: { persistSession: false } })
  }
  return cached
}
