'use client'

import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Fires a GA4 page_view and Meta Pixel PageView on client-side route changes.
 * The initial load is already counted by the inline gtag config and fbq init,
 * so the first effect run is skipped to avoid double-counting.
 */
function Tracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    const query = searchParams?.toString()
    const url = query ? `${pathname}?${query}` : pathname

    if (typeof window.gtag === 'function' && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag('event', 'page_view', {
        page_path: url,
        page_location: window.location.href,
      })
    }

    if (typeof window.fbq === 'function' && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams])

  return null
}

// useSearchParams must sit under a Suspense boundary in the App Router.
export function RouteChangeTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  )
}
