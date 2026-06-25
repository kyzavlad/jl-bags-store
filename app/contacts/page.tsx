import type { Metadata } from 'next'
import { Phone, Instagram, Facebook, Send } from 'lucide-react'
import { BRAND, SOCIAL, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Контакти — Julia Lebedeva Collection',
  description:
    'Зв’яжіться з Julia Lebedeva Collection: телефон, Instagram, Facebook, Telegram. Жіночі сумки з доставкою по всій Україні.',
  alternates: { canonical: `${SITE_URL}/contacts` },
}

const ITEMS = [
  { Icon: Phone,     label: 'Телефон',   value: BRAND.phoneDisplay,        href: `tel:${BRAND.phone}` },
  { Icon: Instagram, label: 'Instagram', value: SOCIAL.instagramHandle,    href: SOCIAL.instagram },
  { Icon: Facebook,  label: 'Facebook',  value: SOCIAL.facebookName,       href: SOCIAL.facebook },
  { Icon: Send,      label: 'Telegram',  value: 'Написати в Telegram',     href: SOCIAL.telegram },
]

export default function ContactsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-14">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3">Контакти</h1>
          <p className="text-neutral-500 mb-10">
            {BRAND.city}, {BRAND.region} · Доставка по всій Україні · Замовлення онлайн 24/7
          </p>

          <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
            {ITEMS.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  target={it.href.startsWith('http') ? '_blank' : undefined}
                  rel={it.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 py-5 group"
                >
                  <span className="w-11 h-11 shrink-0 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:bg-black group-hover:text-white transition-colors">
                    <it.Icon className="w-5 h-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-neutral-400">{it.label}</span>
                    <span className="text-base font-medium text-neutral-900 group-hover:underline">{it.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
