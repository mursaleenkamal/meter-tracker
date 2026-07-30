'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'
import { resetPasswordAction } from '@/lib/actions'
import { Zap, AlertTriangle, CheckCircle, Loader2, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const result = await resetPasswordAction(formData)

    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message || 'Password reset link has been sent to your email.')
      e.currentTarget.reset()
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
          <h2 className={styles.title}>Reset Password</h2>
          <p className={styles.subtitle}>Enter your email to receive a password reset link</p>
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
              <p style={{ fontWeight: 600 }}>Reset Email Sent!</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="name@example.com"
              required
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
                Sending Reset Link...
              </>
            ) : (
              <>
                <Mail size={18} />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <p className={styles.footerText}>
          <Link href="/login" className={styles.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
