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

/**
 * Recognized material/group prefix markers that appear right after the numeric
 * model code in column B. Each represents a different material line that the
 * business treats as a separate, separately-priced product card:
 *   Е/E — екошкіра, З — замша, Р — рептилія (and combinations like ЗР, ЕР).
 * Latin "E" is normalized to Cyrillic "Е".
 */
function normalizePrefix(raw: string): string {
  return raw.toUpperCase().replace(/E/g, 'Е') // Latin E → Cyrillic Е
}

export interface ParsedProductText {
  /** Grouping code used as products.code — e.g. "5304-Е" or "5304" (no prefix). */
  code: string
  /** Numeric base model code — e.g. "5304". */
  baseCode: string
  /** Material/group prefix — e.g. "Е" | "ЗР" | null when absent. */
  prefix: string | null
  /** Remaining color/variant text after the prefix — e.g. "бордо". */
  color: string
}

/**
 * Splits the raw product text from column B into base code + material/group
 * prefix + color, and builds a unique product code at the COLOR level. Every
 * source row becomes its own independent product card.
 *
 *   "5304 Е беж"     → { code: "5304-Е беж",  baseCode: "5304", prefix: "Е",  color: "беж" }
 *   "5304 Р шоколад" → { code: "5304-Р шоколад", baseCode: "5304", prefix: "Р", color: "шоколад" }
 *   "5404 ЗР лате"   → { code: "5404-ЗР лате", baseCode: "5404", prefix: "ЗР", color: "лате" }
 *   "1234 чорний"    → { code: "1234 чорний", baseCode: "1234", prefix: null, color: "чорний" }
 *
 * When no numeric code or no recognized prefix is found, the code still
 * includes the color so each row maps to a distinct product.
 */
export function parseProductText(text: string): ParsedProductText {
  const t = text.trim().replace(/\s+/g, ' ')

  const codeMatch = t.match(/^(\d+)/)
  if (!codeMatch) {
    // No numeric code — first token is the base, color is the remainder.
    const token = extractCode(t)
    const color = t.slice(token.length).trim() || '—'
    const code = color === '—' ? token : `${token} ${color}`
    return { code, baseCode: token, prefix: null, color }
  }

  const baseCode = codeMatch[1]
  const rest = t.slice(baseCode.length).replace(/^[\s\-–/]+/, '')

  // Material/group prefix: 1–2 letters drawn only from the material marker set
  // {Е, E, З, Р}, terminated by whitespace, end, or a separator. Colors like
  // "беж", "бордо", "чорний" never match because they start outside this set.
  const prefixMatch = rest.match(/^([ЕEЗРеeзр]{1,2})(?=\s|$|[-–/])/)
  if (prefixMatch) {
    const prefix = normalizePrefix(prefixMatch[1])
    const color = rest.slice(prefixMatch[1].length).replace(/^[\s\-–/]+/, '').trim() || '—'
    const code = color === '—' ? `${baseCode}-${prefix}` : `${baseCode}-${prefix} ${color}`
    return { code, baseCode, prefix, color }
  }

  // Numeric code but no material prefix — one product per code + color.
  const color = rest.trim() || '—'
  const code = color === '—' ? baseCode : `${baseCode} ${color}`
  return { code, baseCode, prefix: null, color }
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

    const parsed = parseProductText(product)
    if (!parsed.code) {
      skipped++
      continue
    }

    variants.push({
      code: parsed.code,
      color: parsed.color,
      source_text: product,
      // Key stays the normalized FULL source text so re-syncs match the same
      // variant row regardless of grouping changes.
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

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

/**
 * Applies parsed sheet rows to the database.
 *
 * GUARANTEE: sync only writes variant quantities and the product stock flag.
 * It NEVER overwrites manually-entered price_retail, price_drop, description,
 * material, size_text, category, photos or name. New products/variants created
 * from the sheet start with prices = 0 (to be filled in the admin).
 *
 * PERFORMANCE: uses bulk operations to avoid N×M sequential round-trips:
 *   - 2 UPDATE queries for stock status (grouped by in_stock / out_of_stock)
 *   - 1 batch INSERT for new products
 *   - parallel batched UPDATEs (20 concurrent) for variant quantities
 *   - 1-few batch INSERTs for new variants
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

  // ── 1. Load all existing data in parallel ────────────────────────────────
  const [existingProducts, existingVariants] = await Promise.all([
    fetchAll(supabase, 'products', 'id, code'),
    fetchAll(supabase, 'product_variants', 'id, product_id, normalized_source_key'),
  ])

  const productByCode = new Map<string, { id: string }>(
    existingProducts.map((p: any) => [p.code, { id: p.id }])
  )
  const vKey = (pid: string, key: string | null) => `${pid}::${key ?? ''}`
  const variantById = new Map<string, string>(
    existingVariants.map((v: any) => [vKey(v.product_id, v.normalized_source_key), v.id])
  )

  // ── 2. Classify all work to be done ─────────────────────────────────────
  const newProductRows: object[]              = []
  const newProductVariants                    = new Map<string, ParsedVariant[]>() // code → variants
  const inStockIds: string[]                  = []
  const outOfStockIds: string[]               = []
  const variantUpdates: { id: string; quantity: number }[] = []
  const newVariantRows: object[]              = []

  let productsCreated = 0
  let productsUpdated = 0
  let variantsCreated = 0
  let variantsUpdated = 0

  for (const [code, group] of byCode) {
    const totalQty = group.reduce((s, v) => s + v.quantity, 0)
    const stock_status: 'in_stock' | 'out_of_stock' = totalQty > 0 ? 'in_stock' : 'out_of_stock'
    const existing = productByCode.get(code)

    if (!existing) {
      // New product — title defaults to the full code (e.g. "5304-Е беж");
      // prices stay 0, all text fields blank, to be filled in admin.
      newProductRows.push({ code, name: code, description: '', material: '',
        size_text: '', category: '', price_retail: 0, price_drop: 0, is_active: true, stock_status })
      newProductVariants.set(code, group)
    } else {
      // Existing product — only stock flag changes
      if (stock_status === 'in_stock') inStockIds.push(existing.id)
      else outOfStockIds.push(existing.id)
      productsUpdated++

      for (const v of group) {
        const varId = variantById.get(vKey(existing.id, v.normalized_key))
        if (varId) {
          variantUpdates.push({ id: varId, quantity: v.quantity })
          variantsUpdated++
        } else {
          newVariantRows.push({ product_id: existing.id, color: v.color,
            quantity: v.quantity, reserved_quantity: 0,
            source_text: v.source_text, normalized_source_key: v.normalized_key })
          variantsCreated++
        }
      }
    }
  }

  // ── 3a. Bulk stock-status updates — 2 queries instead of N ──────────────
  // Chunk to stay under URL/query limits (Supabase handles large .in() fine,
  // but we chunk at 1000 just to be safe with very large catalogues).
  const stockOps = [
    ...chunk(inStockIds, 1000).map((ids) =>
      supabase.from('products').update({ stock_status: 'in_stock', is_active: true }).in('id', ids)
    ),
    ...chunk(outOfStockIds, 1000).map((ids) =>
      supabase.from('products').update({ stock_status: 'out_of_stock', is_active: true }).in('id', ids)
    ),
  ]

  // ── 3b. Batch insert new products, then build their variant rows ─────────
  const createdMap = new Map<string, string>() // code → id
  if (newProductRows.length > 0) {
    const { data, error } = await supabase
      .from('products')
      .insert(newProductRows)
      .select('id, code')
    if (error) {
      errors.push(`Создание новых товаров: ${error.message}`)
    } else {
      productsCreated = (data ?? []).length
      for (const p of (data ?? [])) createdMap.set(p.code, p.id)
    }
  }

  const newProductVariantRows: object[] = []
  for (const [code, group] of newProductVariants) {
    const pid = createdMap.get(code)
    if (!pid) continue
    for (const v of group) {
      newProductVariantRows.push({ product_id: pid, color: v.color,
        quantity: v.quantity, reserved_quantity: 0,
        source_text: v.source_text, normalized_source_key: v.normalized_key })
      variantsCreated++
    }
  }

  // ── 3c. Parallel variant quantity updates — batches of 20 concurrent ────
  // Sequential over batch groups, 20 concurrent within each batch.
  // With ~2500 variants: 125 rounds × ~200 ms each = ~25 s (vs ~580 s sequential).
  const CONCURRENCY = 20
  const updateBatches = chunk(variantUpdates, CONCURRENCY)
  for (const batch of updateBatches) {
    const results = await Promise.all(
      batch.map(({ id, quantity }) =>
        supabase.from('product_variants').update({ quantity }).eq('id', id)
      )
    )
    for (const { error } of results) {
      if (error) errors.push(`Обновление варианта: ${error.message}`)
    }
  }

  // ── 3d. Run stock ops + new variant inserts in parallel ──────────────────
  const allNewVariantRows = [...newVariantRows, ...newProductVariantRows]
  const insertOps = chunk(allNewVariantRows, 500).map((rows) =>
    supabase.from('product_variants').insert(rows)
  )

  const allParallelOps = [...stockOps, ...insertOps]
  if (allParallelOps.length > 0) {
    const results = await Promise.all(allParallelOps)
    for (const { error } of results as any[]) {
      if (error) errors.push(`Массовая операция: ${error.message}`)
    }
  }

  // ── 4. Verification count ────────────────────────────────────────────────
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
