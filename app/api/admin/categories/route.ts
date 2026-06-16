import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { slugify } from '@/lib/slug'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ─── GET: list categories (+ product counts) ──────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { supabase } = auth

  const { searchParams } = new URL(req.url)
  const activeOnly = searchParams.get('active') === '1'

  let query = supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (activeOnly) query = query.eq('is_active', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Attach product counts so the UI can warn before deleting a used category.
  const { data: prodCats } = await supabase.from('products').select('category_id')
  const counts = new Map<string, number>()
  for (const row of prodCats ?? []) {
    const id = (row as any).category_id
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  const categories = (data ?? []).map((c: any) => ({ ...c, product_count: counts.get(c.id) ?? 0 }))

  return NextResponse.json({ categories })
}

// ─── POST: create category ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { supabase } = auth

  const body = await req.json().catch(() => null)
  const name = String(body?.name ?? '').trim()
  if (!name) return NextResponse.json({ error: 'Название категории обязательно' }, { status: 400 })

  // Unique slug: base from name, append a short suffix if it collides.
  let slug = slugify(name)
  const { data: clash } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle()
  if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`

  // Place new category at the end.
  const { data: last } = await supabase
    .from('categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  const sort_order = Number.isFinite(body?.sort_order)
    ? Number(body.sort_order)
    : ((last?.sort_order ?? 0) + 1)

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug, sort_order, is_active: body?.is_active ?? true })
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Такая категория уже существует' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ category: { ...data, product_count: 0 } })
}
