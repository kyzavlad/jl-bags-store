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

  // Google Ads conversion. A Google Ads conversion needs a specific
  // conversion action label, not just the account ID — the full send_to
  // value (e.g. "AW-123456789/AbCdEfGhIjKlMnOp"). Without it, no conversion
  // is fired even if a conversion-worthy event occurs.
  const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO
  if (typeof window.gtag === 'function' && sendTo && isConversionEvent(event)) {
    window.gtag('event', 'conversion', {
      send_to: sendTo,
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
  return ['phone_click', 'telegram_click', 'viber_click'].includes(event)
}

function toMetaEvent(event: string): string {
  const MAP: Record<string, string> = {
    phone_click: 'Contact',
    telegram_click: 'Contact',
    viber_click: 'Contact',
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
