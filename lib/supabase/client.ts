'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Browser Supabase client (anon key). Used for admin email/password auth.
 * Is `null` when env vars are missing so the UI can show a clear message
 * instead of crashing at import time.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null
