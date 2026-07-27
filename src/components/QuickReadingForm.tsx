'use client'

import { useState } from 'react'
import { addReadingAction } from '@/lib/actions'
import { saveOfflineReading } from '@/lib/offlineStore'
import { Loader2, Plus, AlertTriangle, Check, WifiOff } from 'lucide-react'

interface QuickReadingFormProps {
  meterId: string
  meterNumber: string
  latestReadingValue: number | null
}

export default function QuickReadingForm({
  meterId,
  meterNumber,
  latestReadingValue,
}: QuickReadingFormProps) {
  const [readingValue, setReadingValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isOfflineSuccess, setIsOfflineSuccess] = useState(false)
  const [isBillingReset, setIsBillingReset] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(false)
    setError(null)
    setSuccess(false)
    setIsOfflineSuccess(false)

    const parsedValue = parseFloat(readingValue)
    if (isNaN(parsedValue) || parsedValue < 0) {
      setError('Please enter a valid reading value.')
      return
    }

    if (latestReadingValue !== null && parsedValue < latestReadingValue) {
      setError(
        `New reading (${parsedValue} Units) must be greater than or equal to the previous reading (${latestReadingValue} Units).`
      )
      return
    }

    setIsLoading(true)

    // Handle offline mode directly if navigator.onLine is false
    if (typeof window !== 'undefined' && !navigator.onLine) {
      saveOfflineReading({
        meterId,
        readingValue: parsedValue,
        notes: 'Logged from Quick Access (Offline)',
        isBillingReset,
      })
      setIsLoading(false)
      setIsOfflineSuccess(true)
      setReadingValue('')
      return
    }

    try {
      const formData = new FormData()
      formData.append('meterId', meterId)
      formData.append('readingValue', readingValue)
      formData.append('notes', 'Logged from Quick Access')
      formData.append('isBillingReset', String(isBillingReset))

      const result = await addReadingAction(formData)
      setIsLoading(false)

      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setReadingValue('')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (netErr) {
      console.warn('Network request failed, storing reading offline:', netErr)
      saveOfflineReading({
        meterId,
        readingValue: parsedValue,
        notes: 'Logged from Quick Access (Offline Fallback)',
        isBillingReset,
      })
      setIsLoading(false)
      setIsOfflineSuccess(true)
      setReadingValue('')
    }
  }

  return (
    <div
      className="glass-panel"
      style={{
        width: '100%',
        maxWidth: '500px',
        padding: '1.5rem',
        margin: '1.5rem auto 0 auto',
        textAlign: 'left',
        background: 'rgba(13, 20, 38, 0.4)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Quick Reading Update</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Meter: {meterNumber}
        </span>
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Current Reading:{' '}
        <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>
          {latestReadingValue !== null ? `${latestReadingValue.toFixed(0)} Units` : 'No readings yet'}
        </strong>
      </div>

      {error && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#a7f3d0',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={14} style={{ flexShrink: 0 }} />
          <span>Reading logged successfully! Refreshing...</span>
        </div>
      )}

      {isOfflineSuccess && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <WifiOff size={14} style={{ flexShrink: 0 }} />
          <span>Saved offline! Reading recorded locally and will auto-sync when online.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="number"
            step="1"
            value={readingValue}
            onChange={(e) => setReadingValue(e.target.value)}
            placeholder="New Reading Value"
            required
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'rgba(6, 9, 19, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.9rem',
            }}
          />
          <button
            type="submit"
            className="glow-btn-solid"
            disabled={isLoading || !readingValue}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '10px 16px',
              fontSize: '0.85rem',
            }}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                <Plus size={14} /> Log Units
              </>
            )}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', marginTop: '0.25rem' }}>
          <input
            type="checkbox"
            id="quickIsBillingReset"
            checked={isBillingReset}
            onChange={(e) => setIsBillingReset(e.target.checked)}
            disabled={isLoading}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)', marginTop: '0.1rem' }}
          />
          <label htmlFor="quickIsBillingReset" style={{ marginBottom: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#fff' }}>Start New Billing Cycle</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 'normal', lineHeight: '1.3' }}>
              Check this if this reading resets the monthly K-Electric bill cycle.
            </span>
          </label>
        </div>
      </form>
    </div>
  )
}
