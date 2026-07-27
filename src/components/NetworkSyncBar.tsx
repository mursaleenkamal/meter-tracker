'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getOfflineReadings,
  syncOfflineReadings,
  OfflineReading,
} from '@/lib/offlineStore'
import { WifiOff, RefreshCw, CheckCircle, AlertCircle, CloudUpload } from 'lucide-react'

export default function NetworkSyncBar() {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [offlineQueue, setOfflineQueue] = useState<OfflineReading[]>([])
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null)
  const [syncErrorMsg, setSyncErrorMsg] = useState<string | null>(null)

  const refreshQueue = useCallback(() => {
    setOfflineQueue(getOfflineReadings())
  }, [])

  const handleSync = useCallback(async () => {
    const queue = getOfflineReadings()
    if (queue.length === 0 || isSyncing) return

    setIsSyncing(true)
    setSyncStatusMsg(`Syncing ${queue.length} offline reading(s)...`)
    setSyncErrorMsg(null)

    const result = await syncOfflineReadings()
    setIsSyncing(false)

    if (result.successCount > 0) {
      setSyncStatusMsg(`Successfully synced ${result.successCount} reading(s)!`)
      refreshQueue()
      setTimeout(() => {
        setSyncStatusMsg(null)
        window.location.reload()
      }, 1500)
    }

    if (result.failCount > 0) {
      setSyncErrorMsg(`Failed to sync ${result.failCount} item(s): ${result.errors.join(', ')}`)
      refreshQueue()
    }
  }, [isSyncing, refreshQueue])

  useEffect(() => {
    // Set initial online status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      refreshQueue()

      const handleOnline = () => {
        setIsOnline(true)
        setSyncStatusMsg('Internet connection restored. Starting auto-sync...')
        setTimeout(() => {
          handleSync()
        }, 800)
      }

      const handleOffline = () => {
        setIsOnline(false)
        setSyncStatusMsg('You are offline. Meter readings will be saved locally.')
        setTimeout(() => setSyncStatusMsg(null), 4000)
      }

      const handleCustomEvent = () => {
        refreshQueue()
      }

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      window.addEventListener('offline-readings-changed', handleCustomEvent)

      // Auto-sync on initial mount if online and has pending queue
      if (navigator.onLine && getOfflineReadings().length > 0) {
        handleSync()
      }

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        window.removeEventListener('offline-readings-changed', handleCustomEvent)
      }
    }
  }, [handleSync, refreshQueue])

  // Don't render anything if online and no pending queue and no active status message
  if (isOnline && offlineQueue.length === 0 && !syncStatusMsg && !syncErrorMsg && !isSyncing) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '420px',
        width: 'calc(100vw - 2.5rem)',
      }}
    >
      {/* Offline Status Warning Bar */}
      {!isOnline && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.92)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            fontWeight: 500,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <WifiOff size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Offline Mode Active</strong>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                {offlineQueue.length > 0
                  ? `${offlineQueue.length} reading(s) stored locally pending internet restoration.`
                  : 'New meter readings will be stored locally on your device.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Sync Action Bar when Online */}
      {isOnline && offlineQueue.length > 0 && !isSyncing && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 240, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            border: '1px solid rgba(0, 240, 255, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CloudUpload size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--primary)' }}>{offlineQueue.length} Offline Reading(s)</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Saved locally while offline. Ready to sync.
              </div>
            </div>
          </div>

          <button
            onClick={handleSync}
            className="glow-btn-solid"
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} /> Sync Now
          </button>
        </div>
      )}

      {/* Syncing Progress Banner */}
      {isSyncing && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(59, 130, 246, 0.92)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <RefreshCw className="animate-spin" size={18} style={{ flexShrink: 0 }} />
          <span>{syncStatusMsg || 'Syncing offline data to cloud...'}</span>
        </div>
      )}

      {/* Sync Success Notification Toast */}
      {syncStatusMsg && !isSyncing && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(16, 185, 129, 0.92)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <CheckCircle size={18} style={{ flexShrink: 0 }} />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Sync Error Notification */}
      {syncErrorMsg && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.92)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{syncErrorMsg}</span>
          </div>
          <button
            onClick={() => setSyncErrorMsg(null)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', opacity: 0.8 }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
