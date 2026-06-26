import { Backpack, ShoppingBag, Wallet, Package, Tag, type LucideIcon } from 'lucide-react'
import { getServiceSupabase } from '@/lib/supabase/server'
import type { Category } from '@/lib/types'

/**
 * Fetch all active categories from the database, ordered by sort_order then name.
 * Returns [] on any DB error so the storefront degrades to a clean empty state /
 * fallback instead of throwing during render or build.
 */
export async function fetchActiveCategories(): Promise<Category[]> {
  try {
    const supabase = getServiceSupabase()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    return (data ?? []) as Category[]
  } catch {
    return []
  }
}

/**
 * Safe fallback used ONLY when the database returns no categories (empty DB or
 * connection error). These link to /catalog rather than a possibly-missing slug.
 */
export const FALLBACK_CATEGORIES: { name: string; slug: string }[] = [
  { name: 'Сумочки для телефону', slug: 'phone-bags' },
  { name: 'Замшеві сумки', slug: 'suede-bags' },
  { name: 'Шкіряні сумки', slug: 'leather-bags' },
  { name: 'Сумки через плече', slug: 'crossbody-bags' },
  { name: 'Шопери', slug: 'shoppers' },
  { name: 'Рюкзаки', slug: 'backpacks' },
  { name: 'Гаманці', slug: 'accessories' },
]

/**
 * Pick an icon for a category from its (Ukrainian) name. Admin categories use
 * transliterated slugs, so matching on the human name is the reliable signal.
 */
export function iconForCategory(name: string): LucideIcon {
  const n = (name || '').toLowerCase()
  if (n.includes('рюкзак')) return Backpack
  if (n.includes('гаман')) return Wallet
  if (n.includes('бананк')) return Package
  if (n.includes('розпродаж') || n.includes('знижк') || n.includes('акці') || n.includes('sale')) return Tag
  // сумка / сумочка / клатч / кросбоді / шопер / телефон → bag
  return ShoppingBag
}
