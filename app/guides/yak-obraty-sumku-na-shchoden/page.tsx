import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'
import { SITE_URL } from '@/lib/seo'

const path = '/guides/yak-obraty-sumku-na-shchoden'
const canonical = `${SITE_URL}${path}`

export const metadata: Metadata = {
  title: { absolute: 'Як обрати жіночу сумку на щодень: розмір, матеріал і зручність | JL Bags' },
  description: 'Практичний гід JL Bags: як перевірити місткість, форму, матеріал, ремінець і застібки перед покупкою. Приклади форматів сумок та умови доставки по Україні.',
  alternates: { canonical },
  openGraph: {
    title: 'Як обрати сумку на кожен день — JL Bags',
    description: 'Що перевірити перед замовленням: розмір, потрібні речі, спосіб носіння, матеріал та оплата.',
    url: canonical,
    type: 'article',
  },
}

const steps = [
  {
    title: '1. Спочатку запишіть, що носите щодня',
    detail: 'Телефон, ключі, картки, окуляри, гаманець, косметичка, пляшка води або документи: для різних наборів речей потрібні різні формати. Не обирайте лише за фотографією — спочатку визначте свій мінімум.',
  },
  {
    title: '2. Зіставте розміри сумки з вашими речами',
    detail: 'Зовнішні габарити не дорівнюють корисному простору всередині. Особливо важливо перевірити, чи вміщаються гаманець, телефон та інші предмети з урахуванням перегородок і застібок. Якщо точних внутрішніх розмірів немає, уточніть їх перед покупкою.',
  },
  {
    title: '3. Виберіть спосіб носіння під день',
    detail: 'Кросбоді зручно носити через плече, коли потрібні вільні руки. Шопер доречний, якщо зазвичай берете більше речей або документи. Рюкзак може бути комфортнішим для активного дня чи поїздки. Важливо також перевірити фактичну довжину ремінця конкретної моделі.',
  },
  {
    title: '4. Уточніть матеріал саме обраної моделі',
    detail: 'Замша має виразну м’яку фактуру та потребує уважного догляду. Еко-шкіра і моделі з іншими матеріалами можуть мати іншу поверхню та відчуття. Не всі сумки однієї категорії виготовлені з одного складу — дивіться характеристики товару, а не тільки назву розділу.',
  },
  {
    title: '5. Перевірте кишені, застібки й доступ до речей',
    detail: 'Якщо часто дістаєте телефон або ключі, важливі не лише кількість відділень, а й зручність користування. Попросіть фото відкритої сумки або уточніть будову кишень для конкретного артикулу.',
  },
  {
    title: '6. Порівняйте реальний колір та пропорції',
    detail: 'На різних екранах відтінки можуть виглядати по-різному. Для повсякденної сумки корисно побачити фотографію на людині, щоб оцінити пропорції, а також уточнити наявність потрібного кольору перед замовленням.',
  },
  {
    title: '7. Заздалегідь перевірте умови отримання',
    detail: 'У JL Bags доставка по Україні передбачена Новою Поштою та Укрпоштою. На сторінці доставки описані повна оплата та післяплата з передоплатою 150 грн для роздрібного замовлення. Перед оплатою звірте актуальні умови для конкретної покупки.',
  },
]

const choices = [
  { title: 'Мінімум речей', description: 'Телефон, ключі та картки', href: '/catalog/phone-bags', label: 'Сумочки для телефону' },
  { title: 'Вільні руки в місті', description: 'Зручний формат через плече', href: '/catalog/crossbody-bags', label: 'Сумки кросбоді' },
  { title: 'Більше речей щодня', description: 'Робота, документи й покупки', href: '/catalog/shoppers', label: 'Шопери' },
]

export default function EverydayBagGuide() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Як обрати жіночу сумку на щодень: розмір, матеріал і зручність',
        description: 'Практичні критерії вибору жіночої сумки перед замовленням',
        mainEntityOfPage: canonical,
        datePublished: '2026-10-11',
        dateModified: '2026-10-11',
        author: { '@type': 'Organization', name: 'JL Bags' },
        publisher: { '@type': 'Organization', name: 'JL Bags', url: SITE_URL },
        inLanguage: 'uk-UA',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Як обрати сумку на щодень', item: canonical },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="min-h-screen bg-[#fbfaf7] text-[#171513]">
        <article className="mx-auto max-w-4xl px-6 py-12 sm:px-10 sm:py-20">
          <nav aria-label="Навігація" className="mb-10 text-sm text-black/50">
            <Link href="/" className="underline underline-offset-4 hover:text-black">Головна</Link>
            <span className="mx-3">/</span>
            Поради з вибору
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">JL Bags · практичний гід</p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-6xl">
            Як обрати жіночу сумку на щодень
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-black/65">
            Гарна сумка — це не лише колір чи силует. Вона має відповідати вашим речам, звичному маршруту й способу носіння. Ці сім перевірок допоможуть вибрати формат і не замовляти навмання.
          </p>

          <div className="mt-12 space-y-9">
            {steps.map(({ title, detail }) => (
              <section key={title} className="border-t border-black/10 pt-7">
                <h2 className="text-2xl font-black tracking-[-0.02em]">{title}</h2>
                <p className="mt-3 text-base leading-8 text-black/65">{detail}</p>
              </section>
            ))}
          </div>

          <section className="mt-16 rounded-3xl bg-[#efe8de] p-6 sm:p-9">
            <h2 className="text-2xl font-black tracking-[-0.03em]">З чого почати вибір у каталозі</h2>
            <p className="mt-3 leading-7 text-black/65">Перейдіть до формату, який відповідає вашому дню. Далі перевірте розміри й матеріал уже на сторінці конкретної моделі.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {choices.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl bg-white p-5 transition hover:shadow-md">
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="mt-2 text-xs leading-5 text-black/55">{item.description}</p>
                  <span className="mt-4 flex items-center gap-2 text-sm font-semibold">{item.label}<ArrowRight size={14} /></span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-3xl bg-[#171513] p-7 text-white sm:p-10">
            <h2 className="text-2xl font-bold">Не впевнені у розмірі чи місткості?</h2>
            <p className="mt-4 leading-7 text-white/70">Напишіть, що має поміститися всередині, і вкажіть артикул сумки. Уточнимо характеристики перед замовленням.</p>
            <a href="https://ig.me/m/sumki_kharkov" target="_blank" rel="noopener noreferrer" data-track-event="instagram_click" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black">
              Запитати про модель <ArrowRight size={16}/>
            </a>
            <p className="mt-5 text-xs text-white/55">Умови оплати та доставки: <Link href="/delivery-payment" className="underline underline-offset-4">детальна інформація</Link>.</p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
