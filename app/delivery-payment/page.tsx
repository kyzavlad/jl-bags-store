import type { Metadata } from 'next'
import { BRAND, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Доставка та оплата — Julia Lebedeva Collection',
  description:
    'Доставка Новою Поштою та Укрпоштою по всій Україні. Оплата при отриманні або передоплата. Відправка в день замовлення.',
  alternates: { canonical: `${SITE_URL}/delivery-payment` },
}

export default function DeliveryPaymentPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <article className="max-w-3xl mx-auto px-6 py-14">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">Доставка та оплата</h1>
          <p className="text-xs text-neutral-400 mb-10">Остання редакція: 5 лютого 2026</p>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Способи доставки</h2>
            <p className="text-neutral-600 leading-relaxed">
              Відправляємо замовлення по всій Україні Новою Поштою та Укрпоштою.
              Замовлення, оформлені до {BRAND.orderCutoff}, відправляємо того ж робочого дня —
              зазвичай доставка займає 1–2 робочих дні. Доступна оплата при отриманні
              (накладений платіж) або передоплата на картку.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Нова Пошта</h2>
            <ul className="space-y-2 text-neutral-600 leading-relaxed list-disc pl-5">
              <li>Доставка у відділення, поштомат або адресна кур’єрська доставка.</li>
              <li>Оплата при отриманні (накладений платіж) або передоплата.</li>
              <li>Безкоштовне зберігання посилки у відділенні протягом 5 днів.</li>
              <li>Вартість доставки — за тарифами перевізника.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Укрпошта</h2>
            <ul className="space-y-2 text-neutral-600 leading-relaxed list-disc pl-5">
              <li>Доставка у відділення Укрпошти по всій Україні.</li>
              <li>Підходить для населених пунктів без відділень інших перевізників.</li>
              <li>Оплата при отриманні або передоплата.</li>
              <li>Вартість доставки — за тарифами Укрпошти.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-neutral-600 leading-relaxed">
              Маєте питання щодо доставки чи оплати? Зателефонуйте нам:{' '}
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
