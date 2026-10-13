'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../dashboard.module.css'
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
import ShareWhatsAppBtn from '@/components/ShareWhatsAppBtn'
import {
  Zap,
  Camera,
  Trash2,
  AlertTriangle,
  Calendar,
  CloudUpload,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
  Hash,
  Sparkles,
} from 'lucide-react'

// Realistic NEPRA / K-Electric Tariff Calculation Models (2026 Domestic Slabs)
function calculateProtectedBill(units: number) {
  const u = Math.max(0, units)
  let energyCost = 0
  if (u <= 100) {
    energyCost = u * 7.74
  } else {
    energyCost = 100 * 7.74 + (u - 100) * 14.95
  }
  const fpa = u * 1.5 // Subsidized domestic FPA
  const fixedCharge = 50 // Minimal fixed charge
  const tvFee = 35
  const duty = energyCost * 0.015 // 1.5% Electricity duty
  const total = Math.round(energyCost + fpa + fixedCharge + tvFee + duty)
  return {
    energyCost: Math.round(energyCost),
    fpa: Math.round(fpa),
    fixedCharge,
    tvFee,
    duty: Math.round(duty),
    total,
  }
}

function calculateUnprotectedBill(units: number) {
  const u = Math.max(0, units)
  let energyCost = 0
  if (u <= 100) {
    energyCost = u * 16.48
  } else if (u <= 200) {
    energyCost = 100 * 16.48 + (u - 100) * 22.95
  } else if (u <= 300) {
    energyCost = 100 * 16.48 + 100 * 22.95 + (u - 200) * 34.26
  } else {
    energyCost = 100 * 16.48 + 100 * 22.95 + 100 * 34.26 + (u - 300) * 42.10
  }
  const fpa = u * 3.20 // Full FPA
  const fixedCharge = 200 // Unprotected fixed charge
  const tvFee = 35
  const duty = energyCost * 0.015 // Electricity duty
  const gst = (energyCost + fpa + fixedCharge) * 0.18 // 18% General Sales Tax
  const total = Math.round(energyCost + fpa + fixedCharge + tvFee + duty + gst)
  return {
    energyCost: Math.round(energyCost),
    fpa: Math.round(fpa),
    fixedCharge,
    tvFee,
    duty: Math.round(duty),
    gst: Math.round(gst),
    total,
  }
}

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
  const [showQuickEntry, setShowQuickEntry] = useState(false)

  // Collapsible History & Settings
  const [showHistory, setShowHistory] = useState(false)
  const [isEditingExpectedDate, setIsEditingExpectedDate] = useState(false)
  const [expectedDateInput, setExpectedDateInput] = useState('')

  const checkShouldPromptSignup = (count: number) => {
    if (typeof window === 'undefined') return false
    if (count < 3) return false
    const dismissedAt = parseInt(localStorage.getItem('read_meter_signup_prompt_dismissed') || '0', 10)
    if (count >= 3 && count < 5 && dismissedAt < 3) return true
    if (count >= 5 && dismissedAt < 5) return true
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
  }

  useEffect(() => {
    setMounted(true)
    const s = getGuestState()
    setGuestState({ ...s })

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
        <p style={{ color: 'var(--text-secondary)' }}>Loading 1-Screen Traffic Light Dashboard...</p>
      </div>
    )
  }

  const { meter, readings } = guestState
  const safeLimit = 200 // Protected Slab Threshold (NEPRA)

  // 1. Calculations & Baselines
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

  const isSingleBaselineOnly = readings.length === 1 && Boolean(latestReading?.is_billing_reset)

  const daysElapsed = (new Date().getTime() - billingCycleStart.getTime()) / (1000 * 60 * 60 * 24)
  const durationDays = Math.max(daysElapsed, 1.0)
  const dailyAverage = currentUsage / durationDays
  const projectedUsage = currentUsage + dailyAverage * daysRemaining

  // 3-Tier Traffic Light Classification:
  const isBreached = currentUsage >= safeLimit
  const isWarning = (currentUsage >= 160 && currentUsage < safeLimit) || (projectedUsage >= safeLimit && !isBreached)

  const remainingUnits = Math.max(safeLimit - currentUsage, 0)
  const targetBurnRate = daysRemaining > 0 ? Math.max(remainingUnits / daysRemaining, 0) : 0

  // SVG Radial Gauge Geometry
  const radius = 76
  const circumference = 2 * Math.PI * radius
  const rawProgress = isSingleBaselineOnly ? 0.05 : Math.min(currentUsage / safeLimit, 1.0)
  const strokeDashoffset = circumference - rawProgress * circumference

  let trafficTheme = {
    badgeBg: 'rgba(16, 185, 129, 0.16)',
    badgeBorder: '#10b981',
    badgeColor: '#10b981',
    accentColor: '#10b981',
    glowShadow: '0 0 25px rgba(16, 185, 129, 0.22)',
    statusTitle: '🟢 PROTECTED SAFE (< 200 Units)',
    statusSubtitle: 'Subsidized NEPRA / K-Electric slab active.',
    slabLabel: 'Protected Subsidized Slab',
    prescriptionUrdu: 'سبسڈائزڈ سلیب محفوظ ہے! اے سی 26°C پر چلائیں اور موٹر کا شیڈول صبح رکھیں تاکہ 200 یونٹس کے اندر رہیں۔',
    prescriptionEng: 'Protected tariff intact. Maintain AC at 26°C and run water motor outside peak hours.',
  }

  if (isWarning) {
    trafficTheme = {
      badgeBg: 'rgba(245, 158, 11, 0.16)',
      badgeBorder: '#f59e0b',
      badgeColor: '#f59e0b',
      accentColor: '#f59e0b',
      glowShadow: '0 0 25px rgba(245, 158, 11, 0.25)',
      statusTitle: '🟡 SLAB AT RISK (Approaching Cliff)',
      statusSubtitle: `Approaching 200 cliff! ${remainingUnits.toFixed(0)} units buffer left over ${daysRemaining} days.`,
      slabLabel: 'Approaching Breach Limit',
      prescriptionUrdu: 'خبردار! 200 یونٹ کی حد قریب ہے۔ استری اور واشنگ مشین کا غیر ضروری استعمال روکیں اور اے سی کا دورانیہ کم کریں۔',
      prescriptionEng: 'Warning: Approaching 200 threshold! Shift laundry/ironing to off-peak and limit AC hours.',
    }
  } else if (isBreached) {
    trafficTheme = {
      badgeBg: 'rgba(239, 68, 68, 0.2)',
      badgeBorder: '#ef4444',
      badgeColor: '#ef4444',
      accentColor: '#ef4444',
      glowShadow: '0 0 30px rgba(239, 68, 68, 0.35)',
      statusTitle: '🔴 CLIFF BREACHED (Penalty Applied)',
      statusSubtitle: '200 unit ceiling crossed! Higher unprotected tariff applies.',
      slabLabel: 'Unprotected High Tariff Active',
      prescriptionUrdu: '200 یونٹ کی حد پار ہوچکی ہے! فوری طور پر ہیوی لوڈز بند کریں تاکہ اگلا 300+ والا سلیب نہ لگ جائے۔',
      prescriptionEng: 'Protected slab breached! Immediate load management required to avoid 300+ slab rates.',
    }
  }

  // Tier 2 Financial Comparison Figures
  const unitsForSafeCalc = Math.min(currentUsage || (isSingleBaselineOnly ? 45 : 1), 200)
  const currentSafeBill = calculateProtectedBill(unitsForSafeCalc)
  const cliffComparisonUnits = Math.max(currentUsage, 201)
  const cliffUnprotectedBill = calculateUnprotectedBill(cliffComparisonUnits)
  const penaltySurge = Math.max(cliffUnprotectedBill.total - currentSafeBill.total, 4800)

  // Handlers
  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setQuickError(null)

    const val = parseFloat(quickReading)
    if (isNaN(val) || val < 0) {
      setQuickError('Please enter a valid reading number.')
      return
    }

    if (latestReading && val < latestReading.reading_value && !quickIsReset) {
      setQuickError(`Reading must be >= latest reading (${latestReading.reading_value} kWh).`)
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
    setShowQuickEntry(false)

    const updated = getGuestState()
    if (checkShouldPromptSignup(updated.readings.length)) {
      setIsSignupPromptOpen(true)
    }
  }

  const handleDeleteReading = (id: string) => {
    deleteGuestReading(id)
  }

  const handleSaveExpectedDate = () => {
    if (expectedDateInput) {
      updateGuestMeter({ next_reading_date: expectedDateInput })
      setIsEditingExpectedDate(false)
    }
  }

  return (
    <div className={styles.container} style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <Zap className={styles.logoIcon} size={24} fill="var(--primary)" />
          <span className={styles.logoText}>
            Read<span>Meter</span>
          </span>
        </Link>
        <div className={styles.navActions}>
          <div className={styles.guestBadge} style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: trafficTheme.accentColor }} />
            Traffic Light Mode
          </div>
          <Link
            href="/register"
            className="glow-btn-solid"
            style={{ textDecoration: 'none', padding: '7px 13px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            <CloudUpload size={14} style={{ marginRight: '4px' }} /> Save to Cloud
          </Link>
        </div>
      </nav>

      {/* Main 1-Screen Traffic Light Workspace */}
      <main className={styles.main} style={{ maxWidth: '880px', margin: '0 auto', padding: '1rem 1rem 3rem' }}>
        
        {/* TIER 1 (TOP): 200-Unit Safe Progress Gauge & High-Contrast Traffic Light Badge */}
        <section
          style={{
            background: 'var(--card-bg, #0f172a)',
            border: `1.5px solid ${trafficTheme.badgeBorder}`,
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: trafficTheme.glowShadow,
            marginBottom: '1.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: trafficTheme.accentColor,
              filter: 'blur(75px)',
              opacity: 0.18,
              pointerEvents: 'none',
            }}
          />

          {/* Header Row: Traffic Light Status Badge + Cycle End Date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: trafficTheme.badgeBg,
                  border: `1px solid ${trafficTheme.badgeBorder}`,
                  color: trafficTheme.badgeColor,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  letterSpacing: '0.02em',
                }}
              >
                {trafficTheme.statusTitle}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <Calendar size={14} style={{ color: trafficTheme.accentColor }} />
              <span>Cycle Ends: <strong style={{ color: '#fff' }}>{meter.next_reading_date || 'Day 30'}</strong></span>
              <button
                type="button"
                onClick={() => {
                  setExpectedDateInput(meter.next_reading_date || '')
                  setIsEditingExpectedDate(!isEditingExpectedDate)
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                title="Edit Cycle End Date"
              >
                <Edit2 size={11} />
              </button>
            </div>
          </div>

          {/* Date Picker Drawer (if editing) */}
          {isEditingExpectedDate && (
            <div
              className="fade-in"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                background: 'rgba(0,0,0,0.3)',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <input
                type="date"
                value={expectedDateInput}
                onChange={(e) => setExpectedDateInput(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(15,23,42,0.8)',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              />
              <button onClick={handleSaveExpectedDate} className="glow-btn-solid" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <Check size={13} style={{ marginRight: '4px' }} /> Save
              </button>
              <button
                onClick={() => setIsEditingExpectedDate(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Gauge + Safe Velocity Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {/* SVG Circular Progress Gauge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <svg width="180" height="180" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={trafficTheme.badgeBorder}
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.8s ease-in-out',
                    filter: `drop-shadow(0 0 6px ${trafficTheme.badgeBorder})`,
                  }}
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {currentUsage.toFixed(0)}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  / 200 Units
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: trafficTheme.badgeColor, fontWeight: 600 }}>
                {isSingleBaselineOnly ? 'Initial Baseline Logged' : `${((currentUsage / safeLimit) * 100).toFixed(0)}% Used`}
              </div>
            </div>

            {/* Velocity Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Safe Buffer</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: trafficTheme.accentColor }}>
                  {remainingUnits.toFixed(0)} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>units</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Days Left</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                  {daysRemaining} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>days</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Safe Daily Allowance</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#6ee7b7' }}>
                  ≤ {targetBurnRate.toFixed(1)} <span style={{ fontSize: '0.72rem', fontWeight: 400 }}>u/day</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Current Pace</div>
                <div
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: dailyAverage > targetBurnRate && !isBreached ? '#f59e0b' : dailyAverage > targetBurnRate ? '#ef4444' : '#38bdf8',
                  }}
                >
                  {dailyAverage.toFixed(1)} <span style={{ fontSize: '0.72rem', fontWeight: 400 }}>u/day</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TIER 2 (MIDDLE): Household Financial Comparison Card */}
        <section
          style={{
            background: 'var(--card-bg, #0f172a)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '1.5rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>💰 Household Bill & Penalty Comparison</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.06)', padding: '3px 9px', borderRadius: '6px' }}>
              NEPRA / KE Tariff Slabs
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
              marginBottom: '1.1rem',
            }}
          >
            {/* Safe Protected Bill Box */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1.5px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.82rem', fontWeight: 700 }}>
                <ShieldCheck size={16} /> PROTECTED TARIFF (Safe)
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', margin: '0.45rem 0' }}>
                Rs {currentSafeBill.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Subsidized slab (~Rs 7.74 - 14.95/unit) with zero heavy surcharge penalties.
              </div>
            </div>

            {/* Unprotected Cliff Penalty Box */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.82rem', fontWeight: 700 }}>
                <ShieldAlert size={16} /> UNPROTECTED CLIFF (Breach)
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fca5a5', margin: '0.45rem 0' }}>
                Rs {cliffUnprotectedBill.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Commercial unprotected slab (~Rs 22.95 - 34.26/unit) + 18% GST + double FPA.
              </div>
            </div>
          </div>

          {/* Household Financial Verdict Banner */}
          <div
            style={{
              background: isBreached ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${isBreached ? '#ef4444' : '#10b981'}`,
              borderRadius: '14px',
              padding: '12px 18px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              {isBreached ? (
                <span>
                  <strong style={{ color: '#ef4444' }}>Penalty Active:</strong> You are incurring approximately{' '}
                  <strong style={{ color: '#fff' }}>Rs {penaltySurge.toLocaleString()}</strong> in penalty rates this month.
                </span>
              ) : (
                <span>
                  <strong style={{ color: '#10b981' }}>Family Savings:</strong> Staying under 200 units saves your household{' '}
                  <strong style={{ color: '#fff' }}>Rs {penaltySurge.toLocaleString()}+</strong> in electricity bills!
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isBreached ? 'Threshold Cross' : 'Protected Advantage'}
            </span>
          </div>
        </section>

        {/* TIER 3 (BOTTOM ACTION DOCK): Domestic Prescription & Thumb-Friendly Actions */}
        <section
          style={{
            background: 'var(--card-bg, #0f172a)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Actionable Domestic Prescription Banner (Urdu + English) */}
          <div
            style={{
              background: 'rgba(0,0,0,0.35)',
              borderLeft: `4px solid ${trafficTheme.badgeBorder}`,
              borderRadius: '0 12px 12px 0',
              padding: '14px 18px',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: trafficTheme.badgeColor, fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              <Sparkles size={14} /> Actionable Domestic Prescription
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)', direction: 'rtl', textAlign: 'right', fontFamily: 'system-ui, -apple-system, sans-serif', marginBottom: '6px' }}>
              {trafficTheme.prescriptionUrdu}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {trafficTheme.prescriptionEng}
            </div>
          </div>

          {/* Thumb-Friendly Action Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {/* 1. OCR Camera Scan */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="glow-btn-solid"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                padding: '14px',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Camera size={19} /> Scan Meter Dial
            </button>

            {/* 2. 4-Digit Quick Entry Toggle */}
            <button
              onClick={() => setShowQuickEntry(!showQuickEntry)}
              className="glow-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                padding: '14px',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: showQuickEntry ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)',
              }}
            >
              <Hash size={19} /> {showQuickEntry ? 'Close Entry' : '4-Digit Entry'}
            </button>

            {/* 3. WhatsApp Share */}
            <ShareWhatsAppBtn
              type="status"
              meterNumber="Guest Meter"
              currentUsage={currentUsage}
              limit={safeLimit}
              dailyAverage={dailyAverage}
              daysRemaining={daysRemaining}
              projectedUsage={projectedUsage}
              slabStatus={trafficTheme.slabLabel}
              variant="button"
              label="WhatsApp Share"
              style={{
                padding: '14px',
                borderRadius: '14px',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </div>

          {/* Inline 4-Digit Entry Drawer */}
          {showQuickEntry && (
            <div
              className="fade-in"
              style={{
                marginTop: '1.25rem',
                padding: '1.25rem',
                borderRadius: '16px',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.92rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Hash size={16} style={{ color: 'var(--primary)' }} /> 4-Digit Dial Logger
              </h4>

              {quickError && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    marginBottom: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <AlertTriangle size={15} /> {quickError}
                </div>
              )}

              <form onSubmit={handleQuickSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <input
                    type="number"
                    step="1"
                    placeholder="Enter current reading (e.g. 5420)"
                    value={quickReading}
                    onChange={(e) => setQuickReading(e.target.value)}
                    required
                    style={{
                      flex: '1 1 200px',
                      background: 'rgba(6, 9, 19, 0.8)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '11px 14px',
                      color: '#fff',
                      fontSize: '0.95rem',
                    }}
                  />
                  <button
                    type="submit"
                    className="glow-btn-solid"
                    disabled={!quickReading}
                    style={{
                      padding: '11px 20px',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      borderRadius: '10px',
                    }}
                  >
                    Save Reading
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="guestQuickResetCheck"
                    checked={quickIsReset}
                    onChange={(e) => setQuickIsReset(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="guestQuickResetCheck" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Mark this reading as Billing Cycle Baseline (Day 1 / Bill Reset)
                  </label>
                </div>

                {quickIsReset && (
                  <div
                    style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <label style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>
                      Expected Cycle End Date:
                    </label>
                    <input
                      type="date"
                      value={quickNextReadingDate}
                      onChange={(e) => setQuickNextReadingDate(e.target.value)}
                      style={{
                        maxWidth: '220px',
                        background: 'rgba(6, 9, 19, 0.9)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                )}
              </form>
            </div>
          )}
        </section>

        {/* Collapsible History Drawer */}
        <section
          style={{
            background: 'var(--card-bg, #0f172a)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '1.25rem 1.5rem',
          }}
        >
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.92rem',
              fontWeight: 600,
              padding: 0,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={17} style={{ color: 'var(--text-secondary)' }} />
              Reading History & Records ({readings.length})
            </span>
            {showHistory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showHistory && (
            <div className="fade-in" style={{ marginTop: '1.25rem' }}>
              {readings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  No readings logged yet. Use &apos;Scan Meter Dial&apos; or &apos;4-Digit Entry&apos; above.
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '8px 10px' }}>Date</th>
                        <th style={{ padding: '8px 10px' }}>Dial Value</th>
                        <th style={{ padding: '8px 10px' }}>Type</th>
                        <th style={{ padding: '8px 10px' }}>Notes</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readings.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                            {new Date(r.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                            {r.reading_value} kWh
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            {r.is_billing_reset ? (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#93c5fd',
                                  fontWeight: 600,
                                }}
                              >
                                Baseline
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Regular</span>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            {r.notes || '-'}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                              <ShareWhatsAppBtn
                                type="reading"
                                meterNumber="Guest Meter"
                                value={Number(r.reading_value)}
                                date={new Date(r.created_at).toLocaleDateString()}
                                notes={r.notes || null}
                                variant="icon"
                              />
                              <button
                                onClick={() => handleDeleteReading(r.id)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#fca5a5',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                }}
                                title="Delete reading"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Cloud Sync Upsell Footer */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Guest readings are stored locally in this browser. Create a free account to sync across family phones.
                </span>
                <Link
                  href="/register"
                  className="glow-btn-solid"
                  style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Create Account <ArrowRight size={13} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            </div>
          )}
        </section>
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

