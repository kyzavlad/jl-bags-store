import type { Metadata } from 'next'
import './globals.css'
import { SITE_URL, OG_IMAGE } from '@/lib/seo'
import { Analytics } from '@/components/analytics/Analytics'
import { ClickTracker } from '@/components/analytics/ClickTracker'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | JL Bags',
    default: 'JL Bags — жіночі сумки з доставкою по Україні',
  },
  description:
    'JL Bags — жіночі сумки з Харкова: замшеві та шкіряні сумки, сумочки для телефону, шопери, рюкзаки. Доставка Новою Поштою та Укрпоштою по всій Україні.',
  applicationName: 'JL Bags',
  openGraph: {
    siteName: 'JL Bags',
    locale: 'uk_UA',
    type: 'website',
    url: SITE_URL,
    images: [{ url: OG_IMAGE, width: 1339, height: 1339, alt: 'JL Bags — жіночі сумки' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JL Bags — жіночі сумки з доставкою по Україні',
    description:
      'Жіночі сумки від українського виробника: замшеві та шкіряні сумки, шопери, рюкзаки, сумочки для телефону.',
    images: [OG_IMAGE],
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Analytics />
        <ClickTracker />
        {children}
      </body>
    </html>
  )
}
