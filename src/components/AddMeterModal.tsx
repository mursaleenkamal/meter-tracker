'use client'

import { useState, useEffect } from 'react'
import { createMeterAction } from '@/lib/actions'
import { X, Zap, AlertTriangle, Loader2, Gauge, Calendar, Activity, PlusCircle } from 'lucide-react'
import styles from '../app/dashboard.module.css'

interface AddMeterModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (meterId: string) => void
}

export default function AddMeterModal({ isOpen, onClose, onSuccess }: AddMeterModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createMeterAction(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success && result.meterId) {
      if (onSuccess) {
        onSuccess(result.meterId)
      } else {
        window.location.href = `/dashboard?meterId=${result.meterId}`
      }
    } else {
      window.location.reload()
    }
  }

  return (
    <div className={styles.setupOverlay} onClick={onClose}>
      <div
        className={`${styles.setupCard} fade-in`}
        style={{
          maxWidth: '540px',
          padding: '2.5rem 2rem',
          position: 'relative',
          gap: '1.25rem',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '8px',
            transition: 'all var(--transition-fast)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hover-glow"
          title="Close modal"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header Badge */}
        <div className={styles.setupHeader}>
          <div className={styles.setupIconBadge}>
            <Zap size={28} fill="var(--primary)" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px var(--primary-glow))' }} />
          </div>
          <h2 className={styles.setupTitle}>Add Another Meter</h2>
          <p className={styles.setupText}>
            Add an additional electricity meter to your profile to track another connection, floor, or property.
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
                placeholder="e.g. EM-883492-Y or Floor 2 Meter"
                className={styles.modalInput}
                required
                disabled={isLoading}
              />
            </div>
            <p className={styles.inputHelperText}>
              Enter a unique identifier or label for this meter connection.
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
              The day of the month when your electricity billing cycle restarts for this meter.
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
              Your desired monthly unit budget for this meter profile.
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
              width: '100%',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating Meter Profile...
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                Create New Meter Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
