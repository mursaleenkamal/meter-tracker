'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addGuestReading, clearGuestState } from '@/lib/guestStore'
import { Zap, ArrowRight, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react'

export default function InstantMeterCheckWidget() {
  const router = useRouter()
  const [prevReading, setPrevReading] = useState('')
  const [currReading, setCurrReading] = useState('')
  const [error, setError] = useState<string | null>(null)

  const prev = parseFloat(prevReading)
  const curr = parseFloat(currReading)
  const hasValidInputs = !isNaN(prev) && !isNaN(curr) && prev >= 0 && curr >= prev
  const units = hasValidInputs ? curr - prev : 0

  const handleStartTracking = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isNaN(curr) || curr < 0) {
      setError('Please enter a valid current reading.')
      return
    }

    if (!isNaN(prev) && prev > curr) {
      setError('Current reading must be greater than or equal to previous reading.')
      return
    }

    // Initialize clean guest state with these readings
    clearGuestState()

    if (!isNaN(prev) && prev >= 0) {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 15) // Approximate 15 days ago as cycle baseline
      addGuestReading({
        reading_value: prev,
        is_billing_reset: true,
        notes: 'Cycle start reading',
        created_at: pastDate.toISOString(),
      })
    }

    addGuestReading({
      reading_value: curr,
      is_billing_reset: isNaN(prev),
      notes: 'Current logged reading',
    })

    router.push('/guest')
  }

  return (
    <div
      className="glass-panel fade-in"
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '2rem auto 0 auto',
        padding: '1.75rem',
        borderRadius: '16px',
        textAlign: 'left',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--primary)' }} />
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Instant Slab & Unit Check
          </h3>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '6px',
            background: 'rgba(2, 132, 199, 0.12)',
            color: 'var(--primary)',
          }}
        >
          No Signup Required
        </span>
      </div>

      <form onSubmit={handleStartTracking}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Previous / Start Reading
            </label>
            <input
              type="number"
              step="1"
              placeholder="e.g. 1420"
              value={prevReading}
              onChange={(e) => setPrevReading(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Current Reading <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <input
              type="number"
              step="1"
              placeholder="e.g. 1560"
              value={currReading}
              onChange={(e) => setCurrReading(e.target.value)}
              required
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
              }}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: '#fca5a5', fontSize: '0.8rem', margin: '0 0 0.75rem 0' }}>
            {error}
          </p>
        )}

        {hasValidInputs && (
          <div
            className="fade-in"
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              background: units >= 200 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${units >= 200 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {units >= 200 ? (
                <ShieldAlert size={20} style={{ color: 'var(--error)' }} />
              ) : (
                <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {units.toFixed(0)} Units Consumed
                </div>
                <div style={{ fontSize: '0.78rem', color: units >= 200 ? 'var(--error)' : 'var(--success)' }}>
                  {units >= 200 ? '⚠️ Exceeded 200 protected slab' : '✅ Protected Subsidized Slab Safe'}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {units < 200 ? `${(200 - units).toFixed(0)} units left` : 'Unprotected rate'}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="glow-btn-solid"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <Zap size={18} />
          {hasValidInputs ? 'Track This in Free Guest Mode' : 'Start Instant Tracking (No Signup)'}
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  )
}
