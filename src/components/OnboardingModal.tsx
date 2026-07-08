'use client'

import { useState } from 'react'
import { createMeterAction } from '@/lib/actions'
import styles from '../app/dashboard.module.css'
import { Zap, AlertTriangle, Loader2 } from 'lucide-react'

export default function OnboardingModal() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createMeterAction(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      window.location.reload()
    }
  }

  return (
    <div className={styles.setupOverlay}>
      <div className={`${styles.setupCard} fade-in`}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <Zap className={styles.logoIcon} size={32} fill="var(--primary)" />
        </div>
        <h2 className={styles.setupTitle}>Configure Your Meter</h2>
        <p className={styles.setupText}>
          Welcome to VoltTrack! To start monitoring your electricity consumption, please set up your primary electric meter profile below.
        </p>

        {error && (
          <div className={`${styles.alert} ${styles.errorAlert}`}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="meterNumber" className={styles.label}>
              Meter Serial Number / Identifier
            </label>
            <input
              type="text"
              id="meterNumber"
              name="meterNumber"
              placeholder="e.g. EM-992384-X"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="billingCycleStartDay" className={styles.label}>
              Billing Cycle Start Day (1 - 31)
            </label>
            <input
              type="number"
              id="billingCycleStartDay"
              name="billingCycleStartDay"
              min="1"
              max="31"
              defaultValue="1"
              className={styles.input}
              required
              disabled={isLoading}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              The day of the month your monthly electricity billing cycle restarts.
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="maxUsageLimit" className={styles.label}>
              Maximum Usage Limit (Units)
            </label>
            <input
              type="number"
              id="maxUsageLimit"
              name="maxUsageLimit"
              min="1"
              defaultValue="400"
              className={styles.input}
              required
              disabled={isLoading}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Your desired monthly unit budget. Warnings will trigger once usage hits 80%.
            </p>
          </div>

          <button
            type="submit"
            className="glow-btn-solid"
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Saving Profile...
              </>
            ) : (
              'Confirm Meter Setup'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
