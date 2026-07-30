'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'
import { signUpAction, signUpWhatsAppAction, verifyWhatsAppCodeAction } from '@/lib/actions'
import { Zap, AlertTriangle, CheckCircle, Loader2, Mail, MessageSquare, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [authMethod, setAuthMethod] = useState<'email' | 'whatsapp'>('email')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // WhatsApp state
  const [waData, setWaData] = useState<{ phone: string; fullName: string; code: string } | null>(null)
  const [enteredCode, setEnteredCode] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const result = await signUpAction(formData)

    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message || 'Registration successful!')
      e.currentTarget.reset()
    }
  }

  const handleWaInitSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signUpWhatsAppAction(formData)

    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success && result.phone && result.code) {
      setWaData({
        phone: result.phone,
        fullName: result.fullName || '',
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
      waData.code,
      waData.fullName
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
    `Hello VoltTrack! I am registering my account (${waData?.fullName}). Verification Code: ${waData?.code}`
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
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Sign up to start tracking your energy usage</p>
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
            Email Sign Up
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

        {/* Email Registration Form */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className={styles.form}>
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
        )}

        {/* WhatsApp Registration Form & Verification */}
        {authMethod === 'whatsapp' && (
          <>
            {!waData ? (
              <form onSubmit={handleWaInitSubmit} className={styles.form}>
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
                  <label htmlFor="phone" className={styles.label}>
                    WhatsApp Number
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
                    Enter your WhatsApp phone number including country code (e.g. +92 for Pakistan).
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
                      Generating WhatsApp Link...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={18} />
                      Continue via WhatsApp
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

                {/* Step 1: Open WhatsApp Button */}
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

                {/* Step 2: Code Verification Input & Button */}
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
                        Verifying Code...
                      </>
                    ) : (
                      'Verify & Complete Sign Up'
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
          Already registered?{' '}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

