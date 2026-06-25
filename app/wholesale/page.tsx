import type { Metadata } from 'next'
import { Phone, Send, MessageCircle } from 'lucide-react'
import { BRAND, WHOLESALE, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Оптовим покупцям та партнерам — Julia Lebedeva Collection',
  description:
    'Вигідні умови співпраці для оптових покупців та дропшиперів. Власне виробництво, стабільна наявність, контент для продажів. Персональний менеджер по дропшипінгу.',
  alternates: { canonical: `${SITE_URL}/wholesale` },
}

export default function WholesalePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        {/* Black hero */}
        <section className="bg-neutral-950 text-white">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <h1 className="text-3xl sm:text-5xl font-black mb-5">Оптовим покупцям та партнерам</h1>
            <p className="text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Вигідні умови співпраці для оптових покупців та дропшиперів.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 py-14 space-y-12">
          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Дропшипінг</h2>
            <p className="text-neutral-600 leading-relaxed">
              Працюйте без власних складських запасів. Ми надаємо актуальний асортимент,
              якісний контент для продажів та відправляємо замовлення вашим клієнтам напряму
              від імені вашого магазину. Стабільна наявність і швидкі відправки по Україні.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Оптові продажі</h2>
            <p className="text-neutral-600 leading-relaxed">
              Спеціальні оптові ціни для магазинів та реселерів. Власне виробництво дозволяє
              тримати конкурентну вартість і стабільні залишки популярних моделей.
              Підберемо асортимент під ваш запит.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Менеджер по дропшипінгу</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Персональний менеджер допоможе з підключенням, асортиментом та поточними
              замовленнями. Зв’яжіться зручним для вас способом:
            </p>
            <p className="text-lg font-semibold text-neutral-900 mb-6">{WHOLESALE.phoneDisplay}</p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${WHOLESALE.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                <Phone className="w-4 h-4" /> Зателефонувати
              </a>
              <a
                href={WHOLESALE.viber}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-800 hover:border-black transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Написати в Viber
              </a>
              <a
                href={WHOLESALE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-800 hover:border-black transition-colors"
              >
                <Send className="w-4 h-4" /> Написати в Telegram
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-neutral-600 leading-relaxed">
              Загальні питання щодо замовлень:{' '}
              <a href={`tel:${BRAND.phone}`} className="font-semibold text-neutral-900 hover:underline">
                {BRAND.phoneDisplay}
              </a>
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
