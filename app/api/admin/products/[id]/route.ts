import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ─── PATCH: update product fields + variants + photos ─────────────────────────
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { supabase } = auth
  const id = params.id

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 })

  const variants: any[] = Array.isArray(body.variants) ? body.variants : []
  const photos: any[] = Array.isArray(body.photos) ? body.photos : []

  // Compute stock status from variant quantities
  const totalQty = variants.reduce((s, v) => s + (Number(v.quantity) || 0), 0)
  const stock_status = totalQty > 0 ? 'in_stock' : 'out_of_stock'

  // 1. Update product fields (admin-controlled, full overwrite)
  const { error: pe } = await supabase
    .from('products')
    .update({
      code: String(body.code ?? '').trim(),
      name: body.name ?? '',
      description: body.description ?? '',
      material: body.material ?? '',
      size_text: body.size_text ?? '',
      category: body.category ?? '',
      price_retail: Number(body.price_retail) || 0,
      price_drop: Number(body.price_drop) || 0,
      is_active: body.is_active ?? true,
      stock_status,
    })
    .eq('id', id)
  if (pe) return NextResponse.json({ error: pe.message }, { status: 500 })

  // 2. Replace variants (delete + insert)
  await supabase.from('product_variants').delete().eq('product_id', id)
  if (variants.length > 0) {
    const rows = variants.map((v) => ({
      product_id: id,
      color: String(v.color ?? '—').trim() || '—',
      quantity: Number(v.quantity) || 0,
      reserved_quantity: Number(v.reserved_quantity) || 0,
      source_text: v.source_text ?? null,
      normalized_source_key:
        v.normalized_source_key ?? (String(v.color ?? '').toLowerCase().trim() || null),
    }))
    const { error: ve } = await supabase.from('product_variants').insert(rows)
    if (ve) return NextResponse.json({ error: ve.message }, { status: 500 })
  }

  // 3. Replace photos
  await supabase.from('product_photos').delete().eq('product_id', id)
  if (photos.length > 0) {
    const rows = photos
      .filter((p) => p.url && String(p.url).trim())
      .map((p, i) => ({
        product_id: id,
        url: String(p.url).trim(),
        is_primary: p.is_primary ?? i === 0,
        sort_order: Number(p.sort_order) || i,
      }))
    if (rows.length > 0) {
      const { error: phe } = await supabase.from('product_photos').insert(rows)
      if (phe) return NextResponse.json({ error: phe.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}

// ─── DELETE: remove product ───────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { error } = await auth.supabase.from('products').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
