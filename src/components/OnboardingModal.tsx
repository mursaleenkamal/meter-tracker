'use client'

import { useState } from 'react'
import { createMeterAction } from '@/lib/actions'
import styles from '../app/dashboard.module.css'
import { Zap, AlertTriangle, Loader2, Gauge, Calendar, Activity, CheckCircle2 } from 'lucide-react'

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
        {/* Header Badge */}
        <div className={styles.setupHeader}>
          <div className={styles.setupIconBadge}>
            <Zap size={28} fill="var(--primary)" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px var(--primary-glow))' }} />
          </div>
          <h2 className={styles.setupTitle}>Configure Your Electric Meter</h2>
          <p className={styles.setupText}>
            Welcome to VoltTrack! Set up your primary meter configuration below to unlock real-time tracking, billing cycle insights, and usage alerts.
          </p>
        </div>

        {error && (
          <div className={`${styles.alert} ${styles.errorAlert}`}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          {/* Meter Identifier Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="meterNumber" className={styles.label}>
              <Gauge size={15} style={{ color: 'var(--primary)' }} />
              Meter Serial Number / Identifier
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                id="meterNumber"
                name="meterNumber"
                placeholder="e.g. EM-992384-X or Home Meter #1"
                className={styles.modalInput}
                required
                disabled={isLoading}
              />
            </div>
            <p className={styles.inputHelperText}>
              Enter your physical meter's serial number or nickname for easy identification.
            </p>
          </div>

          {/* Billing Cycle Start Day Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="billingCycleStartDay" className={styles.label}>
              <Calendar size={15} style={{ color: 'var(--primary)' }} />
              Billing Cycle Start Day (1 - 31)
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="number"
                id="billingCycleStartDay"
                name="billingCycleStartDay"
                min="1"
                max="31"
                defaultValue="1"
                className={styles.modalInput}
                required
                disabled={isLoading}
              />
            </div>
            <p className={styles.inputHelperText}>
              The day of the month when your electric company resets your billing cycle.
            </p>
          </div>

          {/* Maximum Usage Limit Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="maxUsageLimit" className={styles.label}>
              <Activity size={15} style={{ color: 'var(--primary)' }} />
              Monthly Target Usage Limit (Units / kWh)
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="number"
                id="maxUsageLimit"
                name="maxUsageLimit"
                min="1"
                defaultValue="400"
                className={styles.modalInput}
                required
                disabled={isLoading}
              />
            </div>
            <p className={styles.inputHelperText}>
              Your desired monthly unit budget. Automatic push alerts will trigger when usage reaches 80%.
            </p>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="glow-btn-solid"
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              marginTop: '0.75rem',
              padding: '14px',
              fontSize: '1rem',
              borderRadius: '10px',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Initializing Meter Profile...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Save & Access Dashboard
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
