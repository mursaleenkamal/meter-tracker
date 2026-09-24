'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

function applyUserIdentification(email: string) {
  if (!email || typeof window === 'undefined') return

  const cleanEmail = email.trim()

  // 1. Set global JavaScript variables
  try {
    ;(window as unknown as Record<string, unknown>).dynatraceUser = cleanEmail
    ;(window as unknown as Record<string, unknown>).currentUser = cleanEmail
  } catch {}

  // 2. Set Cookies (both raw and encoded)
  try {
    document.cookie = `dynatrace_user=${cleanEmail}; path=/; max-age=2592000; SameSite=Lax`
    document.cookie = `dynatraceUser=${cleanEmail}; path=/; max-age=2592000; SameSite=Lax`
  } catch {}

  // 3. Set Meta tag in <head>
  try {
    let meta = document.querySelector('meta[name="dynatrace-user"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'dynatrace-user'
      document.head.appendChild(meta)
    }
    meta.content = cleanEmail
  } catch {}

  // 4. Call official Dynatrace JS Agent API with Beacon Flush
  const tryIdentify = () => {
    const win = window as unknown as {
      dtrum?: {
        identifyUser?: (id: string) => void
        enterAction?: (name: string, type?: string, startTime?: number, sourceUrl?: string) => number
        leaveAction?: (actionId: number) => void
      }
    }
    if (win.dtrum && typeof win.dtrum.identifyUser === 'function') {
      try {
        win.dtrum.identifyUser(cleanEmail)
        if (typeof win.dtrum.enterAction === 'function' && typeof win.dtrum.leaveAction === 'function') {
          const actionId = win.dtrum.enterAction(`Identified: ${cleanEmail}`)
          if (actionId) {
            win.dtrum.leaveAction(actionId)
          }
        }
      } catch (err) {
        console.warn('[Dynatrace] identifyUser error:', err)
      }
      return true
    }
    return false
  }

  if (!tryIdentify()) {
    let attempts = 0
    const interval = setInterval(() => {
      attempts += 1
      if (tryIdentify() || attempts >= 20) {
        clearInterval(interval)
      }
    }, 300)
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

    try {
      const supabase = createClient()

      supabase.auth.getUser().then(({ data }) => {
        const email = data?.user?.email
        if (email) {
          setCurrentUser(email)
          applyUserIdentification(email)
        }
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        const email = session?.user?.email || null
        if (email) {
          setCurrentUser(email)
          applyUserIdentification(email)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch {
      // ignore
    }
  }, [userIdentifier])

  return (
    <>
      <meta name="dynatrace-user" content={currentUser || ''} />
      <span
        id="dt-user-tag"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {currentUser || ''}
      </span>
    </>
  )
}
