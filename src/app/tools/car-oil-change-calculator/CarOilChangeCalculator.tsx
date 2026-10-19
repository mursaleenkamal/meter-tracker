'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './oilCalculator.module.css'
import {
  Gauge,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
} from 'lucide-react'

type OilType = 'mineral' | 'semi_synthetic' | 'full_synthetic'

interface OilSpec {
  name: string
  baseInterval: number
  description: string
  typicalGrade: string
}

const OIL_PRESETS: Record<OilType, OilSpec> = {
  mineral: {
    name: 'Mineral Engine Oil (Standard)',
    baseInterval: 3500,
    description: 'Traditional crude-refined oil. Recommended interval: 3,000–4,000 km.',
    typicalGrade: '20W-50, 10W-40',
  },
  semi_synthetic: {
    name: 'Semi-Synthetic Oil (Synthetic Blend)',
    baseInterval: 5000,
    description: 'Blended mineral & synthetic base. Recommended interval: 5,000 km.',
    typicalGrade: '10W-40, 5W-30',
  },
  full_synthetic: {
    name: 'Fully Synthetic Oil (High Performance)',
    baseInterval: 9000,
    description: 'Engineered synthetic molecules. Recommended interval: 8,000–10,000 km.',
    typicalGrade: '0W-20, 5W-20, 5W-30',
  },
}

export default function CarOilChangeCalculator() {
  const [currentOdometer, setCurrentOdometer] = useState<number>(48500)
  const [lastOilChange, setLastOilChange] = useState<number>(45000)
  const [oilType, setOilType] = useState<OilType>('semi_synthetic')
  const [severeDriving, setSevereDriving] = useState<boolean>(true)
  const [dailyCommute, setDailyCommute] = useState<number>(30)

  // Sanitize input to strip decimals (handles trip-meter decimals like 48500.6)
  const handleCurrentOdometerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    if (rawVal === '') {
      setCurrentOdometer(0)
      return
    }
    const cleanNum = Math.floor(Math.abs(parseFloat(rawVal)))
    setCurrentOdometer(isNaN(cleanNum) ? 0 : cleanNum)
  }

  const handleLastChangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    if (rawVal === '') {
      setLastOilChange(0)
      return
    }
    const cleanNum = Math.floor(Math.abs(parseFloat(rawVal)))
    setLastOilChange(isNaN(cleanNum) ? 0 : cleanNum)
  }

  // Quality gate: negative delta check
  const isNegativeDelta = currentOdometer < lastOilChange && currentOdometer > 0 && lastOilChange > 0

  const calculations = useMemo(() => {
    const preset = OIL_PRESETS[oilType]
    const baseInterval = preset.baseInterval
    // Severe driving condition applies 15% reduction
    const effectiveInterval = severeDriving ? Math.round(baseInterval * 0.85) : baseInterval
    const targetDueOdometer = lastOilChange + effectiveInterval
    const kmDriven = Math.max(0, currentOdometer - lastOilChange)
    const remainingKm = targetDueOdometer - currentOdometer
    const isOverdue = remainingKm <= 0

    // Remaining percentage of oil life
    const remainingPercentage = isOverdue
      ? 0
      : Math.min(100, Math.max(0, Math.round((remainingKm / effectiveInterval) * 100)))

    // Days remaining projection
    const daysRemaining = dailyCommute > 0 ? Math.round(remainingKm / dailyCommute) : 0

    // Due date estimation
    const now = new Date()
    const targetDate = new Date(now.getTime() + daysRemaining * 86400000)
    const formattedDueDate = targetDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    // Status classification:
    // Green (Safe): > 1,000 km
    // Yellow (Warning): 200 - 1,000 km
    // Red (Alert): < 200 km or overdue
    let status: 'safe' | 'warning' | 'alert' = 'safe'
    let statusLabel = 'Safe — Oil Life Good'
    let statusColor = '#10B981' // Emerald Safe

    if (isOverdue || remainingKm < 200) {
      status = 'alert'
      statusLabel = isOverdue ? '⚠️ Overdue — Service Now' : '🔴 Critical — Service Required'
      statusColor = '#EF4444' // Crimson Alert
    } else if (remainingKm <= 1000) {
      status = 'warning'
      statusLabel = '🟡 Due Soon — Schedule Service'
      statusColor = '#F59E0B' // Amber Warning
    }

    return {
      preset,
      baseInterval,
      effectiveInterval,
      targetDueOdometer,
      kmDriven,
      remainingKm,
      isOverdue,
      remainingPercentage,
      daysRemaining,
      formattedDueDate,
      status,
      statusLabel,
      statusColor,
    }
  }, [currentOdometer, lastOilChange, oilType, severeDriving, dailyCommute])

  // SVG Gauge calculations (semi-circle arc)
  // Arc length for R=85 semi-circle = pi * 85 = ~267.04
  const ARC_LENGTH = 267.04
  const strokeOffset = ARC_LENGTH - (calculations.remainingPercentage / 100) * ARC_LENGTH

  return (
    <div className={styles.calculatorCard}>
      {/* Control Inputs */}
      <div className={styles.controlGrid}>
        {/* Current Odometer */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="current-odo">
            <span>🚗 Current Odometer Reading</span>
            <span className={styles.labelHint}>Total KM</span>
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="current-odo"
              type="number"
              className={styles.inputField}
              value={currentOdometer === 0 ? '' : currentOdometer}
              onChange={handleCurrentOdometerChange}
              placeholder="e.g. 48500"
              min="0"
              step="1"
            />
            <span className={styles.unitSuffix}>KM</span>
          </div>
        </div>

        {/* Last Oil Change Mileage */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="last-oil">
            <span>🔧 Last Oil Change Mileage</span>
            <span className={styles.labelHint}>Odometer at service</span>
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="last-oil"
              type="number"
              className={styles.inputField}
              value={lastOilChange === 0 ? '' : lastOilChange}
              onChange={handleLastChangeChange}
              placeholder="e.g. 45000"
              min="0"
              step="1"
            />
            <span className={styles.unitSuffix}>KM</span>
          </div>
        </div>

        {/* Oil Type Preset */}
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="oil-type">
            <span>🛢️ Engine Oil Grade & Type</span>
            <span className={styles.labelHint}>Base: {OIL_PRESETS[oilType].baseInterval} KM</span>
          </label>
          <select
            id="oil-type"
            className={styles.select}
            value={oilType}
            onChange={(e) => setOilType(e.target.value as OilType)}
          >
            <option value="mineral">Mineral Oil (Standard — 3,500 KM)</option>
            <option value="semi_synthetic">Semi-Synthetic (5,000 KM Blend)</option>
            <option value="full_synthetic">Fully Synthetic (High Performance — 9,000 KM)</option>
          </select>
        </div>

        {/* Driving Condition Toggle */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <span>🚦 Driving Environment</span>
            <span className={styles.labelHint}>
              {severeDriving ? '⚠️ -15% Severe City Penalty' : 'Standard 100%'}
            </span>
          </label>
          <div className={styles.toggleContainer}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${!severeDriving ? styles.toggleBtnActive : ''}`}
              onClick={() => setSevereDriving(false)}
            >
              <span>🛣️ Highway / Mixed</span>
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${severeDriving ? styles.toggleBtnActiveSevere : ''}`}
              onClick={() => setSevereDriving(true)}
            >
              <span>🚦 Stop-and-Go City</span>
            </button>
          </div>
        </div>

        {/* Daily Commute Distance Slider */}
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <div className={styles.label}>
            <span>📅 Daily Commute Estimation</span>
            <span style={{ color: '#00f0ff', fontWeight: 700 }}>
              {dailyCommute} KM / day
            </span>
          </div>
          <div className={styles.sliderContainer}>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={dailyCommute}
              onChange={(e) => setDailyCommute(parseInt(e.target.value, 10))}
              className={styles.slider}
            />
          </div>
        </div>
      </div>

      {/* Negative Delta Validation Error Banner */}
      {isNegativeDelta && (
        <div className={styles.errorBanner} role="alert">
          <AlertOctagon size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong>Negative Delta Detected:</strong> Current odometer ({currentOdometer.toLocaleString()} KM) cannot be
            lower than last oil change reading ({lastOilChange.toLocaleString()} KM). Please check your dashboard dial.
          </div>
        </div>
      )}

      {/* Calculation & Visual Gauge Result */}
      <div className={styles.resultPanel}>
        <div className={styles.gaugeSection}>
          <svg className={styles.gaugeSvg} viewBox="0 0 240 140">
            {/* Background Track */}
            <path d="M 35 110 A 85 85 0 0 1 205 110" className={styles.gaugeBg} />
            {/* Progress Stroke */}
            <path
              d="M 35 110 A 85 85 0 0 1 205 110"
              className={styles.gaugeProgress}
              stroke={calculations.statusColor}
              strokeDasharray={ARC_LENGTH}
              strokeDashoffset={strokeOffset}
            />
          </svg>

          <div className={styles.gaugeCenterText}>
            <div className={styles.gaugePercentage}>{calculations.remainingPercentage}%</div>
            <div className={styles.gaugeLabel}>Oil Life Remaining</div>
          </div>

          <div
            className={`${styles.statusPill} ${
              calculations.status === 'safe'
                ? styles.statusSafe
                : calculations.status === 'warning'
                ? styles.statusWarning
                : styles.statusAlert
            }`}
          >
            {calculations.statusLabel}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Remaining Distance</span>
            <span
              className={styles.metricValue}
              style={{ color: calculations.statusColor }}
            >
              {calculations.isOverdue
                ? `-${Math.abs(calculations.remainingKm).toLocaleString()}`
                : calculations.remainingKm.toLocaleString()}
            </span>
            <span className={styles.metricSub}>Kilometers (KM)</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Est. Due Date</span>
            <span className={styles.metricValue}>
              {calculations.isOverdue ? 'Overdue!' : calculations.formattedDueDate}
            </span>
            <span className={styles.metricSub}>
              {calculations.isOverdue
                ? `${Math.abs(calculations.daysRemaining)} days ago`
                : `~${calculations.daysRemaining} days left`}
            </span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Target Due Odo</span>
            <span className={styles.metricValue}>
              {calculations.targetDueOdometer.toLocaleString()}
            </span>
            <span className={styles.metricSub}>
              {severeDriving ? 'Adjusted (-15%)' : 'Standard'}
            </span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Driven Since Service</span>
            <span className={styles.metricValue}>
              {calculations.kmDriven.toLocaleString()}
            </span>
            <span className={styles.metricSub}>
              out of {calculations.effectiveInterval.toLocaleString()} KM
            </span>
          </div>
        </div>

        {/* Instant PWA Conversion Banner */}
        <div className={styles.pwaCtaBanner}>
          <div className={styles.ctaTextContent}>
            <div className={styles.ctaTitle}>
              📸 Snap your odometer monthly — Read Meter tracks it without typing
            </div>
            <div className={styles.ctaDescription}>
              Never write on paper windshield stickers again. Use our AI Camera OCR to scan your car or bike odometer
              instantly and receive timely interval alerts on WhatsApp and Web Push.
            </div>
          </div>
          <Link href="/guest" className={styles.ctaButton}>
            <Camera size={18} />
            <span>Try Camera OCR (Guest)</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
