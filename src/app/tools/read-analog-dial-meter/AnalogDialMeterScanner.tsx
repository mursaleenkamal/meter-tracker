'use client'

import React, { useState, useEffect } from 'react'
import ToolShell from '@/components/tools/ToolShell'
import styles from './analogDial.module.css'
import { RotateCw, RotateCcw, AlertCircle, Info, Sparkles } from 'lucide-react'

interface DialConfig {
  index: number
  label: string
  placeValue: number
  direction: 'CW' | 'CCW'
}

const DIAL_CONFIGS: DialConfig[] = [
  { index: 0, label: '10,000s', placeValue: 10000, direction: 'CW' },
  { index: 1, label: '1,000s', placeValue: 1000, direction: 'CCW' },
  { index: 2, label: '100s', placeValue: 100, direction: 'CW' },
  { index: 3, label: '10s', placeValue: 10, direction: 'CCW' },
  { index: 4, label: '1s', placeValue: 1, direction: 'CW' },
]

export default function AnalogDialMeterScanner() {
  const steps = [
    {
      title: 'Read Left-to-Right (10,000s to 1s)',
      description:
        'Standard analog electric meters have 4 or 5 dials. Always read from the leftmost dial (highest multiplier) to the rightmost dial (1s units).',
    },
    {
      title: 'Watch Alternating Rotation Directions',
      description:
        'Because mechanical gears interlock, adjacent dials spin in opposite directions! Dial 1 spins Clockwise, Dial 2 Counter-Clockwise, Dial 3 Clockwise, Dial 4 Counter-Clockwise, and Dial 5 Clockwise.',
    },
    {
      title: 'Apply the Lower Number Rule',
      description:
        'When a pointer rests between two digits, always record the smaller number. For instance, between 4 and 5, write 4. (When between 9 and 0, the lower value is 9).',
    },
    {
      title: 'The Right-Neighbor "Under-the-Number" Rule',
      description:
        'If a pointer looks like it points directly on a number, check the dial directly to its right! If the right dial has not yet reached zero (e.g. sits on 8 or 9), the hand has not actually reached the digit yet—record the lower number.',
    },
  ]

  const faqs = [
    {
      question: 'Why do adjacent dials rotate in opposite directions?',
      answer:
        'Mechanical dial meters use a train of 10:1 gear reductions behind the faceplate. As one gear turns clockwise, the adjacent interlocking gear turns counter-clockwise. Our interactive tool highlights CW and CCW arrows for each dial to prevent reading errors.',
    },
    {
      question: 'How does the "Neighbor Dial Rule" prevent 1,000-unit billing mistakes?',
      answer:
        'Because gears turn continuously, a hand pointing directly at "5" might actually be at 4.98. If the dial to the right has not yet crossed "0" (e.g. is at 8 or 9), the hand has not reached 5 yet. Recording 5 instead of 4 will instantly over-bill your consumption by 1,000 kWh!',
    },
    {
      question: 'Does this tool work with 4-dial analog meters?',
      answer:
        'Yes. 4-dial meters start at the 1,000s register instead of the 10,000s register. Simply set the first dial to 0 or use the 4 active dials.',
    },
    {
      question: 'Is my uploaded meter photo private and secure?',
      answer:
        '100% private. All neural OCR and canvas image analysis execute strictly inside your browser through WebAssembly. No photos or images are ever uploaded to any cloud server.',
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
    // Pad or trim value to 5 digits
    const padded = (value || '00000').padStart(5, '0').slice(-5)
    const digits = padded.split('').map((d) => {
      const num = parseInt(d, 10)
      return isNaN(num) ? 0 : num
    })

    const handleDigitChange = (dialIdx: number, newDigit: number) => {
      const clamped = (newDigit + 10) % 10
      const nextDigits = [...digits]
      nextDigits[dialIdx] = clamped
      onChange(nextDigits.join(''))
    }

    // Evaluate neighbor rules
    const neighborAlerts: string[] = []
    for (let i = 0; i < 4; i++) {
      const current = digits[i]
      const nextRight = digits[i + 1]
      if (nextRight >= 8) {
        neighborAlerts.push(
          `Dial ${i + 1} (${DIAL_CONFIGS[i].label}): Right dial has not passed 0 yet (${nextRight}). If pointer rests on or near ${current}, the true reading may be ${
            (current + 9) % 10
          }.`
        )
      }
    }

    return (
      <div className={styles.dialContainer}>
        <div className={styles.dialHeader}>
          <div className={styles.dialHeaderTitle}>
            <Sparkles size={16} />
            <span>Interactive 5-Dial Clock Decoder &amp; Stepper</span>
          </div>
          <div className={styles.directInputWrapper}>
            <span className={styles.directInputLabel}>Exact:</span>
            <input
              type="text"
              maxLength={5}
              value={padded}
              onChange={(e) => {
                const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 5)
                onChange(numericOnly)
              }}
              className={styles.directInput}
            />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{unit}</span>
          </div>
        </div>

        {/* 5-Dial Grid */}
        <div className={styles.dialsGrid}>
          {DIAL_CONFIGS.map((config) => {
            const digit = digits[config.index]
            // Calculate rotation angle
            // CW: 180 + digit * 36 deg; CCW: 180 - digit * 36 deg
            const angle =
              config.direction === 'CW' ? 180 + digit * 36 : 180 - digit * 36

            return (
              <div key={config.index} className={styles.dialCard}>
                <span className={styles.dialOrderBadge}>{config.label}</span>
                <span
                  className={`${styles.dialDirectionTag} ${
                    config.direction === 'CW'
                      ? styles.dialDirectionCW
                      : styles.dialDirectionCCW
                  }`}
                >
                  {config.direction === 'CW' ? (
                    <>
                      <RotateCw size={10} /> CW
                    </>
                  ) : (
                    <>
                      <RotateCcw size={10} /> CCW
                    </>
                  )}
                </span>

                {/* Dial Clock Face Graphic */}
                <div className={styles.dialSvgWrapper}>
                  <div className={styles.dialFace}>
                    <div className={styles.dialCenterHub} />
                    <div
                      className={styles.dialNeedle}
                      style={{
                        transform: `translate(-50%, 0) rotate(${angle}deg)`,
                      }}
                    />
                  </div>
                </div>

                {/* Digit and Stepper */}
                <div className={styles.dialControls}>
                  <button
                    type="button"
                    className={styles.dialStepBtn}
                    onClick={() => handleDigitChange(config.index, digit - 1)}
                    title="Decrease digit"
                  >
                    -
                  </button>
                  <span className={styles.dialValueDisplay}>{digit}</span>
                  <button
                    type="button"
                    className={styles.dialStepBtn}
                    onClick={() => handleDigitChange(config.index, digit + 1)}
                    title="Increase digit"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Neighbor Rule Alert */}
        {neighborAlerts.length > 0 ? (
          <div className={styles.neighborRuleBanner}>
            <AlertCircle size={18} className={styles.neighborRuleIcon} />
            <div>
              <strong>Neighbor Dial Rule Alert:</strong>
              <div style={{ marginTop: '2px' }}>{neighborAlerts[0]}</div>
            </div>
          </div>
        ) : (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(16, 185, 129, 0.08)',
              padding: '6px 10px',
              borderRadius: '6px',
            }}
          >
            <Info size={14} />
            <span>Dial sequence verified: All neighbor zero-crossings are consistent.</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <ToolShell
      category="electricity"
      categoryName="Electricity (kWh)"
      title="Free Analog Electric Meter Reader (Dials)"
      subtitle="Point your phone camera or drop a photo to decode rotating clock dials. Interactive 5-dial decoder enforces neighbor-dial rounding rules."
      defaultUnit="kWh"
      unitOptions={['kWh', 'MWh', 'Units']}
      sampleReadingPlaceholder="47291"
      meterTypeLabel="Analog Electric Dial Meter (5 Dials)"
      howItWorksSteps={steps}
      faqs={faqs}
      regexPattern={/\b\d{4,6}(?:\.\d+)?\b/g}
      decimalHandling="strip"
      renderCustomAdjuster={renderCustomAdjuster}
    />
  )
}
