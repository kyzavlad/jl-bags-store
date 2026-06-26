'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Delegated click handler. Add data-track-event="<event_name>" to any
 * anchor or button in server components — this picks it up via bubbling.
 * Mount once in the root layout.
 */
export function ClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as Element).closest('[data-track-event]')
      if (!target) return
      const event = target.getAttribute('data-track-event')
      if (event) trackEvent(event)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
