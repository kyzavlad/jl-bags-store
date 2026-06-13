import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { data, error } = await auth.supabase
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 })

  const { error } = await auth.supabase
    .from('store_settings')
    .update({
      store_name: body.store_name ?? 'JL Bags',
      contact_email: body.contact_email ?? '',
      contact_phone: body.contact_phone ?? '',
      currency: body.currency ?? 'грн',
    })
    .eq('id', 1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
