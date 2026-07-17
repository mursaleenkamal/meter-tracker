'use client'

import { useState, useEffect } from 'react'
import { createMeterAction } from '@/lib/actions'
import { X, Zap, AlertTriangle, Loader2 } from 'lucide-react'
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
          maxWidth: '550px',
          padding: '2.5rem 2rem',
          position: 'relative',
          gap: '1rem',
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
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '6px',
            transition: 'all var(--transition-fast)',
          }}
          className="hover-glow"
          title="Close modal"
          aria-label="Close modal"
        >
          <X size={20} className={styles.closeIcon} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <Zap className={styles.logoIcon} size={32} fill="var(--primary)" />
        </div>
        <h2 className={styles.setupTitle}>Add Another Meter</h2>
        <p className={styles.setupText}>
          Add a new electricity meter to your profile to track another connection or area.
        </p>

        {error && (
          <div className={`${styles.alert} ${styles.errorAlert}`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
              placeholder="e.g. EM-883492-Y"
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
              width: '100%',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating Meter Profile...
              </>
            ) : (
              'Add Meter'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
