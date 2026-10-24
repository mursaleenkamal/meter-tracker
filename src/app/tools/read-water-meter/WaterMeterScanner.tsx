'use client'

import React, { useState } from 'react'
import ToolShell from '@/components/tools/ToolShell'
import styles from './waterMeter.module.css'
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Search,
  Activity,
  ShieldAlert,
} from 'lucide-react'

export default function WaterMeterScanner() {
  const [leakState, setLeakState] = useState<'stationary' | 'spinning'>('stationary')

  const steps = [
    {
      title: 'Read the Odometer Register Wheels',
      description:
        'Standard residential water meters display total water volume on rotating odometer wheels. Record the numbers from left to right for cumulative whole Gallons, Cubic Meters (m³), or Cubic Feet.',
    },
    {
      title: 'Check the Large Circular Sweep Hand',
      description:
        'The large sweep hand rotates around the dial face. One full revolution typically represents 10 or 100 Gallons (or 10 Liters). Read the number the needle has just passed for single units.',
    },
    {
      title: 'Check the Low-Flow Leak Detector Wheel',
      description:
        'Locate the small red/blue triangle, diamond, or star near the center of the meter face. This high-sensitivity indicator rotates with the slightest water flow—even a single drop per second.',
    },
    {
      title: 'Audit Against Your Monthly Water Bill',
      description:
        'Utility companies bill by units of 1,000 Gallons or 100 Cubic Feet (1 CCF = 748 Gallons). Verify that your meter reading matches or exceeds your billed consumption index.',
    },
  ]

  const faqs = [
    {
      question: 'What is the small spinning red/blue triangle or star on my water meter?',
      answer:
        'That is the Low-Flow Leak Indicator (often called the leak detector wheel). Because water meters are geared mechanically, main register wheels only move after gallons flow. The small indicator is geared directly to the impeller and spins rapidly even from a tiny toilet flapper leak or dripping faucet.',
    },
    {
      question: 'How do I perform a 15-minute household water leak test?',
      answer:
        '1. Turn off all indoor and outdoor water fixtures (washing machines, ice makers, sprinklers, faucets). 2. Look at the small leak indicator star on your water meter. 3. If it is rotating or twitching continuously, you have water moving through your pipes—most commonly a faulty toilet flapper valve or hidden underground pipe crack.',
    },
    {
      question: 'What does CCF or HCF mean on my water utility bill?',
      answer:
        'CCF stands for Centum Cubic Feet (100 cubic feet), and HCF stands for Hundred Cubic Feet—they mean the exact same unit. 1 CCF / HCF equals 748 US Gallons (or 2.83 cubic meters). Most US municipal water authorities bill in CCF increments.',
    },
    {
      question: 'Why does my meter dial face say "x10" or "x100"?',
      answer:
        'Older mechanical registers omit the final zeros to save dial space. If the dial says "x10", multiply your reading by 10 (or add a zero to the end) to obtain the true gallon count.',
    },
    {
      question: 'Is my water meter photo processed locally on my phone?',
      answer:
        'Yes! All image analysis and OCR digit extraction are processed 100% locally in your browser through WebAssembly. Photos never leave your device.',
    },
  ]

  const renderCustomAdjuster = ({
    value,
    onChange,
    unit,
  }: {
    value: string
    onChange: (val: string) => void
    unit: string
    categoryColor: string
  }) => {
    // Pad to 5 digits
    const padded = (value || '00000').padStart(5, '0').slice(-5)
    const drums = padded.split('')
    const lastDigit = parseInt(padded.slice(-1), 10) || 0
    const sweepAngle = (lastDigit / 10) * 360

    return (
      <div className={styles.waterContainer}>
        <div className={styles.waterHeader}>
          <div className={styles.waterTitle}>
            <Droplets size={18} color="#14b8a6" />
            <span>Water Register &amp; Sweep Hand Reader</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Reading:</span>
            <input
              type="text"
              maxLength={6}
              value={padded}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '').slice(0, 6)
                onChange(clean)
              }}
              style={{
                background: '#030712',
                border: '1px solid #0d9488',
                color: '#2dd4bf',
                borderRadius: '6px',
                padding: '3px 8px',
                fontFamily: 'monospace',
                fontSize: '1rem',
                fontWeight: 800,
                width: '80px',
                textAlign: 'center',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
              {unit}
            </span>
          </div>
        </div>

        {/* Visual Water Meter Gauges */}
        <div className={styles.waterVisualLayout}>
          {/* Main Numeric Register */}
          <div className={styles.registerBox}>
            <div className={styles.drumsRow}>
              {drums.map((digit, idx) => (
                <div key={idx} className={styles.drum}>
                  <span>{digit}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                textAlign: 'center',
                fontSize: '0.72rem',
                color: '#2dd4bf',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Cumulative {unit} Volume
            </div>
          </div>

          {/* Sweep Hand Clock Gauge */}
          <div className={styles.sweepGaugeCard}>
            <div className={styles.sweepGaugeWrapper}>
              <div className={styles.sweepGaugeCenter} />
              <div
                className={styles.sweepNeedle}
                style={{
                  transform: `translate(-50%, 0) rotate(${sweepAngle}deg)`,
                }}
              />
            </div>
            <span className={styles.sweepGaugeLabel}>Sweep Hand: {lastDigit}</span>
          </div>
        </div>

        {/* Low-Flow Leak Indicator Module */}
        <div
          className={`${styles.leakTestCard} ${
            leakState === 'stationary' ? styles.leakTestCardSafe : ''
          }`}
        >
          <div className={styles.leakHeader}>
            <div className={styles.leakHeaderLeft}>
              {leakState === 'spinning' ? (
                <div className={styles.leakStarSpinner}>
                  <Activity size={20} />
                </div>
              ) : (
                <div className={styles.leakStarStatic}>
                  <CheckCircle2 size={20} />
                </div>
              )}
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>
                  Low-Flow Leak Indicator Test
                </strong>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Inspect small red/blue triangle on meter face while faucets are closed
                </div>
              </div>
            </div>

            <div className={styles.leakToggleRow}>
              <button
                type="button"
                className={`${styles.leakToggleBtn} ${
                  leakState === 'stationary' ? styles.leakToggleBtnActiveSafe : ''
                }`}
                onClick={() => setLeakState('stationary')}
              >
                Stationary (No Leak)
              </button>
              <button
                type="button"
                className={`${styles.leakToggleBtn} ${
                  leakState === 'spinning' ? styles.leakToggleBtnActiveAlert : ''
                }`}
                onClick={() => setLeakState('spinning')}
              >
                Spinning (Leak!)
              </button>
            </div>
          </div>

          {leakState === 'spinning' ? (
            <div className={styles.leakWarningBody}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}>
                <ShieldAlert size={16} color="#f43f5e" />
                <span>Continuous Water Flow Detected!</span>
              </div>
              <p style={{ margin: 0 }}>
                If this wheel spins when no fixtures are in use, you have an active leak. Even a slow
                toilet flapper drip of 1 drop/second wastes <strong>~3,000 Gallons (~11,350 Liters)</strong> per year!
              </p>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#fda4af',
                  marginTop: '0.25rem',
                  borderTop: '1px dashed rgba(244, 63, 94, 0.3)',
                  paddingTop: '0.4rem',
                }}
              >
                <strong>Check these first:</strong> 1. Put 3 drops of food dye in toilet tanks (if bowl colors without flushing, replace flapper). 2. Check garden hose spigots. 3. Check water heater relief valve.
              </div>
            </div>
          ) : (
            <div className={styles.leakSafeBody}>
              ✓ <strong>Zero Leak Flow Confirmed:</strong> Leak indicator is motionless while fixtures are closed. Pipe network integrity verified.
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <ToolShell
      category="water"
      categoryName="Water (Gal / m³ / L)"
      title="Smart Water Meter Scanner & Leak Detector"
      subtitle="Scan mechanical sweep hands and digital registers from your browser to verify billing units and spot slow leaks."
      defaultUnit="Gal"
      unitOptions={['Gal', 'm³', 'CCF', 'L']}
      sampleReadingPlaceholder="01842"
      meterTypeLabel="Residential Water Meter (Sweep Hand & Register)"
      howItWorksSteps={steps}
      faqs={faqs}
      regexPattern={/\b\d{4,6}(?:\.\d+)?\b/g}
      decimalHandling="strip"
      renderCustomAdjuster={renderCustomAdjuster}
    />
  )
}
