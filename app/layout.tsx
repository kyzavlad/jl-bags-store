import type { Metadata } from 'next'
import './globals.css'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | JL Bags',
    default: 'JL Bags — жіночі сумки з доставкою по Україні',
  },
  description:
    'JL Bags — жіночі сумки з Харкова: замшеві та шкіряні сумки, сумочки для телефону, шопери, рюкзаки. Доставка Новою Поштою та Укрпоштою по всій Україні.',
  openGraph: {
    siteName: 'JL Bags',
    locale: 'uk_UA',
    type: 'website',
    url: SITE_URL,
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  )
}
