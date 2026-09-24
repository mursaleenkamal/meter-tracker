'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

function applyUserIdentification(email: string) {
  if (!email || typeof window === 'undefined') return

  // 1. Set global JavaScript variables for Dynatrace UI (JavaScript variable: dynatraceUser)
  try {
    ;(window as unknown as Record<string, unknown>).dynatraceUser = email
    ;(window as unknown as Record<string, unknown>).currentUser = email
  } catch {
    // ignore
  }

  // 2. Set Cookie for Dynatrace UI (Cookie value: dynatrace_user)
  try {
    document.cookie = `dynatrace_user=${encodeURIComponent(email)}; path=/; max-age=86400; SameSite=Lax`
  } catch {
    // ignore
  }

  // 3. Set Meta tag in <head> for Dynatrace UI (Meta tag: dynatrace-user)
  try {
    let meta = document.querySelector('meta[name="dynatrace-user"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'dynatrace-user'
      document.head.appendChild(meta)
    }
    meta.content = email
  } catch {
    // ignore
  }

  // 4. Call official Dynatrace JS Agent API (window.dtrum.identifyUser)
  const tryIdentify = () => {
    const win = window as unknown as {
      dtrum?: {
        identifyUser?: (id: string) => void
      }
    }
    if (win.dtrum && typeof win.dtrum.identifyUser === 'function') {
      try {
        win.dtrum.identifyUser(email)
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
      if (tryIdentify() || attempts >= 15) {
        clearInterval(interval)
      }
    }, 500)
  }
}

interface DynatraceUserTrackerProps {
  userIdentifier?: string | null
}

export default function DynatraceUserTracker({ userIdentifier }: DynatraceUserTrackerProps) {
  const [currentUser, setCurrentUser] = useState<string | null>(userIdentifier || null)

  useEffect(() => {
    if (userIdentifier) {
      applyUserIdentification(userIdentifier)
    }

    // Client-side Supabase session listener
    try {
      const supabase = createClient()

      // Initial check on mount
      supabase.auth.getUser().then(({ data }) => {
        const email = data?.user?.email
        if (email) {
          setCurrentUser(email)
          applyUserIdentification(email)
        }
      })

      // Subscribe to login / token refresh / logout events
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        const email = session?.user?.email || null
        setCurrentUser(email)
        if (email) {
          applyUserIdentification(email)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch {
      // fallback
    }
  }, [userIdentifier])

  return (
    <>
      <meta name="dynatrace-user" content={currentUser || ''} />
      <span id="dt-user-tag" style={{ display: 'none' }} aria-hidden="true">
        {currentUser || ''}
      </span>
    </>
  )
}