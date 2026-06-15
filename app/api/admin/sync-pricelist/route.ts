import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { parseCSV, runImportFromVariants, resolveGoogleSheetsCSVUrl } from '@/lib/pricelist-import'

export const runtime = 'nodejs'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

function safeLogUrl(url: string): string {
  try {
    const u = new URL(url)
    return `${u.origin}${u.pathname}`
  } catch {
    return '[invalid URL]'
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  const { supabase } = auth

  const rawUrl = process.env.GOOGLE_SHEET_CSV_URL
  if (!rawUrl) {
    return NextResponse.json(
      { ok: false, error: 'GOOGLE_SHEET_CSV_URL не задан на сервере. Добавьте переменную в Vercel.' },
      { status: 500 }
    )
  }

  const { csvUrl, sourceType } = resolveGoogleSheetsCSVUrl(rawUrl)
  console.log('[sync] source:', sourceType, safeLogUrl(csvUrl))

  // Fetch CSV
  let res: Response
  try {
    res = await fetch(csvUrl, { cache: 'no-store' })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: `Не удалось получить таблицу: ${e?.message ?? 'сетевая ошибка'}` },
      { status: 502 }
    )
  }

  const contentType = res.headers.get('content-type') ?? ''

  if (!res.ok) {
    const isPrivate = res.status === 401 || res.status === 403
    const is404 = res.status === 404
    let hint = ''
    if (is404) hint = ' Проверьте ссылку и опубликуйте лист: Файл → Поделиться → Опубликовать в интернете → CSV.'
    else if (isPrivate) hint = ' Таблица закрыта. Опубликуйте лист как CSV.'
    return NextResponse.json(
      { ok: false, error: `Ошибка загрузки Google Sheets: ${res.status} ${res.statusText}.${hint}`, sourceType },
      { status: 502 }
    )
  }

  if (contentType.includes('text/html')) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Google вернул HTML вместо CSV — таблица не опубликована как CSV. ' +
          'Откройте таблицу → Файл → Поделиться → Опубликовать в интернете → выберите лист → CSV.',
        sourceType,
      },
      { status: 502 }
    )
  }

  const csvText = await res.text()
  const { variants, skipped } = parseCSV(csvText)

  if (variants.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: `CSV получен, но пригодных строк не найдено (пропущено: ${skipped}). Проверьте формат: колонка B — товар, C — остаток.`,
        sourceType,
      },
      { status: 422 }
    )
  }

  try {
    const report = await runImportFromVariants(variants, supabase)
    return NextResponse.json({ ok: true, report, rowsSkipped: skipped, sourceType })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Ошибка импорта', sourceType },
      { status: 500 }
    )
  }
}
