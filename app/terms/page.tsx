import type { Metadata } from 'next'
import { BRAND, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'Умови використання — JL Bags' },
  description: 'Умови використання сайту та умови замовлення JL Bags.',
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: false, follow: true },
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <article className="max-w-3xl mx-auto px-6 py-14">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">Умови використання</h1>
          <p className="text-xs text-neutral-400 mb-10">Остання редакція: 5 лютого 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-3">Замовлення</h2>
            <p className="text-neutral-600 leading-relaxed">
              Замовлення оформлюється за телефоном або через повідомлення в месенджерах.
              Менеджер підтверджує наявність, ціну та деталі доставки перед відправкою.
              Ціни на сайті вказані в гривнях і можуть змінюватися.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-3">Оплата та доставка</h2>
            <p className="text-neutral-600 leading-relaxed">
              Доступна оплата при отриманні (накладений платіж) або передоплата. Доставка
              здійснюється Новою Поштою та Укрпоштою по всій Україні згідно з тарифами перевізників.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-3">Обмін та повернення</h2>
            <p className="text-neutral-600 leading-relaxed">
              Обмін або повернення товару належної якості можливі протягом 14 днів за умови
              збереження товарного вигляду, упаковки та відсутності слідів використання,
              згідно з чинним законодавством України.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-3">Контакти</h2>
            <p className="text-neutral-600 leading-relaxed">
              З питань щодо замовлень:{' '}
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
