'use client'

import { useEffect } from 'react'

interface DynatraceUserTrackerProps {
  userIdentifier?: string | null
}

export default function DynatraceUserTracker({ userIdentifier }: DynatraceUserTrackerProps) {
  useEffect(() => {
    if (!userIdentifier || typeof window === 'undefined') return

    // 1. Set global JavaScript variable for Dynatrace (Source type: JavaScript variable)
    try {
      ;(window as unknown as Record<string, unknown>).dynatraceUser = userIdentifier
      ;(window as unknown as Record<string, unknown>).currentUser = userIdentifier
    } catch {
      // ignore
    }

    // 2. Set Meta tag in <head> for Dynatrace (Source type: Meta tag)
    try {
      let meta = document.querySelector('meta[name="dynatrace-user"]') as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'dynatrace-user'
        document.head.appendChild(meta)
      }
      meta.content = userIdentifier
    } catch {
      // ignore
    }

    // 3. Set Cookie for Dynatrace (Source type: Cookie value)
    try {
      document.cookie = `dynatrace_user=${encodeURIComponent(userIdentifier)}; path=/; max-age=86400; SameSite=Lax`
    } catch {
      // ignore
    }

    // 4. Call official Dynatrace JS API
    const tryIdentify = () => {
      const dtrum = (window as unknown as { dtrum?: { identifyUser: (id: string) => void } }).dtrum
      if (dtrum && typeof dtrum.identifyUser === 'function') {
        try {
          dtrum.identifyUser(userIdentifier)
        } catch {
          // ignore
        }
        return true
      }
      return false
    }

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

  return (
    <>
      <meta name="dynatrace-user" content={userIdentifier || ''} />
      <span id="dt-user-tag" style={{ display: 'none' }}>
        {userIdentifier}
      </span>
    </>
  )
}
