'use client'

import { useState } from 'react'
import { RefreshCw, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import type { ImportReport } from '@/lib/types'
import { adminFetch } from '@/lib/admin-fetch'
import { Button } from '@/components/ui/button'

const SOURCE_LABELS: Record<string, string> = {
  csv: 'Прямой CSV',
  published: 'Опубликованная таблица',
  spreadsheet: 'Google Spreadsheet',
  raw: 'Произвольный URL',
}

type State = 'idle' | 'syncing' | 'done' | 'error'

export default function AdminImportPage() {
  const [state, setState] = useState<State>('idle')
  const [report, setReport] = useState<ImportReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sourceType, setSourceType] = useState<string | null>(null)
  const [rowsSkipped, setRowsSkipped] = useState(0)

  async function sync() {
    setState('syncing')
    setError(null)
    setReport(null)
    try {
      const res = await adminFetch('/api/admin/sync-pricelist', { method: 'POST' })
      const json = await res.json()
      setSourceType(json.sourceType ?? null)
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Ошибка синхронизации')
        setState('error')
        return
      }
      setReport(json.report)
      setRowsSkipped(json.rowsSkipped ?? 0)
      setState('done')
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка')
      setState('error')
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl sm:text-3xl font-bold">Импорт прайса</h1>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-semibold text-base">Синхронизация из Google Sheets</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Источник: переменная <span className="font-mono">GOOGLE_SHEET_CSV_URL</span>
            </p>
            {sourceType && (
              <p className="text-xs text-blue-600 mt-1">Тип: {SOURCE_LABELS[sourceType] ?? sourceType}</p>
            )}
          </div>
          <Button onClick={sync} disabled={state === 'syncing'} className="w-full sm:w-auto shrink-0">
            {state === 'syncing' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Синхронизация…
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" /> Синхронизировать
              </>
            )}
          </Button>
        </div>

        <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Синхронизация обновляет только остатки. Цены, фото, описания, материалы, размеры и категории
          заполняются вручную в админке и никогда не перезаписываются.
        </div>

        {state === 'error' && error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {state === 'done' && report && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              <span className="text-sm font-medium">Синхронизация завершена</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm">
              <Row label="Строк разобрано" value={report.totalParsed} />
              <Row label="Строк пропущено" value={rowsSkipped} />
              <Row label="Товаров создано" value={report.productsCreated} color="text-blue-600" />
              <Row label="Товаров обновлено" value={report.productsUpdated} color="text-green-700" />
              <Row label="Вариантов создано" value={report.variantsCreated} color="text-blue-600" />
              <Row label="Вариантов обновлено" value={report.variantsUpdated} color="text-green-700" />
              <Row label="Активных в БД" value={`${report.activeProductsCount}`} />
              <Row label="Ожидалось кодов" value={report.expectedProductsCount} />
            </div>
            {report.errors.length > 0 && (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800">
                <p className="font-semibold mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Ошибки ({report.errors.length})
                </p>
                <ul className="space-y-0.5">
                  {report.errors.slice(0, 8).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                  {report.errors.length > 8 && <li>…и ещё {report.errors.length - 8}</li>}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 space-y-1">
          <p className="font-medium text-gray-700">Формат таблицы:</p>
          <ul className="list-disc ml-4 space-y-0.5">
            <li>Колонка B — товар (код + цвет/вариант, например «1234 замша чёрный»)</li>
            <li>Колонка C — остаток (число)</li>
            <li>Опубликуйте лист как CSV: Файл → Поделиться → Опубликовать в интернете → CSV</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, color = '' }: { label: string; value: number | string; color?: string }) {
  return (
    <>
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-right ${color}`}>{value}</span>
    </>
  )
}
