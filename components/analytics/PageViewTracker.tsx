'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

interface Props {
  event: string
  params?: Record<string, unknown>
}

/** Fire a named analytics event once on page mount. */
export function PageViewTracker({ event, params }: Props) {
  useEffect(() => {
    trackEvent(event, params)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
