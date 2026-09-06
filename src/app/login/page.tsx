'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from '../auth.module.css'
import { signInAction } from '@/lib/actions'
import { Zap, AlertTriangle, Loader2 } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      setError(decodeURIComponent(urlError))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signInAction(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.card} fade-in`}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <Zap className={styles.logoIcon} size={24} fill="var(--primary)" />
            <span>Read Meter</span>
          </Link>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Enter credentials to access your dashboard</p>
        </div>

        {error && (
          <div className={`${styles.alert} ${styles.errorAlert}`}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
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

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <Link href="/forgot-password" className={styles.link} style={{ fontSize: '0.8rem' }}>
                Forgot password?
              </Link>
            </div>
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
                Verifying Credentials...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{ margin: '1.25rem 0', textAlign: 'center', position: 'relative' }}>
          <div style={{ height: '1px', background: 'var(--border-color)', width: '100%' }} />
          <span style={{ position: 'relative', top: '-10px', background: '#0a0f1d', padding: '0 10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            OR
          </span>
        </div>

        <Link
          href="/guest"
          className="glow-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            textDecoration: 'none',
            fontSize: '0.9rem',
            padding: '10px',
          }}
        >
          ⚡ Continue as Guest (Instant Access)
        </Link>

        <p className={styles.footerText} style={{ marginTop: '1.25rem' }}>
          Don't have an account?{' '}
          <Link href="/register" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card} style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
