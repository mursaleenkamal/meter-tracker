'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'
import { signUpAction } from '@/lib/actions'
import { Zap, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const result = await signUpAction(formData)

    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(result.message || 'Account registered successfully!')
      window.location.href = '/dashboard'
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
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Sign up to start tracking your energy usage</p>
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
              <p style={{ fontWeight: 600 }}>Account Registered!</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>{success}</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                You can now{' '}
                <Link href="/login" className={styles.link} style={{ textDecoration: 'underline' }}>
                  Log In
                </Link>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={styles.input}
              placeholder="John Doe"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="john@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="whatsappNumber" className={styles.label}>
              WhatsApp Number <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <div className={styles.phoneInputWrapper}>
              <div className={styles.phonePrefix}>🇵🇰 +92</div>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                className={styles.phoneInput}
                placeholder="300 1234567"
                disabled={isLoading}
              />
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Enter your mobile number for WhatsApp alerts and updates.
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="••••••••"
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
                Creating Profile...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className={styles.footerText}>
          Already registered?{' '}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
