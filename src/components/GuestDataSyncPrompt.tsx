'use client'

import { useEffect, useState } from 'react'
import { getGuestState, clearGuestState, GuestState } from '@/lib/guestStore'
import { importGuestReadingsAction } from '@/lib/actions'
import { CloudUpload, Check, X, Loader2 } from 'lucide-react'

export default function GuestDataSyncPrompt() {
  const [guestData, setGuestData] = useState<GuestState | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const state = getGuestState()
    if (state.readings && state.readings.length > 0) {
      setGuestData(state)
    }
  }, [])

  if (!guestData || guestData.readings.length === 0 || isDismissed) {
    return null
  }

  const handleSync = async () => {
    setIsSyncing(true)
    setSyncError(null)

    try {
      const result = await importGuestReadingsAction({
        meterLimit: guestData.meter.max_usage_limit,
        nextReadingDate: guestData.meter.next_reading_date,
        readings: guestData.readings,
      })

      setIsSyncing(false)

      if (result?.error) {
        setSyncError(result.error)
      } else {
        setSyncSuccess(true)
        clearGuestState()
        setTimeout(() => {
          window.location.reload()
        }, 1200)
      }
    } catch (err: any) {
      setIsSyncing(false)
      setSyncError(err?.message || 'Failed to sync guest readings.')
    }
  }

  const handleDismiss = () => {
    clearGuestState()
    setIsDismissed(true)
  }

  return (
    <div
      className="fade-in"
      style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(16, 185, 129, 0.12))',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
          }}
        >
          <CloudUpload size={22} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
            Guest Session Detected ({guestData.readings.length} reading{guestData.readings.length > 1 ? 's' : ''})
          </h4>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            We found readings logged before you signed in. Would you like to import them into your account?
          </p>
        </div>
      </div>

      {syncSuccess ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.88rem' }}>
          <Check size={18} /> Synced successfully! Updating dashboard...
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {syncError && (
            <span style={{ color: '#fca5a5', fontSize: '0.78rem', marginRight: '0.5rem' }}>
              {syncError}
            </span>
          )}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="glow-btn-solid"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            {isSyncing ? (
              <>
                <Loader2 className="animate-spin" size={15} /> Importing...
              </>
            ) : (
              <>
                <CloudUpload size={15} /> Import All
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            disabled={isSyncing}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Dismiss and discard guest data"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
