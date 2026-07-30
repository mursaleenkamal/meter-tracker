'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'
import { signInAction, signInWhatsAppAction, verifyWhatsAppCodeAction } from '@/lib/actions'
import { Zap, AlertTriangle, Loader2, Mail, MessageSquare, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'email' | 'whatsapp'>('email')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // WhatsApp state
  const [waData, setWaData] = useState<{ phone: string; code: string } | null>(null)
  const [enteredCode, setEnteredCode] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleWaInitSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signInWhatsAppAction(formData)

    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success && result.phone && result.code) {
      setWaData({
        phone: result.phone,
        code: result.code,
      })
      setEnteredCode(result.code)
    }
  }

  const handleWaVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!waData) return

    setIsLoading(true)
    setError(null)

    const result = await verifyWhatsAppCodeAction(
      waData.phone,
      enteredCode,
      waData.code
    )

    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      window.location.href = '/dashboard'
    }
  }

  const userPhoneClean = waData?.phone ? waData.phone.replace(/[^0-9]/g, '') : ''
  const supportPhone = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER
  const targetNumber = supportPhone || userPhoneClean

  const waText = encodeURIComponent(
    `Hello VoltTrack! Verification Code: ${waData?.code}`
  )

  const waLink = targetNumber
    ? `https://wa.me/${targetNumber}?text=${waText}`
    : `https://wa.me/?text=${waText}`


  return (
    <div className={styles.container}>
      <div className={`${styles.card} fade-in`}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <Zap className={styles.logoIcon} size={24} fill="var(--primary)" />
            <span>VoltTrack</span>
          </Link>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to access your meter dashboard</p>
        </div>

        {/* Method Toggle Tabs */}
        <div className={styles.tabContainer}>
          <button
            type="button"
            className={`${styles.tab} ${authMethod === 'email' ? styles.activeTab : ''}`}
            onClick={() => {
              setAuthMethod('email')
              setError(null)
            }}
          >
            <Mail size={16} />
            Email Sign In
          </button>
          <button
            type="button"
            className={`${styles.tab} ${authMethod === 'whatsapp' ? styles.activeTabWhatsapp : ''}`}
            onClick={() => {
              setAuthMethod('whatsapp')
              setError(null)
            }}
          >
            <MessageSquare size={16} style={{ color: '#25D366' }} />
            WhatsApp Free
          </button>
        </div>

        {error && (
          <div className={`${styles.alert} ${styles.errorAlert}`}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Email Sign In Form */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className={styles.form}>
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
                  Verifying Credentials...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* WhatsApp Sign In Form & Verification */}
        {authMethod === 'whatsapp' && (
          <>
            {!waData ? (
              <form onSubmit={handleWaInitSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={styles.input}
                    placeholder="+92 300 1234567"
                    required
                    disabled={isLoading}
                  />
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Enter your WhatsApp number registered with VoltTrack.
                  </p>
                </div>

                <button
                  type="submit"
                  className={styles.whatsappBtn}
                  disabled={isLoading}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Generating WhatsApp Code...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={18} />
                      Sign In via WhatsApp
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className={styles.codeBox}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your Verification Code</span>
                  <div className={styles.codeBadge}>{waData.code}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Number: {waData.phone}
                  </span>
                </div>

                {/* Step 1: Send WhatsApp Message */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                  style={{ width: '100%' }}
                >
                  <MessageSquare size={18} />
                  1. Send Code on WhatsApp
                  <ArrowRight size={16} />
                </a>

                {/* Step 2: Confirm Code & Sign In */}
                <form onSubmit={handleWaVerifySubmit} className={styles.form} style={{ gap: '1rem' }}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="code" className={styles.label}>
                      2. Confirm 6-Digit Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value)}
                      className={styles.input}
                      placeholder="VT-123456"
                      required
                      disabled={isLoading}
                      style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', letterSpacing: '2px' }}
                    />
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
                      width: '100%',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Signing In...
                      </>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaData(null)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      marginTop: '0.2rem',
                    }}
                  >
                    Change Phone Number
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        <p className={styles.footerText}>
          Don't have an account?{' '}
          <Link href="/register" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

