'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../dashboard.module.css'
import landingStyles from '../landing.module.css'
import {
  getGuestState,
  addGuestReading,
  deleteGuestReading,
  updateGuestMeter,
  GuestState,
  DEFAULT_GUEST_METER,
} from '@/lib/guestStore'
import AddReadingModal from '@/components/AddReadingModal'
import GuestSignupModal from '@/components/GuestSignupModal'
import {
  Zap,
  TrendingUp,
  Camera,
  Plus,
  Trash2,
  AlertTriangle,
  Calendar,
  Gauge,
  Activity,
  CheckCircle,
  CloudUpload,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Edit2,
  Check,
} from 'lucide-react'

function getBillingCycleStart(startDay: number): Date {
  const now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth()
  if (now.getDate() < startDay) {
    month -= 1
    if (month < 0) {
      month = 11
      year -= 1
    }
  }
  return new Date(year, month, startDay, 0, 0, 0, 0)
}

export default function GuestDashboardPage() {
  const [guestState, setGuestState] = useState<GuestState>({
    meter: DEFAULT_GUEST_METER,
    readings: [],
  })
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSignupPromptOpen, setIsSignupPromptOpen] = useState(false)

  // Quick form input
  const [quickReading, setQuickReading] = useState('')
  const [quickIsReset, setQuickIsReset] = useState(false)
  const [quickNextReadingDate, setQuickNextReadingDate] = useState('')
  const [quickError, setQuickError] = useState<string | null>(null)

  // Limit & Date editing
  const [isEditingLimit, setIsEditingLimit] = useState(false)
  const [newLimit, setNewLimit] = useState('200')
  const [isEditingExpectedDate, setIsEditingExpectedDate] = useState(false)
  const [expectedDateInput, setExpectedDateInput] = useState('')

  const checkShouldPromptSignup = (count: number) => {
    if (typeof window === 'undefined') return false
    if (count < 3) return false
    const dismissedAt = parseInt(localStorage.getItem('read_meter_signup_prompt_dismissed') || '0', 10)
    // Trigger when user reaches 3-4 readings if not yet dismissed at 3
    if (count >= 3 && count < 5 && dismissedAt < 3) {
      return true
    }
    // Trigger again when user reaches 5 or more readings if dismissed before 5
    if (count >= 5 && dismissedAt < 5) {
      return true
    }
    return false
  }

  const handleCloseSignupPrompt = () => {
    setIsSignupPromptOpen(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('read_meter_signup_prompt_dismissed', String(guestState.readings.length))
    }
  }

  const refreshState = () => {
    const s = getGuestState()
    setGuestState({ ...s })
    setNewLimit(String(s.meter.max_usage_limit || 200))
  }

  useEffect(() => {
    setMounted(true)
    const s = getGuestState()
    setGuestState({ ...s })
    setNewLimit(String(s.meter.max_usage_limit || 200))

    if (checkShouldPromptSignup(s.readings.length)) {
      setIsSignupPromptOpen(true)
    }

    const handler = () => refreshState()
    window.addEventListener('guest-state-changed', handler)
    return () => window.removeEventListener('guest-state-changed', handler)
  }, [])

  if (!mounted) {
    return (
      <div className={styles.container} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Guest Workspace...</p>
      </div>
    )
  }

  const { meter, readings } = guestState
  const limit = meter.max_usage_limit || 200

  // 1. Calculations
  const baselineReading = readings.find((r) => r.is_billing_reset)
  const latestReading = readings[0]

  let billingCycleStart: Date
  if (baselineReading) {
    billingCycleStart = new Date(baselineReading.created_at)
  } else {
    billingCycleStart = getBillingCycleStart(meter.billing_cycle_start_day || 1)
  }

  let nextReset: Date
  if (meter.next_reading_date) {
    const [year, month, day] = meter.next_reading_date.split('-').map(Number)
    nextReset = new Date(year, month - 1, day, 23, 59, 59, 999)
  } else {
    nextReset = new Date(billingCycleStart)
    nextReset.setMonth(nextReset.getMonth() + 1)
  }
  const diffTime = nextReset.getTime() - new Date().getTime()
  const daysRemaining = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0)

  let currentUsage = 0
  if (latestReading) {
    if (baselineReading) {
      currentUsage = Number(latestReading.reading_value) - Number(baselineReading.reading_value)
    } else if (readings.length > 1) {
      const oldest = readings[readings.length - 1]
      currentUsage = Number(latestReading.reading_value) - Number(oldest.reading_value)
    }
  }
  currentUsage = Math.max(currentUsage, 0)

  const daysElapsed = (new Date().getTime() - billingCycleStart.getTime()) / (1000 * 60 * 60 * 24)
  const durationDays = Math.max(daysElapsed, 1.0)
  const dailyAverage = currentUsage / durationDays
  const projectedUsage = currentUsage + dailyAverage * daysRemaining

  const usagePercentage = limit > 0 ? (currentUsage / limit) * 100 : 0
  const isWarning = usagePercentage >= 80 && usagePercentage < 100
  const isCritical = usagePercentage >= 100

  // K-Electric 200 units threshold
  const keThreshold = 200
  const isKeBreached = currentUsage >= keThreshold
  const isKeWarning = projectedUsage >= keThreshold && !isKeBreached
  const keRemainingUnits = Math.max(keThreshold - currentUsage, 0)
  const keTargetDailyRate = daysRemaining > 0 ? Math.max((keThreshold - currentUsage) / daysRemaining, 0) : 0

  // SVG Gauge calculations
  const radius = 75
  const circumference = 2 * Math.PI * radius
  const progressPct = Math.min(usagePercentage / 100, 1)
  const strokeDashoffset = circumference - progressPct * circumference

  let gaugeColor = 'var(--primary)'
  if (isWarning) gaugeColor = 'var(--warning)'
  if (isCritical) gaugeColor = 'var(--error)'

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setQuickError(null)

    const val = parseFloat(quickReading)
    if (isNaN(val) || val < 0) {
      setQuickError('Please enter a valid reading number.')
      return
    }

    if (latestReading && val < latestReading.reading_value) {
      setQuickError(`Reading must be >= latest reading (${latestReading.reading_value} units).`)
      return
    }

    addGuestReading({
      reading_value: val,
      is_billing_reset: quickIsReset,
      notes: quickIsReset ? 'New cycle baseline (Guest)' : 'Quick logged (Guest)',
    })

    if (quickIsReset && quickNextReadingDate) {
      updateGuestMeter({ next_reading_date: quickNextReadingDate })
    }

    setQuickReading('')
    setQuickIsReset(false)
    setQuickNextReadingDate('')

    const updated = getGuestState()
    if (checkShouldPromptSignup(updated.readings.length)) {
      setIsSignupPromptOpen(true)
    }
  }

  const handleSaveLimit = () => {
    const parsed = parseInt(newLimit, 10)
    if (!isNaN(parsed) && parsed > 0) {
      updateGuestMeter({ max_usage_limit: parsed })
      setIsEditingLimit(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <Zap className={styles.logoIcon} size={24} fill="var(--primary)" />
          <span className={styles.logoText}>
            Read<span>Meter</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '5px 12px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fef3c7',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }} />
            Guest Mode
          </div>

          <Link href="/register" className="glow-btn-solid" style={{ textDecoration: 'none', padding: '7px 14px', fontSize: '0.85rem' }}>
            <CloudUpload size={15} style={{ marginRight: '4px' }} /> Save to Cloud
          </Link>

          <Link href="/login" className="glow-btn" style={{ textDecoration: 'none', padding: '7px 14px', fontSize: '0.85rem' }}>
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>

        {/* Header Title & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className={styles.greeting} style={{ fontSize: '1.85rem' }}>
              Electricity Consumption Tracker
            </h1>
            <p className={styles.subGreeting}>
              Real-time calculations for meter: <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{meter.meter_number}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="glow-btn-solid"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '10px 16px',
                fontSize: '0.9rem',
              }}
            >
              <Camera size={18} /> Camera OCR / Advanced Log
            </button>
          </div>
        </div>

        {/* K-Electric Slab Alert Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.1rem 1.5rem',
            borderRadius: '12px',
            background: isKeBreached
              ? 'rgba(239, 68, 68, 0.12)'
              : isKeWarning
              ? 'rgba(245, 158, 11, 0.12)'
              : 'rgba(16, 185, 129, 0.12)',
            border: `1px solid ${
              isKeBreached
                ? 'rgba(239, 68, 68, 0.3)'
                : isKeWarning
                ? 'rgba(245, 158, 11, 0.3)'
                : 'rgba(16, 185, 129, 0.3)'
            }`,
            color: isKeBreached ? '#b91c1c' : isKeWarning ? '#92400e' : '#065f46',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isKeBreached ? (
              <ShieldAlert size={28} style={{ color: 'var(--error)', flexShrink: 0 }} />
            ) : isKeWarning ? (
              <AlertTriangle size={28} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            ) : (
              <ShieldCheck size={28} style={{ color: 'var(--success)', flexShrink: 0 }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                K-Electric Tariff Status:{' '}
                {isKeBreached
                  ? 'UNPROTECTED SLAB EXCEEDED'
                  : isKeWarning
                  ? 'BREACH PROJECTED BEFORE CYCLE END'
                  : 'PROTECTED (Subsidized Rate Safe)'}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.2rem' }}>
                {isKeBreached ? (
                  `You have consumed ${currentUsage.toFixed(0)} Units (exceeded 200 limit). High commercial rate applies this month.`
                ) : isKeWarning ? (
                  `Current usage is ${currentUsage.toFixed(0)} Units. At your current pace, you are projected to reach ${projectedUsage.toFixed(0)} Units.`
                ) : (
                  `Safe! Consumed ${currentUsage.toFixed(0)} / 200 Units. You have ${keRemainingUnits.toFixed(0)} safe units remaining for the next ${daysRemaining} days.`
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
            <div
              style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.05)',
                color: 'var(--text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <Calendar size={14} style={{ color: 'var(--primary)' }} />
              <span>
                Expected Last Date:{' '}
                {nextReset.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span style={{ color: 'var(--primary)' }}>{daysRemaining}d left</span>
              <button
                onClick={() => {
                  setExpectedDateInput(meter.next_reading_date || '')
                  setIsEditingExpectedDate(!isEditingExpectedDate)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                title="Edit Expected Reading Last Date"
              >
                <Edit2 size={12} />
              </button>
            </div>

            {isEditingExpectedDate && (
              <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(6,9,19,0.9)', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input
                  type="date"
                  value={expectedDateInput}
                  onChange={(e) => setExpectedDateInput(e.target.value)}
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    color: '#fff',
                    fontSize: '0.8rem',
                  }}
                />
                <button
                  onClick={() => {
                    if (expectedDateInput) {
                      updateGuestMeter({ next_reading_date: expectedDateInput })
                      setIsEditingExpectedDate(false)
                    }
                  }}
                  className="glow-btn-solid"
                  style={{ padding: '4px 10px', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingExpectedDate(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* Left Column: Quick logger & Stats */}
          <div className={styles.leftColumn}>
            {/* Stats Row */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Cycle Consumption</span>
                <span className={styles.statValue}>
                  {currentUsage.toFixed(0)}
                  <span className={styles.statValueUnit}>Units</span>
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {readings.length > 0 ? `${readings.length} reading(s) recorded` : 'No readings yet'}
                </span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Daily Burn Rate</span>
                <span className={styles.statValue}>
                  {dailyAverage.toFixed(1)}
                  <span className={styles.statValueUnit}>Units/d</span>
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Target: &le; {keTargetDailyRate.toFixed(1)} u/d for protected slab
                </span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Projected Total</span>
                <span className={styles.statValue} style={{ color: projectedUsage >= 200 ? 'var(--warning)' : '#fff' }}>
                  {projectedUsage.toFixed(0)}
                  <span className={styles.statValueUnit}>Units</span>
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {projectedUsage >= 200 ? 'Crosses 200 slab' : 'Under 200 slab'}
                </span>
              </div>
            </div>

            {/* Quick Inline Reading Logger */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Plus size={18} /> Quick Reading Logger
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Instant log (no reload required)
                </span>
              </div>

              {quickError && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#fca5a5',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AlertTriangle size={15} />
                  <span>{quickError}</span>
                </div>
              )}

              <form onSubmit={handleQuickSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="number"
                    step="1"
                    placeholder="Enter current meter dial value"
                    value={quickReading}
                    onChange={(e) => setQuickReading(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      background: 'rgba(6, 9, 19, 0.6)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      color: '#fff',
                      fontSize: '0.95rem',
                    }}
                  />
                  <button
                    type="submit"
                    className="glow-btn-solid"
                    disabled={!quickReading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '12px 20px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={16} /> Log Units
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="glow-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '12px 16px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Camera size={16} /> Snap Dial
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="guestResetCheck"
                    checked={quickIsReset}
                    onChange={(e) => setQuickIsReset(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="guestResetCheck" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Mark this reading as Billing Cycle Reset (Baseline for this month)
                  </label>
                </div>

                {quickIsReset && (
                  <div
                    className="fade-in"
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(37, 99, 235, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <label
                      htmlFor="guestQuickNextReadingDate"
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Calendar size={15} style={{ color: 'var(--primary)' }} />
                      Expected Meter Reading Last Date (Cycle End):
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input
                        type="date"
                        id="guestQuickNextReadingDate"
                        value={quickNextReadingDate}
                        onChange={(e) => setQuickNextReadingDate(e.target.value)}
                        style={{
                          maxWidth: '220px',
                          background: 'rgba(6, 9, 19, 0.8)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#fff',
                          fontSize: '0.88rem',
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        e.g. 30th of September
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      Specify the expected last date of this cycle (e.g. 30th of September) so we can accurately calculate remaining days and your safe daily unit allowance.
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Reading History Table */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Calendar size={18} /> Reading History ({readings.length})
                </h3>
              </div>

              {readings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
                  <Zap size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontWeight: 500 }}>No readings recorded yet.</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Enter your physical meter dial value above or snap a photo with your camera.
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '10px 12px' }}>Date</th>
                        <th style={{ padding: '10px 12px' }}>Dial Reading</th>
                        <th style={{ padding: '10px 12px' }}>Type</th>
                        <th style={{ padding: '10px 12px' }}>Notes</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readings.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                            {new Date(r.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                            {r.reading_value} Units
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            {r.is_billing_reset ? (
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#93c5fd',
                                  fontWeight: 600,
                                }}
                              >
                                Cycle Start
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Regular</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                            {r.notes || '-'}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <button
                              onClick={() => deleteGuestReading(r.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fca5a5',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                              title="Delete Reading"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Circular Gauge & Limit Settings */}
          <div className={styles.rightColumn}>
            {/* SVG Circular Gauge */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>
                <Gauge size={18} /> Budget Allocation
              </h3>

              <div className={styles.gaugeContainer}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <defs>
                    <radialGradient id="guestGaugeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="60%" stopColor="rgba(10, 16, 34, 0.9)" stopOpacity="1" />
                      <stop offset="100%" stopColor={gaugeColor} stopOpacity="0.25" />
                    </radialGradient>
                  </defs>

                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="url(#guestGaugeGlow)"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="12"
                  />

                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={gaugeColor}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                    style={{
                      transition: 'stroke-dashoffset var(--transition-slow)',
                      filter: `drop-shadow(0 0 8px ${gaugeColor})`,
                    }}
                  />
                </svg>

                <div className={styles.gaugeTextContainer}>
                  <span className={styles.gaugeNumber}>{currentUsage.toFixed(0)}</span>
                  <span className={styles.gaugeMax}>of {limit} Units</span>
                  <span className={styles.gaugeLabel} style={{ color: gaugeColor, textShadow: `0 0 8px ${gaugeColor}` }}>
                    {usagePercentage.toFixed(0)}% USED
                  </span>
                </div>
              </div>

              {/* Limit Editor */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(8, 14, 28, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly Target Limit</div>
                  {isEditingLimit ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <input
                        type="number"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                        style={{
                          width: '85px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          background: 'rgba(6, 10, 20, 0.9)',
                          border: '1px solid rgba(0, 240, 255, 0.3)',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          fontFamily: 'var(--font-mono), monospace',
                          outline: 'none',
                        }}
                      />
                      <button
                        onClick={handleSaveLimit}
                        style={{
                          padding: '5px 10px',
                          background: 'var(--primary)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#040915',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                      {limit} <span style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--text-secondary)' }}>Units</span>
                    </div>
                  )}
                </div>

                {!isEditingLimit && (
                  <button
                    onClick={() => setIsEditingLimit(true)}
                    style={{
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.25)',
                      borderRadius: '8px',
                      color: 'var(--primary)',
                      padding: '6px 12px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>
            </div>

            {/* Cloud Backup Promotion Card */}
            <div className={styles.card} style={{ border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <h3 className={styles.cardTitle} style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                <CloudUpload size={18} /> Why Create an Account?
              </h3>
              <ul style={{ paddingLeft: '1.2rem', margin: '0.75rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li>Auto-sync readings across all family phones & laptops</li>
                <li>Instant WhatsApp & Web Push alert when nearing 200 units</li>
                <li>Unlimited reading history & billing cycle exports</li>
                <li>Permanent cloud backup — never lose your meter data</li>
              </ul>
              <Link
                href="/register"
                className="glow-btn-solid"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  marginTop: '1rem',
                  padding: '10px 16px',
                  fontSize: '0.88rem',
                  width: '100%',
                }}
              >
                Sign Up & Save My Readings <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Embedded Reading / OCR Modal for Guest */}
      <AddReadingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meterId={meter.id}
        meterNumber={meter.meter_number}
        isGuest={true}
        onSuccess={() => {
          setIsModalOpen(false)
          refreshState()
          const updated = getGuestState()
          if (checkShouldPromptSignup(updated.readings.length)) {
            setIsSignupPromptOpen(true)
          }
        }}
      />

      {/* Automated Signup Prompt after continuous usage (3 to 5 readings) */}
      <GuestSignupModal
        isOpen={isSignupPromptOpen}
        onClose={handleCloseSignupPrompt}
        readingCount={readings.length}
      />
    </div>
  )
}
