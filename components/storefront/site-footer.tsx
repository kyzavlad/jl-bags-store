import Link from 'next/link'
import { BRAND, NAV_CATEGORIES } from '@/lib/seo'

/** Public storefront footer with brand info, catalog links and contacts. */
export function SiteFooter() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-bold text-white mb-2">JL Bags</p>
          <p className="text-sm text-stone-400 leading-relaxed">
            Жіночі сумки з {BRAND.city}. Замшеві та шкіряні сумки, сумочки для телефону,
            шопери та рюкзаки з доставкою по всій Україні.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-3">Каталог</p>
          <ul className="space-y-2 text-sm">
            {NAV_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/catalog/${c.slug}`} className="text-stone-400 hover:text-white transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-3">Доставка</p>
          <ul className="space-y-2 text-sm text-stone-400">
            <li>Нова пошта по всій Україні</li>
            <li>Укрпошта по всій Україні</li>
            <li>Відправка в день замовлення до {BRAND.orderCutoff}</li>
            <li>Оплата при отриманні</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-3">Контакти</p>
          <ul className="space-y-2 text-sm text-stone-400">
            <li>
              <a href={`tel:${BRAND.phone}`} className="hover:text-white transition-colors">
                {BRAND.phoneDisplay}
              </a>
            </li>
            <li>{BRAND.city}, {BRAND.region}</li>
            <li>Замовлення онлайн 24/7</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-stone-500">
          <span>© {new Date().getFullYear()} JL Bags. Усі права захищені.</span>
          <Link href="/admin" className="hover:text-stone-300 transition-colors">
            Адмін
          </Link>
        </div>
      </div>
    </footer>
  )
}
