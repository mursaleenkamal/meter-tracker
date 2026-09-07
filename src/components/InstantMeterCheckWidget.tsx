'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

  const handleStartTracking = async (e: React.FormEvent) => {
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

    const { addGuestReading, clearGuestState } = await import('@/lib/guestStore')

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
        margin: '1.5rem auto 0 auto',
        padding: 'clamp(1.1rem, 4vw, 1.85rem)',
        borderRadius: '18px',
        textAlign: 'left',
        background: 'linear-gradient(135deg, rgba(17, 27, 51, 0.75) 0%, rgba(10, 16, 32, 0.85) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.8), 0 0 25px rgba(0, 240, 255, 0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={20} style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px var(--primary-glow))' }} />
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Instant Slab & Unit Check
          </h2>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '9999px',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            color: 'var(--primary)',
            letterSpacing: '0.3px',
          }}
        >
          ⚡ No Signup Required
        </span>
      </div>

      <form onSubmit={handleStartTracking}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
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
                background: 'rgba(6, 10, 20, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '11px 13px',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-mono), monospace',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
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
                background: 'rgba(6, 10, 20, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '11px 13px',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-mono), monospace',
                outline: 'none',
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
