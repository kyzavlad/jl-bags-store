/**
 * Thin wrapper around window.gtag and window.fbq.
 * Safe to call on SSR — checks for window before anything.
 * IDs are read from NEXT_PUBLIC_* env vars; if unset, calls are no-ops.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function trackEvent(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return

  // GA4
  if (typeof window.gtag === 'function' && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('event', event, params ?? {})
  }

  // Google Ads conversion (only for explicit conversion events)
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  if (typeof window.gtag === 'function' && adsId && isConversionEvent(event)) {
    window.gtag('event', 'conversion', {
      send_to: adsId,
      event_category: 'engagement',
      event_label: event,
      ...params,
    })
  }

  // Meta Pixel
  if (typeof window.fbq === 'function' && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
    window.fbq('track', toMetaEvent(event), params ?? {})
  }
}

function isConversionEvent(event: string): boolean {
  return ['phone_click', 'telegram_click'].includes(event)
}

function toMetaEvent(event: string): string {
  const MAP: Record<string, string> = {
    phone_click: 'Contact',
    telegram_click: 'Contact',
    facebook_click: 'Contact',
    instagram_click: 'ViewContent',
    category_view: 'ViewContent',
    product_view: 'ViewContent',
    wholesale_view: 'ViewContent',
    contact_view: 'Contact',
    catalog_view: 'ViewContent',
  }
  return MAP[event] ?? 'CustomEvent'
}
