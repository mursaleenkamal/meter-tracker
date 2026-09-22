'use client'

import { useEffect } from 'react'

interface DynatraceUserTrackerProps {
  userIdentifier?: string | null
}

export default function DynatraceUserTracker({ userIdentifier }: DynatraceUserTrackerProps) {
  useEffect(() => {
    if (!userIdentifier || typeof window === 'undefined') return

    const tryIdentify = () => {
      const dtrum = (window as unknown as { dtrum?: { identifyUser: (id: string) => void } }).dtrum
      if (dtrum && typeof dtrum.identifyUser === 'function') {
        try {
          dtrum.identifyUser(userIdentifier)
        } catch {
          // Ignore any initialization errors
        }
        return true
      }
      return false
    }

    // Try immediately
    if (!tryIdentify()) {
      let attempts = 0
      const interval = setInterval(() => {
        attempts += 1
        if (tryIdentify() || attempts >= 5) {
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [userIdentifier])

  return null
}
