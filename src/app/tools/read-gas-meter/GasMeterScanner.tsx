'use client'

import React, { useState } from 'react'
import ToolShell from '@/components/tools/ToolShell'
import styles from './gasMeter.module.css'
import { Flame, Info, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react'

export default function GasMeterScanner() {
  const steps = [
    {
      title: 'Find the Black & White Roller Wheels',
      description:
        'Standard diaphragm and ultrasonic gas meters have mechanical roller drums. The whole cubic meters (m³) or CCF appear as white numbers on black drums on the left.',
    },
    {
      title: 'Ignore the Red Digits (Fractional Decimals)',
      description:
        'Numbers printed in red, surrounded by a red box, or located to the right of a comma/decimal point measure liters or fractions. Utility companies do NOT bill these numbers—our AI strips them automatically.',
    },
    {
      title: 'Eliminate Glare on Protective Glass',
      description:
        'Gas meters often have deep scratch-resistant glass covers. Tilt your phone at a slight 15-degree angle to avoid camera flash bouncing off the screen.',
    },
    {
      title: 'Calculate Monthly Volume & Energy Units',
      description:
        'Subtract your previous billing meter index from this reading to determine volume consumed, then multiply by your local calorific factor to convert to Therms or kWh.',
    },
  ]

  const faqs = [
    {
      question: 'Should I record the red digits on my gas meter?',
      answer:
        'No! The red numbers (or numbers after the decimal point) represent fractional cubic meters (liters or thousandths). If you include red digits when submitting a meter reading, your bill will be calculated up to 100 times higher than your actual consumption.',
    },
    {
      question: 'What is the difference between m³ and CCF?',
      answer:
        'm³ (cubic meters) is the international metric standard used across the UK, Europe, Pakistan (SSGC / SNGPL), and Asia. CCF (centum cubic feet, or 100 cubic feet) is standard across the United States. 1 m³ is roughly equal to 35.315 cubic feet or 0.353 CCF.',
    },
    {
      question: 'How do gas companies convert volume (m³) to energy (Therms / kWh)?',
      answer:
        'Utility providers multiply the volume (m³) by the Gross Calorific Value (GCV, typically 38 to 40 MJ/m³) and a pressure/temperature correction factor (typically 1.02264) divided by 3.6 to calculate kilowatt-hours (kWh) or Therms.',
    },
    {
      question: 'Does this tool work for commercial diaphragm and LPG gas meters?',
      answer:
        'Yes. Whether you have a residential G4 meter, commercial G16/G25 diaphragm meter, or LPG bulk meter, the client-side OCR reads white-on-black drums and decimal layouts across all major brands (Itron, Elster, Landis+Gyr, Actaris).',
    },
    {
      question: 'Are my gas meter photos uploaded to any server?',
      answer:
        'Never. Read Meter uses 100% in-browser WebAssembly OCR. Preprocessing and number extraction occur strictly inside your device canvas, guaranteeing complete privacy.',
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
    // Pad to 5 digits for the billed whole drums
    const padded = (value || '00000').padStart(5, '0').slice(-5)
    const drums = padded.split('')

    return (
      <div className={styles.odometerContainer}>
        <div className={styles.odometerHeader}>
          <div className={styles.odometerTitle}>
            <Flame size={16} color="#0284c7" />
            <span>Mechanical Roller Odometer Register</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Edit:</span>
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
                border: '1px solid #334155',
                color: '#38bdf8',
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

        {/* Visual Odometer Wheels */}
        <div>
          <div className={styles.odometerBox}>
            {drums.map((digit, idx) => (
              <div key={idx} className={`${styles.drum} ${styles.drumBlack}`}>
                <span>{digit}</span>
              </div>
            ))}

            <span className={styles.decimalDivider}>,</span>

            {/* Red Ignored Fractional Drums */}
            <div className={`${styles.drum} ${styles.drumRed}`} title="Fractional Tenths (Ignored for Billing)">
              <span>7</span>
            </div>
            <div className={`${styles.drum} ${styles.drumRed}`} title="Fractional Hundredths (Ignored for Billing)">
              <span>2</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.4rem 0.75rem',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}
          >
            <span className={styles.drumLabelBilled}>
              ← Billed Whole Units ({unit})
            </span>
            <span className={styles.drumLabelIgnored}>
              Red Decimals (Ignored) →
            </span>
          </div>
        </div>

        {/* Rule note */}
        <div className={styles.ruleNote}>
          <CheckCircle2 size={18} className={styles.ruleNoteIcon} />
          <div>
            <strong>Billing Rule Applied:</strong> Only the black drums ({padded} {unit}) are recorded.
            The red fractional wheels represent decimal parts of a unit and are safely excluded from
            your utility bill.
          </div>
        </div>
      </div>
    )
  }

  return (
    <ToolShell
      category="gas"
      categoryName="Gas (m³ / CCF)"
      title="Online Gas Meter Photo Reader (m³ / CCF)"
      subtitle="Point your phone camera or drop a photo to extract mechanical roller odometer digits. Strips red fractional decimals automatically."
      defaultUnit="m³"
      unitOptions={['m³', 'CCF', 'Therms', 'ft³']}
      sampleReadingPlaceholder="03482"
      meterTypeLabel="Natural Gas / LPG Meter (Roller Counter)"
      howItWorksSteps={steps}
      faqs={faqs}
      regexPattern={/\b\d{4,6}(?:\.\d+)?\b/g}
      decimalHandling="strip"
      renderCustomAdjuster={renderCustomAdjuster}
    />
  )
}
