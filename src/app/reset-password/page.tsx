'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'
import { updatePasswordAction } from '@/lib/actions'
import { Zap, AlertTriangle, CheckCircle, Loader2, KeyRound } from 'lucide-react'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const result = await updatePasswordAction(formData)

    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message || 'Password updated successfully!')
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1500)
    }
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.card} fade-in`}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <Zap className={styles.logoIcon} size={24} fill="var(--primary)" />
            <span>VoltTrack</span>
          </Link>
          <h2 className={styles.title}>Set New Password</h2>
          <p className={styles.subtitle}>Enter a new password for your account</p>
        </div>

        {error && (
          <div className={`${styles.alert} ${styles.errorAlert}`}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={`${styles.alert} ${styles.successAlert}`}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 600 }}>Password Reset!</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>{success}</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className={styles.input}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="glow-btn-solid styles.submitBtn"
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              marginTop: '0.5rem',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Updating Password...
              </>
            ) : (
              <>
                <KeyRound size={18} />
                Save New Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
