import type { Metadata } from 'next'
import { BRAND, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Політика конфіденційності — Julia Lebedeva Collection',
  description: 'Політика конфіденційності Julia Lebedeva Collection: які дані ми збираємо та як їх використовуємо.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: false, follow: true },
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <article className="max-w-3xl mx-auto px-6 py-14">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">Політика конфіденційності</h1>
          <p className="text-xs text-neutral-400 mb-10">Остання редакція: 5 лютого 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-3">Які дані ми збираємо</h2>
            <p className="text-neutral-600 leading-relaxed">
              Для оформлення та доставки замовлення ми обробляємо ім’я, номер телефону та дані
              для відправки (місто, відділення пошти). Ми не збираємо більше даних, ніж необхідно
              для виконання замовлення.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-3">Як ми використовуємо дані</h2>
            <p className="text-neutral-600 leading-relaxed">
              Дані використовуються виключно для обробки замовлень, доставки, зв’язку з клієнтом
              та виконання гарантійних зобов’язань. Ми не передаємо персональні дані третім особам,
              окрім служб доставки в обсязі, потрібному для відправки.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-3">Зберігання та захист</h2>
            <p className="text-neutral-600 leading-relaxed">
              Ми вживаємо розумних організаційних і технічних заходів для захисту персональних даних.
              Дані зберігаються лише протягом часу, потрібного для виконання замовлень та вимог
              законодавства.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-3">Контакти</h2>
            <p className="text-neutral-600 leading-relaxed">
              З питань обробки персональних даних звертайтеся:{' '}
              <a href={`tel:${BRAND.phone}`} className="font-semibold text-neutral-900 hover:underline">
                {BRAND.phoneDisplay}
              </a>
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
