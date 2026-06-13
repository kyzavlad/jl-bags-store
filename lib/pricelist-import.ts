import type { SupabaseClient } from '@supabase/supabase-js'
import type { ImportReport } from './types'

// ─── CSV parsing ──────────────────────────────────────────────────────────────

export interface ParsedVariant {
  code: string
  color: string
  source_text: string
  normalized_key: string
  quantity: number
}

/** RFC-4180-ish CSV row parser that handles quoted fields and embedded commas. */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  const endField = () => {
    row.push(field)
    field = ''
  }
  const endRow = () => {
    endField()
    rows.push(row)
    row = []
  }

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      endField()
    } else if (c === '\n') {
      endRow()
    } else if (c === '\r') {
      // ignore CR
    } else {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) endRow()

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}

function extractCode(text: string): string {
  const m = text.trim().match(/^(\S+)/)
  return m ? m[1] : ''
}

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[«»"']/g, '')
    .trim()
}

function parseQuantity(raw: string): number {
  if (!raw) return 0
  const m = raw.replace(/\s/g, '').match(/-?\d+/)
  if (m) {
    const n = parseInt(m[0], 10)
    return Number.isFinite(n) && n > 0 ? n : 0
  }
  // Non-numeric "in stock" markers (e.g. Ukrainian "є", "+", "да")
  if (/^(є|\+|да|yes|в наявності|in stock)$/i.test(raw.trim())) return 1
  return 0
}

/**
 * Picks the product text column and quantity column from a row.
 * Legacy sheet layout: column B (index 1) = product, column C (index 2) = qty.
 * Falls back to columns A/B when B is empty.
 */
function pickColumns(row: string[]): { product: string; qty: string } | null {
  if ((row[1] ?? '').trim()) {
    return { product: row[1].trim(), qty: (row[2] ?? '').trim() }
  }
  if ((row[0] ?? '').trim()) {
    return { product: row[0].trim(), qty: (row[1] ?? '').trim() }
  }
  return null
}

export function parseCSV(text: string): { variants: ParsedVariant[]; skipped: number } {
  const rows = parseCsvRows(text)
  const variants: ParsedVariant[] = []
  let skipped = 0

  for (const row of rows) {
    const picked = pickColumns(row)
    if (!picked) {
      skipped++
      continue
    }
    const { product, qty } = picked

    // Skip header-ish rows that don't start with a code-like token
    if (/(товар|остаток|залишок|назв|product|код|name|qty)/i.test(product) && !/^\S*\d/.test(product)) {
      skipped++
      continue
    }

    const code = extractCode(product)
    if (!code) {
      skipped++
      continue
    }

    const color = product.slice(code.length).trim() || '—'
    variants.push({
      code,
      color,
      source_text: product,
      normalized_key: normalizeKey(product),
      quantity: parseQuantity(qty),
    })
  }

  return { variants, skipped }
}

// ─── Import runner ────────────────────────────────────────────────────────────

async function fetchAll(
  supabase: SupabaseClient,
  table: string,
  columns: string
): Promise<any[]> {
  const pageSize = 1000
  let from = 0
  const all: any[] = []
  // Supabase caps rows at 1000 per request — paginate with range().
  for (;;) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .range(from, from + pageSize - 1)
    if (error) throw new Error(`Чтение ${table}: ${error.message}`)
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < pageSize) break
    from += pageSize
  }
  return all
}

/**
 * Applies parsed sheet rows to the database.
 *
 * GUARANTEE: sync only writes variant quantities and the product stock flag.
 * It NEVER overwrites manually-entered price_retail, price_drop, description,
 * material, size_text, category, photos or name. New products/variants created
 * from the sheet start with prices = 0 (to be filled in the admin).
 */
export async function runImportFromVariants(
  variants: ParsedVariant[],
  supabase: SupabaseClient
): Promise<ImportReport> {
  const errors: string[] = []

  // Group parsed rows by product code
  const byCode = new Map<string, ParsedVariant[]>()
  for (const v of variants) {
    const list = byCode.get(v.code) ?? []
    list.push(v)
    byCode.set(v.code, list)
  }

  // Load existing products + variants once
  const existingProducts = await fetchAll(supabase, 'products', 'id, code')
  const productByCode = new Map<string, { id: string }>(
    existingProducts.map((p: any) => [p.code, { id: p.id }])
  )

  const existingVariants = await fetchAll(
    supabase,
    'product_variants',
    'id, product_id, normalized_source_key'
  )
  const variantKey = (pid: string, key: string | null) => `${pid}::${key ?? ''}`
  const variantMap = new Map<string, { id: string }>(
    existingVariants.map((v: any) => [variantKey(v.product_id, v.normalized_source_key), { id: v.id }])
  )

  let productsCreated = 0
  let productsUpdated = 0
  let variantsCreated = 0
  let variantsUpdated = 0

  for (const [code, group] of byCode) {
    const totalQty = group.reduce((s, v) => s + v.quantity, 0)
    const stock_status = totalQty > 0 ? 'in_stock' : 'out_of_stock'
    const existing = productByCode.get(code)

    if (!existing) {
      // Create new product — prices stay 0, to be filled in admin
      const { data, error } = await supabase
        .from('products')
        .insert({
          code,
          name: `Товар ${code}`,
          description: '',
          material: '',
          size_text: '',
          category: '',
          price_retail: 0,
          price_drop: 0,
          is_active: true,
          stock_status,
        })
        .select('id')
        .single()

      if (error || !data) {
        errors.push(`Создание товара ${code}: ${error?.message ?? 'нет данных'}`)
        continue
      }
      productsCreated++

      const rows = group.map((v) => ({
        product_id: data.id,
        color: v.color,
        quantity: v.quantity,
        reserved_quantity: 0,
        source_text: v.source_text,
        normalized_source_key: v.normalized_key,
      }))
      const { error: ve } = await supabase.from('product_variants').insert(rows)
      if (ve) errors.push(`Варианты товара ${code}: ${ve.message}`)
      else variantsCreated += rows.length
    } else {
      // Existing product — update ONLY stock flag, never prices/text
      const { error: pe } = await supabase
        .from('products')
        .update({ stock_status, is_active: true })
        .eq('id', existing.id)
      if (pe) errors.push(`Обновление товара ${code}: ${pe.message}`)
      else productsUpdated++

      for (const v of group) {
        const match = variantMap.get(variantKey(existing.id, v.normalized_key))
        if (match) {
          const { error: ue } = await supabase
            .from('product_variants')
            .update({ quantity: v.quantity })
            .eq('id', match.id)
          if (ue) errors.push(`Вариант ${code}/${v.color}: ${ue.message}`)
          else variantsUpdated++
        } else {
          const { error: ie } = await supabase.from('product_variants').insert({
            product_id: existing.id,
            color: v.color,
            quantity: v.quantity,
            reserved_quantity: 0,
            source_text: v.source_text,
            normalized_source_key: v.normalized_key,
          })
          if (ie) errors.push(`Новый вариант ${code}/${v.color}: ${ie.message}`)
          else variantsCreated++
        }
      }
    }
  }

  // Verification count
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return {
    totalParsed: variants.length,
    productsCreated,
    productsUpdated,
    variantsCreated,
    variantsUpdated,
    expectedProductsCount: byCode.size,
    activeProductsCount: count ?? 0,
    errors,
  }
}

// ─── Google Sheets URL normalization ──────────────────────────────────────────

export type SourceType = 'csv' | 'published' | 'spreadsheet' | 'raw'

export function resolveGoogleSheetsCSVUrl(raw: string): { csvUrl: string; sourceType: SourceType } {
  const input = raw.trim()

  if (/[?&](output|format)=csv/.test(input)) {
    return { csvUrl: input, sourceType: 'csv' }
  }

  const pub = input.match(/\/spreadsheets\/d\/e\/([^/?\s]+)/)
  if (pub) {
    const gid = input.match(/[?&]gid=(\d+)/)?.[1] ?? '0'
    return {
      csvUrl: `https://docs.google.com/spreadsheets/d/e/${pub[1]}/pub?gid=${gid}&single=true&output=csv`,
      sourceType: 'published',
    }
  }

  const normal = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
  if (normal) {
    const gid = input.match(/[?&]gid=(\d+)/)?.[1] ?? '0'
    return {
      csvUrl: `https://docs.google.com/spreadsheets/d/${normal[1]}/export?format=csv&gid=${gid}`,
      sourceType: 'spreadsheet',
    }
  }

  return { csvUrl: input, sourceType: 'raw' }
}
