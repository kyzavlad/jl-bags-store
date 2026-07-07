import type { Metadata } from 'next'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'
import { BioLinks } from '@/components/storefront/bio-links'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'sumki_kharkov JL™ | Посилання' },
  description: 'Каталог, Instagram, Facebook, Telegram та контакти sumki_kharkov JL™',
  alternates: { canonical: `${SITE_URL}/sumki_kharkov` },
  openGraph: {
    title: 'sumki_kharkov JL™',
    description: 'Каталог, Instagram, Facebook, Telegram та контакти sumki_kharkov JL™',
    url: `${SITE_URL}/sumki_kharkov`,
    type: 'website',
    siteName: 'sumki_kharkov JL™',
    images: [{ url: OG_IMAGE, width: 1339, height: 1339, alt: 'sumki_kharkov JL' }],
  },
  robots: { index: true, follow: true },
}

export default function SumkiKharkovPage() {
  return <BioLinks />
}
