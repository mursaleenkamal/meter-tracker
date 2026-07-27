'use client'

import { useState, useEffect } from 'react'
import {
  getOfflineReadings,
  removeOfflineReading,
  syncOfflineReadings,
  OfflineReading,
} from '@/lib/offlineStore'
import { WifiOff, Trash2, CloudUpload, Loader2 } from 'lucide-react'

interface OfflineReadingsListProps {
  meterId?: string
}

export default function OfflineReadingsList({ meterId }: OfflineReadingsListProps) {
  const [offlineReadings, setOfflineReadings] = useState<OfflineReading[]>([])
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  const updateList = () => {
    const all = getOfflineReadings()
    if (meterId) {
      setOfflineReadings(all.filter((r) => r.meterId === meterId))
    } else {
      setOfflineReadings(all)
    }
  }

  useEffect(() => {
    updateList()
    const handleUpdate = () => updateList()
    window.addEventListener('offline-readings-changed', handleUpdate)
    window.addEventListener('online', handleUpdate)
    window.addEventListener('offline', handleUpdate)

    return () => {
      window.removeEventListener('offline-readings-changed', handleUpdate)
      window.removeEventListener('online', handleUpdate)
      window.removeEventListener('offline', handleUpdate)
    }
  }, [meterId])

  const handleDelete = (tempId: string) => {
    removeOfflineReading(tempId)
    updateList()
  }

  const handleManualSync = async () => {
    if (!navigator.onLine) {
      alert('You are currently offline. Please reconnect to the internet to sync.')
      return
    }
    setIsSyncing(true)
    const result = await syncOfflineReadings()
    setIsSyncing(false)
    if (result.successCount > 0) {
      window.location.reload()
    }
  }

  if (offlineReadings.length === 0) return null

  return (
    <div
      className="glass-panel fade-in"
      style={{
        width: '100%',
        padding: '1.25rem 1.5rem',
        margin: '1.5rem 0',
        borderRadius: '14px',
        background: 'rgba(239, 68, 68, 0.04)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <WifiOff size={13} /> Unsynced Offline Logs ({offlineReadings.length})
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Saved locally on your device
          </span>
        </div>

        {navigator.onLine && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="glow-btn-solid"
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            {isSyncing ? (
              <>
                <Loader2 className="animate-spin" size={14} /> Syncing...
              </>
            ) : (
              <>
                <CloudUpload size={14} /> Sync All Now
              </>
            )}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {offlineReadings.map((item) => (
          <div
            key={item.tempId}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>
                {item.readingValue} Units{' '}
                {item.isBillingReset && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--success)',
                      marginLeft: '0.4rem',
                    }}
                  >
                    Cycle Reset
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Recorded: {new Date(item.createdAt).toLocaleString()} {item.notes ? `• ${item.notes}` : ''}
              </div>
            </div>

            <button
              onClick={() => handleDelete(item.tempId)}
              title="Delete offline record"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
