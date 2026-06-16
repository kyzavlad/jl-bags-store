import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BUCKET = 'product-photos'
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { supabase } = auth

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Ожидался файл (multipart/form-data)' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
  }

  const type = (file.type || '').toLowerCase()
  const ext = EXT_BY_TYPE[type]
  if (!ext) {
    return NextResponse.json(
      { error: 'Неподдерживаемый формат. Используйте JPG, PNG или WebP.' },
      { status: 415 }
    )
  }
  if (type === 'image/heic' || type === 'image/heif') {
    return NextResponse.json(
      { error: 'Формат HEIC не поддерживается. Сохраните фото как JPG, PNG или WebP.' },
      { status: 415 }
    )
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'Файл пустой' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Файл слишком большой. Максимум 10 МБ.' }, { status: 413 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: type, upsert: false, cacheControl: '31536000' })

  if (upErr) {
    const msg = upErr.message || ''
    if (/bucket not found|not found/i.test(msg)) {
      return NextResponse.json(
        {
          error:
            'Хранилище не настроено: bucket «product-photos» отсутствует. ' +
            'Создайте публичный bucket в Supabase → Storage (см. README).',
        },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: `Не удалось загрузить файл: ${msg}` }, { status: 500 })
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl, path })
}
