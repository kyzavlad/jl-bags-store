import type { Metadata } from 'next'
import { Phone, Instagram, Facebook, Send } from 'lucide-react'
import { BRAND, SOCIAL, SITE_URL } from '@/lib/seo'
import { SiteHeader } from '@/components/storefront/site-header'
import { SiteFooter } from '@/components/storefront/site-footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Контакти — Julia Lebedeva Collection',
  description:
    'Зв\'яжіться з Julia Lebedeva Collection: телефон, Instagram, Facebook, Telegram. Жіночі сумки з доставкою по всій Україні.',
  alternates: { canonical: `${SITE_URL}/contacts` },
}

const ITEMS = [
  { Icon: Phone,     label: 'Телефон',   value: BRAND.phoneDisplay,     href: `tel:${BRAND.phone}` },
  { Icon: Instagram, label: 'Instagram', value: SOCIAL.instagramHandle, href: SOCIAL.instagram },
  { Icon: Facebook,  label: 'Facebook',  value: SOCIAL.facebookName,    href: SOCIAL.facebook },
  { Icon: Send,      label: 'Telegram',  value: 'Написати в Telegram',  href: SOCIAL.telegram },
]

export default function ContactsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-12">Контакти</h1>

          <ul className="space-y-8">
            {ITEMS.map((it) => (
              <li key={it.label}>
                <a
                  href={it.href}
                  target={it.href.startsWith('http') ? '_blank' : undefined}
                  rel={it.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-5 group"
                >
                  <it.Icon className="w-6 h-6 shrink-0 text-neutral-700 group-hover:text-black transition-colors" />
                  <span className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900">{it.label}</span>
                    <span className="text-sm text-neutral-600 group-hover:underline">{it.value}</span>
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
