import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">JL Bags Store</h1>
        <p className="text-gray-600 text-sm">
          Внутренний каталог и панель управления.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/admin"
            className="rounded-md bg-primary text-primary-foreground py-2 font-medium hover:opacity-90"
          >
            Войти в админку
          </Link>
          <p className="text-xs text-gray-400">
            Прайс-лист доступен по ссылке с ключом: <code>/pricelist?key=…</code>
          </p>
        </div>
      </div>
    </main>
  )
}
