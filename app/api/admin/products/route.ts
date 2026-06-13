import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 50

// ─── GET: list + stats ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { supabase } = auth

  const { searchParams } = new URL(req.url)
  const search = (searchParams.get('search') ?? '').trim()
  const filter = searchParams.get('filter') ?? 'all'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))

  // Stats (counts)
  const [total, inStock, outOfStock, active] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'in_stock'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'out_of_stock'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  let query = supabase
    .from('products')
    .select('*, product_variants(*), product_photos(*)', { count: 'exact' })

  if (search) {
    const s = search.replace(/[%,]/g, '')
    query = query.or(`code.ilike.%${s}%,name.ilike.%${s}%,material.ilike.%${s}%`)
  }

  if (filter === 'in_stock') query = query.eq('stock_status', 'in_stock')
  else if (filter === 'out_of_stock') query = query.eq('stock_status', 'out_of_stock')
  else if (filter === 'no_description') query = query.or('description.is.null,description.eq.')
  else if (filter === 'no_retail') query = query.or('price_retail.is.null,price_retail.eq.0')
  else if (filter === 'no_photo') {
    // Products that have at least one photo → exclude them
    const { data: withPhotos } = await supabase.from('product_photos').select('product_id')
    const ids = Array.from(new Set((withPhotos ?? []).map((r: any) => r.product_id)))
    if (ids.length > 0) {
      query = query.not('id', 'in', `(${ids.join(',')})`)
    }
  }

  const from = (page - 1) * PAGE_SIZE
  query = query.order('code', { ascending: true }).range(from, from + PAGE_SIZE - 1)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    products: data ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    stats: {
      total: total.count ?? 0,
      inStock: inStock.count ?? 0,
      outOfStock: outOfStock.count ?? 0,
      active: active.count ?? 0,
    },
  })
}

// ─── POST: create product ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { supabase } = auth

  const body = await req.json().catch(() => null)
  if (!body?.code) return NextResponse.json({ error: 'Код обязателен' }, { status: 400 })

  const { data, error } = await supabase
    .from('products')
    .insert({
      code: String(body.code).trim(),
      name: body.name ?? `Товар ${body.code}`,
      description: body.description ?? '',
      material: body.material ?? '',
      size_text: body.size_text ?? '',
      category: body.category ?? '',
      price_retail: Number(body.price_retail) || 0,
      price_drop: Number(body.price_drop) || 0,
      is_active: body.is_active ?? true,
      stock_status: 'out_of_stock',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
