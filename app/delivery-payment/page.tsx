import type { Metadata } from 'next'
import { Truck, Package, Clock, ShieldCheck, CreditCard, Wallet, Globe, Phone, Instagram, MapPin } from 'lucide-react'
import { BRAND, SOCIAL, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'Доставка та оплата — JL Bags | Нова Пошта, Укрпошта' },
  description:
    'Доставка замовлень JL Bags Новою Поштою та Укрпоштою по всій Україні. Накладений платіж або оплата на картку. Відправка протягом 1–2 робочих днів.',
  alternates: { canonical: `${SITE_URL}/delivery-payment` },
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-3 text-neutral-600 leading-relaxed">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

export default function DeliveryPaymentPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <article className="max-w-3xl mx-auto px-6 py-14">

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 mb-3">Доставка та оплата</h1>
          <p className="text-xs text-neutral-400 mb-8">Остання редакція: 5 лютого 2026</p>
          <p className="text-neutral-600 leading-relaxed text-lg mb-12">
            Ми пропонуємо зручні способи доставки та оплати для вашого комфорту. Нижче наведена
            детальна інформація про всі доступні опції.
          </p>

          {/* Способи доставки */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
              <h2 className="text-2xl font-black text-neutral-900">Способи доставки</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Ми працюємо з надійними службами доставки по всій Україні:
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-4">Нова Пошта</h3>
                <Bullets items={[
                  'Доставка у відділення або поштомат',
                  'Вартість доставки за тарифами перевізника',
                  'Середній час доставки: 1-3 дні',
                  'Доступна адресна доставка кур’єром',
                  'Можливість подовження терміну зберігання',
                ]} />
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-4">Укрпошта</h3>
                <Bullets items={[
                  'Доставка у відділення',
                  'Економічний варіант доставки',
                  'Середній час доставки: 3-7 днів',
                  'Вартість за тарифами перевізника',
                  'Зберігання на відділенні 7 днів',
                ]} />
              </div>
            </div>
          </section>

          {/* Терміни обробки */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
              <h2 className="text-2xl font-black text-neutral-900">Терміни обробки</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-5">Графік відправки замовлень:</p>
            <Bullets items={[
              'Відправка протягом 1-2 робочих днів після підтвердження',
              'Відправки здійснюються щодня окрім неділі',
              'Замовлення, оплачені до 13:30, відправляються в той же день',
              'Номер накладної надсилається одразу після відправки',
              'Відстеження посилки доступне на сайті перевізника',
            ]} />
          </section>

          {/* Зберігання посилок */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
              <h2 className="text-2xl font-black text-neutral-900">Зберігання посилок</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-5">Важлива інформація про зберігання:</p>
            <Bullets items={[
              'Посилки зберігаються на відділенні 7 днів безкоштовно',
              'Після закінчення терміну посилка повертається відправнику',
              'Нова Пошта: можливе подовження через гарячу лінію',
              'Укрпошта: подовження терміну не передбачено',
              'За повернення посилки клієнт сплачує вартість доставки',
            ]} />
          </section>

          {/* Способи оплати */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
              <h2 className="text-2xl font-black text-neutral-900">Способи оплати</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-6">Доступні зручні способи оплати:</p>

            <div className="space-y-5">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-4">Накладений платіж</h3>
                <Bullets items={[
                  'Оплата готівкою при отриманні на відділенні',
                  'Доступно на Новій Пошті та Укрпошті',
                  'Комісія за послугу стягується перевізником',
                  'Додаткова передоплата не потрібна для роздробу',
                ]} />
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-4">Оплата на картку</h3>
                <Bullets items={[
                  'Переказ на банківську картку',
                  'Після узгодження з менеджером',
                  'Реквізити надаються при оформленні',
                  'Відправка відразу після підтвердження оплати',
                ]} />
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-4">Оптові клієнти</h3>
                <Bullets items={[
                  'Спеціальні умови оплати для постійних партнерів',
                  'Можлива відстрочка платежу',
                  'Індивідуальні тарифи на доставку',
                ]} />
              </div>
            </div>
          </section>

          {/* Вартість доставки */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
              <h2 className="text-2xl font-black text-neutral-900">Вартість доставки</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-5">Ціноутворення доставки:</p>
            <Bullets items={[
              'Вартість залежить від ваги та габаритів посилки',
              'Розрахунок доступний на сайтах перевізників',
              'Орієнтовна вартість: від 50 до 150 грн',
              'Адресна доставка оплачується додатково',
              'Для великих замовлень можлива безкоштовна доставка',
            ]} />
          </section>

          {/* Міжнародна доставка */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-neutral-900" strokeWidth={1.5} />
              <h2 className="text-2xl font-black text-neutral-900">Міжнародна доставка</h2>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              На даний момент міжнародна доставка призупинена. Ми працюємо над розширенням географії
              доставки та повідомимо про можливості міжнародного відправлення найближчим часом.
            </p>
          </section>

          {/* Питання по доставці */}
          <section className="rounded-2xl bg-neutral-950 text-white p-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-white" strokeWidth={1.5} />
              <h2 className="text-2xl font-black">Питання по доставці</h2>
            </div>
            <p className="text-neutral-300 leading-relaxed mb-6">
              Якщо у вас виникли питання щодо доставки або оплати:
            </p>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${BRAND.phone}`} className="inline-flex items-center gap-3 text-white hover:text-neutral-300 transition-colors">
                  <Phone className="w-5 h-5" /> +380 95 742 7720
                </a>
              </li>
              <li>
                <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-white hover:text-neutral-300 transition-colors">
                  <Instagram className="w-5 h-5" /> {SOCIAL.instagramHandle}
                </a>
              </li>
              <li className="inline-flex items-center gap-3 text-neutral-300">
                <MapPin className="w-5 h-5" /> Харків, Україна
              </li>
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
