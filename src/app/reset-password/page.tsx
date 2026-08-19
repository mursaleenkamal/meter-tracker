'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from '../auth.module.css'
import { updatePasswordAction } from '@/lib/actions'
import { createClient } from '@/utils/supabase/client'
import { Zap, AlertTriangle, CheckCircle, Loader2, KeyRound, ArrowLeft } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check search params for errors from callback
    const paramError = searchParams.get('error')
    if (paramError) {
      setError(decodeURIComponent(paramError))
    }

    // Check URL hash for implicit auth errors or recovery tokens
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const hashError = hashParams.get('error_description') || hashParams.get('error')
      if (hashError) {
        setError(decodeURIComponent(hashError))
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!newPassword || !confirmPassword) {
      setError('All fields are required.')
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      setIsLoading(false)
      return
    }

    // 1. Attempt update via Server Action
    const result = await updatePasswordAction(formData)

    if (result?.error) {
      // 2. Fallback to client-side Supabase if server cookie session was missing (e.g. hash fragment auth)
      try {
        const supabase = createClient()
        const { error: clientErr } = await supabase.auth.updateUser({
          password: newPassword,
        })

        if (clientErr) {
          setError(clientErr.message || result.error)
          setIsLoading(false)
          return
        }
      } catch (clientEx: any) {
        setError(result.error || clientEx?.message || 'Failed to update password.')
        setIsLoading(false)
        return
      }
    }

    setIsLoading(false)
    setSuccess('Password updated successfully! Redirecting to dashboard...')
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1500)
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.card} fade-in`}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <Zap className={styles.logoIcon} size={24} fill="var(--primary)" />
            <span>Read Meter</span>
          </Link>
          <h2 className={styles.title}>Set New Password</h2>
          <p className={styles.subtitle}>Enter a new password for your account</p>
        </div>

        {error && (
          <div className={`${styles.alert} ${styles.errorAlert}`}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              <span>{error}</span>
              <p style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
                <Link href="/forgot-password" className={styles.link} style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Request a new reset link
                </Link>
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className={`${styles.alert} ${styles.successAlert}`}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 600 }}>Password Reset!</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>{success}</p>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card} style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
