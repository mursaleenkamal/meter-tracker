'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, ArrowRight, ShieldCheck, ShieldAlert, Sparkles, AlertTriangle, Info } from 'lucide-react'
import ShareWhatsAppBtn from '@/components/ShareWhatsAppBtn'

export default function InstantMeterCheckWidget() {
  const router = useRouter()
  const [currReading, setCurrReading] = useState('')
  const [prevReading, setPrevReading] = useState('')
  const [showOptionalPrev, setShowOptionalPrev] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const curr = parseFloat(currReading)
  const prev = parseFloat(prevReading)

  const hasCurr = !isNaN(curr) && curr >= 0
  const hasBoth = hasCurr && !isNaN(prev) && prev >= 0 && curr >= prev
  const units = hasBoth ? curr - prev : 0

  const handleStartTracking = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isNaN(curr) || curr < 0) {
      setError('Baraye meharbani current meter reading (4-7 digits) darj karein.')
      return
    }

    if (showOptionalPrev && !isNaN(prev) && prev > curr) {
      setError('Current reading previous reading se barabar ya barhi honi chahiye.')
      return
    }

    const { addGuestReading, clearGuestState } = await import('@/lib/guestStore')

    // Clean guest session initialize karein
    clearGuestState()

    if (showOptionalPrev && !isNaN(prev) && prev >= 0) {
      // User ne past reading bhi di thi
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 15) // 15 din pehle cycle baseline
      addGuestReading({
        reading_value: prev,
        is_billing_reset: true,
        notes: 'Cycle baseline reading',
        created_at: pastDate.toISOString(),
      })
      addGuestReading({
        reading_value: curr,
        is_billing_reset: false,
        notes: 'Current logged reading',
      })
    } else {
      // FTUX Phase 2: Single reading baseline log
      addGuestReading({
        reading_value: curr,
        is_billing_reset: true,
        notes: 'Cycle start baseline reading',
      })
    }

    router.push('/guest')
  }

  return (
    <div
      className="glass-panel fade-in"
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '1.5rem auto 0 auto',
        padding: 'clamp(1.2rem, 4vw, 1.85rem)',
        borderRadius: '16px',
        textAlign: 'left',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Instant Meter & Slab Check
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              1-Click Single Reading Baseline (No Signup)
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '6px',
            background: 'var(--success-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--primary)',
            letterSpacing: '0.3px',
          }}
        >
          ⚡ 100% Free Utility
        </span>
      </div>

      <form onSubmit={handleStartTracking}>
        {/* Main Current Reading Input */}
        <div style={{ marginBottom: '0.9rem' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
            <span>
              Current Meter Reading (kWh) <span style={{ color: 'var(--primary)' }}>*</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Dial ya LCD par likha number
            </span>
          </label>
          <input
            type="number"
            step="1"
            inputMode="numeric"
            placeholder="e.g. 1560 (Meter ka current display)"
            value={currReading}
            onChange={(e) => setCurrReading(e.target.value)}
            required
            autoFocus
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '12px 14px',
              color: '#0f172a',
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono), monospace',
              outline: 'none',
              letterSpacing: '0.5px',
            }}
          />
        </div>

        {/* Optional Previous Reading Accordion Toggle */}
        <div style={{ marginBottom: '1.1rem' }}>
          {!showOptionalPrev ? (
            <button
              type="button"
              onClick={() => setShowOptionalPrev(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                padding: '2px 0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'underline',
              }}
            >
              + Purani (Cycle Start) reading bhi enter karna chahte hain? (Optional)
            </button>
          ) : (
            <div className="fade-in" style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Previous / Start Reading (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowOptionalPrev(false)
                    setPrevReading('')
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  ✕ Hata dein
                </button>
              </div>
              <input
                type="number"
                step="1"
                inputMode="numeric"
                placeholder="e.g. 1420"
                value={prevReading}
                onChange={(e) => setPrevReading(e.target.value)}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#0f172a',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono), monospace',
                  outline: 'none',
                }}
              />
            </div>
          )}
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 12px', borderRadius: '8px', background: 'var(--error-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)', fontSize: '0.8rem', marginBottom: '0.9rem' }}>
            <AlertTriangle size={16} style={{ color: 'var(--error)', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* State A: Single Reading Entered (FTUX Explainer) */}
        {hasCurr && !hasBoth && (
          <div
            className="fade-in"
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              background: 'var(--success-bg)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
            }}
          >
            <Info size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.82rem', lineHeight: '1.45', color: 'var(--text-primary)' }}>
              <strong>Pehli Reading ({curr} kWh)</strong> cycle baseline log ho jayegi. Kal doosri reading enter karne par live daily units aur bill forecast unlock ho jayega.
            </div>
          </div>
        )}

        {/* State B: Both Readings Entered (Instant Units & Traffic-Light Check) */}
        {hasBoth && (
          <div
            className="fade-in"
            style={{
              padding: '1rem',
              borderRadius: '10px',
              background: units >= 200 ? 'var(--error-bg)' : 'var(--success-bg)',
              border: `1px solid ${units >= 200 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {units >= 200 ? (
                  <ShieldAlert size={22} style={{ color: 'var(--error)', flexShrink: 0 }} />
                ) : (
                  <ShieldCheck size={22} style={{ color: 'var(--success)', flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {units.toFixed(0)} Units Consumed
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: units >= 200 ? 'var(--error)' : 'var(--success)' }}>
                    {units >= 200 ? '⚠️ 200 Protected Slab Breached (High Rate)' : '✅ 200 Protected Slab Safe (Subsidized)'}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>
                {units < 200 ? `${(200 - units).toFixed(0)} units baki` : 'Commercial Rate'}
              </div>
            </div>

            <ShareWhatsAppBtn
              type="instant"
              units={units}
              prevReading={prev}
              currReading={curr}
              label="WhatsApp par Result Share Karein"
              style={{ width: '100%', padding: '9px 14px', fontSize: '0.88rem' }}
            />
          </div>
        )}

        {/* Submit CTA */}
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
          {hasBoth ? 'Save & Track in Free Guest Mode' : 'Start Instant Tracking (Baseline Log)'}
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  )
}
