import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ─── PATCH: rename / reorder / enable-disable ─────────────────────────────────
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { supabase } = auth

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 })

  const patch: Record<string, any> = {}
  if (typeof body.name === 'string') {
    const name = body.name.trim()
    if (!name) return NextResponse.json({ error: 'Название не может быть пустым' }, { status: 400 })
    patch.name = name
  }
  if (typeof body.is_active === 'boolean') patch.is_active = body.is_active
  if (body.sort_order !== undefined && Number.isFinite(Number(body.sort_order))) {
    patch.sort_order = Number(body.sort_order)
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Нечего обновлять' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('categories')
    .update(patch)
    .eq('id', params.id)
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Keep the denormalized text `category` on linked products in sync on rename.
  if (patch.name) {
    await supabase.from('products').update({ category: patch.name }).eq('category_id', params.id)
  }

  return NextResponse.json({ category: data })
}

// ─── DELETE: only when no products reference the category ─────────────────────
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { supabase } = auth

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', params.id)

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: `Категория используется в ${count} товарах. Сначала отключите её или перенесите товары.` },
      { status: 409 }
    )
  }

  const { error } = await supabase.from('categories').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
