import type { Metadata } from 'next'
import { Phone, Send, MessageCircle, Package, ShoppingBag, Check, AlertCircle } from 'lucide-react'
import { BRAND, WHOLESALE, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { FaqAccordion } from '@/components/storefront/faq-accordion'
import { PageViewTracker } from '@/components/analytics/PageViewTracker'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'Оптовим покупцям та дропшиперам — JL Bags' },
  description:
    'Опт і дропшипінг жіночих сумок від виробника JL Bags: вигідні умови, власне виробництво, стабільна наявність, контент для продажів. Доставка по всій Україні.',
  alternates: { canonical: `${SITE_URL}/wholesale` },
}

const DROPSHIPPING_ITEMS = [
  'Відправки Новою Поштою та Укрпоштою',
  'Накладений платіж на Новій Пошті та Укрпошті за передоплатою 150 грн',
  'Відправки щодня окрім неділі',
  'Оплати до 13:30 відправляються день в день',
  'Є прайс з наявністю',
]

const WHOLESALE_ITEMS = [
  'Мінімальне замовлення від 10 одиниць',
  'Спеціальні оптові ціни',
  'Гнучка система знижок',
  'Індивідуальні умови доставки',
  'Можливість замовлення під вашою маркою',
]

const WHOLESALE_FAQ = [
  {
    q: 'Як швидко відправляються замовлення?',
    a: 'Замовлення, оформлені до 13:30, відправляємо того ж робочого дня. Решта — наступного робочого дня. Відправки здійснюються щодня окрім неділі.',
  },
  {
    q: 'Які способи доставки доступні?',
    a: 'Доставляємо Новою Поштою та Укрпоштою по всій Україні — у відділення, поштомат або адресною доставкою кур\'єром.',
  },
  {
    q: 'Скільки зберігаються посилки на пошті?',
    a: 'Посилки зберігаються на відділенні 7 днів, після чого повертаються відправнику. Для Нової Пошти можливе подовження через гарячу лінію або через нас. Укрпошта термін не подовжує.',
  },
  {
    q: 'Які умови для оптових закупівель?',
    a: 'Мінімальне замовлення від 10 одиниць, спеціальні оптові ціни та гнучка система знижок. Можливе замовлення під вашою маркою та індивідуальні умови доставки.',
  },
  {
    q: 'Як отримати прайс?',
    a: 'Зв\'яжіться з менеджером по дропшипінгу за телефоном, у Viber або Telegram — надішлемо актуальний прайс із наявністю та розкажемо про умови співпраці.',
  },
]

export default function WholesalePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <PageViewTracker event="wholesale_view" />

        {/* Black hero */}
        <section className="bg-neutral-950 text-white">
          <div className="max-w-4xl mx-auto px-6 py-20 sm:py-24 text-center">
            <h1 className="text-3xl sm:text-5xl font-black mb-5">Оптовим покупцям та партнерам</h1>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Вигідні умови співпраці для оптових покупців та дропшиперів.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 py-14 space-y-14">

          {/* Dropshipping section */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-7 h-7 text-neutral-900" strokeWidth={1.5} />
              <h2 className="text-2xl font-black text-neutral-900">Дропшипінг</h2>
            </div>
            <p className="text-neutral-500 text-sm mb-6">Працюйте без складу та вкладень</p>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 space-y-4 mb-4">
              {DROPSHIPPING_ITEMS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  </div>
                  <span className="text-sm text-neutral-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Warning box */}
            <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-5 py-4">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">
                Зберігання посилок на пошті 7 днів, потім повернення
              </p>
            </div>
            <ul className="mt-3 pl-5 space-y-1 text-sm text-neutral-600 list-disc">
              <li>Для Нової Пошти є подовження зберігання через гарячу лінію або через нас</li>
              <li>Укрпошта не подовжує термін</li>
            </ul>
          </section>

          {/* Wholesale section */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-7 h-7 text-neutral-900" strokeWidth={1.5} />
              <h2 className="text-2xl font-black text-neutral-900">Оптові продажі</h2>
            </div>
            <p className="text-neutral-500 text-sm mb-6">Спеціальні ціни для оптових партнерів</p>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 space-y-4">
              {WHOLESALE_ITEMS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-sm text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Manager CTA card */}
          <section className="rounded-2xl bg-neutral-950 text-white p-8 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-black mb-2">Менеджер по дропшипінгу</h2>
            <p className="text-neutral-400 text-sm mb-8">Зв&apos;яжіться з нами для отримання прайсу та деталей</p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <a
                href={`tel:${WHOLESALE.phone}`}
                data-track-event="phone_click"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-neutral-200 transition-colors"
              >
                <Phone className="w-4 h-4" /> Зателефонувати
              </a>
              <a
                href={WHOLESALE.viber}
                data-track-event="phone_click"
                className="inline-flex items-center gap-2 rounded-full bg-[#7360f2] text-white px-6 py-3 text-sm font-semibold hover:bg-[#6352d4] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Написати в Viber
              </a>
              <a
                href={WHOLESALE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                data-track-event="telegram_click"
                className="inline-flex items-center gap-2 rounded-full bg-[#2AABEE] text-white px-6 py-3 text-sm font-semibold hover:bg-[#1a9de0] transition-colors"
              >
                <Send className="w-4 h-4" /> Написати в Telegram
              </a>
            </div>

            <p className="text-lg font-bold text-white">{WHOLESALE.phoneDisplay}</p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-6">Часті питання</h2>
            <FaqAccordion items={WHOLESALE_FAQ} />
          </section>

          {/* General contacts */}
          <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-neutral-600 text-sm leading-relaxed">
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
