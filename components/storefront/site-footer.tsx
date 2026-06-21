import Link from 'next/link'
import { Instagram, Facebook } from 'lucide-react'
import { BRAND } from '@/lib/seo'

const CATALOG_LINKS = [
  { slug: 'phone-bags',    name: 'Сумочки для телефону' },
  { slug: 'suede-bags',   name: 'Замшеві сумки' },
  { slug: 'leather-bags', name: 'Шкіряні сумки' },
  { slug: 'crossbody-bags', name: 'Сумки через плече' },
  { slug: 'shoppers',     name: 'Шопери' },
  { slug: 'backpacks',    name: 'Рюкзаки' },
  { slug: 'accessories',  name: 'Аксесуари' },
]

/** Julia Lebedeva Collection footer — dark, premium fashion style. */
export function SiteFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center justify-center w-9 h-9 rounded-full border border-white/40 shrink-0">
                <span className="text-[10px] font-black tracking-tighter text-white">JL</span>
              </span>
              <span className="text-white text-xs tracking-[0.3em] uppercase font-light">
                Julia Lebedeva
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500">
              Преміальні жіночі сумки з {BRAND.city}.
              Замшеві, шкіряні моделі та сумочки для телефону.
              Доставка по всій Україні.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
                aria-label="Instagram" className="hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
                aria-label="Facebook" className="hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <p className="text-xs tracking-widest uppercase text-white mb-5">Каталог</p>
            <ul className="space-y-3 text-sm">
              {CATALOG_LINKS.map((c) => (
                <li key={c.slug}>
                  <Link href={`/catalog/${c.slug}`}
                    className="hover:text-white transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery */}
          <div id="delivery">
            <p className="text-xs tracking-widest uppercase text-white mb-5">Доставка</p>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li>Нова пошта — по всій Україні</li>
              <li>Укрпошта — по всій Україні</li>
              <li>Відправка в день замовлення до&nbsp;{BRAND.orderCutoff}</li>
              <li>Оплата при отриманні</li>
            </ul>
          </div>

          {/* Contacts */}
          <div id="contacts">
            <p className="text-xs tracking-widest uppercase text-white mb-5">Контакти</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${BRAND.phone}`}
                  className="hover:text-white transition-colors">
                  {BRAND.phoneDisplay}
                </a>
              </li>
              <li className="text-neutral-500">{BRAND.city}, {BRAND.region}</li>
              <li className="text-neutral-500">Замовлення онлайн 24/7</li>
              <li>
                <Link href="/pricelist" className="hover:text-white transition-colors text-xs tracking-wider uppercase">
                  Прайс-лист для оптовиків →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
          <span>© {new Date().getFullYear()} Julia Lebedeva Collection. Усі права захищені.</span>
          <Link href="/admin" className="hover:text-neutral-400 transition-colors">
            Адміністрування
          </Link>
        </div>
      </div>
    </footer>
  )
}
